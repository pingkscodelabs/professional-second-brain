/**
 * Link Suggester
 * Suggests related content to link based on extracted information
 */

class Linker {
  constructor() {
    this.commonTechs = [
      'aws', 'kubernetes', 'terraform', 'docker', 'python', 'javascript',
      'react', 'nodejs', 'postgresql', 'mongodb', 'redis', 'jenkins',
      'argocd', 'helm', 'microservices', 'api', 'rest', 'graphql'
    ];

    this.skillCategories = {
      'cloud': ['aws', 'azure', 'gcp', 'cloud'],
      'kubernetes': ['kubernetes', 'k8s', 'container', 'docker'],
      'infrastructure': ['terraform', 'infrastructure', 'iac', 'ansible'],
      'backend': ['nodejs', 'python', 'java', 'go', 'api', 'rest'],
      'frontend': ['react', 'vue', 'angular', 'javascript', 'typescript'],
      'database': ['postgresql', 'mongodb', 'redis', 'elasticsearch']
    };
  }

  async suggestProjectLinks(extracted) {
    const suggestions = [];

    // Suggest skill links based on technologies
    const skills = this._extractSkillsFromTechnologies(extracted.fields.technologies);
    for (const skill of skills) {
      suggestions.push({
        type: 'skill',
        name: skill,
        reason: `Used ${skill} in this project`,
        path: `../../profile/skills/${skill.toLowerCase().replace(/\s+/g, '-')}.md`,
        confidence: 'HIGH'
      });
    }

    // Suggest achievement links based on business outcomes
    if (extracted.fields.businessOutcome) {
      suggestions.push({
        type: 'achievement',
        name: 'Related Achievement',
        reason: 'This project may have associated achievements',
        path: '../../evidence/achievements/[achievement-name].md',
        confidence: 'MEDIUM'
      });
    }

    // Suggest client links
    if (extracted.fields.client) {
      suggestions.push({
        type: 'client',
        name: extracted.fields.client,
        reason: 'Link to client documentation',
        path: `../../clients/${extracted.fields.client.toLowerCase().replace(/\s+/g, '-')}.md`,
        confidence: 'HIGH'
      });
    }

    return suggestions;
  }

  async suggestAchievementLinks(extracted) {
    const suggestions = [];

    // Suggest project links if this achievement came from a project
    if (extracted.fields.context) {
      suggestions.push({
        type: 'project',
        name: 'Related Project',
        reason: 'This achievement likely came from a project',
        path: '../../projects/[project-name].md',
        confidence: 'MEDIUM'
      });
    }

    // Suggest skill links based on technologies used
    const skills = this._extractSkillsFromTechnologies(extracted.fields.technologies);
    for (const skill of skills) {
      suggestions.push({
        type: 'skill',
        name: skill,
        reason: `Used ${skill} to achieve this outcome`,
        path: `../../profile/skills/${skill.toLowerCase().replace(/\s+/g, '-')}.md`,
        confidence: 'HIGH'
      });
    }

    // Suggest client links
    if (extracted.fields.context && extracted.fields.context.includes('CLIENT_')) {
      suggestions.push({
        type: 'client',
        name: 'Related Client',
        reason: 'This achievement occurred at a specific client',
        path: '../../clients/[client-name].md',
        confidence: 'MEDIUM'
      });
    }

    return suggestions;
  }

  async suggestSkillLinks(extracted) {
    const suggestions = [];

    // Suggest technology documentation links
    const skillName = extracted.fields.skillName || '';
    const lowerName = skillName.toLowerCase();

    for (const [category, keywords] of Object.entries(this.skillCategories)) {
      if (keywords.some(kw => lowerName.includes(kw))) {
        suggestions.push({
          type: 'technology',
          name: `${category.charAt(0).toUpperCase() + category.slice(1)} Technologies`,
          reason: `${skillName} belongs to ${category}`,
          path: `../../technologies/${category}.md`,
          confidence: 'HIGH'
        });
      }
    }

    // Suggest project links where this skill was used
    suggestions.push({
      type: 'project',
      name: 'Projects Using This Skill',
      reason: 'Projects demonstrate this skill in practice',
      path: '../../projects/[search-for-projects-using-this-skill]',
      confidence: 'MEDIUM'
    });

    // Suggest achievement links
    suggestions.push({
      type: 'achievement',
      name: 'Achievements Using This Skill',
      reason: 'Link to achievements accomplished with this skill',
      path: '../../evidence/achievements/[search-for-achievements]',
      confidence: 'MEDIUM'
    });

    return suggestions;
  }

  async suggestClientLinks(extracted) {
    const suggestions = [];

    // Suggest project links for this client
    suggestions.push({
      type: 'project',
      name: 'Projects with This Client',
      reason: 'Link to projects executed for this client',
      path: '../../projects/[client-project-1].md',
      confidence: 'MEDIUM'
    });

    // Suggest skill links based on technologies mentioned
    const skills = this._extractSkillsFromTechnologies(extracted.fields.technologies || []);
    for (const skill of skills) {
      suggestions.push({
        type: 'skill',
        name: skill,
        reason: `${skill} was used at this client`,
        path: `../../profile/skills/${skill.toLowerCase().replace(/\s+/g, '-')}.md`,
        confidence: 'MEDIUM'
      });
    }

    return suggestions;
  }

  _extractSkillsFromTechnologies(technologies) {
    if (!technologies || !Array.isArray(technologies)) {
      return [];
    }

    const skills = [];
    for (const tech of technologies) {
      if (tech) {
        skills.push(tech);
      }
    }

    return [...new Set(skills)];  // Remove duplicates
  }

  _inferSkillName(technology) {
    const mapping = {
      'aws': 'Amazon Web Services',
      'gcp': 'Google Cloud Platform',
      'k8s': 'Kubernetes',
      'nodejs': 'Node.js',
      'javascript': 'JavaScript',
      'typescript': 'TypeScript',
      'postgresql': 'PostgreSQL',
      'mongodb': 'MongoDB'
    };

    return mapping[technology.toLowerCase()] || technology;
  }
}

module.exports = Linker;
