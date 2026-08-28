#!/bin/bash

# Setup script for PSB CV Builder extension

set -e

BASE_DIR="$(pwd)"
EXT_DIR="$BASE_DIR/.github/extensions/psb-cv-builder"

echo "Setting up PSB CV Builder extension..."

# Create directory structure
mkdir -p "$EXT_DIR/src"
mkdir -p "$EXT_DIR/dist"
mkdir -p "$EXT_DIR/docs"

echo "Created directory structure at $EXT_DIR"

# Create extension.json
cat > "$EXT_DIR/extension.json" << 'EOFEXT'
{
  "name": "psb-cv-builder",
  "displayName": "PSB CV Builder",
  "description": "Generate tailored CVs/resumes by matching job requirements against documented professional experience",
  "version": "1.0.0",
  "publisher": "professional-second-brain",
  "repository": "https://github.com/pingabdulrehman01/professional-second-brain",
  "keywords": [
    "cv",
    "resume",
    "job-matching",
    "career",
    "professional-development"
  ],
  "engines": {
    "copilot": ">=1.0.0"
  },
  "activationEvents": ["onCommand:psb-cv-builder.generateCV"],
  "main": "./dist/extension.js",
  "contributes": {
    "commands": [
      {
        "command": "psb-cv-builder.generateCV",
        "title": "PSB: Generate Tailored CV",
        "description": "Generate a tailored CV based on a job description by matching against your documented experience"
      }
    ],
    "tools": [
      {
        "name": "generate-cv",
        "displayName": "Generate Tailored CV",
        "description": "Generate a tailored CV/resume by matching job requirements against documented professional experience",
        "inputSchema": {
          "type": "object",
          "properties": {
            "jobDescription": {
              "type": "string",
              "description": "The job description, role title, or requirements to match against. Can be full JD or brief title."
            },
            "format": {
              "type": "string",
              "enum": ["resume", "cv", "linkedin"],
              "default": "resume",
              "description": "Output format: resume (1-page), cv (detailed), or linkedin (profile)"
            },
            "maxLength": {
              "type": "number",
              "description": "Maximum length in pages (for resume/cv) or characters (for linkedin). Default: 1 page for resume, 2 pages for cv"
            },
            "targetLevel": {
              "type": "string",
              "enum": ["junior", "mid", "senior", "staff", "principal"],
              "default": "senior",
              "description": "Target career level for the CV"
            },
            "focusAreas": {
              "type": "array",
              "items": {"type": "string"},
              "description": "Optional areas to emphasize (e.g., ['Cloud Architecture', 'Cost Optimization'])"
            }
          },
          "required": ["jobDescription"]
        }
      }
    ]
  }
}
EOFEXT

echo "Created extension.json"

# Create TypeScript implementation files
cat > "$EXT_DIR/src/extension.ts" << 'EOFTS'
import { ExtensionContext, Tool } from 'vscode';

export async function activate(context: ExtensionContext) {
  console.log('PSB CV Builder extension activated');
}

export function deactivate() {
  console.log('PSB CV Builder extension deactivated');
}
EOFTS

echo "Created src/extension.ts"

# Create job description parser
cat > "$EXT_DIR/src/jobDescriptionParser.ts" << 'EOFPARSER'
/**
 * Job Description Parser
 * Extracts required skills, technologies, and experience level from job descriptions
 */

export interface ParsedJobRequirements {
  title: string;
  company?: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  technologies: string[];
  experienceLevel: 'junior' | 'mid' | 'senior' | 'staff' | 'principal';
  yearsRequired: number;
  industries: string[];
  teamSize?: number;
  focusAreas: string[];
  responsibilities: string[];
  mustHaves: string[];
}

export class JobDescriptionParser {
  /**
   * Parse a job description and extract requirements
   */
  static parse(jobDescription: string): ParsedJobRequirements {
    const requirements: ParsedJobRequirements = {
      title: this.extractTitle(jobDescription),
      requiredSkills: this.extractSkills(jobDescription, true),
      niceToHaveSkills: this.extractSkills(jobDescription, false),
      technologies: this.extractTechnologies(jobDescription),
      experienceLevel: this.extractExperienceLevel(jobDescription),
      yearsRequired: this.extractYearsRequired(jobDescription),
      industries: this.extractIndustries(jobDescription),
      teamSize: this.extractTeamSize(jobDescription),
      focusAreas: this.extractFocusAreas(jobDescription),
      responsibilities: this.extractResponsibilities(jobDescription),
      mustHaves: this.extractMustHaves(jobDescription),
    };

    return requirements;
  }

  private static extractTitle(jd: string): string {
    const titleMatch = jd.match(/(?:Position|Role|Title)\s*:?\s*(.+?)(?:\n|$)/i);
    if (titleMatch) return titleMatch[1].trim();

    // Try to extract from first line if it looks like a title
    const firstLine = jd.split('\n')[0];
    if (firstLine.length < 150 && !firstLine.includes('.')) {
      return firstLine.trim();
    }

    return 'Software Engineer';
  }

