/**
 * Skills Analyzer
 * Analyzes skill depth, breadth, evolution, and clustering
 */

import { SkillEntry, Insight } from './psb-analyzer';

/**
 * Skill category cluster
 */
export interface SkillCluster {
  categoryName: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills: SkillEntry[];
  synergies: string[];
  marketValue: 'high' | 'medium' | 'low' | 'emerging';
}

/**
 * Skill evolution over time
 */
export interface SkillEvolution {
  skill: string;
  timeline: Array<{
    period: string;
    proficiency: string;
    context: string;
  }>;
  trend: 'deepening' | 'stagnant' | 'declining' | 'cycling';
}

export class SkillsAnalyzer {
  
  /**
   * Build comprehensive skill matrix
   */
  static buildSkillMatrix(experiences: any[], projects: any[]): SkillEntry[] {
    const skillMap = new Map<string, SkillEntry>();

    // Extract skills from experiences
    (experiences || []).forEach((exp) => {
      const skills = exp.skills || [];
      const technologies = exp.technologies || [];
      
      [...skills, ...technologies].forEach((skill: string) => {
        if (!skillMap.has(skill.toLowerCase())) {
          skillMap.set(skill.toLowerCase(), {
            skill,
            depth: 3,
            yearsOfExperience: 0,
            category: categorizeSkill(skill),
            proficiency: 'intermediate',
            evidence: [exp.company || 'Unknown']
          });
        } else {
          const entry = skillMap.get(skill.toLowerCase())!;
          entry.evidence.push(exp.company || 'Unknown');
        }
      });
    });

    // Extract skills from projects
    (projects || []).forEach((project) => {
      const technologies = project.technologies || [];
      
      technologies.forEach((tech: string) => {
        if (!skillMap.has(tech.toLowerCase())) {
          skillMap.set(tech.toLowerCase(), {
            skill: tech,
            depth: 2,
            yearsOfExperience: 0,
            category: categorizeSkill(tech),
            proficiency: 'beginner',
            evidence: [project.name || 'Unknown']
          });
        } else {
          const entry = skillMap.get(tech.toLowerCase())!;
          entry.evidence.push(project.name || 'Unknown');
          entry.depth = Math.min(5, Math.ceil(entry.evidence.length / 2)) as 1 | 2 | 3 | 4 | 5;
        }
      });
    });

    return Array.from(skillMap.values())
      .map(skill => ({
        ...skill,
        depth: Math.min(5, Math.max(1, Math.ceil(skill.evidence.length / 2))) as 1 | 2 | 3 | 4 | 5,
        proficiency: estimateProficiency(skill.evidence.length)
      }))
      .sort((a, b) => b.depth - a.depth);
  }

  /**
   * Cluster related skills
   */
  static clusterSkills(skills: SkillEntry[]): SkillCluster[] {
    const clusters = new Map<string, SkillEntry[]>();

    skills.forEach((skill) => {
      const category = skill.category;
      if (!clusters.has(category)) {
        clusters.set(category, []);
      }
      clusters.get(category)!.push(skill);
    });

    return Array.from(clusters.entries()).map(([categoryName, categorySkills]) => {
      const avgDepth = categorySkills.reduce((a, b) => a + b.depth, 0) / categorySkills.length;
      const proficiency = estimateProficiencyLevel(avgDepth);

      return {
        categoryName,
        proficiency: proficiency as any,
        skills: categorySkills.sort((a, b) => b.depth - a.depth),
        synergies: findSkillSynergies(categorySkills),
        marketValue: assessMarketValue(categoryName, categorySkills)
      };
    });
  }

  /**
   * Track skill evolution over time
   */
  static analyzeSkillEvolution(experiences: any[]): SkillEvolution[] {
    const skillTimeline = new Map<string, SkillEvolution>();

    const sortedExps = [...(experiences || [])].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    sortedExps.forEach((exp) => {
      const skills = exp.skills || [];
      const period = `${new Date(exp.startDate).getFullYear()}-${exp.endDate ? new Date(exp.endDate).getFullYear() : 'present'}`;

      skills.forEach((skill: string) => {
        const key = skill.toLowerCase();
        if (!skillTimeline.has(key)) {
          skillTimeline.set(key, {
            skill,
            timeline: [],
            trend: 'stagnant'
          });
        }

        skillTimeline.get(key)!.timeline.push({
          period,
          proficiency: exp.level || 'intermediate',
          context: exp.company || 'Unknown'
        });
      });
    });

    // Analyze trends
    return Array.from(skillTimeline.values()).map((evolution) => {
      evolution.trend = analyzeTrend(evolution.timeline.length);
      return evolution;
    });
  }

