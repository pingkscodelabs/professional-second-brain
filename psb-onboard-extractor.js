/**
 * Information Extractor
 * Parses raw text and extracts key professional information
 */

class Extractor {
  constructor() {
    this.datePatterns = [
      /(\d{4})\s*(?:to|-|–)\s*(\d{4})/g,           // 2023-2024, 2023 to 2024
      /(\w+\s+\d{4})\s*(?:to|-|–)\s*(\w+\s+\d{4})/g, // Jan 2023 to Dec 2024
      /(\d{1,2})\/(\d{1,2})\/(\d{4})/g,            // 01/01/2023
      /(\d{4})-(\d{2})-(\d{2})/g                   // 2023-01-01
    ];
    
    this.numberPatterns = [
      /(\d+)\s*(?:team\s+)?members?/i,
      /(\d+)\+?\s*(?:microservices?|services?|instances?|systems?|users?)/i,
      /(\d+)%\s*(?:improvement?|reduction|increase|decrease)/i,
      /\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:million|thousand|M|K)?/i,
      /(\d+)\s*(?:hours?|minutes?|seconds?|days?|weeks?|months?|years?)/i
    ];
    
    this.rolePatterns = [
      /(?:led|led team|managed|headed|directed)\s+([^,\.]*)/i,
      /(?:architect|developer|engineer|senior|lead|principal|staff)/i,
      /my\s+role\s+(?:was|is):\s*([^,\.]*)/i
    ];
    
