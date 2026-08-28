/**
 * PSB Analyzer - Main Extension File
 * Comprehensive analytics and insight engine for career documentation
 * 
 * Analyzes:
 * - Career timeline and progression
 * - Skills depth and breadth
 * - Technology stack evolution
 * - Project patterns and themes
 * - Achievement metrics and impact
 * - Career trajectory
 * - Skill gaps and opportunities
 * - Unique differentiators
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Time range filter for analysis
 */
export interface TimeRange {
  startDate?: string; // ISO 8601 date format (YYYY-MM-DD)
  endDate?: string;   // ISO 8601 date format (YYYY-MM-DD)
}

/**
 * Single insight from analysis
 */
export interface Insight {
  category: string;
  finding: string;
  evidencePoints: string[];
  confidence: 'high' | 'medium' | 'low';
  actionableRecommendation: string;
  sourceFiles?: string[];
}

/**
 * Career statistics
 */
export interface CareerStatistics {
  totalYearsExperience: number;
  totalProjects: number;
  technologyCount: number;
  skillCount: number;
  averageProjectDuration: number;
  careerGrowthTrajectory: 'ascending' | 'stable' | 'varied';
  averageRoleLength: number;
  companiesWorkedWith: number;
  industriesCovered: number;
}

/**
 * Skill matrix entry
 */
export interface SkillEntry {
  skill: string;
  depth: 1 | 2 | 3 | 4 | 5;
  yearsOfExperience: number;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lastUsed?: string;
  evidence: string[];
}

/**
 * Technology cluster
 */
export interface TechnologyCluster {
  category: string;
  technologies: Array<{
    name: string;
    depth: 1 | 2 | 3 | 4 | 5;
    adoptedDate?: string;
    lastUsed?: string;
    projectCount: number;
  }>;
}

/**
 * Timeline entry
 */
export interface TimelineEntry {
  date: string;
  eventType: 'role-start' | 'role-end' | 'project-start' | 'project-end' | 'achievement' | 'skill-acquired';
  title: string;
  company?: string;
  description?: string;
  technologies?: string[];
  impact?: string;
}

/**
 * Project pattern analysis
 */
export interface ProjectPattern {
  pattern: string;
  frequency: number;
  commonTechnologies: string[];
  averageDuration: string;
  impactType: string[];
  examples: string[];
  confidence: 'high' | 'medium' | 'low';
}

/**
 * Achievement metric
 */
export interface AchievementMetric {
  achievement: string;
  metric: string;
  value: string;
  unit: string;
  date?: string;
  impactCategory: 'cost' | 'performance' | 'team' | 'product' | 'process' | 'other';
  sourceFile?: string;
}

/**
 * Visualizations
 */
export interface AnalysisVisualizations {
  timeline?: string;
  technologyClusters?: string[];
  skillMatrix?: SkillEntry[];
  careerTrajectory?: string;
  projectDistribution?: string;
}

/**
 * Complete analysis output
 */
export interface AnalysisOutput {
  analysisType: 'overview' | 'timeline' | 'skills' | 'technologies' | 'projects' | 'achievements' | 'trajectory' | 'gaps' | 'differentiators';
  insights: Insight[];
  statistics: Partial<CareerStatistics>;
  visualizations: AnalysisVisualizations;
  careerNarrative: string;
  recommendations: string[];
  generatedAt: string;
  analysisMetadata?: {
    filesProcessed: number;
    dataPoints: number;
    confidenceAverage: number;
  };
}

/**
 * Skill gap analysis
 */
export interface SkillGap {
  skill: string;
  currentLevel: 'none' | 'beginner' | 'intermediate' | 'advanced';
  targetLevel: 'intermediate' | 'advanced' | 'expert';
  gap: string;
  impactIfAddressed: 'high' | 'medium' | 'low';
  learningPath: string[];
  estimatedTimeToMastery: string;
  relatedProjects?: string[];
}

/**
 * Career differentiator
 */
export interface Differentiator {
  category: string;
  differentiator: string;
  rarity: 'rare' | 'uncommon' | 'unique';
  competitiveAdvantage: string;
  evidence: string[];
  marketValue: 'high' | 'medium' | 'emerging';
}

// ============================================================================
// MAIN ANALYZER CLASS
// ============================================================================