  /**
   * Identify skill gaps for target role
   */
  static identifySkillGaps(
    currentSkills: SkillEntry[],
    targetRoleRequirements: string[],
    industryTrends: string[] = []
  ): Array<{
    skill: string;
    gap: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    learningPath: string[];
  }> {
    const currentSkillsSet = new Set(currentSkills.map(s => s.skill.toLowerCase()));
    const gaps = [];

    // Target role gaps
    targetRoleRequirements.forEach((requirement) => {
      if (!currentSkillsSet.has(requirement.toLowerCase())) {
        gaps.push({
          skill: requirement,
          gap: 1,
          priority: 'critical' as const,
          learningPath: generateLearningPath(requirement)
        });
      }
    });

    // Industry trend gaps
    industryTrends.forEach((trend) => {
      if (!currentSkillsSet.has(trend.toLowerCase())) {
        gaps.push({
          skill: trend,
          gap: 0.5,
          priority: 'high' as const,
          learningPath: generateLearningPath(trend)
        });
      }
    });

    return gaps.sort((a, b) => b.gap - a.gap);
  }

  /**
   * Calculate skill breadth vs depth
   */
  static analyzeBreadthVsDepth(skills: SkillEntry[]): {
    breadth: number;
    depth: number;
    ratio: number;
    profile: 'specialist' | 'generalist' | 't-shaped' | 'pi-shaped';
  } {
    const totalSkills = skills.length;
    const totalDepth = skills.reduce((a, b) => a + b.depth, 0);
    const avgDepth = totalDepth / totalSkills;

    const expertSkills = skills.filter(s => s.depth >= 4).length;
    const proficientSkills = skills.filter(s => s.depth >= 3).length;

    let profile: 'specialist' | 'generalist' | 't-shaped' | 'pi-shaped';
    if (expertSkills > 2 && totalSkills < 15) {
      profile = 'specialist';
    } else if (expertSkills === 1 && proficientSkills > 5) {
      profile = 't-shaped';
    } else if (expertSkills >= 2 && proficientSkills > 8) {
      profile = 'pi-shaped';
    } else {
      profile = 'generalist';
    }

    return {
      breadth: totalSkills,
      depth: Math.round(avgDepth * 100) / 100,
      ratio: expertSkills > 0 ? totalSkills / expertSkills : totalSkills,
      profile
    };
  }

