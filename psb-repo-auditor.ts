/**
 * PSB Repository Auditor
 * Comprehensive repository-wide quality assessment
 */

import * as fs from 'fs';
import * as path from 'path';
import { QualityAuditReport, QualityIssue } from './psb-quality-checker';
import QualityChecker from './psb-quality-checker';

export interface RepositoryAuditSummary {
  total_files_checked: number;
  files_with_issues: number;
  overall_repository_score: number;
  average_file_score: number;
  critical_issues_count: number;
  warning_count: number;
  info_count: number;
  dimension_scores: {
    fabrication: number;
    confidentiality: number;
    completeness: number;
    evidence: number;
  };
  highest_risk_files: Array<{
    filePath: string;
    score: number;
    top_issues: QualityIssue[];
  }>;
  health_metrics: {
    repository_health_status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
    risk_assessment: string;
    improvement_priority: string[];
  };
  audit_timestamp: string;
  audit_duration_seconds: number;
}

export interface AuditOptions {
  scope: 'all' | 'projects' | 'skills' | 'clients' | 'experience' | 'metadata';
  dimension: 'all' | string;
  generateSummary: boolean;
  excludePatterns: string[];
  verbose: boolean;
}

export class RepositoryAuditor {
  private static readonly DEFAULT_SCOPE_PATHS = {
    projects: 'projects/**/*.md',
    skills: 'skills/**/*.md',
    clients: 'clients/**/*.md',
    experience: 'experience/**/*.md',
    metadata: 'metadata/**/*.yml',
    all: [
      'projects/**/*.md',
      'skills/**/*.md',
      'clients/**/*.md',
      'experience/**/*.md',
      'metadata/**/*.yml',
    ],
  };

  static async auditRepository(options: AuditOptions): Promise<RepositoryAuditSummary> {
    const startTime = Date.now();
    const fileReports: QualityAuditReport[] = [];
    const filesToAudit = this.findFilesToAudit(options);

    console.log(`Starting audit of ${filesToAudit.length} files...`);

    // Audit each file
    for (const filePath of filesToAudit) {
      try {
        const report = await QualityChecker.checkFile(
          filePath,
          options.dimension,
          options.verbose
        );
        fileReports.push(report);
      } catch (error) {
        console.error(`Error auditing ${filePath}:`, error);
      }
    }

    // Generate summary
    const summary = this.generateSummary(fileReports, Date.now() - startTime);
    return summary;
  }

  private static findFilesToAudit(options: AuditOptions): string[] {
    const files: string[] = [];
    const baseDir = process.cwd();
    const scopePaths =
      options.scope === 'all'
        ? this.DEFAULT_SCOPE_PATHS.all
        : [this.DEFAULT_SCOPE_PATHS[options.scope as keyof typeof this.DEFAULT_SCOPE_PATHS]].filter(Boolean);

    scopePaths.forEach(globPattern => {
      const matchedFiles = this.globFiles(baseDir, globPattern);
      files.push(
        ...matchedFiles.filter(
          f =>
            !options.excludePatterns.some(pattern =>
              f.includes(pattern.replace('*.', ''))
            )
        )
      );
    });

    return Array.from(new Set(files)); // Remove duplicates
  }

