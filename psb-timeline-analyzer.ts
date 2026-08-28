/**
 * Career Timeline Analyzer
 * Builds chronological view of experience with detailed timeline analysis
 */

import { TimelineEntry, Insight, AnalysisOutput } from './psb-analyzer';

/**
 * Timeline gap analysis
 */
export interface TimelineGap {
  startDate: string;
  endDate: string;
  durationMonths: number;
  description?: string;
}

/**
 * Role transition analysis
 */
export interface RoleTransition {
  fromRole: string;
  toRole: string;
  transitionType: 'promotion' | 'lateral-move' | 'career-change' | 'return-to-market';
  durationAsTitle: number;
  skillsRetained: string[];
  skillsLost: string[];
  growthScore: number;
}

export class TimelineAnalyzer {
  
  /**
   * Build chronological timeline entries
   */
  static buildTimeline(experiences: any[]): TimelineEntry[] {
    const entries: TimelineEntry[] = [];

    experiences.forEach((exp) => {
      // Add role start event
      if (exp.startDate) {
        entries.push({
          date: exp.startDate,
          eventType: 'role-start',
          title: exp.title || 'Position Start',
          company: exp.company,
          technologies: exp.technologies
        });
      }

      // Add role end event
      if (exp.endDate) {
        entries.push({
          date: exp.endDate,
          eventType: 'role-end',
          title: exp.title || 'Position End',
          company: exp.company
        });
      }
    });

    return entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  /**
   * Detect employment gaps
   */
  static detectGaps(experiences: any[]): TimelineGap[] {
    const gaps: TimelineGap[] = [];
    const sortedExperiences = [...experiences].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sortedExperiences.length - 1; i++) {
      const current = sortedExperiences[i];
      const next = sortedExperiences[i + 1];

      if (current.endDate && next.startDate) {
        const endDate = new Date(current.endDate);
        const startDate = new Date(next.startDate);
        const durationMs = startDate.getTime() - endDate.getTime();
        const durationMonths = durationMs / (1000 * 60 * 60 * 24 * 30.44);

        if (durationMonths > 0.5) { // More than 2 weeks
          gaps.push({
            startDate: current.endDate,
            endDate: next.startDate,
            durationMonths: Math.round(durationMonths * 100) / 100
          });
        }
      }
    }

    return gaps;
  }