  /**
   * Generate skill insights
   */
  static generateInsights(
    skills: SkillEntry[],
    clusters: SkillCluster[],
    breadthDepth: any
  ): Insight[] {
    const insights: Insight[] = [];

    // Top skills insight
    const topSkills = skills.slice(0, 5);
    insights.push({
      category: 'Top Skills',
      finding: `Top 5 deepest skills: ${topSkills.map(s => s.skill).join(', ')}`,
      evidencePoints: topSkills.map(s => `${s.skill} (depth: ${s.depth}, evidence: ${s.evidence.length} references)`),
      confidence: 'high',
      actionableRecommendation: 'These are your strongest differentiators - leverage in applications'
    });

    // Skill cluster insights
    clusters.forEach((cluster) => {
      if (cluster.proficiency === 'expert' || cluster.proficiency === 'advanced') {
        insights.push({
          category: `${cluster.categoryName} Expertise`,
          finding: `Strong expertise in ${cluster.categoryName} domain`,
          evidencePoints: cluster.skills.slice(0, 3).map(s => `${s.skill} (depth: ${s.depth})`),
          confidence: 'high',
          actionableRecommendation: `${cluster.categoryName} is a key differentiator for relevant roles`
        });
      }
    });

    // Profile insight
    insights.push({
      category: 'Skill Profile',
      finding: `${breadthDepth.profile} profile: ${breadthDepth.breadth} total skills with ${breadthDepth.ratio.toFixed(1)}:1 breadth-to-depth ratio`,
      evidencePoints: [
        `Broad knowledge: ${breadthDepth.breadth} different skills`,
        `Average depth: ${breadthDepth.depth}/5`,
        `Expert skills: ${skills.filter(s => s.depth >= 4).length}`
      ],
      confidence: 'high',
      actionableRecommendation: getProfileRecommendation(breadthDepth.profile)
    });

    return insights;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function categorizeSkill(skill: string): string {
  const lowerSkill = skill.toLowerCase();

  // Cloud platforms
  if (['aws', 'azure', 'gcp', 'google cloud', 'oracle cloud'].some(s => lowerSkill.includes(s))) {
    return 'Cloud Platforms';
  }

  // Container/Orchestration
  if (['kubernetes', 'docker', 'container', 'k8s'].some(s => lowerSkill.includes(s))) {
    return 'Containerization';
  }

  // Infrastructure/DevOps
  if (['terraform', 'ansible', 'jenkins', 'devops', 'ci/cd', 'infrastructure'].some(s => lowerSkill.includes(s))) {
    return 'Infrastructure & DevOps';
  }

  // Programming languages
  if (['python', 'javascript', 'typescript', 'golang', 'rust', 'java', 'c#', 'ruby', 'php'].some(s => lowerSkill.includes(s))) {
    return 'Programming Languages';
  }

  // Frontend
  if (['react', 'vue', 'angular', 'html', 'css', 'frontend'].some(s => lowerSkill.includes(s))) {
    return 'Frontend';
  }

  // Backend/Frameworks
  if (['django', 'fastapi', 'nodejs', 'express', 'backend', 'api'].some(s => lowerSkill.includes(s))) {
    return 'Backend & Frameworks';
  }

  // Databases
  if (['postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'database'].some(s => lowerSkill.includes(s))) {
    return 'Databases';
  }

  // Leadership/Soft skills
  if (['leadership', 'management', 'communication', 'mentoring', 'team building'].some(s => lowerSkill.includes(s))) {
    return 'Leadership';
  }

  return 'Other';
}

function estimateProficiency(evidenceCount: number): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
  if (evidenceCount <= 1) return 'beginner';
  if (evidenceCount <= 3) return 'intermediate';
  if (evidenceCount <= 6) return 'advanced';
  return 'expert';
}

function estimateProficiencyLevel(avgDepth: number): string {
  if (avgDepth < 2) return 'beginner';
  if (avgDepth < 3) return 'intermediate';
  if (avgDepth < 4) return 'advanced';
  return 'expert';
}

function findSkillSynergies(skills: SkillEntry[]): string[] {
  const synergies: string[] = [];

  // Common synergies
  const synergyCombos = [
    { skills: ['Kubernetes', 'Docker'], synergy: 'Container Orchestration' },
    { skills: ['AWS', 'Terraform'], synergy: 'AWS Infrastructure as Code' },
    { skills: ['React', 'TypeScript'], synergy: 'Type-Safe React Development' },
    { skills: ['Python', 'Django'], synergy: 'Python Web Development' },
    { skills: ['PostgreSQL', 'Django'], synergy: 'Full-Stack Python' }
  ];

  synergyCombos.forEach(combo => {
    const skillNames = skills.map(s => s.skill.toLowerCase());
    if (combo.skills.every(s => skillNames.some(sn => sn.includes(s.toLowerCase())))) {
      synergies.push(combo.synergy);
    }
  });

  return synergies;
}

function assessMarketValue(category: string, skills: SkillEntry[]): 'high' | 'medium' | 'low' | 'emerging' {
  const highValueCategories = ['Cloud Platforms', 'Containerization', 'Infrastructure & DevOps', 'Leadership'];
  const emergingCategories = ['Machine Learning', 'AI/ML', 'Blockchain'];

  if (highValueCategories.includes(category)) return 'high';
  if (emergingCategories.includes(category)) return 'emerging';
  if (category === 'Legacy' || category === 'Deprecated') return 'low';
  return 'medium';
}

function analyzeTrend(timelineLength: number): 'deepening' | 'stagnant' | 'declining' | 'cycling' {
  if (timelineLength > 5) return 'deepening';
  if (timelineLength > 2) return 'stagnant';
  if (timelineLength === 1) return 'cycling';
  return 'declining';
}

function generateLearningPath(skill: string): string[] {
  const paths: { [key: string]: string[] } = {
    'kubernetes': ['Docker fundamentals', 'Container concepts', 'Kubernetes architecture', 'Deployment strategies', 'Production setup'],
    'typescript': ['JavaScript basics', 'TypeScript fundamentals', 'Advanced types', 'Framework integration'],
    'aws': ['Cloud fundamentals', 'AWS core services', 'Architecture patterns', 'Cost optimization'],
    'terraform': ['Infrastructure concepts', 'HCL basics', 'State management', 'Module design'],
  };

  return paths[skill.toLowerCase()] || [
    'Fundamentals',
    'Core concepts',
    'Advanced topics',
    'Real-world projects',
    'Specialization'
  ];
}

function getProfileRecommendation(profile: string): string {
  switch (profile) {
    case 'specialist':
      return 'Deep expertise is valuable - market as subject matter expert';
    case 'generalist':
      return 'Broad skills are valuable - consider T-shaped development for specialization';
    case 't-shaped':
      return 'Strong T-shaped profile - ideal for architectural roles';
    case 'pi-shaped':
      return 'Excellent multi-domain expertise - pursue leadership or specialized IC roles';
    default:
      return 'Continue skill development aligned with career goals';
  }
}

export default SkillsAnalyzer;