  private static globFiles(baseDir: string, pattern: string): string[] {
    const files: string[] = [];
    const parts = pattern.split('**/');
    const searchDir = path.join(baseDir, parts[0] || '');

    if (!fs.existsSync(searchDir)) {
      return files;
    }

    const walkDir = (dir: string) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        entries.forEach(entry => {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walkDir(fullPath);
          } else if (entry.isFile()) {
            if (this.matchesPattern(fullPath, pattern)) {
              files.push(fullPath);
            }
          }
        });
      } catch (error) {
        // Skip directories we can't read
      }
    };

    walkDir(searchDir);
    return files;
  }

  private static matchesPattern(filePath: string, pattern: string): boolean {
    const fileName = path.basename(filePath);
    const extension = pattern.match(/\.(\w+)$/)?.[1];
    if (extension) {
      return fileName.endsWith(`.${extension}`);
    }
    return true;
  }

  private static generateSummary(
    fileReports: QualityAuditReport[],
    durationMs: number
  ): RepositoryAuditSummary {
    if (fileReports.length === 0) {
      return {
        total_files_checked: 0,
        files_with_issues: 0,
        overall_repository_score: 100,
        average_file_score: 100,
        critical_issues_count: 0,
        warning_count: 0,
        info_count: 0,
        dimension_scores: {
          fabrication: 0,
          confidentiality: 0,
          completeness: 100,
          evidence: 100,
        },
        highest_risk_files: [],
        health_metrics: {
          repository_health_status: 'excellent',
          risk_assessment: 'No files to audit',
          improvement_priority: [],
        },
        audit_timestamp: new Date().toISOString(),
        audit_duration_seconds: Math.round(durationMs / 1000),
      };
    }

    // Calculate statistics
    const filesWithIssues = fileReports.filter(r => r.issues.length > 0).length;
    const allIssues = fileReports.flatMap(r => r.issues);
    const criticalCount = allIssues.filter(i => i.severity === 'critical').length;
    const warningCount = allIssues.filter(i => i.severity === 'warning').length;
    const infoCount = allIssues.filter(i => i.severity === 'info').length;

    // Calculate average scores
    const averageFileScore =
      fileReports.reduce((sum, r) => sum + r.overall_quality_score, 0) /
      fileReports.length;

    const avgFabricationRisk =
      fileReports.reduce((sum, r) => sum + r.audit_report.fabrication_risk, 0) /
      fileReports.length;
    const avgConfidentialityRisk =
      fileReports.reduce((sum, r) => sum + r.audit_report.confidentiality_risk, 0) /
      fileReports.length;
    const avgCompletenessScore =
      fileReports.reduce((sum, r) => sum + r.audit_report.completeness_score, 0) /
      fileReports.length;
    const avgEvidenceCoverage =
      fileReports.reduce((sum, r) => sum + r.audit_report.evidence_coverage, 0) /
      fileReports.length;

    // Find highest risk files
    const highestRiskFiles = fileReports
      .sort((a, b) => a.overall_quality_score - b.overall_quality_score)
      .slice(0, 5)
      .map(r => ({
        filePath: r.filePath,
        score: r.overall_quality_score,
        top_issues: r.issues.slice(0, 3),
      }));

    // Determine health status
    const healthStatus = this.determineHealthStatus(
      averageFileScore,
      criticalCount,
      avgConfidentialityRisk
    );

    // Generate improvement priorities
    const priorities = this.generateImprovementPriorities(
      avgFabricationRisk,
      avgConfidentialityRisk,
      avgCompletenessScore,
      avgEvidenceCoverage
    );

    const overallScore = Math.round(
      averageFileScore * 0.4 +
        (100 - avgFabricationRisk) * 0.25 +
        (100 - avgConfidentialityRisk) * 0.25 +
        avgCompletenessScore * 0.1
    );

    return {
      total_files_checked: fileReports.length,
      files_with_issues: filesWithIssues,
      overall_repository_score: overallScore,
      average_file_score: Math.round(averageFileScore),
      critical_issues_count: criticalCount,
      warning_count: warningCount,
      info_count: infoCount,
      dimension_scores: {
        fabrication: Math.round(100 - avgFabricationRisk),
        confidentiality: Math.round(100 - avgConfidentialityRisk),
        completeness: Math.round(avgCompletenessScore),
        evidence: Math.round(avgEvidenceCoverage),
      },
      highest_risk_files: highestRiskFiles,
      health_metrics: {
        repository_health_status: healthStatus,
        risk_assessment: this.generateRiskAssessment(
          avgFabricationRisk,
          avgConfidentialityRisk,
          healthStatus
        ),
        improvement_priority: priorities,
      },
      audit_timestamp: new Date().toISOString(),
      audit_duration_seconds: Math.round(durationMs / 1000),
    };
  }

  private static determineHealthStatus(
    averageScore: number,
    criticalIssues: number,
    confidentialityRisk: number
  ): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (confidentialityRisk > 60) return 'critical';
    if (criticalIssues > 10 || averageScore < 40) return 'critical';
    if (criticalIssues > 5 || averageScore < 60) return 'poor';
    if (criticalIssues > 2 || averageScore < 75) return 'fair';
    if (averageScore < 90) return 'good';
    return 'excellent';
  }

  private static generateRiskAssessment(
    fabricationRisk: number,
    confidentialityRisk: number,
    healthStatus: string
  ): string {
    const risks: string[] = [];

    if (fabricationRisk > 60) {
      risks.push('HIGH fabrication risk - claims lack evidence');
    }
    if (confidentialityRisk > 60) {
      risks.push('CRITICAL confidentiality risk - sensitive data exposed');
    }
    if (fabricationRisk > 30) {
      risks.push('MEDIUM fabrication risk - some claims need better support');
    }
    if (confidentialityRisk > 30) {
      risks.push('MEDIUM confidentiality risk - some data may be exposed');
    }

    return risks.length > 0
      ? risks.join('; ')
      : 'No significant risks identified';
  }

  private static generateImprovementPriorities(
    fabricationRisk: number,
    confidentialityRisk: number,
    completenessScore: number,
    evidenceCoverage: number
  ): string[] {
    const priorities: string[] = [];

    if (confidentialityRisk > 30) {
      priorities.push('Review and redact sensitive information (client names, credentials)');
    }
    if (fabricationRisk > 30) {
      priorities.push('Add evidence links to support claims (metrics, documentation)');
    }
    if (completenessScore < 70) {
      priorities.push('Complete missing documentation sections (overview, impact, evidence)');
    }
    if (evidenceCoverage < 60) {
      priorities.push('Link achievement claims to supporting evidence files');
    }
    if (priorities.length === 0) {
      priorities.push('Maintain current quality standards');
    }

    return priorities;
  }

  static generateReport(
    summary: RepositoryAuditSummary,
    format: 'json' | 'markdown' | 'html' | 'csv' = 'markdown'
  ): string {
    switch (format) {
      case 'json':
        return JSON.stringify(summary, null, 2);
      case 'markdown':
        return this.generateMarkdownReport(summary);
      case 'html':
        return this.generateHtmlReport(summary);
      case 'csv':
        return this.generateCsvReport(summary);
      default:
        return JSON.stringify(summary, null, 2);
    }
  }

  private static generateMarkdownReport(summary: RepositoryAuditSummary): string {
    const lines = [
      '# PSB Quality Audit Report',
      `\n**Generated:** ${new Date(summary.audit_timestamp).toLocaleString()}`,
      `**Duration:** ${summary.audit_duration_seconds} seconds\n`,

      '## Executive Summary',
      `- **Overall Repository Score:** ${summary.overall_repository_score}/100`,
      `- **Average File Score:** ${summary.average_file_score}/100`,
      `- **Health Status:** ${summary.health_metrics.repository_health_status.toUpperCase()}`,
      `- **Files Checked:** ${summary.total_files_checked}`,
      `- **Files with Issues:** ${summary.files_with_issues} (${Math.round((summary.files_with_issues / summary.total_files_checked) * 100)}%)\n`,

      '## Quality Metrics',
      '| Dimension | Score |',
      '|-----------|-------|',
      `| Fabrication Detection | ${summary.dimension_scores.fabrication}/100 |`,
      `| Confidentiality Audit | ${summary.dimension_scores.confidentiality}/100 |`,
      `| Completeness | ${summary.dimension_scores.completeness}/100 |`,
      `| Evidence Coverage | ${summary.dimension_scores.evidence}/100 |\n`,

      '## Issue Summary',
      `- **Critical Issues:** ${summary.critical_issues_count}`,
      `- **Warnings:** ${summary.warning_count}`,
      `- **Info Messages:** ${summary.info_count}\n`,

      '## Risk Assessment',
      `${summary.health_metrics.risk_assessment}\n`,

      '## Improvement Priorities',
      summary.health_metrics.improvement_priority
        .map((p, i) => `${i + 1}. ${p}`)
        .join('\n') + '\n',

      '## Highest Risk Files',
      summary.highest_risk_files.length > 0
        ? summary.highest_risk_files
            .map(
              f =>
                `\n### ${f.filePath}\n**Score:** ${f.score}/100\n\nTop Issues:\n${f.top_issues
                  .map(i => `- [${i.severity.toUpperCase()}] ${i.message}`)
                  .join('\n')}`
            )
            .join('\n')
        : 'No files with issues found.',
    ];

    return lines.join('\n');
  }

  private static generateHtmlReport(summary: RepositoryAuditSummary): string {
    const scoreColor = (score: number) => {
      if (score >= 80) return '#4CAF50';
      if (score >= 60) return '#FFC107';
      if (score >= 40) return '#FF9800';
      return '#F44336';
    };

    return `
<!DOCTYPE html>
<html>
<head>
  <title>PSB Quality Audit Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; }
    h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
    h2 { color: #555; margin-top: 30px; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
    .metric-card { padding: 20px; border-radius: 8px; background-color: #f9f9f9; border-left: 4px solid #007bff; }
    .metric-card.critical { border-left-color: #F44336; }
    .metric-card.warning { border-left-color: #FFC107; }
    .score { font-size: 32px; font-weight: bold; }
    .status { display: inline-block; padding: 8px 12px; border-radius: 4px; font-weight: bold; color: white; }
    .status.excellent { background-color: #4CAF50; }
    .status.good { background-color: #8BC34A; }
    .status.fair { background-color: #FFC107; }
    .status.poor { background-color: #FF9800; }
    .status.critical { background-color: #F44336; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f9f9f9; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <h1>PSB Quality Audit Report</h1>
    <p><strong>Generated:</strong> ${new Date(summary.audit_timestamp).toLocaleString()}</p>
    
    <h2>Executive Summary</h2>
    <div class="metrics">
      <div class="metric-card">
        <div class="score" style="color: ${scoreColor(summary.overall_repository_score)}">
          ${summary.overall_repository_score}
        </div>
        <div>Overall Repository Score</div>
      </div>
      <div class="metric-card">
        <div class="score" style="color: ${scoreColor(summary.average_file_score)}">
          ${summary.average_file_score}
        </div>
        <div>Average File Score</div>
      </div>
      <div class="metric-card">
        <div><span class="status ${summary.health_metrics.repository_health_status}">
          ${summary.health_metrics.repository_health_status.toUpperCase()}
        </span></div>
        <div>Health Status</div>
      </div>
      <div class="metric-card">
        <div class="score">${summary.total_files_checked}</div>
        <div>Files Audited</div>
      </div>
    </div>

    <h2>Quality Dimensions</h2>
    <table>
      <tr>
        <th>Dimension</th>
        <th>Score</th>
      </tr>
      <tr>
        <td>Fabrication Detection</td>
        <td><strong>${summary.dimension_scores.fabrication}/100</strong></td>
      </tr>
      <tr>
        <td>Confidentiality Audit</td>
        <td><strong>${summary.dimension_scores.confidentiality}/100</strong></td>
      </tr>
      <tr>
        <td>Completeness</td>
        <td><strong>${summary.dimension_scores.completeness}/100</strong></td>
      </tr>
      <tr>
        <td>Evidence Coverage</td>
        <td><strong>${summary.dimension_scores.evidence}/100</strong></td>
      </tr>
    </table>

    <h2>Improvement Priorities</h2>
    <ol>
      ${summary.health_metrics.improvement_priority
        .map(p => `<li>${p}</li>`)
        .join('\n')}
    </ol>
  </div>
</body>
</html>
    `;
  }

  private static generateCsvReport(summary: RepositoryAuditSummary): string {
    const lines = [
      'Repository Quality Audit Report',
      `Generated,${summary.audit_timestamp}`,
      `Overall Score,${summary.overall_repository_score}`,
      `Average File Score,${summary.average_file_score}`,
      `Health Status,${summary.health_metrics.repository_health_status}`,
      `Files Checked,${summary.total_files_checked}`,
      `Files with Issues,${summary.files_with_issues}`,
      `Critical Issues,${summary.critical_issues_count}`,
      `Warnings,${summary.warning_count}`,
      `Info Messages,${summary.info_count}`,
      '',
      'Quality Dimensions',
      'Dimension,Score',
      `Fabrication Detection,${summary.dimension_scores.fabrication}`,
      `Confidentiality Audit,${summary.dimension_scores.confidentiality}`,
      `Completeness,${summary.dimension_scores.completeness}`,
      `Evidence Coverage,${summary.dimension_scores.evidence}`,
    ];

    return lines.join('\n');
  }
}

export default RepositoryAuditor;
