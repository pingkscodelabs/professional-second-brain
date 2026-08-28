/**
 * Technologies Analyzer
 * Analyzes technology stack, adoption, and market trends
 */

import { Insight, TechnologyCluster } from './psb-analyzer';

/**
 * Technology adoption timeline
 */
export interface TechnologyAdoption {
  name: string;
  adoptedDate?: string;
  lastUsed?: string;
  adoptionTrend: 'rising' | 'stable' | 'declining';
  projectCount: number;
  yearsUsed: number;
}

export class TechnologiesAnalyzer {
  
  /**
   * Build technology inventory
   */
  static buildTechnologyInventory(experiences: any[], projects: any[]): any[] {
    const techMap = new Map<string, any>();

    // From experiences
    (experiences || []).forEach((exp) => {
      const technologies = exp.technologies || [];
      technologies.forEach((tech: string) => {
        const key = tech.toLowerCase();
        if (!techMap.has(key)) {
          techMap.set(key, {
            name: tech,
            category: categorizeByTechType(tech),
            adoptedDate: exp.startDate,
            projectCount: 0,
            yearsUsed: 0,
            proficiency: 'intermediate',
            contexts: []
          });
        }
        techMap.get(key)!.contexts.push(`${exp.company} (${exp.startDate})`);
      });
    });

    // From projects
    (projects || []).forEach((project) => {
      const technologies = project.technologies || [];
      technologies.forEach((tech: string) => {
        const key = tech.toLowerCase();
        if (!techMap.has(key)) {
          techMap.set(key, {
            name: tech,
            category: categorizeByTechType(tech),
            adoptedDate: project.startDate,
            projectCount: 0,
            yearsUsed: 0,
            proficiency: 'beginner',
            contexts: []
          });
        }
        const entry = techMap.get(key)!;
        entry.projectCount++;
        entry.contexts.push(project.name || 'Unknown');
      });
    });

    return Array.from(techMap.values())
      .map(tech => ({
        ...tech,
        proficiency: estimateTechProficiency(tech.projectCount, tech.yearsUsed),
        adoptionTrend: calculateAdoptionTrend(tech.contexts.length)
      }))
      .sort((a, b) => b.projectCount - a.projectCount);
  }

  /**
   * Cluster technologies by category
   */
  static clusterByCategory(technologies: any[]): TechnologyCluster[] {
    const clusters = new Map<string, any[]>();

    technologies.forEach((tech) => {
      const category = tech.category;
      if (!clusters.has(category)) {
        clusters.set(category, []);
      }
      clusters.get(category)!.push(tech);
    });

    return Array.from(clusters.entries()).map(([categoryName, categoryTechs]) => ({
      category: categoryName,
      technologies: categoryTechs.map(t => ({
        name: t.name,
        depth: calculateTechDepth(t.projectCount) as 1 | 2 | 3 | 4 | 5,
        adoptedDate: t.adoptedDate,
        lastUsed: t.lastUsed,
        projectCount: t.projectCount
      }))
    }));
  }

  /**
   * Analyze technology adoption timeline
   */
  static analyzeAdoptionTimeline(technologies: any[]): TechnologyAdoption[] {
    return technologies
      .filter(t => t.adoptedDate)
      .map(t => ({
        name: t.name,
        adoptedDate: t.adoptedDate,
        lastUsed: t.lastUsed,
        adoptionTrend: t.adoptionTrend,
        projectCount: t.projectCount,
        yearsUsed: calculateYearsBetween(t.adoptedDate, t.lastUsed || new Date().toISOString())
      }))
      .sort((a, b) => new Date(b.adoptedDate!).getTime() - new Date(a.adoptedDate!).getTime());
  }

  /**
   * Identify technology trends
   */
  static identifyTrends(technologies: any[]): {
    emerging: string[];
    trending: string[];
    stable: string[];
    declining: string[];
  } {
    const trends = { emerging: [], trending: [], stable: [], declining: [] };

    technologies.forEach((tech) => {
      const isRecent = isRecentAdoption(tech.adoptedDate);
      const isFrequentlyUsed = tech.projectCount > 3;
      const isInDemand = isPopularTechnology(tech.name);

      if (isRecent && isInDemand) {
        trends.emerging.push(tech.name);
      } else if (isFrequentlyUsed && isInDemand) {
        trends.trending.push(tech.name);
      } else if (isFrequentlyUsed) {
        trends.stable.push(tech.name);
      } else if (!isInDemand) {
        trends.declining.push(tech.name);
      }
    });

    return trends;
  }

  /**
   * Assess market value of technologies
   */
  static assessMarketValue(technology: string): 'high' | 'medium' | 'low' | 'emerging' {
    const highDemand = [
      'kubernetes', 'docker', 'aws', 'azure', 'gcp',
      'terraform', 'golang', 'rust', 'typescript',
      'react', 'python', 'postgres'
    ];
    const emerging = [
      'webassembly', 'wasm', 'edge computing', 'rust',
      'llm', 'ai', 'ml', 'quantum'
    ];
    const legacy = [
      'flash', 'activeX', 'silverlight', 'jsp'
    ];

    const techLower = technology.toLowerCase();

    if (legacy.some(l => techLower.includes(l))) return 'low';
    if (emerging.some(e => techLower.includes(e))) return 'emerging';
    if (highDemand.some(h => techLower.includes(h))) return 'high';
    return 'medium';
  }