  /**
   * Analyze role transitions
   */
  static analyzeTransitions(experiences: any[]): RoleTransition[] {
    const transitions: RoleTransition[] = [];
    const sortedExperiences = [...experiences].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    for (let i = 0; i < sortedExperiences.length - 1; i++) {
      const current = sortedExperiences[i];
      const next = sortedExperiences[i + 1];

      const durationMonths = current.endDate 
        ? (new Date(current.endDate).getTime() - new Date(current.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44)
        : 0;

      transitions.push({
        fromRole: current.title || 'Unknown',
        toRole: next.title || 'Unknown',
        transitionType: determineTransitionType(current, next),
        durationAsTitle: Math.round(durationMonths),
        skillsRetained: findCommonSkills(current, next),
        skillsLost: findUniqueSkills(current, next),
        growthScore: calculateGrowthScore(current, next)
      });
    }

    return transitions;
  }

  /**
   * Calculate total years of experience
   */
  static calculateTotalExperience(experiences: any[]): number {
    let totalDays = 0;

    experiences.forEach((exp) => {
      if (exp.startDate && exp.endDate) {
        const start = new Date(exp.startDate);
        const end = new Date(exp.endDate);
        totalDays += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      }
    });

    return totalDays / 365.25;
  }

  /**
   * Identify employment tenure patterns
   */
  static analyzeTenurePattern(experiences: any[]): {
    averageLength: number;
    longestTenure: number;
    shortestTenure: number;
    pattern: 'job-hopper' | 'loyal' | 'balanced';
  } {
    const durations = experiences
      .map((exp) => {
        if (exp.startDate && exp.endDate) {
          const start = new Date(exp.startDate);
          const end = new Date(exp.endDate);
          return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
        }
        return 0;
      })
      .filter((d) => d > 0);

    if (durations.length === 0) {
      return {
        averageLength: 0,
        longestTenure: 0,
        shortestTenure: 0,
        pattern: 'balanced'
      };
    }

    const averageLength = durations.reduce((a, b) => a + b, 0) / durations.length;
    const longestTenure = Math.max(...durations);
    const shortestTenure = Math.min(...durations);

    let pattern: 'job-hopper' | 'loyal' | 'balanced' = 'balanced';
    if (averageLength < 1.5) {
      pattern = 'job-hopper';
    } else if (averageLength > 4) {
      pattern = 'loyal';
    }

    return {
      averageLength: Math.round(averageLength * 100) / 100,
      longestTenure: Math.round(longestTenure * 100) / 100,
      shortestTenure: Math.round(shortestTenure * 100) / 100,
      pattern
    };
  }

  /**
   * Generate ASCII timeline visualization
   */
  static generateTimelineVisualization(experiences: any[]): string {
    const sortedExps = [...experiences].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    if (sortedExps.length === 0) return 'No experiences to visualize';

    const startYear = new Date(sortedExps[0].startDate).getFullYear();
    const endYear = new Date(sortedExps[sortedExps.length - 1].endDate || new Date()).getFullYear();

    let timeline = `\nCareer Timeline (${startYear} - ${endYear})\n`;
    timeline += '='.repeat(60) + '\n\n';

    sortedExps.forEach((exp, index) => {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const startYear = start.getFullYear();
      const endYear = end.getFullYear();

      const durationYears = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      const durationStr = durationYears < 1 
        ? `${Math.round(durationYears * 12)}mo`
        : `${Math.round(durationYears * 10) / 10}yr`;

      timeline += `${index + 1}. ${exp.title || 'Position'} @ ${exp.company || 'Company'}\n`;
      timeline += `   ${start.toLocaleDateString()} - ${end.toLocaleDateString()} (${durationStr})\n`;
      timeline += `   ▓`.repeat(Math.round(durationYears * 5)) + '\n';
      timeline += '\n';
    });

    return timeline;
  }

  /**
   * Generate analysis insights
   */
  static generateInsights(experiences: any[]): Insight[] {
    const insights: Insight[] = [];
    const gaps = this.detectGaps(experiences);
    const tenurePattern = this.analyzeTenurePattern(experiences);
    const transitions = this.analyzeTransitions(experiences);

    // Gap analysis insight
    if (gaps.length > 0) {
      insights.push({
        category: 'Employment Gaps',
        finding: `Found ${gaps.length} gap(s) in employment history totaling ${Math.round(gaps.reduce((a, b) => a + b.durationMonths, 0))} months`,
        evidencePoints: gaps.map(g => `${g.durationMonths} months between ${g.startDate} and ${g.endDate}`),
        confidence: 'high',
        actionableRecommendation: gaps.length > 2 ? 'Consider addressing gaps in CV with explanations' : 'Employment gaps are minimal'
      });
    }

    // Tenure pattern insight
    insights.push({
      category: 'Tenure Pattern',
      finding: `${tenurePattern.pattern} pattern detected - average role duration: ${tenurePattern.averageLength} years`,
      evidencePoints: [
        `Shortest tenure: ${tenurePattern.shortestTenure} years`,
        `Longest tenure: ${tenurePattern.longestTenure} years`
      ],
      confidence: 'high',
      actionableRecommendation: getTenureRecommendation(tenurePattern.pattern)
    });

    // Career progression insight
    if (transitions.length > 0) {
      const avgGrowth = transitions.reduce((a, b) => a + b.growthScore, 0) / transitions.length;
      insights.push({
        category: 'Career Progression',
        finding: `Identified ${transitions.length} significant transitions with average growth score of ${Math.round(avgGrowth * 100) / 100}`,
        evidencePoints: transitions.slice(0, 3).map(t => `${t.fromRole} → ${t.toRole} (${t.transitionType})`),
        confidence: avgGrowth > 0.7 ? 'high' : 'medium',
        actionableRecommendation: 'Career shows consistent progression and skill building'
      });
    }

    return insights;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function determineTransitionType(current: any, next: any): 'promotion' | 'lateral-move' | 'career-change' | 'return-to-market' {
  const currentLevel = extractLevelFromTitle(current.title || '');
  const nextLevel = extractLevelFromTitle(next.title || '');

  if (nextLevel > currentLevel) return 'promotion';
  if (nextLevel === currentLevel) return 'lateral-move';
  return 'career-change';
}

function extractLevelFromTitle(title: string): number {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('cto') || lowerTitle.includes('principal') || lowerTitle.includes('vp')) return 5;
  if (lowerTitle.includes('staff') || lowerTitle.includes('lead')) return 4;
  if (lowerTitle.includes('senior')) return 3;
  if (lowerTitle.includes('mid') || lowerTitle.includes('medior')) return 2;
  if (lowerTitle.includes('junior') || lowerTitle.includes('intern')) return 1;
  return 2; // Default to mid-level
}

function findCommonSkills(exp1: any, exp2: any): string[] {
  const tech1 = new Set(exp1.technologies || []);
  const tech2 = new Set(exp2.technologies || []);
  return Array.from(tech1).filter(t => tech2.has(t));
}

function findUniqueSkills(exp1: any, exp2: any): string[] {
  const tech1 = new Set(exp1.technologies || []);
  const tech2 = new Set(exp2.technologies || []);
  return Array.from(tech1).filter(t => !tech2.has(t));
}

function calculateGrowthScore(exp1: any, exp2: any): number {
  const level1 = extractLevelFromTitle(exp1.title || '');
  const level2 = extractLevelFromTitle(exp2.title || '');
  const levelChange = Math.max(0, level2 - level1) / 5;

  const skillRetention = findCommonSkills(exp1, exp2).length / Math.max(1, (exp1.technologies || []).length);
  const newSkills = findUniqueSkills(exp2, exp1).length;

  return (levelChange * 0.5 + skillRetention * 0.3 + Math.min(newSkills / 5, 1) * 0.2);
}

function getTenureRecommendation(pattern: string): string {
  switch (pattern) {
    case 'job-hopper':
      return 'Consider focusing on deeper roles or explain career exploration strategy in interviews';
    case 'loyal':
      return 'Demonstrate adaptability and ability to work in dynamic environments';
    default:
      return 'Tenure pattern shows healthy balance between stability and growth';
  }
}

export default TimelineAnalyzer;
