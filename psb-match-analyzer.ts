/**
 * CV Match Analyzer
 * Calculates match scores, identifies gaps, and validates claims
 */

export interface MatchAnalysis {
  matchScore: number;
  strongAreas: string[];
  gapAreas: string[];
  fabricationRisk: string[];
  recommendations: string[];
  confidenceLevels: {
    skill: string;
    evidenceCount: number;
    confidence: 'high' | 'medium' | 'low';
  }[];
}

export class CVMatchAnalyzer {
  /**
   * Analyze CV match against job description
   */
  static analyze(
    jobRequirements: any,
    availableExperience: any,
    generatedCV: any
  ): MatchAnalysis {
    const matchScore = this.calculateMatchScore(jobRequirements, availableExperience);
    const strongAreas = this.identifyStrongAreas(jobRequirements, availableExperience);
    const gapAreas = this.identifyGaps(jobRequirements, availableExperience);
    const fabricationRisk = this.validateClaims(generatedCV, availableExperience);
    const recommendations = this.generateRecommendations(matchScore, gapAreas);
    const confidenceLevels = this.assessConfidenceLevels(generatedCV, availableExperience);

    return {
      matchScore,
      strongAreas,
      gapAreas,
      fabricationRisk,
      recommendations,
      confidenceLevels,
    };
  }

  /**
   * Calculate overall match score (0-100)
   */
  private static calculateMatchScore(jobRequirements: any, availableExperience: any): number {
    let totalScore = 0;
    let weights = 0;

    // Must-haves weight (40%)
    const mustHaveScore = this.calculateMustHaveMatch(jobRequirements, availableExperience);
    totalScore += mustHaveScore * 0.4;
    weights += 0.4;

    // Technology match weight (30%)
    const techScore = this.calculateTechnologyMatch(jobRequirements, availableExperience);
    totalScore += techScore * 0.3;
    weights += 0.3;

    // Experience level weight (20%)
    const levelScore = this.calculateExperienceLevelMatch(jobRequirements, availableExperience);
    totalScore += levelScore * 0.2;
    weights += 0.2;

    // Scale/impact weight (10%)
    const scaleScore = this.calculateScaleMatch(jobRequirements, availableExperience);
    totalScore += scaleScore * 0.1;
    weights += 0.1;

    return Math.round((totalScore / weights) * 100);
  }

  private static calculateMustHaveMatch(jobReq: any, experience: any): number {
    if (!jobReq.mustHaves || jobReq.mustHaves.length === 0) {
      return 100;
    }

    const experienceText = this.buildExperienceText(experience);
    const matches = jobReq.mustHaves.filter((requirement: string) =>
      experienceText.toLowerCase().includes(requirement.toLowerCase())
    ).length;

    return (matches / jobReq.mustHaves.length) * 100;
  }

  private static calculateTechnologyMatch(jobReq: any, experience: any): number {
    if (!jobReq.technologies || jobReq.technologies.length === 0) {
      return 100;
    }

    let matched = 0;
    jobReq.technologies.forEach((tech: string) => {
      if (experience.projects && experience.projects.length > 0) {
        experience.projects.forEach((project: any) => {
          if (project.technologies && project.technologies.some((t: string) =>
            t.toLowerCase() === tech.toLowerCase() || t.toLowerCase().includes(tech.toLowerCase())
          )) {
            matched++;
          }
        });
      }
    });

    // Remove duplicates
    const uniqueMatches = new Set();
    jobReq.technologies.forEach((tech: string) => {
      if (experience.projects && experience.projects.length > 0) {
        experience.projects.forEach((project: any) => {
          if (project.technologies && project.technologies.some((t: string) =>
            t.toLowerCase() === tech.toLowerCase() || t.toLowerCase().includes(tech.toLowerCase())
          )) {
            uniqueMatches.add(tech);
          }
        });
      }
    });

    return (uniqueMatches.size / jobReq.technologies.length) * 100;
  }

  private static calculateExperienceLevelMatch(jobReq: any, experience: any): number {
    const jobLevelValue = this.getLevelValue(jobReq.experienceLevel);
    const experienceLevelValue = this.calculateExperienceLevel(experience);

    // Match if experience meets or exceeds requirement
    if (experienceLevelValue >= jobLevelValue) {
      return 100;
    }

    // Partial credit for being close
    const difference = jobLevelValue - experienceLevelValue;
    return Math.max(0, 100 - (difference * 20));
  }

