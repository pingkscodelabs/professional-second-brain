/**
 * Experience Ranker and CV Formatter
 * Ranks experience by relevance and generates CV bullets
 */

export interface RankedExperience {
  item: any;
  score: number;
  rank: number;
}

export interface CVBullet {
  text: string;
  metrics: string[];
  sourceFile: string;
  confidence: 'high' | 'medium' | 'low';
}

export class ExperienceRanker {
  /**
   * Rank projects/achievements by relevance to job requirements
   */
  static rankByRelevance(
    items: any[],
    requiredTechnologies: string[],
    requiredSkills: string[],
    focusAreas?: string[]
  ): RankedExperience[] {
    const ranked: RankedExperience[] = items.map((item, index) => {
      const score = this.calculateRelevanceScore(item, requiredTechnologies, requiredSkills, focusAreas);
      return {
        item,
        score,
        rank: index,
      };
    });

    // Sort by score descending, then by recency
    return ranked.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort by recency (if both have period field)
      const aPeriod = a.item.period || '';
      const bPeriod = b.item.period || '';
      return bPeriod.localeCompare(aPeriod);
    });
  }

  /**
   * Calculate relevance score for an item (0-100)
   */
  private static calculateRelevanceScore(
    item: any,
    requiredTechnologies: string[],
    requiredSkills: string[],
    focusAreas?: string[]
  ): number {
    let score = 0;

    // Technology match (40 points)
    const itemTechs = (item.technologies || []).map((t: string) => t.toLowerCase());
    const techMatches = requiredTechnologies.filter(req =>
      itemTechs.some(proj => proj.includes(req.toLowerCase()) || req.toLowerCase().includes(proj))
    ).length;
    score += (techMatches / Math.max(requiredTechnologies.length, 1)) * 40;

    // Skill/responsibility match (30 points)
    const itemResponsibilities = ((item.responsibilities || []) as string[]).join(' ').toLowerCase();
    const itemDescription = ((item.business_impact || '') + ' ' + (item.technical_impact || '')).toLowerCase();
    const itemText = (itemDescription + ' ' + itemResponsibilities).toLowerCase();

    const skillMatches = requiredSkills.filter(skill => itemText.includes(skill.toLowerCase())).length;
    score += (skillMatches / Math.max(requiredSkills.length, 1)) * 30;

    // Focus areas match (20 points)
    if (focusAreas && focusAreas.length > 0) {
      const focusMatches = focusAreas.filter(area => itemText.includes(area.toLowerCase())).length;
      score += (focusMatches / focusAreas.length) * 20;
    }

    // Recent projects get slight boost (max 10 points)
    if (item.period) {
      const year = this.extractYear(item.period);
      const currentYear = new Date().getFullYear();
      const yearsAgo = currentYear - year;
      if (yearsAgo <= 2) score += 10;
      else if (yearsAgo <= 4) score += 5;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Extract year from period string (e.g., "2023-01 to 2024-01" -> 2024)
   */
  private static extractYear(period: string): number {
    const yearMatch = period.match(/\d{4}/);
    if (yearMatch) {
      const matches = period.match(/\d{4}/g);
      return parseInt(matches?.[matches.length - 1] || new Date().getFullYear().toString(), 10);
    }
    return new Date().getFullYear();
  }

  /**
   * Generate CV bullets from project/achievement data
   */
  static generateBullets(item: any, maxBullets: number = 3): CVBullet[] {
    const bullets: CVBullet[] = [];

    // Primary bullet: high-level accomplishment
    if (item.business_impact) {
      const metrics = this.extractMetrics(item.business_impact);
      bullets.push({
        text: this.formatBullet(item.name, item.business_impact, item.client),
        metrics,
        sourceFile: item.documentation_link || '',
        confidence: 'high',
      });
    }

    // Secondary bullet: technical details
    if (item.technical_impact && bullets.length < maxBullets) {
      const metrics = this.extractMetrics(item.technical_impact);
      bullets.push({
        text: this.formatBullet(item.name, item.technical_impact, null),
        metrics,
        sourceFile: item.documentation_link || '',
        confidence: 'high',
      });
    }

    // Tertiary bullet: scale/team size
    if (item.team_size && bullets.length < maxBullets) {
      const teamText = `Managed team of ${item.team_size} engineers`;
      bullets.push({
        text: this.formatBullet(item.name, teamText, null),
        metrics: [item.team_size.toString()],
        sourceFile: item.documentation_link || '',
        confidence: 'medium',
      });
    }

    return bullets.slice(0, maxBullets);
  }

  /**
   * Format a bullet point in ATS-friendly format
   */
  private static formatBullet(title: string, description: string, company?: string): string {
    // Remove excessive punctuation and normalize
    let text = description.trim();
    if (!text.endsWith('.')) text += '.';

    // Add company context if provided and not already in description
    if (company && !text.toLowerCase().includes(company.toLowerCase())) {
      return `${text}`;
    }

    return text;
  }

  /**
   * Extract quantified metrics from text
   */
  private static extractMetrics(text: string): string[] {
    const metrics: string[] = [];

    // Find currency amounts
    const currencyMatches = text.match(/\$[\d.,]+[MKB]?|\£[\d.,]+[MKB]?|€[\d.,]+[MKB]?/g);
    if (currencyMatches) {
      metrics.push(...currencyMatches);
    }

    // Find percentages
    const percentMatches = text.match(/\d+(?:\.\d+)?%/g);
    if (percentMatches) {
      metrics.push(...percentMatches);
    }

    // Find counts (numbers followed by service/item descriptors)
    const countMatches = text.match(/\d+\+?\s*(?:microservices|services|servers|instances|nodes|clusters|users|requests|transactions)/gi);
    if (countMatches) {
      metrics.push(...countMatches);
    }

    // Find time measurements
    const timeMatches = text.match(/\d+(?:\.\d+)?x?\s*(?:hours?|minutes?|seconds?|days?|months?|years?)/gi);
    if (timeMatches) {
      metrics.push(...timeMatches);
    }

    return metrics.slice(0, 5); // Top 5 metrics
  }
}

export class CVFormatter {
  /**
   * Format CV output in human-readable format
   */
  static formatCV(cvData: any, format: 'resume' | 'cv' | 'linkedin' = 'resume'): string {
    switch (format) {
      case 'resume':
        return this.formatResume(cvData);
      case 'cv':
        return this.formatDetailedCV(cvData);
      case 'linkedin':
        return this.formatLinkedIn(cvData);
      default:
        return this.formatResume(cvData);
    }
  }

  private static formatResume(cvData: any): string {
    let output = '# RESUME\n\n';

    // Professional Summary
    output += '## PROFESSIONAL SUMMARY\n';
    output += cvData.cv.summary + '\n\n';

    // Technical Skills
    output += '## TECHNICAL SKILLS\n';
    if (cvData.cv.skills && cvData.cv.skills.length > 0) {
      const expertSkills = cvData.cv.skills.filter((s: any) => s.level === 'Expert');
      const advancedSkills = cvData.cv.skills.filter((s: any) => s.level === 'Advanced');

      if (expertSkills.length > 0) {
        output += '**Expert**: ' + expertSkills.map((s: any) => s.skill).join(', ') + '\n';
      }
      if (advancedSkills.length > 0) {
        output += '**Advanced**: ' + advancedSkills.map((s: any) => s.skill).join(', ') + '\n';
      }
    }
    output += '\n';

    // Experience
    output += '## PROFESSIONAL EXPERIENCE\n';
    if (cvData.cv.experience && cvData.cv.experience.length > 0) {
      cvData.cv.experience.forEach((exp: any) => {
        output += `### ${exp.title} – ${exp.company} (${exp.period})\n`;
        if (exp.bullets) {
          exp.bullets.forEach((bullet: any) => {
            output += `- ${bullet.text}\n`;
          });
        }
        output += '\n';
      });
    }

    return output;
  }

  private static formatDetailedCV(cvData: any): string {
    let output = '# CURRICULUM VITAE\n\n';

    output += `**Match Score**: ${cvData.analysis.matchScore}/100\n`;
    output += `**Generated**: ${new Date().toISOString().split('T')[0]}\n\n`;

    // Professional Summary
    output += '## PROFESSIONAL SUMMARY\n';
    output += cvData.cv.summary + '\n\n';

    // Technical Skills with Evidence
    output += '## TECHNICAL SKILLS\n';
    if (cvData.cv.skills && cvData.cv.skills.length > 0) {
      cvData.cv.skills.forEach((skill: any) => {
        output += `- **${skill.skill}** (${skill.level})\n`;
        if (skill.evidence) {
          output += `  Evidence: ${skill.evidence}\n`;
        }
      });
    }
    output += '\n';

    // Experience with full bullets
    output += '## PROFESSIONAL EXPERIENCE\n';
    if (cvData.cv.experience && cvData.cv.experience.length > 0) {
      cvData.cv.experience.forEach((exp: any) => {
        output += `### ${exp.title}\n`;
        output += `**${exp.company}** | ${exp.period}\n\n`;
        if (exp.bullets) {
          exp.bullets.forEach((bullet: any) => {
            output += `- ${bullet.text}\n`;
            if (bullet.sourceFile) {
              output += `  [Source: ${bullet.sourceFile}]\n`;
            }
          });
        }
        output += '\n';
      });
    }

    // Gap Analysis
    output += '## MATCH ANALYSIS\n\n';
    output += `**Match Score**: ${cvData.analysis.matchScore}/100\n\n`;

    if (cvData.analysis.strongAreas && cvData.analysis.strongAreas.length > 0) {
      output += '**Strong Areas**:\n';
      cvData.analysis.strongAreas.forEach((area: string) => {
        output += `- ✓ ${area}\n`;
      });
      output += '\n';
    }

    if (cvData.analysis.gapAreas && cvData.analysis.gapAreas.length > 0) {
      output += '**Gap Areas**:\n';
      cvData.analysis.gapAreas.forEach((area: string) => {
        output += `- ⚠ ${area}\n`;
      });
      output += '\n';
    }

    if (cvData.analysis.fabricationRisk && cvData.analysis.fabricationRisk.length > 0) {
      output += '**Verification Status**: ';
      if (cvData.analysis.fabricationRisk.length === 0) {
        output += '✓ All claims verified\n';
      } else {
        output += '⚠ Unverified:\n';
        cvData.analysis.fabricationRisk.forEach((risk: string) => {
          output += `- ${risk}\n`;
        });
      }
    }

    return output;
  }

  private static formatLinkedIn(cvData: any): string {
    let output = '';

    output += cvData.cv.summary + '\n\n';

    if (cvData.cv.skills && cvData.cv.skills.length > 0) {
      output += 'Skills: ' + cvData.cv.skills.map((s: any) => s.skill).join(', ') + '\n\n';
    }

    if (cvData.cv.experience && cvData.cv.experience.length > 0) {
      cvData.cv.experience.forEach((exp: any) => {
        output += `${exp.title} at ${exp.company} (${exp.period})\n`;
        if (exp.bullets && exp.bullets.length > 0) {
          output += exp.bullets[0].text + '\n';
        }
        output += '\n';
      });
    }

    return output;
  }
}
