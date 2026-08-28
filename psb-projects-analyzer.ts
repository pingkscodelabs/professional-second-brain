/**
 * Projects Analyzer
 * Analyzes project patterns, scale, and themes
 */

import { Insight } from './psb-analyzer';

/**
 * Project type classification
 */
export interface ProjectType {
  type: string;
  examples: string[];
  frequency: number;
  technologies: string[];
  averageDuration: string;
  impactLevel: 'high' | 'medium' | 'low';
}

/**
 * Project pattern analysis result
 */
export interface ProjectPattern {
  pattern: string;
  description: string;
  frequency: number;
  examples: string[];
  technologies: string[];
  averageDuration: number;
  impactMetrics: string[];
  confidence: 'high' | 'medium' | 'low';
}

export class ProjectsAnalyzer {
  
  /**
   * Identify common project patterns
   */
  static identifyPatterns(projects: any[]): ProjectPattern[] {
    const patterns: ProjectPattern[] = [];

    // Infrastructure/Platform projects
    const infraProjects = projects.filter(p => 
      (p.name || '').toLowerCase().includes('infra') ||
      (p.description || '').toLowerCase().includes('infrastructure') ||
      (p.technologies || []).some((t: string) => 
        ['kubernetes', 'terraform', 'aws'].some(k => t.toLowerCase().includes(k))
      )
    );

    if (infraProjects.length > 0) {
      patterns.push({
        pattern: 'Infrastructure & DevOps',
        description: 'Building, scaling, and managing infrastructure',
        frequency: infraProjects.length,
        examples: infraProjects.slice(0, 3).map(p => p.name || 'Unnamed'),
        technologies: extractCommonTechs(infraProjects),
        averageDuration: calculateAvgDuration(infraProjects),
        impactMetrics: extractCommonMetrics(infraProjects),
        confidence: infraProjects.length > 2 ? 'high' : 'medium'
      });
    }

    // Migration/Modernization projects
    const migrationProjects = projects.filter(p =>
      (p.description || '').toLowerCase().includes('migrat') ||
      (p.description || '').toLowerCase().includes('moderniz') ||
      (p.name || '').toLowerCase().includes('migrat')
    );

    if (migrationProjects.length > 0) {
      patterns.push({
        pattern: 'Migration & Modernization',
        description: 'Moving systems, upgrading technologies, refactoring',
        frequency: migrationProjects.length,
        examples: migrationProjects.slice(0, 3).map(p => p.name || 'Unnamed'),
        technologies: extractCommonTechs(migrationProjects),
        averageDuration: calculateAvgDuration(migrationProjects),
        impactMetrics: extractCommonMetrics(migrationProjects),
        confidence: migrationProjects.length > 2 ? 'high' : 'medium'
      });
    }

    // Performance/Optimization projects
    const perfProjects = projects.filter(p =>
      (p.description || '').toLowerCase().includes('optimi') ||
      (p.description || '').toLowerCase().includes('perform') ||
      (p.name || '').toLowerCase().includes('optimi')
    );

    if (perfProjects.length > 0) {
      patterns.push({
        pattern: 'Performance & Optimization',
        description: 'Improving speed, efficiency, and resource utilization',
        frequency: perfProjects.length,
        examples: perfProjects.slice(0, 3).map(p => p.name || 'Unnamed'),
        technologies: extractCommonTechs(perfProjects),
        averageDuration: calculateAvgDuration(perfProjects),
        impactMetrics: extractCommonMetrics(perfProjects),
        confidence: perfProjects.length > 2 ? 'high' : 'medium'
      });
    }

    return patterns.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * Categorize projects by type
   */
  static categorizeByType(projects: any[]): ProjectType[] {
    const typeMap = new Map<string, any[]>();

    projects.forEach((project) => {
      let type = 'Other';

      // Determine project type
      if ((project.technologies || []).some((t: string) => 
          ['kubernetes', 'docker', 'terraform'].some(k => t.toLowerCase().includes(k))
      )) {
        type = 'Infrastructure';
      } else if ((project.technologies || []).some((t: string) =>
          ['react', 'angular', 'vue'].some(k => t.toLowerCase().includes(k))
      )) {
        type = 'Frontend';
      } else if ((project.technologies || []).some((t: string) =>
          ['python', 'django', 'nodejs'].some(k => t.toLowerCase().includes(k))
      )) {
        type = 'Backend';
      } else if ((project.description || '').toLowerCase().includes('cloud')) {
        type = 'Cloud';
      } else if ((project.description || '').toLowerCase().includes('consulting')) {
        type = 'Consulting';
      }

      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(project);
    });

    return Array.from(typeMap.entries()).map(([type, typeProjects]) => ({
      type,
      examples: typeProjects.slice(0, 3).map(p => p.name || 'Unnamed'),
      frequency: typeProjects.length,
      technologies: extractCommonTechs(typeProjects),
      averageDuration: calculateAvgDurationStr(typeProjects),
      impactLevel: assessImpactLevel(typeProjects)
    }));
  }

  /**
   * Analyze project scale and growth
   */
  static analyzeScale(projects: any[]): {
    smallScaleProjects: number;
    mediumScaleProjects: number;
    largeScaleProjects: number;
    scalingTrend: 'increasing' | 'stable' | 'decreasing';
    complexity: 'simple' | 'moderate' | 'complex';
  } {
    const sortedByDate = [...projects]
      .filter(p => p.startDate)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const categorize = (project: any): 'small' | 'medium' | 'large' => {
      const techCount = (project.technologies || []).length;
      const teamSize = extractTeamSize(project.description || '') || 1;
      const duration = calculateProjectDuration(project);

      const score = techCount * 0.4 + teamSize * 0.3 + duration * 0.3;

      if (score < 5) return 'small';
      if (score < 15) return 'medium';
      return 'large';
    };

    const small = projects.filter(p => categorize(p) === 'small').length;
    const medium = projects.filter(p => categorize(p) === 'medium').length;
    const large = projects.filter(p => categorize(p) === 'large').length;

    // Determine trend
    const firstHalf = sortedByDate.slice(0, Math.ceil(sortedByDate.length / 2));
    const secondHalf = sortedByDate.slice(Math.ceil(sortedByDate.length / 2));

    const avgScaleFirst = firstHalf.reduce((sum, p) => sum + (categorize(p) === 'large' ? 3 : categorize(p) === 'medium' ? 2 : 1), 0) / Math.max(1, firstHalf.length);
    const avgScaleSecond = secondHalf.reduce((sum, p) => sum + (categorize(p) === 'large' ? 3 : categorize(p) === 'medium' ? 2 : 1), 0) / Math.max(1, secondHalf.length);

    let trend: 'increasing' | 'stable' | 'decreasing' = 'stable';
    if (avgScaleSecond > avgScaleFirst * 1.2) {
      trend = 'increasing';
    } else if (avgScaleSecond < avgScaleFirst * 0.8) {
      trend = 'decreasing';
    }

    const totalTechCount = projects.reduce((sum, p) => sum + (p.technologies || []).length, 0);
    const complexity = totalTechCount > 50 ? 'complex' : totalTechCount > 20 ? 'moderate' : 'simple';

    return {
      smallScaleProjects: small,
      mediumScaleProjects: medium,
      largeScaleProjects: large,
      scalingTrend: trend,
      complexity
    };
  }

  /**
   * Extract impact metrics from projects
   */
  static extractMetrics(projects: any[]): Array<{
    projectName: string;
    metric: string;
    value: string;
    unit: string;
    impactCategory: string;
  }> {
    const metrics = [];

    projects.forEach((project) => {
      // Extract from description
      const description = project.description || '';
      
      // Look for performance metrics
      const perfMatches = description.match(/(\d+)\s*(?:%|percent|times?)\s*(?:faster|speedup|improvement)/gi);
      if (perfMatches) {
        perfMatches.forEach((match) => {
          metrics.push({
            projectName: project.name || 'Unknown',
            metric: `Performance Improvement: ${match}`,
            value: match.split(/\s/)[0],
            unit: '%',
            impactCategory: 'Performance'
          });
        });
      }

      // Look for cost metrics
      const costMatches = description.match(/\$[\d,]+(?:\.\d+)?[MK]?/g);
      if (costMatches) {
        costMatches.forEach((match) => {
          metrics.push({
            projectName: project.name || 'Unknown',
            metric: `Cost Impact: ${match}`,
            value: match,
            unit: 'USD',
            impactCategory: 'Cost'
          });
        });
      }

      // Look for team metrics
      const teamMatches = description.match(/(\d+)\s*(?:team\s*members?|engineers?|people)/gi);
      if (teamMatches) {
        teamMatches.forEach((match) => {
          metrics.push({
            projectName: project.name || 'Unknown',
            metric: `Team Size: ${match}`,
            value: match.split(/\s/)[0],
            unit: 'people',
            impactCategory: 'Team'
          });
        });
      }
    });

    return metrics;
  }

  /**
   * Map technologies used across projects
   */
  static mapTechnologies(projects: any[]): Map<string, any[]> {
    const techMap = new Map<string, any[]>();

    projects.forEach((project) => {
      const technologies = project.technologies || [];
      technologies.forEach((tech: string) => {
        const key = tech.toLowerCase();
        if (!techMap.has(key)) {
          techMap.set(key, []);
        }
        techMap.get(key)!.push({
          projectName: project.name,
          projectDuration: calculateProjectDuration(project),
          role: extractRoleFromProject(project)
        });
      });
    });

    return techMap;
  }

  /**
   * Generate project analysis insights
   */
  static generateInsights(
    projects: any[],
    patterns: ProjectPattern[],
    scale: any
  ): Insight[] {
    const insights: Insight[] = [];

    // Project count and diversity
    insights.push({
      category: 'Project Portfolio',
      finding: `${projects.length} documented projects spanning ${extractUniqueIndustries(projects)} industries`,
      evidencePoints: [
        `Project count: ${projects.length}`,
        `Technology diversity: ${new Set(projects.flatMap(p => p.technologies || [])).size} unique technologies`,
        `Average project duration: ${calculateAvgDurationStr(projects)}`
      ],
      confidence: 'high',
      actionableRecommendation: 'Diverse project experience demonstrates adaptability'
    });

    // Project patterns
    if (patterns.length > 0) {
      insights.push({
        category: 'Project Patterns',
        finding: `Identified ${patterns.length} major project patterns`,
        evidencePoints: patterns.slice(0, 3).map(p => `${p.pattern} (${p.frequency} projects)`),
        confidence: 'high',
        actionableRecommendation: 'Focus on communicating core project patterns in interviews'
      });
    }

    // Scale growth
    insights.push({
      category: 'Project Scale',
      finding: `Project scale shows ${scale.scalingTrend} trend: ${scale.smallScaleProjects} small, ${scale.mediumScaleProjects} medium, ${scale.largeScaleProjects} large`,
      evidencePoints: [
        `Overall complexity: ${scale.complexity}`,
        `Scaling trend: ${scale.scalingTrend}`,
        `Large-scale projects: ${scale.largeScaleProjects}`
      ],
      confidence: 'high',
      actionableRecommendation: scale.scalingTrend === 'increasing' 
        ? 'Demonstrates growth in handling larger projects'
        : 'Consider taking on larger-scope initiatives'
    });

    return insights;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function extractCommonTechs(projects: any[]): string[] {
  const techMap = new Map<string, number>();

  projects.forEach((p) => {
    (p.technologies || []).forEach((tech: string) => {
      const key = tech.toLowerCase();
      techMap.set(key, (techMap.get(key) || 0) + 1);
    });
  });

  return Array.from(techMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tech]) => tech);
}

function calculateAvgDuration(projects: any[]): string {
  const durations = projects
    .map(p => calculateProjectDuration(p))
    .filter(d => d > 0);

  if (durations.length === 0) return 'Unknown';

  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  
  if (avg < 1) return `${Math.round(avg * 12)} months`;
  return `${Math.round(avg)} years`;
}

function calculateAvgDurationStr(projects: any[]): string {
  return calculateAvgDuration(projects);
}

function calculateProjectDuration(project: any): number {
  if (!project.startDate) return 0;
  
  const start = new Date(project.startDate);
  const end = project.endDate ? new Date(project.endDate) : new Date();
  
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

function assessImpactLevel(projects: any[]): 'high' | 'medium' | 'low' {
  const hasMetrics = projects.some(p => 
    (p.description || '').includes('%') || 
    (p.description || '').includes('$') ||
    (p.impact || '').length > 0
  );

  const avgDuration = projects.reduce((sum, p) => sum + calculateProjectDuration(p), 0) / Math.max(1, projects.length);
  
  if (hasMetrics && avgDuration > 1) return 'high';
  if (hasMetrics || avgDuration > 0.5) return 'medium';
  return 'low';
}

function extractTeamSize(text: string): number {
  const matches = text.match(/(\d+)\s*(?:team\s*members?|engineers?|people)/i);
  return matches ? parseInt(matches[1], 10) : 1;
}

function extractRoleFromProject(project: any): string {
  if (project.role) return project.role;
  if ((project.description || '').toLowerCase().includes('lead')) return 'Lead';
  if ((project.description || '').toLowerCase().includes('architect')) return 'Architect';
  if ((project.description || '').toLowerCase().includes('contributor')) return 'Contributor';
  return 'Team Member';
}

function extractUniqueIndustries(projects: any[]): number {
  const industries = new Set(
    projects
      .map(p => (p.industry || 'Unknown').toLowerCase())
      .filter(i => i !== 'unknown')
  );
  return Math.max(1, industries.size);
}

export default ProjectsAnalyzer;