  private static calculateScaleMatch(jobReq: any, experience: any): number {
    let score = 0;
    let count = 0;

    // Check team size requirements
    if (jobReq.teamSize) {
      if (experience.projects && experience.projects.length > 0) {
        experience.projects.forEach((project: any) => {
          if (project.team_size && project.team_size >= jobReq.teamSize * 0.5) {
            score += 100;
          } else if (project.team_size) {
            score += (project.team_size / jobReq.teamSize) * 100;
          }
          count++;
        });
      }
    }

    return count > 0 ? score / count : 75; // Default to 75 if no data
  }

  /**
   * Identify strong areas of match
   */
  private static identifyStrongAreas(jobReq: any, experience: any): string[] {
    const areas: string[] = [];

    // Check if all must-haves are covered
    if (jobReq.mustHaves && jobReq.mustHaves.length > 0) {
      const experienceText = this.buildExperienceText(experience);
      const allMustHavesCovered = jobReq.mustHaves.every((requirement: string) =>
        experienceText.toLowerCase().includes(requirement.toLowerCase())
      );
      if (allMustHavesCovered) {
        areas.push('✓ All core requirements met');
      }
    }

    // Check technology expertise
    if (jobReq.technologies && jobReq.technologies.length > 0) {
      const matchedTechs = new Set();
      jobReq.technologies.forEach((tech: string) => {
        if (experience.projects && experience.projects.length > 0) {
          experience.projects.forEach((project: any) => {
            if (project.technologies && project.technologies.some((t: string) =>
              t.toLowerCase() === tech.toLowerCase()
            )) {
              matchedTechs.add(tech);
            }
          });
        }
      });

      if (matchedTechs.size >= jobReq.technologies.length * 0.8) {
        areas.push(`✓ Strong technology stack (${matchedTechs.size}/${jobReq.technologies.length} match)`);
      }
    }

    // Check experience level
    const expLevel = this.calculateExperienceLevel(experience);
    const jobLevel = this.getLevelValue(jobReq.experienceLevel);
    if (expLevel >= jobLevel) {
      areas.push(`✓ Experience level matches or exceeds requirement (${this.getLevelName(expLevel)})`);
    }

    // Check focus areas
    if (jobReq.focusAreas && jobReq.focusAreas.length > 0) {
      const experienceText = this.buildExperienceText(experience);
      const matchedFocusAreas = jobReq.focusAreas.filter((area: string) =>
        experienceText.toLowerCase().includes(area.toLowerCase())
      ).length;

      if (matchedFocusAreas >= jobReq.focusAreas.length * 0.7) {
        areas.push(`✓ Strong focus areas alignment (${matchedFocusAreas}/${jobReq.focusAreas.length} match)`);
      }
    }

    return areas.slice(0, 5);
  }

  /**
   * Identify gap areas
   */
  private static identifyGaps(jobReq: any, experience: any): string[] {
    const gaps: string[] = [];

    // Check missing must-haves
    if (jobReq.mustHaves && jobReq.mustHaves.length > 0) {
      const experienceText = this.buildExperienceText(experience);
      const missingRequirements = jobReq.mustHaves.filter((requirement: string) =>
        !experienceText.toLowerCase().includes(requirement.toLowerCase())
      );
      if (missingRequirements.length > 0) {
        gaps.push(`⚠ Missing: ${missingRequirements.slice(0, 3).join(', ')}`);
      }
    }

    // Check missing technologies
    if (jobReq.technologies && jobReq.technologies.length > 0) {
      const missingTechs = new Set();
      jobReq.technologies.forEach((tech: string) => {
        let found = false;
        if (experience.projects && experience.projects.length > 0) {
          experience.projects.forEach((project: any) => {
            if (project.technologies && project.technologies.some((t: string) =>
              t.toLowerCase().includes(tech.toLowerCase()) || tech.toLowerCase().includes(t.toLowerCase())
            )) {
              found = true;
            }
          });
        }
        if (!found) {
          missingTechs.add(tech);
        }
      });

      if (missingTechs.size > 0) {
        gaps.push(`⚠ Limited/no experience with: ${Array.from(missingTechs).slice(0, 3).join(', ')}`);
      }
    }

    // Check experience level gap
    const expLevel = this.calculateExperienceLevel(experience);
    const jobLevel = this.getLevelValue(jobReq.experienceLevel);
    if (expLevel < jobLevel) {
      gaps.push(`⚠ Experience level below requirement (${this.getLevelName(expLevel)} vs ${jobReq.experienceLevel})`);
    }

    return gaps.slice(0, 5);
  }