export class PSBAnalyzer {
  
  /**
   * Generate comprehensive career overview
   */
  static async analyzeCareerOverview(
    options?: {
      includeSections?: string[];
      timeRange?: TimeRange;
      focusArea?: 'growth' | 'impact' | 'breadth' | 'specialization' | 'none';
    }
  ): Promise<AnalysisOutput> {
    const {
      includeSections = ['timeline', 'statistics', 'insights', 'recommendations', 'narrative'],
      timeRange,
      focusArea = 'none'
    } = options || {};

    return {
      analysisType: 'overview',
      insights: [],
      statistics: {},
      visualizations: {},
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString(),
      analysisMetadata: {
        filesProcessed: 0,
        dataPoints: 0,
        confidenceAverage: 0
      }
    };
  }

  /**
   * Build chronological timeline of career
   */
  static async analyzeTimeline(
    options?: {
      granularity?: 'years' | 'quarters' | 'months';
      includeGaps?: boolean;
      visualize?: boolean;
    }
  ): Promise<AnalysisOutput> {
    const {
      granularity = 'years',
      includeGaps = true,
      visualize = true
    } = options || {};

    return {
      analysisType: 'timeline',
      insights: [],
      statistics: {},
      visualizations: {},
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Analyze skills depth, breadth, and evolution
   */
  static async analyzeSkills(
    options?: {
      categoryFilter?: string;
      includeEvolution?: boolean;
      depthAnalysis?: boolean;
      clusterSkills?: boolean;
    }
  ): Promise<AnalysisOutput> {
    const {
      categoryFilter,
      includeEvolution = true,
      depthAnalysis = true,
      clusterSkills = true
    } = options || {};

    return {
      analysisType: 'skills',
      insights: [],
      statistics: {
        skillCount: 0
      },
      visualizations: {
        skillMatrix: []
      },
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Analyze technology stack and evolution
   */
  static async analyzeTechnologies(
    options?: {
      groupByCategory?: boolean;
      showTimeline?: boolean;
      identifyTrends?: boolean;
      depthThreshold?: number;
    }
  ): Promise<AnalysisOutput> {
    const {
      groupByCategory = true,
      showTimeline = true,
      identifyTrends = true,
      depthThreshold = 1
    } = options || {};

    return {
      analysisType: 'technologies',
      insights: [],
      statistics: {
        technologyCount: 0
      },
      visualizations: {
        technologyClusters: []
      },
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Identify project patterns and themes
   */
  static async analyzeProjects(
    options?: {
      identifyPatterns?: boolean;
      categorizeByType?: boolean;
      analyzeScale?: boolean;
      duration?: 'all' | 'last-year' | 'last-3-years' | 'last-5-years';
    }
  ): Promise<AnalysisOutput> {
    const {
      identifyPatterns = true,
      categorizeByType = true,
      analyzeScale = true,
      duration = 'all'
    } = options || {};

    return {
      analysisType: 'projects',
      insights: [],
      statistics: {
        totalProjects: 0,
        averageProjectDuration: 0
      },
      visualizations: {
        projectDistribution: ''
      },
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Extract and analyze achievement metrics and impact
   */
  static async analyzeAchievements(
    options?: {
      extractMetrics?: boolean;
      categorizeImpact?: boolean;
      identifyPatterns?: boolean;
      timeRange?: 'all' | 'last-year' | 'last-3-years' | 'last-5-years';
    }
  ): Promise<AnalysisOutput> {
    const {
      extractMetrics = true,
      categorizeImpact = true,
      identifyPatterns = true,
      timeRange = 'all'
    } = options || {};

    return {
      analysisType: 'achievements',
      insights: [],
      statistics: {},
      visualizations: {},
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Analyze career progression and trajectory
   */
  static async analyzeTrajectory(
    options?: {
      includeProgression?: boolean;
      identifyThemes?: boolean;
      projections?: boolean;
      compareBenchmarks?: boolean;
    }
  ): Promise<AnalysisOutput> {
    const {
      includeProgression = true,
      identifyThemes = true,
      projections = false,
      compareBenchmarks = false
    } = options || {};

    return {
      analysisType: 'trajectory',
      insights: [],
      statistics: {},
      visualizations: {
        careerTrajectory: ''
      },
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Identify skill gaps and learning opportunities
   */
  static async analyzeGaps(
    options?: {
      targetRole?: string;
      targetIndustry?: string;
      trendAnalysis?: boolean;
      prioritizeByImpact?: boolean;
      includeLearningPaths?: boolean;
    }
  ): Promise<AnalysisOutput> {
    const {
      targetRole,
      targetIndustry,
      trendAnalysis = true,
      prioritizeByImpact = true,
      includeLearningPaths = true
    } = options || {};

    return {
      analysisType: 'gaps',
      insights: [],
      statistics: {},
      visualizations: {},
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Identify unique strengths and differentiators
   */
  static async identifyDifferentiators(
    options?: {
      compareToRole?: string;
      focusOnRarity?: boolean;
      identifyNiches?: boolean;
      analyzeUniqueness?: boolean;
    }
  ): Promise<AnalysisOutput> {
    const {
      compareToRole,
      focusOnRarity = true,
      identifyNiches = true,
      analyzeUniqueness = true
    } = options || {};

    return {
      analysisType: 'differentiators',
      insights: [],
      statistics: {},
      visualizations: {},
      careerNarrative: '',
      recommendations: [],
      generatedAt: new Date().toISOString()
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS FOR DATA EXTRACTION
// ============================================================================

/**
 * Parse date strings to standardized format
 */
export function parseDate(dateString: string): Date {
  // Handle various date formats: YYYY-MM-DD, MM/DD/YYYY, "January 2020", etc.
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}

/**
 * Calculate years between two dates
 */
export function calculateYears(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

/**
 * Extract numbers and metrics from text
 */
export function extractMetrics(text: string): { metric: string; value: string }[] {
  const patterns = [
    /(\d+(?:\.\d+)?)\s*%/g,           // Percentages
    /\$\d+(?:,\d{3})*(?:\.\d+)?/g,   // Currency
    /(\d+(?:,\d{3})*)\s*(?:times?|x)(?:\s+faster|speedup)?/g, // Multipliers
    /(\d+(?:,\d{3})*)\s*(?:employees?|people|team members?)/g, // Team size
    /(\d+(?:,\d{3})*)\s*(?:years?|months?|weeks?|days?)/g // Time durations
  ];

  const metrics: { metric: string; value: string }[] = [];
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      metrics.push({
        metric: text.substring(Math.max(0, match.index - 20), match.index + match[0].length + 20).trim(),
        value: match[0]
      });
    }
  });

  return metrics;
}

/**
 * Identify technologies from text
 */
export function identifyTechnologies(text: string): string[] {
  const commonTechs = [
    'kubernetes', 'docker', 'terraform', 'aws', 'azure', 'gcp',
    'python', 'typescript', 'javascript', 'golang', 'rust', 'java',
    'react', 'vue', 'angular', 'nodejs', 'django', 'fastapi',
    'postgres', 'mysql', 'mongodb', 'redis', 'elasticsearch',
    'kafka', 'rabbitmq', 'graphql', 'rest', 'grpc',
    'jenkins', 'gitlab', 'github', 'circleci', 'github-actions',
    'prometheus', 'grafana', 'datadog', 'newrelic', 'cloudwatch'
  ];

  const lowerText = text.toLowerCase();
  const found = new Set<string>();

  commonTechs.forEach(tech => {
    if (lowerText.includes(tech)) {
      found.add(tech);
    }
  });

  return Array.from(found);
}

/**
 * Estimate skill depth from evidence
 */
export function estimateSkillDepth(evidence: string[]): 1 | 2 | 3 | 4 | 5 {
  if (evidence.length === 0) return 1;
  if (evidence.length <= 2) return 2;
  if (evidence.length <= 4) return 3;
  if (evidence.length <= 6) return 4;
  return 5;
}

/**
 * Generate confidence score for insight
 */
export function calculateConfidence(
  dataPoints: number,
  sourceFiles: number,
  consistency: number // 0-1 scale
): 'high' | 'medium' | 'low' {
  const score = (dataPoints * 0.4 + sourceFiles * 0.3 + consistency * 0.3) / 10;
  if (score >= 0.7) return 'high';
  if (score >= 0.4) return 'medium';
  return 'low';
}

export default PSBAnalyzer;
