/**
 * PSB CV Builder - Main Integration Module
 * Orchestrates job parsing, repository searching, experience ranking, and CV generation
 */

import { JobDescriptionParser, ParsedJobRequirements } from './psb-job-parser';
import { RepositorySearcher, SearchResults } from './psb-repo-searcher';
import { ExperienceRanker, CVFormatter, CVBullet } from './psb-ranker-formatter';
import { CVMatchAnalyzer, MatchAnalysis } from './psb-match-analyzer';

export interface CVBuilderInput {
  jobDescription: string;
  format?: 'resume' | 'cv' | 'linkedin';
  maxLength?: number;
  targetLevel?: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
  focusAreas?: string[];
}

export interface Skill {
  skill: string;
  level: string;
  evidence: string;
}

export interface ExperienceBullet {
  text: string;
  sourceFile: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  bullets: ExperienceBullet[];
}

export interface CV {
  summary: string;
  skills: Skill[];
  experience: Experience[];
}

export interface CVAnalysis {
  matchScore: number;
  strongAreas: string[];
  gapAreas: string[];
  fabricationRisk: string[];
}

export interface CVBuilderOutput {
  cv: CV;
  analysis: CVAnalysis;
  sources: { [bulletId: string]: string };
  formattedCV: string;
}

export class PSBCVBuilder {
  private repositoryRoot: string;
  private jobParser: typeof JobDescriptionParser;
  private repositorySearcher: RepositorySearcher;
  private experienceRanker: typeof ExperienceRanker;
  private cvFormatter: typeof CVFormatter;
  private matchAnalyzer: typeof CVMatchAnalyzer;

  constructor(repositoryRoot: string = '.') {
    this.repositoryRoot = repositoryRoot;
    this.jobParser = JobDescriptionParser;
    this.repositorySearcher = new RepositorySearcher(repositoryRoot);
    this.experienceRanker = ExperienceRanker;
    this.cvFormatter = CVFormatter;
    this.matchAnalyzer = CVMatchAnalyzer;
  }

  /**
   * Generate a tailored CV based on job description
   */
  async generate(input: CVBuilderInput): Promise<CVBuilderOutput> {
    // Step 1: Parse job description
    const jobRequirements = this.jobParser.parse(input.jobDescription);

    // Step 2: Search repository for matching experience
    const searchResults = this.repositorySearcher.search(
      jobRequirements.technologies,
      jobRequirements.requiredSkills
    );

    // Step 3: Rank experience by relevance
    const rankedProjects = this.experienceRanker.rankByRelevance(
      searchResults.projects,
      jobRequirements.technologies,
      jobRequirements.requiredSkills,
      input.focusAreas || jobRequirements.focusAreas
    );

    // Step 4: Generate CV content
    const cvContent = this.generateCVContent(jobRequirements, rankedProjects, searchResults, input);

    // Step 5: Analyze match
    const analysis = this.matchAnalyzer.analyze(jobRequirements, searchResults, cvContent);

    // Step 6: Generate professional summary
    const summary = this.generateProfessionalSummary(jobRequirements, rankedProjects, analysis);

    // Step 7: Format CV
    const formattedCV = this.cvFormatter.formatCV(
      {
        cv: {
          summary,
          ...cvContent.cv,
        },
        analysis,
      },
      input.format || 'resume'
    );

    return {
      cv: {
        summary,
        ...cvContent.cv,
      },
      analysis,
      sources: cvContent.sources,
      formattedCV,
    };
  }

  /**
   * Generate CV content (skills, experience sections)
   */
  private generateCVContent(
    jobRequirements: ParsedJobRequirements,
    rankedProjects: any[],
    searchResults: SearchResults,
    input: CVBuilderInput
  ): { cv: CV; sources: { [bulletId: string]: string } } {
    const sources: { [bulletId: string]: string } = {};
    const skills: Skill[] = [];
    const experience: Experience[] = [];

    // Generate skills section
    const skillsForCV = this.generateSkillsSection(
      jobRequirements,
      searchResults.skills,
      sources
    );
    skills.push(...skillsForCV);

    // Generate experience section
    const experienceForCV = this.generateExperienceSection(
      jobRequirements,
      rankedProjects,
      input.maxLength,
      sources
    );
    experience.push(...experienceForCV);

    return {
      cv: {
        summary: '', // Will be set separately
        skills,
        experience,
      },
      sources,
    };
  }