  /**
   * Validate CV claims against documented evidence
   */
  private static validateClaims(generatedCV: any, availableExperience: any): string[] {
    const risks: string[] = [];

    // Check if all skills have evidence
    if (generatedCV.cv.skills && generatedCV.cv.skills.length > 0) {
      generatedCV.cv.skills.forEach((skill: any) => {
        if (!skill.evidence || skill.evidence === '') {
          risks.push(`No evidence for "${skill.skill}" skill claim`);
        }
      });
    }

    // Verify experience claims reference documented projects
    if (generatedCV.cv.experience && generatedCV.cv.experience.length > 0) {
      generatedCV.cv.experience.forEach((exp: any) => {
        if (!availableExperience.projects || availableExperience.projects.length === 0) {
          risks.push(`Experience claim has no documented project evidence`);
        }
      });
    }

    return risks;
  }

  /**
   * Assess confidence levels for each skill
   */
  private static assessConfidenceLevels(
    generatedCV: any,
    availableExperience: any
  ): { skill: string; evidenceCount: number; confidence: 'high' | 'medium' | 'low' }[] {
    const confidenceLevels = [];

    if (!generatedCV.cv.skills || generatedCV.cv.skills.length === 0) {
      return confidenceLevels;
    }

    for (const skill of generatedCV.cv.skills) {
      let evidenceCount = 0;

      // Count evidence sources
      if (skill.evidence && skill.evidence !== '') {
        evidenceCount++;
      }

      // Count projects that mention this skill
      if (availableExperience.projects && availableExperience.projects.length > 0) {
        evidenceCount += availableExperience.projects.filter((proj: any) =>
          proj.technologies && proj.technologies.some((t: string) =>
            t.toLowerCase().includes(skill.skill.toLowerCase())
          )
        ).length;
      }

      const confidence = evidenceCount >= 3 ? 'high' : evidenceCount >= 1 ? 'medium' : 'low';

      confidenceLevels.push({
        skill: skill.skill,
        evidenceCount,
        confidence,
      });
    }

    return confidenceLevels;
  }

  /**
   * Generate actionable recommendations
   */
  private static generateRecommendations(matchScore: number, gapAreas: string[]): string[] {
    const recommendations: string[] = [];

    if (matchScore >= 80) {
      recommendations.push('Strong match - Prioritize applying and tailoring cover letter');
    } else if (matchScore >= 60) {
      recommendations.push('Moderate match - Address gap areas in interviews');
    } else {
      recommendations.push('Significant gaps - Consider upskilling before applying');
    }

    if (gapAreas.length > 0) {
      recommendations.push('Before interviews: Research role requirements and prepare learning narratives');
    }

    if (matchScore >= 70) {
      recommendations.push('Highlight your strongest aligned experience in cover letter');
    }

    recommendations.push('Follow up with specific examples during interviews');

    return recommendations.slice(0, 5);
  }

  /**
   * Helper: Get level numeric value
   */
  private static getLevelValue(level: string): number {
    const levels: { [key: string]: number } = {
      junior: 1,
      mid: 2,
      senior: 3,
      staff: 4,
      principal: 5,
    };
    return levels[level.toLowerCase()] || 2;
  }

  /**
   * Helper: Get level name from numeric value
   */
  private static getLevelName(value: number): string {
    const names = ['Junior', 'Mid', 'Senior', 'Staff', 'Principal'];
    return names[Math.min(Math.max(Math.round(value) - 1, 0), 4)];
  }

  /**
   * Helper: Calculate average experience level from projects
   */
  private static calculateExperienceLevel(experience: any): number {
    if (!experience.projects || experience.projects.length === 0) {
      return 2; // Default to mid-level
    }

    let totalLevel = 0;
    experience.projects.forEach((project: any) => {
      // Estimate based on project characteristics
      let level = 2; // Default mid

      if (project.business_impact && project.business_impact.toLowerCase().includes('lead')) {
        level = 3;
      }
      if (project.team_size && project.team_size > 5) {
        level = Math.max(level, 3);
      }
      if (project.technologies && project.technologies.length > 5) {
        level = Math.max(level, 3);
      }

      totalLevel += level;
    });

    return totalLevel / experience.projects.length;
  }

  /**
   * Helper: Build searchable text from experience
   */
  private static buildExperienceText(experience: any): string {
    let text = '';

    if (experience.projects && experience.projects.length > 0) {
      experience.projects.forEach((proj: any) => {
        text += (proj.name || '') + ' ' + (proj.business_impact || '') + ' ' + (proj.technical_impact || '') + ' ';
        if (proj.technologies) {
          text += proj.technologies.join(' ') + ' ';
        }
      });
    }

    return text.toLowerCase();
  }
}
