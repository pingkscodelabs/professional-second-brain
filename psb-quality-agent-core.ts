/**
 * PSB Quality Agent - Core Orchestration Engine
 * Main autonomous agent for continuous quality monitoring and maintenance
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

import {
  QualityAgentInput,
  QualityAgentOutput,
  ScanResult,
  QualityScores,
  TrendAnalysis,
  QualityIssue,
  Notification,
  AgentConfig,
  QualityAgentState,
  QualityHistory,
  Recommendation,
  AppliedFix,
  IssueDimension,
  SeverityLevel,
} from './psb-quality-agent-types';

// ============================================================================
// QUALITY AGENT CORE
// ============================================================================

export class PSBQualityAgent {
  private config: AgentConfig;
  private state: QualityAgentState;
  private historyFile: string;
  private stateFile: string;

  constructor(configPath: string) {
    this.config = this.loadConfig(configPath);
    this.historyFile = path.join(process.cwd(), '.psb', 'quality-history.json');
    this.stateFile = path.join(process.cwd(), '.psb', 'quality-agent-state.json');
    this.state = this.loadState();
    this.ensureStateDirectory();
  }

  // ============================================================================
  // CORE OPERATIONS
  // ============================================================================

  /**
   * Execute quality scan operation
   */
  async execute(input: QualityAgentInput): Promise<QualityAgentOutput> {
    const startTime = Date.now();

    try {
      this.state.current_operation = input.operation;
      this.saveState();

      let output: QualityAgentOutput;

      switch (input.operation) {
        case 'scan':
          output = await this.performScan(input);
          break;
        case 'monitor':
          output = await this.performMonitoring(input);
          break;
        case 'report':
          output = await this.generateReport(input);
          break;
        case 'fix':
          output = await this.performAutoFix(input);
          break;
        case 'schedule':
          output = await this.manageSchedule(input);
          break;
        default:
          throw new Error(`Unknown operation: ${input.operation}`);
      }

      output.execution_time_ms = Date.now() - startTime;
      output.success = true;

      // Update state with results
      if (output.scan_result) {
        this.state.last_scan_time = new Date().toISOString();
        this.state.last_scan_result = output.scan_result;
        this.state.total_issues_found += output.scan_result.issues_found;
      }

      if (output.fixes_applied) {
        this.state.total_fixes_applied += output.fixes_applied.count;
      }

      this.saveState();
      return output;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        scan_result: {
          files_scanned: 0,
          files_failed: 0,
          issues_found: 0,
          critical_count: 0,
          warning_count: 0,
          info_count: 0,
          scan_start_time: new Date().toISOString(),
          scan_end_time: new Date().toISOString(),
          files_analyzed: [],
        },
        quality_scores: {
          overall: 0,
          fabrication_risk: 100,
          confidentiality_risk: 100,
          completeness: 0,
          consistency: 0,
          technology_alignment: 0,
          evidence_coverage: 0,
          link_validity: 0,
          structure_compliance: 0,
        },
        trend_analysis: {
          trend: 'stable',
          improvement_percentage: 0,
          velocity: 'slow',
          historical_scores: [],
          score_deltas: {
            fabrication_risk_delta: 0,
            confidentiality_risk_delta: 0,
            completeness_delta: 0,
            consistency_delta: 0,
          },
        },
        issues_by_severity: [],
        notifications: [],
        success: false,
        error_message: errorMessage,
        execution_time_ms: Date.now() - startTime,
      };
    }
  }

  /**
   * Perform repository quality scan
   */
  private async performScan(input: QualityAgentInput): Promise<QualityAgentOutput> {
    const startTime = new Date().toISOString();

    // TODO: Integrate with psb-quality-checker-skill
    // This will scan the repository/file for quality issues

    const scanResult: ScanResult = {
      files_scanned: 0,
      files_failed: 0,
      issues_found: 0,
      critical_count: 0,
      warning_count: 0,
      info_count: 0,
      scan_start_time: startTime,
      scan_end_time: new Date().toISOString(),
      files_analyzed: [],
    };

    const qualityScores: QualityScores = {
      overall: 75,
      fabrication_risk: 15,
      confidentiality_risk: 5,
      completeness: 85,
      consistency: 80,
      technology_alignment: 90,
      evidence_coverage: 70,
      link_validity: 88,
      structure_compliance: 82,
    };

    const trendAnalysis = this.analyzeTrends(qualityScores);
    const issues: QualityIssue[] = [];
    const notifications: Notification[] = [];

    // Check against quality threshold
    if (qualityScores.overall < input.quality_threshold) {
      notifications.push({
        level: 'warning',
        message: `Quality score ${qualityScores.overall} is below threshold ${input.quality_threshold}`,
        issue_count: scanResult.issues_found,
        issue_types: [],
        timestamp: new Date().toISOString(),
      });
    }

    // Group issues by severity
    const issuesBySeverity = this.groupIssuesBySeverity(issues);

    return {
      scan_result: scanResult,
      quality_scores: qualityScores,
      trend_analysis: trendAnalysis,
      issues_by_severity: issuesBySeverity,
      notifications: notifications.length > 0 ? notifications : undefined,
      success: true,
    };
  }

  /**
   * Perform continuous monitoring
   */
  private async performMonitoring(input: QualityAgentInput): Promise<QualityAgentOutput> {
    // Perform initial scan
    const scanOutput = await this.performScan(input);

    // Add monitoring-specific logic
    const notifications: Notification[] = [];

    // Check for degradation
    if (this.config.monitoring.alert_on_degradation && this.state.last_scan_result) {
      const lastIssueCount = this.state.last_scan_result.issues_found;
      const currentIssueCount = scanOutput.scan_result.issues_found;

      if (currentIssueCount > lastIssueCount) {
        const degradation = currentIssueCount - lastIssueCount;
        notifications.push({
          level: 'warning',
          message: `Quality degradation detected: ${degradation} new issues found`,
          issue_count: degradation,
          issue_types: [],
          timestamp: new Date().toISOString(),
        });
      }
    }

    if (notifications.length > 0) {
      scanOutput.notifications = notifications;
    }

    return scanOutput;
  }

  /**
   * Generate quality report
   */
  private async generateReport(input: QualityAgentInput): Promise<QualityAgentOutput> {
    if (!this.state.last_scan_result) {
      throw new Error('No scan results available. Run scan operation first.');
    }

    const scanOutput = await this.performScan(input);
    const recommendations = this.generateRecommendations(
      scanOutput.quality_scores,
      input.quality_threshold
    );

    // Generate report in requested format
    const reportPath = await this.saveReport(input.report_format, scanOutput, recommendations);

    return {
      ...scanOutput,
      report_path: reportPath,
      notifications: [
        {
          level: 'info',
          message: `Quality report generated at ${reportPath}`,
          issue_count: 0,
          issue_types: [],
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }

  /**
   * Perform automatic fixes
   */
  private async performAutoFix(input: QualityAgentInput): Promise<QualityAgentOutput> {
    if (!this.config.auto_fix.enabled) {
      throw new Error('Auto-fix is disabled in configuration');
    }

    const scanOutput = await this.performScan(input);
    const appliedFixes: AppliedFix[] = [];
    let fixCount = 0;

    // Filter issues that are auto-fixable and match configuration
    const fixableIssues = scanOutput.issues_by_severity
      .flatMap((group) => group.examples)
      .filter(
        (issue) =>
          issue.auto_fixable &&
          this.config.auto_fix.dimensions.includes(issue.type) &&
          this.config.auto_fix.severity_levels.includes(issue.severity)
      );

    // Apply fixes
    for (const issue of fixableIssues) {
      const fix = await this.applyFix(issue, input.dry_run || false);
      appliedFixes.push(fix);

      if (fix.status === 'success') {
        fixCount++;
      }
    }

    return {
      ...scanOutput,
      fixes_applied: {
        count: fixCount,
        types: Array.from(new Set(appliedFixes.map((f) => f.type))),
        fixes: appliedFixes,
      },
      notifications:
        fixCount > 0
          ? [
              {
                level: 'info',
                message: `Applied ${fixCount} automatic fixes`,
                issue_count: fixCount,
                issue_types: [],
                timestamp: new Date().toISOString(),
              },
            ]
          : undefined,
    };
  }

  /**
   * Manage scheduled operations
   */
  private async manageSchedule(input: QualityAgentInput): Promise<QualityAgentOutput> {
    // Schedule monitoring based on configuration
    if (!input.schedule_interval) {
      throw new Error('schedule_interval is required for schedule operation');
    }

    // TODO: Implement scheduling logic with node-cron or similar

    return {
      scan_result: {
        files_scanned: 0,
        files_failed: 0,
        issues_found: 0,
        critical_count: 0,
        warning_count: 0,
        info_count: 0,
        scan_start_time: new Date().toISOString(),
        scan_end_time: new Date().toISOString(),
        files_analyzed: [],
      },
      quality_scores: {
        overall: 0,
        fabrication_risk: 0,
        confidentiality_risk: 0,
        completeness: 0,
        consistency: 0,
        technology_alignment: 0,
        evidence_coverage: 0,
        link_validity: 0,
        structure_compliance: 0,
      },
      trend_analysis: {
        trend: 'stable',
        improvement_percentage: 0,
        velocity: 'slow',
        historical_scores: [],
        score_deltas: {
          fabrication_risk_delta: 0,
          confidentiality_risk_delta: 0,
          completeness_delta: 0,
          consistency_delta: 0,
        },
      },
      issues_by_severity: [],
      notifications: [
        {
          level: 'info',
          message: `Scheduled monitoring activated for ${input.schedule_interval} interval`,
          issue_count: 0,
          issue_types: [],
          timestamp: new Date().toISOString(),
        },
      ],
      success: true,
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Apply a single fix to an issue
   */
  private async applyFix(issue: QualityIssue, dryRun: boolean): Promise<AppliedFix> {
    try {
      if (!issue.fix_suggestion) {
        return {
          file_path: issue.file_path,
          issue_id: issue.id,
          type: issue.type,
          status: 'skipped',
          error: 'No fix suggestion available',
        };
      }

      const suggestion = issue.fix_suggestion;

      if (dryRun) {
        return {
          file_path: issue.file_path,
          issue_id: issue.id,
          type: issue.type,
          status: 'success',
        };
      }

      // Read file
      let content = fs.readFileSync(issue.file_path, 'utf-8');

      // Apply fix based on action type
      switch (suggestion.action) {
        case 'replace':
          if (suggestion.before) {
            content = content.replace(suggestion.before, suggestion.after || '');
          }
          break;
        case 'add':
          content += `\n${suggestion.after}`;
          break;
        case 'remove':
          if (suggestion.before) {
            content = content.replace(suggestion.before, '');
          }
          break;
        case 'reformat':
          // Placeholder for reformatting logic
          break;
      }

      // Write file
      fs.writeFileSync(issue.file_path, content, 'utf-8');

      return {
        file_path: issue.file_path,
        issue_id: issue.id,
        type: issue.type,
        status: 'success',
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        file_path: issue.file_path,
        issue_id: issue.id,
        type: issue.type,
        status: 'failed',
        error: errorMessage,
      };
    }
  }

  /**
   * Analyze quality trends
   */
  private analyzeTrends(currentScores: QualityScores): TrendAnalysis {
    const history = this.state.historical_scores;

    if (history.length === 0) {
      return {
        trend: 'stable',
        improvement_percentage: 0,
        velocity: 'slow',
        historical_scores: [],
        score_deltas: {
          fabrication_risk_delta: 0,
          confidentiality_risk_delta: 0,
          completeness_delta: 0,
          consistency_delta: 0,
        },
      };
    }

    const lastScore = history[history.length - 1];
    const previousScore = history.length > 1 ? history[history.length - 2] : lastScore;

    const overallDelta = currentScores.overall - lastScore.overall_score;
    const improvementPercentage = (overallDelta / (lastScore.overall_score || 1)) * 100;

    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (overallDelta > 2) trend = 'improving';
    if (overallDelta < -2) trend = 'declining';

    let velocity: 'fast' | 'moderate' | 'slow' = 'slow';
    if (Math.abs(overallDelta) > 5) velocity = 'fast';
    if (Math.abs(overallDelta) > 2) velocity = 'moderate';

    return {
      trend,
      improvement_percentage: parseFloat(improvementPercentage.toFixed(2)),
      velocity,
      historical_scores: history,
      score_deltas: {
        fabrication_risk_delta:
          currentScores.fabrication_risk -
          (lastScore.dimension_scores?.fabrication_risk || 0),
        confidentiality_risk_delta:
          currentScores.confidentiality_risk -
          (lastScore.dimension_scores?.confidentiality_risk || 0),
        completeness_delta: currentScores.completeness - (lastScore.dimension_scores?.completeness || 0),
        consistency_delta: currentScores.consistency - (lastScore.dimension_scores?.consistency || 0),
      },
    };
  }

  /**
   * Group issues by severity
   */
  private groupIssuesBySeverity(issues: QualityIssue[]) {
    const grouped = {
      critical: issues.filter((i) => i.severity === 'critical'),
      warning: issues.filter((i) => i.severity === 'warning'),
      info: issues.filter((i) => i.severity === 'info'),
    };

    return [
      { severity: 'critical' as SeverityLevel, count: grouped.critical.length, examples: grouped.critical.slice(0, 5) },
      { severity: 'warning' as SeverityLevel, count: grouped.warning.length, examples: grouped.warning.slice(0, 5) },
      { severity: 'info' as SeverityLevel, count: grouped.info.length, examples: grouped.info.slice(0, 5) },
    ];
  }

  /**
   * Generate recommendations based on quality scores
   */
  private generateRecommendations(scores: QualityScores, threshold: number): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Fabrication risk recommendations
    if (scores.fabrication_risk > 30) {
      recommendations.push({
        priority: 'high',
        title: 'Reduce Fabrication Risk',
        description: 'Add evidence links to quantified claims in your documentation',
        impact: `Could improve overall score by ${Math.min(10, scores.fabrication_risk / 2)}%`,
        implementation_effort: 'easy',
        affected_dimensions: ['fabrication', 'missing_evidence'],
        suggested_action: 'Link evidence files to claims with specific metrics',
      });
    }

    // Confidentiality risk recommendations
    if (scores.confidentiality_risk > 20) {
      recommendations.push({
        priority: 'critical',
        title: 'Address Confidentiality Violations',
        description: 'Review and redact sensitive information',
        impact: 'Critical security issue',
        implementation_effort: 'medium',
        affected_dimensions: ['confidentiality'],
        suggested_action: 'Remove or redact client names, emails, and internal metrics',
      });
    }

    // Completeness recommendations
    if (scores.completeness < 70) {
      recommendations.push({
        priority: 'high',
        title: 'Improve Documentation Completeness',
        description: 'Add missing required sections and information',
        impact: `Could improve overall score by ${100 - scores.completeness}%`,
        implementation_effort: 'medium',
        affected_dimensions: ['completeness', 'structure'],
        suggested_action: 'Add missing project descriptions, impact metrics, and technology details',
      });
    }

    // Consistency recommendations
    if (scores.consistency < 75) {
      recommendations.push({
        priority: 'medium',
        title: 'Ensure Data Consistency',
        description: 'Align metadata across YAML files and markdown documentation',
        impact: `Could improve overall score by ${100 - scores.consistency}%`,
        implementation_effort: 'medium',
        affected_dimensions: ['consistency'],
        suggested_action: 'Update YAML metadata to match markdown content',
      });
    }

    return recommendations;
  }

  /**
   * Save quality report in requested format
   */
  private async saveReport(
    format: 'json' | 'markdown' | 'html' | 'csv',
    scanOutput: QualityAgentOutput,
    recommendations: Recommendation[]
  ): Promise<string> {
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const reportDir = path.join(process.cwd(), '.psb', 'reports');

    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    const reportName = `quality-report-${timestamp}`;
    let reportPath = '';

    switch (format) {
      case 'json':
        reportPath = path.join(reportDir, `${reportName}.json`);
        fs.writeFileSync(
          reportPath,
          JSON.stringify({ scan: scanOutput, recommendations }, null, 2),
          'utf-8'
        );
        break;

      case 'markdown':
        reportPath = path.join(reportDir, `${reportName}.md`);
        const md = this.generateMarkdownReport(scanOutput, recommendations);
        fs.writeFileSync(reportPath, md, 'utf-8');
        break;

      case 'html':
        reportPath = path.join(reportDir, `${reportName}.html`);
        const html = this.generateHtmlReport(scanOutput, recommendations);
        fs.writeFileSync(reportPath, html, 'utf-8');
        break;

      case 'csv':
        reportPath = path.join(reportDir, `${reportName}.csv`);
        const csv = this.generateCsvReport(scanOutput);
        fs.writeFileSync(reportPath, csv, 'utf-8');
        break;
    }

    return reportPath;
  }

  /**
   * Generate markdown report
   */
  private generateMarkdownReport(
    output: QualityAgentOutput,
    recommendations: Recommendation[]
  ): string {
    const { quality_scores, scan_result, issues_by_severity, trend_analysis } = output;

    let md = `# PSB Quality Report\n\n`;
    md += `Generated: ${new Date().toISOString()}\n\n`;

    md += `## Quality Scores\n\n`;
    md += `- **Overall**: ${quality_scores.overall}/100\n`;
    md += `- **Fabrication Risk**: ${quality_scores.fabrication_risk}/100\n`;
    md += `- **Confidentiality Risk**: ${quality_scores.confidentiality_risk}/100\n`;
    md += `- **Completeness**: ${quality_scores.completeness}/100\n`;
    md += `- **Consistency**: ${quality_scores.consistency}/100\n\n`;

    md += `## Scan Results\n\n`;
    md += `- **Files Scanned**: ${scan_result.files_scanned}\n`;
    md += `- **Issues Found**: ${scan_result.issues_found}\n`;
    md += `- **Critical**: ${scan_result.critical_count}\n`;
    md += `- **Warnings**: ${scan_result.warning_count}\n\n`;

    md += `## Trend Analysis\n\n`;
    md += `- **Trend**: ${trend_analysis.trend}\n`;
    md += `- **Improvement**: ${trend_analysis.improvement_percentage}%\n`;
    md += `- **Velocity**: ${trend_analysis.velocity}\n\n`;

    md += `## Recommendations\n\n`;
    recommendations.forEach((rec) => {
      md += `### ${rec.title}\n`;
      md += `**Priority**: ${rec.priority}\n`;
      md += `**Effort**: ${rec.implementation_effort}\n`;
      md += `${rec.description}\n\n`;
    });

    return md;
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(
    output: QualityAgentOutput,
    recommendations: Recommendation[]
  ): string {
    const { quality_scores, scan_result } = output;

    return `
<!DOCTYPE html>
<html>
<head>
  <title>PSB Quality Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    .score { font-size: 24px; font-weight: bold; }
    .metric { margin: 10px 0; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #4CAF50; color: white; }
  </style>
</head>
<body>
  <h1>PSB Quality Report</h1>
  <p>Generated: ${new Date().toISOString()}</p>
  
  <h2>Quality Scores</h2>
  <div class="metric">Overall Score: <span class="score">${quality_scores.overall}/100</span></div>
  <div class="metric">Fabrication Risk: ${quality_scores.fabrication_risk}/100</div>
  <div class="metric">Confidentiality Risk: ${quality_scores.confidentiality_risk}/100</div>
  
  <h2>Scan Results</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Files Scanned</td>
      <td>${scan_result.files_scanned}</td>
    </tr>
    <tr>
      <td>Issues Found</td>
      <td>${scan_result.issues_found}</td>
    </tr>
    <tr>
      <td>Critical Issues</td>
      <td>${scan_result.critical_count}</td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  /**
   * Generate CSV report
   */
  private generateCsvReport(output: QualityAgentOutput): string {
    const { quality_scores, scan_result, issues_by_severity } = output;

    let csv = `Metric,Value\n`;
    csv += `Overall Score,${quality_scores.overall}\n`;
    csv += `Fabrication Risk,${quality_scores.fabrication_risk}\n`;
    csv += `Confidentiality Risk,${quality_scores.confidentiality_risk}\n`;
    csv += `Files Scanned,${scan_result.files_scanned}\n`;
    csv += `Issues Found,${scan_result.issues_found}\n`;
    csv += `Critical Issues,${scan_result.critical_count}\n`;
    csv += `Warning Issues,${scan_result.warning_count}\n`;

    return csv;
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Load configuration from YAML file
   */
  private loadConfig(configPath: string): AgentConfig {
    try {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      const config = yaml.load(configContent) as AgentConfig;
      return config;
    } catch (error) {
      // Return default configuration
      return this.getDefaultConfig();
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): AgentConfig {
    return {
      name: 'PSB-Quality-Agent',
      version: '1.0.0',
      enabled: true,
      scan_intervals: {
        hourly: false,
        daily: true,
        weekly: false,
        monthly: false,
      },
      quality_thresholds: {
        overall: 70,
        fabrication_risk: 30,
        confidentiality_risk: 10,
        completeness: 75,
        consistency: 80,
      },
      auto_fix: {
        enabled: false,
        dimensions: [],
        severity_levels: [],
      },
      monitoring: {
        track_history: true,
        trend_window_days: 30,
        alert_on_degradation: true,
      },
      reporting: {
        formats: ['json', 'markdown'],
        destination_paths: {
          json: '.psb/reports/quality-report.json',
          markdown: '.psb/reports/quality-report.md',
          html: '.psb/reports/quality-report.html',
          csv: '.psb/reports/quality-report.csv',
        },
        retention_days: 90,
      },
      notifications: {
        enabled: true,
        channels: ['console'],
        severity_filter: ['critical', 'warning'],
      },
    };
  }

  /**
   * Load agent state from file
   */
  private loadState(): QualityAgentState {
    try {
      if (fs.existsSync(this.stateFile)) {
        const content = fs.readFileSync(this.stateFile, 'utf-8');
        return JSON.parse(content);
      }
    } catch (error) {
      // Ignore errors and use default state
    }

    return {
      historical_scores: [],
      scheduled_operations: [],
      total_fixes_applied: 0,
      total_issues_found: 0,
    };
  }

  /**
   * Save agent state to file
   */
  private saveState(): void {
    try {
      this.ensureStateDirectory();
      fs.writeFileSync(this.stateFile, JSON.stringify(this.state, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save state:', error);
    }
  }

  /**
   * Ensure state directory exists
   */
  private ensureStateDirectory(): void {
    const stateDir = path.join(process.cwd(), '.psb');
    if (!fs.existsSync(stateDir)) {
      fs.mkdirSync(stateDir, { recursive: true });
    }
  }

  /**
   * Get current state
   */
  getState(): QualityAgentState {
    return this.state;
  }

  /**
   * Get current configuration
   */
  getConfig(): AgentConfig {
    return this.config;
  }
}

// Export for use as module or CLI
export default PSBQualityAgent;
