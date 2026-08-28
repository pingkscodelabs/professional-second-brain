/**
 * Repository Searcher
 * Searches repository metadata files for matching technologies, skills, and achievements
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface ProjectMatch {
  name: string;
  client: string;
  period: string;
  technologies: string[];
  businessImpact: string;
  technicalImpact: string;
  relevanceScore: number;
  evidence: string; // Documentation link
}

export interface SkillMatch {
  name: string;
  level: string;
  years: number;
  projects: string[];
  relevanceScore: number;
}

export interface SearchResults {
  projects: ProjectMatch[];
  skills: SkillMatch[];
  achievements: Achievement[];
}

export interface Achievement {
  title: string;
  description: string;
  metrics: string;
  relevanceScore: number;
}

export class RepositorySearcher {
  private metadataPath: string;
  private projectsData: any;
  private skillsData: any;
  private experienceData: any;
  private technologiesData: any;

  constructor(repositoryRoot: string = '.') {
    this.metadataPath = path.join(repositoryRoot, 'metadata');
    this.loadMetadataFiles();
  }

  private loadMetadataFiles(): void {
    try {
      const projectsFile = path.join(this.metadataPath, 'projects.yml');
      const skillsFile = path.join(this.metadataPath, 'skills.yml');
      const experienceFile = path.join(this.metadataPath, 'experience.yml');
      const technologiesFile = path.join(this.metadataPath, 'technologies.yml');

      if (fs.existsSync(projectsFile)) {
        this.projectsData = yaml.load(fs.readFileSync(projectsFile, 'utf8'));
      }
      if (fs.existsSync(skillsFile)) {
        this.skillsData = yaml.load(fs.readFileSync(skillsFile, 'utf8'));
      }
      if (fs.existsSync(experienceFile)) {
        this.experienceData = yaml.load(fs.readFileSync(experienceFile, 'utf8'));
      }
      if (fs.existsSync(technologiesFile)) {
        this.technologiesData = yaml.load(fs.readFileSync(technologiesFile, 'utf8'));
      }
    } catch (error) {
      console.error('Error loading metadata files:', error);
    }
  }

  /**
   * Search for projects matching required technologies and skills
   */
  search(requiredTechnologies: string[], requiredSkills: string[]): SearchResults {
    const projectMatches = this.searchProjects(requiredTechnologies);
    const skillMatches = this.searchSkills(requiredSkills);
    const achievements = this.extractAchievements(projectMatches);

    return {
      projects: projectMatches,
      skills: skillMatches,
      achievements,
    };
  }

  private searchProjects(requiredTechnologies: string[]): ProjectMatch[] {
    const matches: ProjectMatch[] = [];

    if (!this.projectsData || !this.projectsData.projects) {
      return matches;
    }

    const projects = this.projectsData.projects;
    projects.forEach((project: any) => {
      if (!project.name) return;

      const projectTechs = (project.technologies || []).map((t: string) => t.toLowerCase());
      const matchCount = requiredTechnologies.filter(req =>
        projectTechs.some(proj => proj.includes(req.toLowerCase()) || req.toLowerCase().includes(proj))
      ).length;

      if (matchCount > 0) {
        const relevanceScore = (matchCount / requiredTechnologies.length) * 100;
        matches.push({
          name: project.name,
          client: project.client || 'Unknown',
          period: project.period || 'Unknown',
          technologies: project.technologies || [],
          businessImpact: project.business_impact || '',
          technicalImpact: project.technical_impact || '',
          relevanceScore,
          evidence: project.documentation_link || '',
        });
      }
    });

    // Sort by relevance score descending
    return matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private searchSkills(requiredSkills: string[]): SkillMatch[] {
    const matches: SkillMatch[] = [];

    if (!this.skillsData || !this.skillsData.skills) {
      return matches;
    }

    const skills = this.skillsData.skills;
    skills.forEach((skill: any) => {
      if (!skill.name) return;

      const skillNameLower = skill.name.toLowerCase();
      if (requiredSkills.some(req => req.toLowerCase() === skillNameLower || skillNameLower.includes(req.toLowerCase()))) {
        matches.push({
          name: skill.name,
          level: skill.level || 'Unknown',
          years: skill.years || 0,
          projects: skill.projects || [],
          relevanceScore: 100,
        });
      }
    });

    return matches;
  }

  private extractAchievements(projectMatches: ProjectMatch[]): Achievement[] {
    const achievements: Achievement[] = [];

    projectMatches.forEach(project => {
      if (project.businessImpact) {
        achievements.push({
          title: project.name,
          description: project.businessImpact,
          metrics: this.extractMetrics(project.businessImpact),
          relevanceScore: project.relevanceScore,
        });
      }
    });

    return achievements.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  private extractMetrics(text: string): string {
    // Extract numbers and percentages from text
    const metrics: string[] = [];
    const numberMatches = text.match(/\d+(?:\.\d+)?(?:%|x)?/g) || [];
    numberMatches.forEach(match => {
      if (match && match.length < 20) {
        metrics.push(match);
      }
    });
    return metrics.join(', ');
  }
}
