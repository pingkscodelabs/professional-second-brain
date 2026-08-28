/**
 * PSB Quality Agent - Reporter Module
 * Generates comprehensive quality reports and dashboards
 */

import * as fs from 'fs';
import * as path from 'path';

import {
  QualityAgentOutput,
  QualityReport,
  DashboardData,
  Recommendation,
  QualityScores,
  QualityIssue,
} from './psb-quality-agent-types';

// ============================================================================
// REPORTER
// ============================================================================

export class QualityReporter {
  private reportsDir: string;

  constructor(reportsDir: string = '.psb/reports') {
    this.reportsDir = reportsDir;
    this.ensureReportsDirectory();
  }

  // ============================================================================
  // REPORT GENERATION
  // ============================================================================

  /**
   * Generate comprehensive quality report
   */
  generateReport(
    output: QualityAgentOutput,
    recommendations: Recommendation[],
    targetPath: string = 'repository'
  ): QualityReport {
    return {
      title: `PSB Quality Report - ${targetPath}`,
      generated_at: new Date().toISOString(),
      scope: output.scan_result.files_scanned > 0 ? 'repository' : 'file',
      target_path: targetPath,
      execution_summary: output.scan_result,
      quality_scores: output.quality_scores,
      trend_analysis: output.trend_analysis,
      critical_issues: output.issues_by_severity
        .find((group) => group.severity === 'critical')
        ?.examples.slice(0, 10) || [],
      warning_issues: output.issues_by_severity
        .find((group) => group.severity === 'warning')
        ?.examples.slice(0, 10) || [],
      info_issues: output.issues_by_severity
        .find((group) => group.severity === 'info')
        ?.examples.slice(0, 10) || [],
      recommendations,
      fixes_applied: output.fixes_applied || { count: 0, types: [], fixes: [] },
    };
  }

  /**
   * Generate dashboard data
   */
  generateDashboard(
    currentOutput: QualityAgentOutput,
    recommendations: Recommendation[],
    historicalOutputs: QualityAgentOutput[] = []
  ): DashboardData {
    const topIssues = this.extractTopIssues(currentOutput);
    const recentFixes = currentOutput.fixes_applied?.fixes.slice(0, 5) || [];

    return {
      current_scores: currentOutput.quality_scores,
      score_trend: currentOutput.trend_analysis.historical_scores,
      top_issues: topIssues,
      recent_fixes: recentFixes,
      recommendations: recommendations.slice(0, 5),
      system_health: {
        agent_status: this.determineHealthStatus(currentOutput.quality_scores),
        last_successful_scan: currentOutput.scan_result.scan_end_time,
        uptime_percentage: this.calculateUptime(historicalOutputs),
      },
    };
  }

  /**
   * Export report as JSON
   */
  exportJSON(report: QualityReport): string {
    return JSON.stringify(report, null, 2);
  }

  /**
   * Export report as Markdown
   */
  exportMarkdown(report: QualityReport): string {
    let md = '';

    // Header
    md += `# ${report.title}\n\n`;
    md += `**Generated:** ${new Date(report.generated_at).toLocaleString()}\n`;
    md += `**Scope:** ${report.scope}\n`;
    md += `**Target:** ${report.target_path}\n\n`;

    // Executive Summary
    md += this.generateMarkdownSummary(report);

    // Quality Scores
    md += this.generateMarkdownScores(report.quality_scores);

    // Trend Analysis
    md += this.generateMarkdownTrends(report.trend_analysis);

    // Issues
    md += this.generateMarkdownIssues(report);

    // Recommendations
    md += this.generateMarkdownRecommendations(report.recommendations);

    // Fixes Applied
    if (report.fixes_applied.count > 0) {
      md += this.generateMarkdownFixes(report.fixes_applied);
    }

    return md;
  }

  /**
   * Export report as HTML
   */
  exportHTML(report: QualityReport, dashboard: DashboardData): string {
    const scores = report.quality_scores;
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    
    .header h1 {
      font-size: 32px;
      margin-bottom: 10px;
    }
    
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px;
    }
    