  /**
   * Generate skills section for CV
   */
  private generateSkillsSection(
    jobRequirements: ParsedJobRequirements,
    matchedSkills: any[],
    sources: { [bulletId: string]: string }
  ): Skill[] {
    const skills: Skill[] = [];
    const skillLevels: { [key: string]: string } = {};

    // Map required skills to available experience
    jobRequirements.requiredSkills.forEach(skill => {
      const matched = matchedSkills.find(s => s.name.toLowerCase() === skill.toLowerCase());
      if (matched) {
        skillLevels[skill] = matched.level || 'Advanced';
        sources[skill] = matched.projects?.[0] || 'Repository documentation';
      } else {
        skillLevels[skill] = 'Intermediate';
        sources[skill] = 'Experience in related areas';
      }

      skills.push({
        skill,
        level: skillLevels[skill],
        evidence: sources[skill],
      });
    });

    // Add additional nice-to-have skills if space permits
    jobRequirements.niceToHaveSkills.forEach(skill => {
      if (!skillLevels[skill]) {
        const matched = matchedSkills.find(s => s.name.toLowerCase() === skill.toLowerCase());
        if (matched) {
          skills.push({
            skill,
            level: matched.level || 'Intermediate',
            evidence: matched.projects?.[0] || 'Repository documentation',
          });
        }
      }
    });

    return skills.slice(0, 15); // Limit to 15 skills
  }

  /**
   * Generate experience section for CV
   */
  private generateExperienceSection(
    jobRequirements: ParsedJobRequirements,
    rankedProjects: any[],
    maxLength?: number,
    sources: { [bulletId: string]: string } = {}
  ): Experience[] {
    const experience: Experience[] = [];
    const maxProjects = maxLength ? Math.floor(maxLength / 0.5) : 5; // Roughly 0.5 page per project

    // Group projects by company/period
    const projectsByCompany = this.groupProjectsByCompany(rankedProjects.slice(0, maxProjects));

    projectsByCompany.forEach((companyProjects, companyName) => {
      // Get the most recent project details for company header
      const latestProject = companyProjects[0];

      const bullets: ExperienceBullet[] = [];
      companyProjects.forEach((project: any) => {
        const projectBullets = this.experienceRanker.generateBullets(project, 2);
        projectBullets.forEach((bullet: CVBullet, index: number) => {
          const bulletId = `${companyName}-bullet-${index}`;
          sources[bulletId] = bullet.sourceFile;
          bullets.push({
            text: bullet.text,
            sourceFile: bullet.sourceFile,
          });
        });
      });

      experience.push({
        title: this.extractJobTitle(latestProject.name),
        company: latestProject.client || companyName,
        period: latestProject.period || 'Present',
        bullets: bullets.slice(0, 3), // Max 3 bullets per role
      });
    });

    return experience;
  }

  /**
   * Group projects by company for cleaner experience section
   */
  private groupProjectsByCompany(projects: any[]): Map<string, any[]> {
    const grouped = new Map<string, any[]>();

    projects.forEach(project => {
      const company = project.client || project.organisation || 'Project';
      if (!grouped.has(company)) {
        grouped.set(company, []);
      }
      grouped.get(company)!.push(project);
    });

    return grouped;
  }

  /**
   * Extract job title from project name
   */
  private extractJobTitle(projectName: string): string {
    // Try to extract role from project name
    const titleMatch = projectName.match(/(?:lead|architect|engineer|manager|director|senior|principal)/i);
    if (titleMatch) {
      return titleMatch[0];
    }
    return 'Technical Professional';
  }

  /**
   * Generate tailored professional summary
   */
  private generateProfessionalSummary(
    jobRequirements: ParsedJobRequirements,
    rankedProjects: any[],
    analysis: MatchAnalysis
  ): string {
    const keyStrengths: string[] = [];
    const topTech: string[] = [];

    // Extract key strengths from top projects
    if (rankedProjects.length > 0) {
      const topProject = rankedProjects[0];
      if (topProject.item.business_impact) {
        keyStrengths.push(topProject.item.business_impact.split('.')[0]);
      }
      if (topProject.item.technologies && topProject.item.technologies.length > 0) {
        topTech.push(...topProject.item.technologies.slice(0, 3));
      }
    }

    // Build summary
    let summary = `Experienced professional specializing in ${topTech.slice(0, 2).join(', ')}. `;

    if (keyStrengths.length > 0) {
      summary += `${keyStrengths[0]}. `;
    }

    summary += `Seeking ${jobRequirements.title} role to leverage proven expertise in `;
    summary += `${jobRequirements.technologies.slice(0, 2).join(', ')}. `;

    if (rankedProjects.length > 0 && rankedProjects[0].item.team_size) {
      summary += `Experienced managing teams and driving large-scale initiatives.`;
    }

    return summary.trim();
  }
}

/**
 * Main export for Copilot tool usage
 */
export async function generateCV(input: CVBuilderInput): Promise<CVBuilderOutput> {
  const builder = new PSBCVBuilder();
  return builder.generate(input);
}