  /**
   * Find technology synergies
   */
  static findSynergies(technologies: any[]): string[] {
    const synergies: string[] = [];
    const techNames = technologies.map(t => t.name.toLowerCase());

    // Define powerful combinations
    const synergyCombos = [
      { techs: ['kubernetes', 'docker'], synergy: 'Container Orchestration' },
      { techs: ['terraform', 'aws'], synergy: 'Infrastructure as Code on AWS' },
      { techs: ['react', 'typescript'], synergy: 'Type-Safe React' },
      { techs: ['python', 'tensorflow'], synergy: 'Machine Learning' },
      { techs: ['kubernetes', 'prometheus'], synergy: 'Container Monitoring' },
      { techs: ['postgresql', 'graphql'], synergy: 'Modern Database APIs' }
    ];

    synergyCombos.forEach(combo => {
      if (combo.techs.every(t => techNames.some(tn => tn.includes(t)))) {
        synergies.push(combo.synergy);
      }
    });

    return synergies;
  }

  /**
   * Generate analysis insights
   */
  static generateInsights(
    technologies: any[],
    clusters: TechnologyCluster[],
    trends: any
  ): Insight[] {
    const insights: Insight[] = [];

    // Top technologies
    const top5 = technologies.slice(0, 5);
    if (top5.length > 0) {
      insights.push({
        category: 'Core Technologies',
        finding: `Top 5 technologies: ${top5.map(t => t.name).join(', ')}`,
        evidencePoints: top5.map(t => `${t.name} (${t.projectCount} projects)`),
        confidence: 'high',
        actionableRecommendation: 'These are core competencies - highlight prominently'
      });
    }

    // Technology clusters
    clusters.forEach((cluster) => {
      if (cluster.technologies.length >= 3) {
        insights.push({
          category: `${cluster.category} Expertise`,
          finding: `${cluster.technologies.length} technologies in ${cluster.category}`,
          evidencePoints: cluster.technologies.slice(0, 3).map(t => `${t.name} (depth: ${t.depth})`),
          confidence: 'high',
          actionableRecommendation: `${cluster.category} is a key domain area`
        });
      }
    });

    // Emerging technologies
    if (trends.emerging.length > 0) {
      insights.push({
        category: 'Emerging Technologies',
        finding: `Early adoption of ${trends.emerging.length} emerging technology/technologies`,
        evidencePoints: trends.emerging.slice(0, 3),
        confidence: 'medium',
        actionableRecommendation: 'Position as forward-thinking and adaptable'
      });
    }

    // Market alignment
    const marketValue = technologies.map(t => this.assessMarketValue(t.name));
    const highValueCount = marketValue.filter(v => v === 'high').length;
    insights.push({
      category: 'Market Alignment',
      finding: `${highValueCount}/${technologies.length} technologies in high demand`,
      evidencePoints: [
        `High demand: ${highValueCount}`,
        `Emerging: ${marketValue.filter(v => v === 'emerging').length}`,
        `Medium: ${marketValue.filter(v => v === 'medium').length}`
      ],
      confidence: 'high',
      actionableRecommendation: 'Strong alignment with market needs'
    });

    return insights;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function categorizeByTechType(technology: string): string {
  const lowerTech = technology.toLowerCase();

  // Cloud platforms
  if (['aws', 'azure', 'gcp', 'google cloud'].some(p => lowerTech.includes(p))) {
    return 'Cloud Platforms';
  }

  // Container/Orchestration
  if (['kubernetes', 'docker', 'k8s', 'container'].some(p => lowerTech.includes(p))) {
    return 'Container & Orchestration';
  }

  // Infrastructure/DevOps
  if (['terraform', 'ansible', 'jenkins', 'devops', 'ci/cd'].some(p => lowerTech.includes(p))) {
    return 'Infrastructure & DevOps';
  }

  // Programming languages
  if (['python', 'javascript', 'typescript', 'go', 'golang', 'rust', 'java'].some(p => lowerTech.includes(p))) {
    return 'Programming Languages';
  }

  // Frontend frameworks
  if (['react', 'vue', 'angular', 'svelte'].some(p => lowerTech.includes(p))) {
    return 'Frontend Frameworks';
  }

  // Backend frameworks
  if (['django', 'fastapi', 'nodejs', 'express', 'rails', 'spring'].some(p => lowerTech.includes(p))) {
    return 'Backend Frameworks';
  }

  // Databases
  if (['postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch'].some(p => lowerTech.includes(p))) {
    return 'Databases';
  }

  // Message queues
  if (['kafka', 'rabbitmq', 'sqs', 'pubsub'].some(p => lowerTech.includes(p))) {
    return 'Message Queues';
  }

  return 'Other';
}

function estimateTechProficiency(projectCount: number, yearsUsed: number): string {
  if (projectCount === 0) return 'beginner';
  if (projectCount <= 2) return 'intermediate';
  if (projectCount <= 5) return 'advanced';
  return 'expert';
}

function calculateTechDepth(projectCount: number): number {
  if (projectCount <= 1) return 1;
  if (projectCount <= 2) return 2;
  if (projectCount <= 4) return 3;
  if (projectCount <= 6) return 4;
  return 5;
}

function calculateAdoptionTrend(contextCount: number): 'rising' | 'stable' | 'declining' {
  if (contextCount > 5) return 'rising';
  if (contextCount > 2) return 'stable';
  return 'declining';
}

function calculateYearsBetween(start: string, end: string): number {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

function isRecentAdoption(date?: string): boolean {
  if (!date) return false;
  const adoptDate = new Date(date);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  return adoptDate > twoYearsAgo;
}

function isPopularTechnology(tech: string): boolean {
  const popular = [
    'kubernetes', 'docker', 'aws', 'azure', 'gcp',
    'python', 'typescript', 'javascript', 'react', 'golang',
    'terraform', 'postgresql', 'redis', 'graphql', 'rust'
  ];
  return popular.some(p => tech.toLowerCase().includes(p));
}

export default TechnologiesAnalyzer;