  private static extractSkills(jd: string, required: boolean): string[] {
    const skills: Set<string> = new Set();

    const requiredSection = required
      ? jd.match(/(?:required|must have|essential)[:\s]*([\s\S]*?)(?=(?:nice to have|preferred|optional|$))/i)?.[1]
      : jd.match(/(?:nice to have|preferred|optional|beneficial)[:\s]*([\s\S]*?)(?=$)/i)?.[1];

    if (requiredSection) {
      const skillMatches = requiredSection.match(/[-•*]\s*(.+?)(?=\n|$)/g) || [];
      skillMatches.forEach(match => {
        const skill = match.replace(/^[-•*]\s*/, '').trim();
        if (skill && skill.length < 100) {
          skills.add(skill);
        }
      });
    }

    // Common skill keywords to look for
    const commonSkills = [
      'kubernetes', 'terraform', 'aws', 'docker', 'ci/cd', 'python', 'java', 'go', 'rust',
      'javascript', 'typescript', 'react', 'nodejs', 'sql', 'nosql', 'postgresql', 'mongodb',
      'leadership', 'communication', 'problem-solving', 'architecture', 'design patterns',
      'agile', 'scrum', 'git', 'linux', 'networking', 'security', 'devops',
    ];

    const jdLower = jd.toLowerCase();
    commonSkills.forEach(skill => {
      if (jdLower.includes(skill)) {
        skills.add(this.capitalizeSkill(skill));
      }
    });

    return Array.from(skills);
  }

  private static capitalizeSkill(skill: string): string {
    return skill
      .split(/[\s-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private static extractTechnologies(jd: string): string[] {
    const techs: Set<string> = new Set();

    const techKeywords = [
      'AWS', 'GCP', 'Azure', 'Kubernetes', 'Docker', 'Terraform', 'Ansible',
      'ArgoCD', 'Helm', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI',
      'Python', 'Java', 'Go', 'Rust', 'JavaScript', 'TypeScript', 'C++', 'C#',
      'React', 'Vue', 'Angular', 'Node.js', 'Django', 'Flask', 'Spring Boot',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
      'Kafka', 'RabbitMQ', 'gRPC', 'REST', 'GraphQL',
      'Linux', 'Windows Server', 'macOS',
      'Prometheus', 'Grafana', 'Datadog', 'New Relic',
    ];

    techKeywords.forEach(tech => {
      if (jd.includes(tech)) {
        techs.add(tech);
      }
    });

    return Array.from(techs).sort();
  }

  private static extractExperienceLevel(jd: string): 'junior' | 'mid' | 'senior' | 'staff' | 'principal' {
    const jdLower = jd.toLowerCase();

    if (jdLower.includes('principal') || jdLower.includes('executive')) return 'principal';
    if (jdLower.includes('staff')) return 'staff';
    if (jdLower.includes('senior') || jdLower.includes('lead')) return 'senior';
    if (jdLower.includes('mid') || jdLower.includes('intermediate')) return 'mid';
    if (jdLower.includes('junior') || jdLower.includes('entry')) return 'junior';

    // Default based on years
    const years = this.extractYearsRequired(jd);
    if (years >= 8) return 'staff';
    if (years >= 5) return 'senior';
    if (years >= 2) return 'mid';
    return 'junior';
  }

  private static extractYearsRequired(jd: string): number {
    const yearMatches = jd.match(/(\d+)\+?\s*(?:years?|yrs)/i);
    if (yearMatches) {
      return parseInt(yearMatches[1], 10);
    }
    return 2; // Default
  }

  private static extractIndustries(jd: string): string[] {
    const industries: Set<string> = new Set();

    const industryKeywords = [
      'fintech', 'finance', 'banking', 'healthcare', 'e-commerce', 'retail',
      'travel', 'hospitality', 'manufacturing', 'automotive', 'energy', 'telecom',
      'media', 'entertainment', 'government', 'education', 'saas', 'paas', 'iaas',
    ];

    industryKeywords.forEach(industry => {
      if (jd.toLowerCase().includes(industry)) {
        industries.add(this.capitalizeSkill(industry));
      }
    });

    return Array.from(industries);
  }

  private static extractTeamSize(jd: string): number | undefined {
    const matches = jd.match(/(?:team|group) (?:of|size)?\s*(\d+)/i);
    if (matches) {
      return parseInt(matches[1], 10);
    }
    return undefined;
  }

  private static extractFocusAreas(jd: string): string[] {
    const areas: Set<string> = new Set();

    const focusKeywords = [
      'architecture', 'scalability', 'performance', 'security', 'reliability',
      'cost optimization', 'automation', 'documentation', 'mentoring', 'leadership',
      'innovation', 'quality', 'compliance', 'migration', 'modernization',
    ];

    focusKeywords.forEach(area => {
      if (jd.toLowerCase().includes(area)) {
        areas.add(this.capitalizeSkill(area));
      }
    });

    return Array.from(areas);
  }

  private static extractResponsibilities(jd: string): string[] {
    const responsibilities: string[] = [];

    const respSection = jd.match(/(?:responsibilities?|you will)[:\s]*([\s\S]*?)(?=\n\n|\n(?=\w)|$)/i)?.[1];

    if (respSection) {
      const lines = respSection.match(/[-•*]\s*(.+?)(?=\n|$)/g) || [];
      lines.forEach(line => {
        const resp = line.replace(/^[-•*]\s*/, '').trim();
        if (resp && resp.length < 200) {
          responsibilities.push(resp);
        }
      });
    }

    return responsibilities.slice(0, 10); // Top 10
  }

  private static extractMustHaves(jd: string): string[] {
    const mustHaves: string[] = [];

    const mustSection = jd.match(/(?:must have|required|essential)[:\s]*([\s\S]*?)(?=(?:nice to have|preferred|optional|$))/i)?.[1];

    if (mustSection) {
      const lines = mustSection.match(/[-•*]\s*(.+?)(?=\n|$)/g) || [];
      lines.forEach(line => {
        const must = line.replace(/^[-•*]\s*/, '').trim();
        if (must && must.length < 200) {
          mustHaves.push(must);
        }
      });
    }

    return mustHaves.slice(0, 10);
  }
}
EOFPARSER

echo "Created src/jobDescriptionParser.ts"

echo "PSB CV Builder extension setup complete!"
echo "Files created at: $EXT_DIR"