    .scores-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .score-card {
      background: #f5f7fa;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      border: 2px solid #e1e8ed;
    }
    
    .score-card h3 {
      font-size: 12px;
      text-transform: uppercase;
      color: #7f8c8d;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    
    .score-value {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .score-good { color: #27ae60; }
    .score-warning { color: #f39c12; }
    .score-critical { color: #e74c3c; }
    
    .score-bar {
      height: 8px;
      background: #ecf0f1;
      border-radius: 4px;
      overflow: hidden;
      margin-top: 10px;
    }
    
    .score-fill {
      height: 100%;
      background: linear-gradient(90deg, #27ae60, #2ecc71);
      border-radius: 4px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section h2 {
      font-size: 24px;
      margin-bottom: 20px;
      color: #2c3e50;
      border-bottom: 3px solid #667eea;
      padding-bottom: 10px;
    }
    
    .issues-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .issue-card {
      border-left: 4px solid #e74c3c;
      background: #fff5f5;
      padding: 20px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    
    .issue-card.warning {
      border-left-color: #f39c12;
      background: #fffaf0;
    }
    
    .issue-card.info {
      border-left-color: #3498db;
      background: #f0f8ff;
    }
    
    .issue-card h4 {
      margin-bottom: 10px;
      color: #2c3e50;
    }
    
    .issue-card p {
      font-size: 14px;
      color: #555;
      line-height: 1.5;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    th {
      background: #667eea;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    td {
      padding: 12px;
      border-bottom: 1px solid #ecf0f1;
    }
    
    tr:hover {
      background: #f9f9f9;
    }
    
    .footer {
      background: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #7f8c8d;
      font-size: 12px;
      border-top: 1px solid #ecf0f1;
    }
    
    .recommendation {
      background: #f0f8ff;
      border-left: 4px solid #3498db;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    
    .recommendation h4 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .recommendation p {
      font-size: 14px;
      color: #555;
      line-height: 1.5;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 5px;
    }
    
    .badge-high { background: #ffe5e5; color: #c92a2a; }
    .badge-medium { background: #fff4e6; color: #e67700; }
    .badge-low { background: #e7f5ff; color: #1971c2; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${report.title}</h1>
      <p>Generated on ${new Date(report.generated_at).toLocaleString()}</p>
    </div>
    
    <div class="content">
      ${this.generateHTMLScores(scores)}
      ${this.generateHTMLSummary(report.execution_summary)}
      ${this.generateHTMLIssues(report)}
      ${this.generateHTMLRecommendations(report.recommendations)}
      ${this.generateHTMLTrends(report.trend_analysis)}
    </div>
    
    <div class="footer">
      <p>PSB Quality Agent Report • ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
    `;

    return html;
  }

  /**
   * Export report as CSV
   */
  exportCSV(report: QualityReport): string {
    let csv = '';

    // Summary
    csv += 'Quality Report Summary\n';
    csv += `Generated,${report.generated_at}\n`;
    csv += `Target,${report.target_path}\n\n`;

    // Scores
    csv += 'Quality Scores\n';
    csv += 'Dimension,Score\n';
    Object.entries(report.quality_scores).forEach(([key, value]) => {
      csv += `${key},${value}\n`;
    });

    csv += '\nScan Results\n';
    csv += 'Metric,Value\n';
    csv += `Files Scanned,${report.execution_summary.files_scanned}\n`;
    csv += `Issues Found,${report.execution_summary.issues_found}\n`;
    csv += `Critical Issues,${report.execution_summary.critical_count}\n`;
    csv += `Warning Issues,${report.execution_summary.warning_count}\n`;

    return csv;
  }

  /**
   * Save report to file
   */
  saveReport(report: QualityReport, format: 'json' | 'markdown' | 'html' | 'csv'): string {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `quality-report-${timestamp}.${format}`;
    const filepath = path.join(this.reportsDir, filename);

    let content = '';
    switch (format) {
      case 'json':
        content = this.exportJSON(report);
        break;
      case 'markdown':
        content = this.exportMarkdown(report);
        break;
      case 'html':
        // Note: dashboard is not available in this context
        content = this.exportHTML(report, {} as DashboardData);
        break;
      case 'csv':
        content = this.exportCSV(report);
        break;
    }

    fs.writeFileSync(filepath, content, 'utf-8');
    return filepath;
  }

  // ============================================================================
  // PRIVATE HELPERS
  // ============================================================================

  /**
   * Extract top issues from output
   */
  private extractTopIssues(output: QualityAgentOutput): QualityIssue[] {
    const allIssues = output.issues_by_severity.flatMap((group) => group.examples);
    return allIssues.slice(0, 10);
  }

  /**
   * Determine health status
   */
  private determineHealthStatus(scores: QualityScores): 'healthy' | 'warning' | 'critical' {
    if (scores.overall >= 80) return 'healthy';
    if (scores.overall >= 60) return 'warning';
    return 'critical';
  }

  /**
   * Calculate uptime percentage
   */
  private calculateUptime(historicalOutputs: QualityAgentOutput[]): number {
    if (historicalOutputs.length === 0) return 100;

    const successful = historicalOutputs.filter((o) => o.success).length;
    return Math.round((successful / historicalOutputs.length) * 100);
  }

  /**
   * Generate markdown summary
   */
  private generateMarkdownSummary(report: QualityReport): string {
    return `## Executive Summary

- **Overall Quality Score:** ${report.quality_scores.overall}/100
- **Files Scanned:** ${report.execution_summary.files_scanned}
- **Issues Found:** ${report.execution_summary.issues_found}
- **Critical Issues:** ${report.execution_summary.critical_count}
- **Fixes Applied:** ${report.fixes_applied.count}

\n`;
  }

  /**
   * Generate markdown scores
   */
  private generateMarkdownScores(scores: QualityScores): string {
    let md = `## Quality Scores\n\n`;
    md += `| Dimension | Score |\n`;
    md += `|-----------|-------|\n`;
    md += `| Overall | ${scores.overall}/100 |\n`;
    md += `| Fabrication Risk | ${scores.fabrication_risk}/100 |\n`;
    md += `| Confidentiality Risk | ${scores.confidentiality_risk}/100 |\n`;
    md += `| Completeness | ${scores.completeness}/100 |\n`;
    md += `| Consistency | ${scores.consistency}/100 |\n`;
    md += `| Technology Alignment | ${scores.technology_alignment}/100 |\n`;
    md += `| Evidence Coverage | ${scores.evidence_coverage}/100 |\n`;
    md += `| Link Validity | ${scores.link_validity}/100 |\n`;
    md += `| Structure Compliance | ${scores.structure_compliance}/100 |\n\n`;
    return md;
  }

  /**
   * Generate markdown trends
   */
  private generateMarkdownTrends(trend: any): string {
    return `## Trend Analysis\n\n- **Trend:** ${trend.trend}\n- **Improvement:** ${trend.improvement_percentage}%\n- **Velocity:** ${trend.velocity}\n\n`;
  }

  /**
   * Generate markdown issues
   */
  private generateMarkdownIssues(report: QualityReport): string {
    let md = `## Issues\n\n`;

    if (report.critical_issues.length > 0) {
      md += `### Critical Issues\n\n`;
      report.critical_issues.forEach((issue) => {
        md += `- **${issue.type}** (${issue.file_path}): ${issue.message}\n`;
        md += `  - ${issue.suggestion}\n\n`;
      });
    }

    if (report.warning_issues.length > 0) {
      md += `### Warnings\n\n`;
      report.warning_issues.forEach((issue) => {
        md += `- **${issue.type}** (${issue.file_path}): ${issue.message}\n`;
        md += `  - ${issue.suggestion}\n\n`;
      });
    }

    return md;
  }

  /**
   * Generate markdown recommendations
   */
  private generateMarkdownRecommendations(recommendations: Recommendation[]): string {
    let md = `## Recommendations\n\n`;

    recommendations.forEach((rec) => {
      md += `### ${rec.title}\n`;
      md += `**Priority:** ${rec.priority} | **Effort:** ${rec.implementation_effort}\n\n`;
      md += `${rec.description}\n\n`;
      md += `**Action:** ${rec.suggested_action}\n\n`;
    });

    return md;
  }

  /**
   * Generate markdown fixes
   */
  private generateMarkdownFixes(fixes: any): string {
    let md = `## Fixes Applied\n\n`;
    md += `${fixes.count} automated fixes were applied:\n\n`;
    fixes.fixes.slice(0, 5).forEach((fix: any) => {
      md += `- ${fix.file_path}: ${fix.type} (${fix.status})\n`;
    });
    return md;
  }

  /**
   * Generate HTML scores section
   */
  private generateHTMLScores(scores: QualityScores): string {
    return `
      <div class="section">
        <h2>Quality Scores</h2>
        <div class="scores-grid">
          ${this.generateScoreCard('Overall', scores.overall)}
          ${this.generateScoreCard('Fabrication Risk', scores.fabrication_risk, true)}
          ${this.generateScoreCard('Confidentiality Risk', scores.confidentiality_risk, true)}
          ${this.generateScoreCard('Completeness', scores.completeness)}
          ${this.generateScoreCard('Consistency', scores.consistency)}
          ${this.generateScoreCard('Technology Alignment', scores.technology_alignment)}
        </div>
      </div>
    `;
  }

  /**
   * Generate score card HTML
   */
  private generateScoreCard(label: string, score: number, isRisk: boolean = false): string {
    const displayScore = isRisk ? 100 - score : score;
    const colorClass =
      displayScore >= 80 ? 'score-good' : displayScore >= 60 ? 'score-warning' : 'score-critical';

    return `
      <div class="score-card">
        <h3>${label}</h3>
        <div class="score-value ${colorClass}">${displayScore}</div>
        <div class="score-bar">
          <div class="score-fill" style="width: ${displayScore}%"></div>
        </div>
      </div>
    `;
  }

  /**
   * Generate HTML summary
   */
  private generateHTMLSummary(summary: any): string {
    return `
      <div class="section">
        <h2>Scan Results</h2>
        <table>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Files Scanned</td>
            <td>${summary.files_scanned}</td>
          </tr>
          <tr>
            <td>Issues Found</td>
            <td>${summary.issues_found}</td>
          </tr>
          <tr>
            <td>Critical Issues</td>
            <td>${summary.critical_count}</td>
          </tr>
          <tr>
            <td>Warning Issues</td>
            <td>${summary.warning_count}</td>
          </tr>
        </table>
      </div>
    `;
  }

  /**
   * Generate HTML issues
   */
  private generateHTMLIssues(report: QualityReport): string {
    let html = `<div class="section"><h2>Issues</h2><div class="issues-section">`;

    report.critical_issues.slice(0, 3).forEach((issue) => {
      html += `
        <div class="issue-card">
          <h4>${issue.type}</h4>
          <p><strong>File:</strong> ${issue.file_path}</p>
          <p>${issue.message}</p>
        </div>
      `;
    });

    html += `</div></div>`;
    return html;
  }

  /**
   * Generate HTML recommendations
   */
  private generateHTMLRecommendations(recommendations: Recommendation[]): string {
    let html = `<div class="section"><h2>Recommendations</h2>`;

    recommendations.slice(0, 5).forEach((rec) => {
      html += `
        <div class="recommendation">
          <h4>${rec.title}</h4>
          <p><span class="badge badge-${rec.priority.toLowerCase()}">${rec.priority}</span></p>
          <p>${rec.description}</p>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  }

  /**
   * Generate HTML trends
   */
  private generateHTMLTrends(trend: any): string {
    return `
      <div class="section">
        <h2>Trend Analysis</h2>
        <table>
          <tr>
            <th>Metric</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>Trend</td>
            <td>${trend.trend}</td>
          </tr>
          <tr>
            <td>Improvement</td>
            <td>${trend.improvement_percentage}%</td>
          </tr>
          <tr>
            <td>Velocity</td>
            <td>${trend.velocity}</td>
          </tr>
        </table>
      </div>
    `;
  }

  /**
   * Ensure reports directory exists
   */
  private ensureReportsDirectory(): void {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true });
    }
  }
}

// Export for use
export default QualityReporter;