    this.technologyKeywords = [
      'kubernetes', 'docker', 'aws', 'azure', 'gcp', 'terraform', 'ansible',
      'python', 'java', 'javascript', 'typescript', 'go', 'rust', 'nodejs',
      'react', 'vue', 'angular', 'postgresql', 'mongodb', 'redis', 'elasticsearch',
      'jenkins', 'gitlab', 'github', 'argocd', 'helm', 'prometheus', 'grafana',
      'microservices', 'kubernetes', 'serverless', 'lambda', 'api', 'rest', 'graphql'
    ];
  }

  extractProjectInfo(rawText) {
    const fields = {
      projectName: this._extractProjectName(rawText),
      client: this._extractClient(rawText),
      timePeriod: this._extractDateRange(rawText),
      role: this._extractRole(rawText),
      teamSize: this._extractTeamSize(rawText),
      technologies: this._extractTechnologies(rawText),
      scale: this._extractScale(rawText),
      businessOutcome: this._extractBusinessOutcome(rawText),
      challenges: this._extractChallenges(rawText),
      category: this._inferCategory(rawText)
    };

    const confidence = this._scoreConfidence(fields, rawText);

    return {
      fields,
      confidence,
      extractedFrom: rawText
    };
  }

  extractAchievementInfo(rawText) {
    const fields = {
      title: this._extractAchievementTitle(rawText),
      date: this._extractDateRange(rawText),
      context: this._extractContext(rawText),
      businessImpact: this._extractBusinessOutcome(rawText),
      technicalOutcome: this._extractTechnicalOutcome(rawText),
      metrics: this._extractMetrics(rawText),
      technologies: this._extractTechnologies(rawText),
      scale: this._extractScale(rawText),
      leadership: this._extractLeadershipRole(rawText)
    };

    const confidence = this._scoreConfidence(fields, rawText);

    return {
      fields,
      confidence,
      extractedFrom: rawText
    };
  }

  extractSkillInfo(rawText) {
    const fields = {
      skillName: this._extractSkillName(rawText),
      category: this._inferCategory(rawText),
      level: this._inferSkillLevel(rawText),
      yearsOfExperience: this._extractYearsOfExperience(rawText),
      lastUsed: this._extractLastUsed(rawText),
      productionExperience: this._extractProductionExperience(rawText),
      expertise_areas: this._extractExpertiseAreas(rawText)
    };

    const confidence = this._scoreConfidence(fields, rawText);

    return {
      fields,
      confidence,
      extractedFrom: rawText
    };
  }

  extractClientInfo(rawText) {
    const fields = {
      clientName: this._extractClientName(rawText),
      anonymizedName: this._generateAnonymizedName(),
      industry: this._extractIndustry(rawText),
      engagementPeriod: this._extractDateRange(rawText),
      engagementType: this._extractEngagementType(rawText),
      scale: this._extractScale(rawText),
      major_projects: this._extractMajorProjects(rawText)
    };

    const confidence = this._scoreConfidence(fields, rawText);

    return {
      fields,
      confidence,
      extractedFrom: rawText
    };
  }

  // Private helper methods

  _extractProjectName(text) {
    const patterns = [
      /(?:project|initiative|program)[\s:]+([^,\.]+)/i,
      /^([^,\.]+?)(?:\s+project|\s+at\s+|,)/i,
      /(?:led|built|created|developed)\s+([^,\.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  _extractAchievementTitle(text) {
    const patterns = [
      /(?:achievement|award|accomplishment)[\s:]+([^,\.]+)/i,
      /^([^,\.]+?)(?:\s+achievement|,|resulted in|led to)/i,
      /(?:achieved|accomplished|delivered)\s+([^,\.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  _extractSkillName(text) {
    // Look for technology keywords
    for (const tech of this.technologyKeywords) {
      if (new RegExp(`\\b${tech}\\b`, 'i').test(text)) {
        return tech.charAt(0).toUpperCase() + tech.slice(1);
      }
    }
    
    const patterns = [
      /(?:skill|expertise|knowledge)\s+(?:in|with|of)[\s:]+([^,\.]+)/i,
      /(?:experienced|expert|proficient)\s+(?:in|with)\s+([^,\.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  _extractClient(text) {
    const patterns = [
      /(?:client|company|organization|at)[\s:]+([A-Z][A-Za-z0-9\s&\.\-]+?)(?:,|$|\.|;)/,
      /(?:worked|worked at|at)\s+([A-Z][A-Za-z0-9\s&\.\-]+?)(?:,|$|\.|;)/
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        const name = match[1].trim();
        if (name.length > 2 && name.length < 100) {
          return name;
        }
      }
    }
    return null;
  }

  _extractClientName(text) {
    return this._extractClient(text);
  }

  _extractDateRange(text) {
    for (const pattern of this.datePatterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    
    // Try to find years
    const yearMatch = text.match(/\b(20\d{2})\b/g);
    if (yearMatch && yearMatch.length >= 1) {
      return yearMatch[0];
    }
    
    return null;
  }

  _extractRole(text) {
    for (const pattern of this.rolePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().split(/[,\.]/)[0];
      }
    }
    return null;
  }

  _extractTeamSize(text) {
    const match = text.match(/(\d+)\s*(?:team\s+)?members?|team of\s+(\d+)/i);
    if (match) {
      return match[1] || match[2];
    }
    return null;
  }

  _extractTechnologies(text) {
    const found = [];
    const lowerText = text.toLowerCase();
    
    for (const tech of this.technologyKeywords) {
      if (new RegExp(`\\b${tech}\\b`).test(lowerText)) {
        found.push(tech.charAt(0).toUpperCase() + tech.slice(1));
      }
    }
    
    return found.length > 0 ? found : [];
  }

  _extractScale(text) {
    const patterns = [
      /(\d+)\+?\s*(?:microservices?|services?|instances?|servers?|databases?|users?|customers?)/i,
      /scale[d]?\s+to\s+(\d+(?:,\d{3})*)/i,
      /serving\s+(\d+(?:,\d{3})*)\s+(?:users|customers|requests)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  _extractBusinessOutcome(text) {
    const patterns = [
      /(?:reduced|improved|increased|decreased|saved)\s+([^,\.]+?)(?:by|to|\.|,)/i,
      /business\s+outcome[s]?[\s:]+([^,\.]+)/i,
      /(?:cost|revenue|performance|efficiency)\s+(?:improvement|increase)[\s:]+([^,\.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  _extractTechnicalOutcome(text) {
    const patterns = [
      /(?:deployed|built|implemented|created|architected)\s+([^,\.]+?)(?:resulting|which|to achieve|\.|,)/i,
      /technical\s+outcome[s]?[\s:]+([^,\.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  _extractMetrics(text) {
    const metrics = {};
    
    // Cost metrics
    const costMatch = text.match(/\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:savings?|reduction|saved)/i);
    if (costMatch) {
      metrics.cost_savings = costMatch[1];
    }

    // Percentage metrics
    const percentMatches = text.matchAll(/(\d+)%\s+([^,\.]+)/gi);
    for (const match of percentMatches) {
      metrics[match[2].toLowerCase().replace(/\s+/g, '_')] = `${match[1]}%`;
    }

    // Time metrics
    const timeMatch = text.match(/from\s+(\d+)\s+(\w+)\s+to\s+(\d+)\s+(\w+)/i);
    if (timeMatch) {
      metrics.time_improvement = `${timeMatch[1]} ${timeMatch[2]} to ${timeMatch[3]} ${timeMatch[4]}`;
    }

    return Object.keys(metrics).length > 0 ? metrics : null;
  }

  _extractChallenges(text) {
    const patterns = [
      /(?:challenge|challenge|problem)[s]?[\s:]+([^,\.]+)/i,
      /had to overcome\s+([^,\.]+)/i,
      /faced.*?:\s*([^,\.]+)/i
    ];

    const challenges = [];
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        challenges.push(match[1].trim());
      }
    }
    
    return challenges.length > 0 ? challenges : [];
  }

  _extractContext(text) {
    const patterns = [
      /(?:at|during|within)\s+([^,\.]+)/i,
      /(?:context|situation)[\s:]+([^,\.]+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  _extractYearsOfExperience(text) {
    const match = text.match(/(\d+)\s*\+?\s*years?/i);
    if (match) {
      return parseInt(match[1]);
    }
    return null;
  }

  _extractLastUsed(text) {
    // Try to find the most recent date
    const dateMatch = text.match(/(20\d{2})\b/g);
    if (dateMatch) {
      const mostRecent = Math.max(...dateMatch.map(d => parseInt(d)));
      return `${mostRecent}-12`;
    }
    return null;
  }

  _extractProductionExperience(text) {
    const patterns = [
      /production\s+(?:experience|use)[\s:]+([^,\.]+)/i,
      /(?:used|experience)\s+(?:in\s+)?production\s+(?:environments?|systems?)[\s:]*([^,\.]*)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
    return null;
  }

  _extractExpertiseAreas(text) {
    // Extract related technologies/skills as areas
    return this._extractTechnologies(text);
  }

  _extractIndustry(text) {
    const patterns = [
      /(?:industry|sector|domain)[\s:]+([^,\.]+)/i,
      /(?:fintech|healthcare|e-commerce|retail|banking|insurance|technology|software|media)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[1] ? match[1].trim() : match[0];
      }
    }
    return null;
  }

  _extractEngagementType(text) {
    const patterns = [
      /(?:engagement|engagement type)[\s:]+([^,\.]+)/i,
      /(?:contract|consulting|full-time|part-time|project-based)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return match[0];
      }
    }
    return null;
  }

  _extractMajorProjects(text) {
    // Extract project names or descriptions
    const projects = [];
    const projectPatterns = [
      /(?:project|program)[\s:]+([^,\.]+)/gi
    ];

    for (const pattern of projectPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        projects.push(match[1].trim());
      }
    }

    return projects.length > 0 ? projects : [];
  }

  _inferSkillLevel(text) {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('expert') || lowerText.includes('mastery') || 
        /\d+\+?\s*years?/.test(text) && parseInt(text.match(/(\d+)/)[0]) >= 5) {
      return 'EXPERT';
    }
    
    if (lowerText.includes('advanced') || lowerText.includes('senior') || 
        /\d+\s*years?/.test(text) && parseInt(text.match(/(\d+)/)[0]) >= 3) {
      return 'ADVANCED';
    }
    
    if (lowerText.includes('intermediate') || lowerText.includes('solid') ||
        /\d+\s*years?/.test(text) && parseInt(text.match(/(\d+)/)[0]) >= 1) {
      return 'INTERMEDIATE';
    }
    
    if (lowerText.includes('learning') || lowerText.includes('studying')) {
      return 'LEARNING';
    }
    
    if (lowerText.includes('exposure') || lowerText.includes('familiar') || lowerText.includes('aware')) {
      return 'EXPOSURE';
    }
    
    return 'BEGINNER';
  }

  _inferCategory(text) {
    const categories = {
      'cloud': ['aws', 'azure', 'gcp', 'cloud'],
      'kubernetes': ['kubernetes', 'k8s', 'container', 'docker'],
      'infrastructure': ['terraform', 'infrastructure', 'iac', 'ansible', 'provisioning'],
      'backend': ['nodejs', 'python', 'java', 'go', 'backend', 'api'],
      'frontend': ['react', 'vue', 'angular', 'typescript', 'javascript', 'frontend'],
      'database': ['postgresql', 'mongodb', 'redis', 'elasticsearch', 'database'],
      'devops': ['ci/cd', 'jenkins', 'github', 'gitlab', 'devops'],
      'leadership': ['led', 'managed', 'team', 'leadership', 'mentored']
    };

    const lowerText = text.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some(kw => lowerText.includes(kw))) {
        return category;
      }
    }

    return 'general';
  }

  _generateAnonymizedName() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const char = chars[Math.floor(Math.random() * chars.length)];
    return `CLIENT_${char}`;
  }

  _scoreConfidence(fields, rawText) {
    const confidence = {};
    
    for (const [key, value] of Object.entries(fields)) {
      if (value === null || value === undefined || value === '') {
        confidence[key] = 'LOW';
      } else if (typeof value === 'string' && value.length < 10) {
        confidence[key] = 'MEDIUM';
      } else if (Array.isArray(value) && value.length === 0) {
        confidence[key] = 'LOW';
      } else {
        confidence[key] = 'HIGH';
      }
    }
    
    return confidence;
  }
}

module.exports = Extractor;
