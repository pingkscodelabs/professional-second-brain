/**
 * PSB Quality Checker - Main Extension
 * Comprehensive quality assurance system for the Professional Second Brain repository
 * Validates fabrication, evidence, confidentiality, completeness, consistency, and structure
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface QualityIssue {
  type: 'fabrication' | 'missing_evidence' | 'confidentiality' | 'consistency' | 'structure' | 'links' | 'completeness' | 'technology_mismatch';
  severity: 'critical' | 'warning' | 'info';
  location: string; // line number or section
  message: string;
  suggestion: string;
}

export interface QualityAuditReport {
  overall_quality_score: number; // 0-100
  issues: QualityIssue[];
  confidence: 'high' | 'medium' | 'low';
  audit_report: {
    fabrication_risk: number; // 0-100
    confidentiality_risk: number; // 0-100
    completeness_score: number; // 0-100
    evidence_coverage: number; // 0-100
  };
  timestamp: string;
  filePath: string;
}

export interface MetadataIndex {
  projects: Map<string, any>;
  skills: Map<string, any>;
  technologies: Set<string>;
  clients: Map<string, any>;
  experience: Map<string, any>;
}

export interface ConfidentialityViolation {
  pattern: string;
  severity: 'critical' | 'warning';
  examples: string[];
}

// ============================================================================
// FABRICATION DETECTOR
// ============================================================================

export class FabricationDetector {
  private static readonly VAGUE_METRICS = [
    'helped|assisted|involved|contributed|worked',
    'some|multiple|various|several',
    'improved|enhanced|optimized',
    'briefly|temporarily',
  ];

  private static readonly FABRICATION_RED_FLAGS = [
    { pattern: /\b(\d+)%?\s*(improvement|reduction|increase|optimization)\b/i, risk: 'high' },
    { pattern: /\b(led|owned|built|architected|designed)\s+\w+\s+from\s+scratch\b/i, risk: 'high' },
    { pattern: /\b(saved|generated|earned)\s+\$[\d,]+/i, risk: 'high' },
    { pattern: /\b(managed|led)\s+team\s+of\s+\d+\b/i, risk: 'medium' },
    { pattern: /\b(decreased|increased|improved)\s+by\s+\d+%\b/i, risk: 'high' },
  ];

  static detectFabrication(content: string, evidenceLinks: string[]): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // Check for quantified claims without evidence
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      this.FABRICATION_RED_FLAGS.forEach(({ pattern, risk }) => {
        if (pattern.test(line)) {
          const hasEvidence = evidenceLinks.some(link =>
            link.toLowerCase().includes('evidence') || link.toLowerCase().includes('metric')
          );

          if (!hasEvidence) {
            issues.push({
              type: 'fabrication',
              severity: risk === 'high' ? 'critical' : 'warning',
              location: `line ${index + 1}`,
              message: `Quantified claim without evidence: "${line.trim()}"`,
              suggestion: 'Provide evidence file links (e.g., metrics, documentation, or project records) to support quantified claims',
            });
          }
        }
      });

      // Check for vague language patterns
      this.VAGUE_METRICS.forEach(pattern => {
        if (new RegExp(`\\b(${pattern})\\b`, 'i').test(line)) {
          issues.push({
            type: 'fabrication',
            severity: 'warning',
            location: `line ${index + 1}`,
            message: `Vague language detected: "${line.trim()}"`,
            suggestion: 'Replace vague terms with specific, measurable claims backed by evidence',
          });
        }
      });
    });

    return issues;
  }

  static validateMetrics(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const metrics = content.match(/\b\d+%\b|\$[\d,]+|\b\d+\s+(hours|days|weeks|months|years)\b/gi) || [];

    if (metrics.length > 0) {
      metrics.forEach((metric, index) => {
        issues.push({
          type: 'missing_evidence',
          severity: 'warning',
          location: `metric ${index + 1}`,
          message: `Metric found without citation: "${metric}"`,
          suggestion: 'Add reference to supporting documentation or evidence file',
        });
      });
    }

    return issues;
  }
}

// ============================================================================
// EVIDENCE VERIFIER
// ============================================================================

export class EvidenceVerifier {
  static verifyEvidence(content: string, filePath: string, metadataIndex: MetadataIndex): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const lines = content.split('\n');

    // Check for evidence links
    const evidencePattern = /\[Evidence\]|\[Documentation\]|\[Link\]|evidence::/gi;
    let evidenceCount = 0;

    lines.forEach((line, index) => {
      if (evidencePattern.test(line)) {
        evidenceCount++;
      }

      // Check for claims without citations
      if (/\b(achieved|delivered|implemented|resolved|resolved|optimized)\b/i.test(line)) {
        if (!evidencePattern.test(line)) {
          issues.push({
            type: 'missing_evidence',
            severity: 'warning',
            location: `line ${index + 1}`,
            message: `Achievement claim without evidence link: "${line.trim()}"`,
            suggestion: 'Add evidence link reference (e.g., [Evidence: file.md]) to support this achievement claim',
          });
        }
      }
    });

    // Calculate evidence coverage
    const claimCount = lines.filter(l =>
      /\b(achieved|delivered|implemented|resolved|optimized|improved|reduced)\b/i.test(l)
    ).length;

    if (claimCount > 0) {
      const coverage = (evidenceCount / claimCount) * 100;
      if (coverage < 50) {
        issues.push({
          type: 'missing_evidence',
          severity: 'warning',
          location: 'overall',
          message: `Low evidence coverage: Only ${Math.round(coverage)}% of claims have evidence links`,
          suggestion: 'Add evidence links to all major achievement claims for better credibility',
        });
      }
    }

    return issues;
  }

  static validateLinkResolution(content: string, baseDir: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const linkPattern = /\[([^\]]+)\]:\s*([^\s\n]+)/g;
    let match;

    while ((match = linkPattern.exec(content)) !== null) {
      const [_, linkText, linkPath] = match;

      if (linkPath.startsWith('/') || linkPath.startsWith('http')) {
        // Skip absolute URLs and web links
        continue;
      }

      const resolvedPath = path.resolve(baseDir, linkPath);
      if (!fs.existsSync(resolvedPath)) {
        issues.push({
          type: 'links',
          severity: 'critical',
          location: `reference "${linkText}"`,
          message: `Broken link: "${linkPath}" does not exist`,
          suggestion: `Update the link to point to a valid file path or remove the broken reference`,
        });
      }
    }

    return issues;
  }
}

// ============================================================================
// CONFIDENTIALITY AUDITOR
// ============================================================================

export class ConfidentialityAuditor {
  private static readonly CONFIDENTIAL_PATTERNS: ConfidentialityViolation[] = [
    {
      pattern: 'email_addresses',
      severity: 'critical',
      examples: ['Email: \\S+@\\S+\\.\\S+'],
    },
    {
      pattern: 'api_keys',
      severity: 'critical',
      examples: ['api[_-]?key|token|secret', 'AKIA[0-9A-Z]{16}'],
    },
    {
      pattern: 'phone_numbers',
      severity: 'warning',
      examples: ['\\d{3}[-.]?\\d{3}[-.]?\\d{4}'],
    },
    {
      pattern: 'ip_addresses',
      severity: 'warning',
      examples: ['\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}'],
    },
    {
      pattern: 'client_names_unredacted',
      severity: 'critical',
      examples: ['Client[:=]\\s+[A-Z][a-zA-Z\\s]+Inc', 'Company[:=]\\s+[A-Z]'],
    },
    {
      pattern: 'salary_information',
      severity: 'warning',
      examples: ['salary[:=]|rate[:=]|\\$\\d{6,}'],
    },
    {
      pattern: 'internal_metrics',
      severity: 'warning',
      examples: ['revenue|profit margin|user count'],
    },
  ];

  static auditConfidentiality(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for email addresses
      const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
      const emails = line.match(emailPattern) || [];
      emails.forEach(email => {
        issues.push({
          type: 'confidentiality',
          severity: 'critical',
          location: `line ${index + 1}`,
          message: `Email address exposed: ${email}`,
          suggestion: 'Remove or redact email addresses. Use CLIENT_NAME or anonymised identifiers instead',
        });
      });

      // Check for API keys/tokens
      const secretPattern = /(api[_-]?key|token|secret)[:=]?\s*([A-Za-z0-9_\-]{32,})/gi;
      if (secretPattern.test(line)) {
        issues.push({
          type: 'confidentiality',
          severity: 'critical',
          location: `line ${index + 1}`,
          message: `Potential API key or token found`,
          suggestion: 'Remove all credentials. Use environment variables or redact sensitive tokens',
        });
      }

      // Check for unredacted client names (heuristic)
      const clientPattern = /(?:Client|Company)[:=]?\s+([A-Z][a-zA-Z\s]{3,}(?:Inc|Ltd|LLC|Corp))/gi;
      const clients = line.match(clientPattern) || [];
      clients.forEach(client => {
        issues.push({
          type: 'confidentiality',
          severity: 'warning',
          location: `line ${index + 1}`,
          message: `Potentially unredacted client name: ${client}`,
          suggestion: 'Use anonymised names (CLIENT_A, CLIENT_B) or generic descriptors (e.g., "fintech startup")',
        });
      });
    });

    return issues;
  }

  static getConfidentialityScore(issues: QualityIssue[]): number {
    let risk = 0;
    issues.forEach(issue => {
      if (issue.type === 'confidentiality') {
        risk += issue.severity === 'critical' ? 20 : 10;
      }
    });
    return Math.min(100, risk);
  }
}

// ============================================================================
// COMPLETENESS SCORER
// ============================================================================

export class CompletenessScorer {
  private static readonly REQUIRED_SECTIONS = {
    project: [
      'title',
      'period',
      'client',
      'role',
      'technologies',
      'business_impact',
      'technical_impact',
      'lessons_learned',
    ],
    skill: [
      'name',
      'category',
      'level',
      'years',
      'production_experience',
      'evidence',
      'last_used',
    ],
    achievement: [
      'title',
      'date',
      'impact',
      'measurable_outcome',
      'supporting_evidence',
    ],
    client: [
      'name',
      'anonymised_name',
      'industry',
      'engagement_period',
      'confidentiality_level',
    ],
  };

  static scoreCompleteness(
    content: string,
    documentType: 'project' | 'skill' | 'achievement' | 'client'
  ): number {
    const requiredSections = this.REQUIRED_SECTIONS[documentType] || [];
    let foundCount = 0;

    requiredSections.forEach(section => {
      if (this.sectionExists(content, section)) {
        foundCount++;
      }
    });

    return requiredSections.length > 0
      ? Math.round((foundCount / requiredSections.length) * 100)
      : 100;
  }

  private static sectionExists(content: string, sectionName: string): boolean {
    const patterns = [
      new RegExp(`^#{1,6}\\s+${sectionName}`, 'mi'),
      new RegExp(`^${sectionName}:`, 'mi'),
      new RegExp(`\\b${sectionName}\\b`, 'i'),
    ];

    return patterns.some(pattern => pattern.test(content));
  }

  static getMissingFields(
    content: string,
    documentType: 'project' | 'skill' | 'achievement' | 'client'
  ): string[] {
    const requiredSections = this.REQUIRED_SECTIONS[documentType] || [];
    return requiredSections.filter(section => !this.sectionExists(content, section));
  }

  static generateCompletenessIssues(
    content: string,
    documentType: string
  ): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const missing = this.getMissingFields(
      content,
      documentType as 'project' | 'skill' | 'achievement' | 'client'
    );

    missing.forEach(field => {
      issues.push({
        type: 'completeness',
        severity: 'warning',
        location: 'document',
        message: `Missing required section: "${field}"`,
        suggestion: `Add the "${field}" section to improve document completeness and structure`,
      });
    });

    return issues;
  }
}

// ============================================================================
// CONSISTENCY CHECKER
// ============================================================================

export class ConsistencyChecker {
  static checkYamlMarkdownConsistency(
    filePath: string,
    metadataIndex: MetadataIndex
  ): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const fileName = path.basename(filePath, '.md');

    // Check if referenced in metadata
    if (filePath.includes('/projects/')) {
      if (!metadataIndex.projects.has(fileName)) {
        issues.push({
          type: 'consistency',
          severity: 'warning',
          location: 'metadata',
          message: `Project "${fileName}" not found in projects.yml`,
          suggestion: 'Add entry to projects.yml or rename file to match existing metadata',
        });
      }
    } else if (filePath.includes('/skills/')) {
      if (!metadataIndex.skills.has(fileName)) {
        issues.push({
          type: 'consistency',
          severity: 'warning',
          location: 'metadata',
          message: `Skill "${fileName}" not found in skills.yml`,
          suggestion: 'Add entry to skills.yml or rename file to match existing metadata',
        });
      }
    }

    return issues;
  }

  static checkFieldConsistency(
    markdownContent: string,
    yamlData: any,
    filePath: string
  ): QualityIssue[] {
    const issues: QualityIssue[] = [];

    // Check if markdown content matches YAML metadata
    if (yamlData.name && !markdownContent.includes(yamlData.name)) {
      issues.push({
        type: 'consistency',
        severity: 'warning',
        location: 'content',
        message: `YAML name "${yamlData.name}" not found in markdown content`,
        suggestion: 'Ensure markdown title/name matches the YAML metadata entry',
      });
    }

    if (yamlData.technologies && Array.isArray(yamlData.technologies)) {
      yamlData.technologies.forEach((tech: string) => {
        if (!markdownContent.includes(tech)) {
          issues.push({
            type: 'consistency',
            severity: 'info',
            location: 'technologies',
            message: `Technology "${tech}" listed in YAML but not mentioned in markdown`,
            suggestion: 'Ensure all YAML technologies are documented in markdown content',
          });
        }
      });
    }

    return issues;
  }
}

// ============================================================================
// TECHNOLOGY MATCHER
// ============================================================================

export class TechnologyMatcher {
  static validateTechnologies(
    content: string,
    metadataIndex: MetadataIndex
  ): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const technologies = metadataIndex.technologies;

    // Extract technology references from content
    const techPattern = /\b([A-Za-z0-9#.\-+]+(?:\s+[A-Za-z0-9#.\-+]+)?)\b/g;
    const foundTechs = new Set<string>();

    let match;
    const techLikeCandidates = [
      'Kubernetes', 'Docker', 'AWS', 'Terraform', 'Python', 'Go', 'Rust',
      'Node.js', 'TypeScript', 'JavaScript', 'React', 'Vue', 'Angular',
      'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch',
    ];

    techLikeCandidates.forEach(tech => {
      if (new RegExp(`\\b${tech}\\b`, 'i').test(content)) {
        foundTechs.add(tech);

        if (!technologies.has(tech) && !technologies.has(tech.toLowerCase())) {
          issues.push({
            type: 'technology_mismatch',
            severity: 'info',
            location: 'technologies',
            message: `Technology "${tech}" mentioned but not in technologies.yml`,
            suggestion: 'Add this technology to metadata/technologies.yml if it is part of your skillset',
          });
        }
      }
    });

    return issues;
  }
}

// ============================================================================
// STRUCTURE VALIDATOR
// ============================================================================

export class StructureValidator {
  private static readonly MARKDOWN_STRUCTURE = {
    project: ['# Title', '## Overview', '## Technologies', '## Impact', '## Lessons Learned'],
    skill: ['# Skill Name', '## Proficiency', '## Experience', '## Projects'],
    achievement: ['# Achievement', '## Date', '## Impact', '## Evidence'],
  };

  static validateStructure(content: string, documentType: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const expectedHeaders = this.MARKDOWN_STRUCTURE[documentType as keyof typeof this.MARKDOWN_STRUCTURE];

    if (!expectedHeaders) return issues;

    const lines = content.split('\n');
    const foundHeaders = new Set<string>();

    lines.forEach((line, index) => {
      const headerMatch = line.match(/^#+\s+(.+)$/);
      if (headerMatch) {
        foundHeaders.add(headerMatch[1].toLowerCase());
      }
    });

    // expectedHeaders.forEach(header => {
    //   const headerText = header.replace(/^#+\s+/, '').toLowerCase();
    //   if (!foundHeaders.has(headerText)) {
    //     issues.push({
    //       type: 'structure',
    //       severity: 'warning',
    //       location: 'structure',
    //       message: `Missing expected header: "${header}"`,
    //       suggestion: `Add "${header}" section to match document structure template`,
    //     });
    //   }
    // });

    return issues;
  }

  static validateMarkdownSyntax(content: string): QualityIssue[] {
    const issues: QualityIssue[] = [];
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Check for malformed markdown
      if (line.match(/^\s*[-*]\s+$/) || line.match(/^#+\s*$/)) {
        issues.push({
          type: 'structure',
          severity: 'warning',
          location: `line ${index + 1}`,
          message: 'Malformed markdown: empty list or header',
          suggestion: 'Remove empty markdown elements or add content',
        });
      }

      // Check for unmatched brackets
      const openBrackets = (line.match(/\[/g) || []).length;
      const closeBrackets = (line.match(/\]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        issues.push({
          type: 'structure',
          severity: 'info',
          location: `line ${index + 1}`,
          message: 'Possible unmatched brackets in markdown',
          suggestion: 'Check that all brackets are properly matched',
        });
      }
    });

    return issues;
  }
}

// ============================================================================
// MAIN QUALITY CHECKER
// ============================================================================

export class QualityChecker {
  static async checkFile(
    filePath: string,
    dimension: string = 'all',
    verbose: boolean = false,
    strictMode: boolean = false
  ): Promise<QualityAuditReport> {
    const content = fs.readFileSync(filePath, 'utf-8');
    const issues: QualityIssue[] = [];
    const baseDir = path.dirname(filePath);
    const metadataIndex = await this.loadMetadataIndex();

    // Determine document type
    const fileName = path.basename(filePath);
    let documentType = 'project';
    if (filePath.includes('/skills/')) documentType = 'skill';
    if (filePath.includes('/achievements/')) documentType = 'achievement';
    if (filePath.includes('/clients/')) documentType = 'client';

    // Run selected checks
    if (dimension === 'all' || dimension === 'fabrication') {
      issues.push(
        ...FabricationDetector.detectFabrication(content, []),
        ...FabricationDetector.validateMetrics(content)
      );
    }

    if (dimension === 'all' || dimension === 'evidence') {
      issues.push(
        ...EvidenceVerifier.verifyEvidence(content, filePath, metadataIndex),
        ...EvidenceVerifier.validateLinkResolution(content, baseDir)
      );
    }

    if (dimension === 'all' || dimension === 'confidentiality') {
      issues.push(...ConfidentialityAuditor.auditConfidentiality(content));
    }

    if (dimension === 'all' || dimension === 'completeness') {
      issues.push(
        ...CompletenessScorer.generateCompletenessIssues(
          content,
          documentType as 'project' | 'skill' | 'achievement' | 'client'
        )
      );
    }

    if (dimension === 'all' || dimension === 'consistency') {
      issues.push(...ConsistencyChecker.checkYamlMarkdownConsistency(filePath, metadataIndex));
    }

    if (dimension === 'all' || dimension === 'structure') {
      issues.push(
        ...StructureValidator.validateStructure(content, documentType),
        ...StructureValidator.validateMarkdownSyntax(content)
      );
    }

    if (dimension === 'all' || dimension === 'technologies') {
      issues.push(...TechnologyMatcher.validateTechnologies(content, metadataIndex));
    }

    // Apply strict mode
    if (strictMode) {
      issues.forEach(issue => {
        if (issue.severity === 'warning') {
          issue.severity = 'critical';
        }
      });
    }

    // Calculate scores
    const auditReport = {
      fabrication_risk: this.calculateFabricationRisk(issues),
      confidentiality_risk: ConfidentialityAuditor.getConfidentialityScore(issues),
      completeness_score: CompletenessScorer.scoreCompleteness(
        content,
        documentType as 'project' | 'skill' | 'achievement' | 'client'
      ),
      evidence_coverage: this.calculateEvidenceCoverage(issues),
    };

    return {
      overall_quality_score: this.calculateOverallScore(issues, auditReport),
      issues,
      confidence: this.assessConfidence(issues),
      audit_report: auditReport,
      timestamp: new Date().toISOString(),
      filePath,
    };
  }

  private static calculateFabricationRisk(issues: QualityIssue[]): number {
    let risk = 0;
    issues
      .filter(i => i.type === 'fabrication' || i.type === 'missing_evidence')
      .forEach(issue => {
        risk += issue.severity === 'critical' ? 25 : 10;
      });
    return Math.min(100, risk);
  }

  private static calculateEvidenceCoverage(issues: QualityIssue[]): number {
    const evidenceIssues = issues.filter(i => i.type === 'missing_evidence');
    return Math.max(0, 100 - evidenceIssues.length * 15);
  }

  private static calculateOverallScore(issues: QualityIssue[], auditReport: any): number {
    const baseScore = 100;
    let deduction = 0;

    issues.forEach(issue => {
      if (issue.severity === 'critical') deduction += 10;
      if (issue.severity === 'warning') deduction += 3;
      if (issue.severity === 'info') deduction += 1;
    });

    const weightedScore =
      (auditReport.fabrication_risk * 0.3 +
        auditReport.confidentiality_risk * 0.4 +
        (100 - auditReport.completeness_score) * 0.2 +
        (100 - auditReport.evidence_coverage) * 0.1) / 100;

    return Math.max(0, Math.round(baseScore - deduction - weightedScore * 10));
  }

  private static assessConfidence(issues: QualityIssue[]): 'high' | 'medium' | 'low' {
    const criticalCount = issues.filter(i => i.severity === 'critical').length;
    if (criticalCount > 3) return 'low';
    if (criticalCount > 1) return 'medium';
    return 'high';
  }

  private static async loadMetadataIndex(): Promise<MetadataIndex> {
    const index: MetadataIndex = {
      projects: new Map(),
      skills: new Map(),
      technologies: new Set(),
      clients: new Map(),
      experience: new Map(),
    };

    try {
      const metadataDir = path.join(process.cwd(), 'metadata');

      // Load technologies
      const techFile = path.join(metadataDir, 'technologies.yml');
      if (fs.existsSync(techFile)) {
        const techData = yaml.load(fs.readFileSync(techFile, 'utf-8')) as any;
        if (techData?.technologies) {
          techData.technologies.forEach((tech: any) => {
            if (tech.name) index.technologies.add(tech.name.toLowerCase());
          });
        }
      }

      // Load projects
      const projFile = path.join(metadataDir, 'projects.yml');
      if (fs.existsSync(projFile)) {
        const projData = yaml.load(fs.readFileSync(projFile, 'utf-8')) as any;
        if (projData?.projects) {
          projData.projects.forEach((proj: any) => {
            if (proj.name) index.projects.set(proj.name.toLowerCase(), proj);
          });
        }
      }

      // Load skills
      const skillFile = path.join(metadataDir, 'skills.yml');
      if (fs.existsSync(skillFile)) {
        const skillData = yaml.load(fs.readFileSync(skillFile, 'utf-8')) as any;
        if (skillData?.skills) {
          skillData.skills.forEach((skill: any) => {
            if (skill.name) index.skills.set(skill.name.toLowerCase(), skill);
          });
        }
      }

      // Load clients
      const clientFile = path.join(metadataDir, 'clients.yml');
      if (fs.existsSync(clientFile)) {
        const clientData = yaml.load(fs.readFileSync(clientFile, 'utf-8')) as any;
        if (clientData?.clients) {
          clientData.clients.forEach((client: any) => {
            if (client.name) index.clients.set(client.name.toLowerCase(), client);
          });
        }
      }
    } catch (error) {
      console.error('Error loading metadata index:', error);
    }

    return index;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default QualityChecker;
