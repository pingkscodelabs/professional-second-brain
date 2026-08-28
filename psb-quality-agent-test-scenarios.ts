import { PSBQualityAgent } from './psb-quality-agent-core';
import { QualityAgentScheduler } from './psb-quality-agent-scheduler';
import { QualityReporter } from './psb-quality-agent-reporter';
import {
  QualityAgentInput,
  QualityAgentOutput,
  AgentConfig,
  QualityIssue,
  AutoFixAction
} from './psb-quality-agent-types';

/**
 * Test Scenarios for PSB Quality Agent
 * 
 * Comprehensive test scenarios covering:
 * - Basic operations (scan, monitor, report, fix)
 * - All quality dimensions (8 total)
 * - Scheduler functionality
 * - Error handling and edge cases
 * - Performance and scaling
 * - Integration with quality-checker-skill
 */

// ============================================================================
// TEST SCENARIO 1: BASIC SCAN OPERATION
// ============================================================================

const scenario1BasicScan = {
  name: 'Basic Repository Scan',
  description: 'Scan entire repository and generate quality report',
  input: {
    operation: 'scan',
    scope: 'repository',
    quality_threshold: 70,
    report_format: 'json',
    auto_fix_enabled: false
  },
  expectedOutcome: {
    files_scanned: 'greater_than_0',
    issues_found: 'any',
    quality_score: 'between_0_and_100',
    all_dimensions: 'present'
  },
  successCriteria: [
    '✅ At least 1 file scanned',
    '✅ All 8 quality dimensions reported',
    '✅ Overall quality score between 0-100',
    '✅ Issues categorized by severity'
  ]
};

// ============================================================================
// TEST SCENARIO 2: DIRECTORY SCAN WITH EXCLUSIONS
// ============================================================================

const scenario2DirectoryScan = {
  name: 'Targeted Directory Scan',
  description: 'Scan specific directory with exclusion patterns',
  input: {
    operation: 'scan',
    scope: 'directory',
    target_path: './docs',
    quality_threshold: 75,
    report_format: 'markdown',
    auto_fix_enabled: false
  },
  configuration: {
    exclude_patterns: [
      'node_modules/**',
      '.git/**',
      'dist/**',
      'build/**'
    ]
  },
  expectedOutcome: {
    scanned_directory: './docs',
    files_in_scope: 'markdown_and_text_files',
    excluded_directories: 'none'
  },
  successCriteria: [
    '✅ Only markdown files scanned',
    '✅ node_modules excluded',
    '✅ Report generated in markdown format',
    '✅ Directory-specific metrics available'
  ]
};

// ============================================================================
// TEST SCENARIO 3: MULTI-FORMAT REPORT GENERATION
// ============================================================================

const scenario3MultiFormatReports = {
  name: 'Multi-Format Report Generation',
  description: 'Generate reports in all supported formats',
  operations: [
    {
      format: 'json',
      expectedFile: '.psb/reports/quality-report-*.json',
      validation: 'Valid JSON with all metrics'
    },
    {
      format: 'markdown',
      expectedFile: '.psb/reports/quality-report-*.md',
      validation: 'GitHub-compatible markdown'
    },
    {
      format: 'html',
      expectedFile: '.psb/reports/quality-report-*.html',
      validation: 'Interactive dashboard with CSS'
    },
    {
      format: 'csv',
      expectedFile: '.psb/reports/quality-report-*.csv',
      validation: 'Spreadsheet-compatible CSV'
    }
  ],
  successCriteria: [
    '✅ All 4 formats generated successfully',
    '✅ Each format contains same data',
    '✅ File size reasonable (JSON < 1MB)',
    '✅ All metrics present in each format'
  ]
};

// ============================================================================
// TEST SCENARIO 4: QUALITY DIMENSION DETECTION
// ============================================================================

const scenario4QualityDimensions = {
  name: 'Quality Dimension Detection',
  description: 'Verify all 8 quality dimensions are properly detected',
  dimensions: [
    {
      name: 'Fabrication Risk',
      detection: 'Unsourced claims and assertions',
      testFile: 'docs/unsourced-claim.md',
      shouldDetect: true,
      expectedScore: 'less_than_50'
    },
    {
      name: 'Evidence Coverage',
      detection: 'Citations and supporting evidence',
      testFile: 'docs/well-sourced.md',
      shouldDetect: true,
      expectedScore: 'greater_than_70'
    },
    {
      name: 'Confidentiality Risk',
      detection: 'Exposed credentials and secrets',
      testFile: '.env.example',
      shouldDetect: true,
      expectedScore: 'low' // Low risk = high score in this context
    },
    {
      name: 'Completeness',
      detection: 'Missing sections or content',
      testFile: 'docs/setup.md',
      shouldDetect: true,
      expectedScore: 'varies'
    },
    {
      name: 'Consistency',
      detection: 'Conflicting information',
      testFiles: ['docs/guide-v1.md', 'docs/guide-v2.md'],
      shouldDetect: true,
      expectedScore: 'less_than_80'
    },
    {
      name: 'Technology Alignment',
      detection: 'Deprecated technology references',
      testFile: 'docs/tech-recommendations.md',
      shouldDetect: true,
      expectedScore: 'varies'
    },
    {
      name: 'Link Validity',
      detection: 'Broken or dead links',
      testFile: 'docs/references.md',
      shouldDetect: true,
      expectedScore: 'greater_than_75'
    },
    {
      name: 'Structure',
      detection: 'Document hierarchy and organization',
      testFile: 'docs/*.md',
      shouldDetect: true,
      expectedScore: 'greater_than_70'
    }
  ],
  successCriteria: [
    '✅ All 8 dimensions scored independently',
    '✅ Each dimension has 0-100 score',
    '✅ Appropriate issues detected for each dimension',
    '✅ No false positives or false negatives'
  ]
};

// ============================================================================
// TEST SCENARIO 5: AUTO-FIX WITH DRY-RUN
// ============================================================================

const scenario5AutoFixDryRun = {
  name: 'Auto-Fix Preview Mode',
  description: 'Preview fixes without modifying files',
  input: {
    operation: 'fix',
    scope: 'repository',
    quality_threshold: 70,
    report_format: 'json',
    auto_fix_enabled: true
  },
  configuration: {
    dry_run_by_default: true,
    severity_levels: ['info', 'warning']
  },
  expectedOutcome: {
    fixes_applied: 0,
    fixes_previewed: 'greater_than_0',
    files_modified: 0,
    status: 'preview_only'
  },
  successCriteria: [
    '✅ Fix previews shown to user',
    '✅ No files actually modified',
    '✅ Each fix shows: file, line, change type, before/after',
    '✅ User can review before applying'
  ],
  nextStep: 'User can run without --dry-run to apply fixes'
};

// ============================================================================
// TEST SCENARIO 6: AUTO-FIX APPLICATION
// ============================================================================

const scenario6AutoFixApply = {
  name: 'Auto-Fix Application',
  description: 'Apply automatic fixes to simple issues',
  fixableIssueTypes: [
    {
      type: 'formatting',
      example: 'Inconsistent heading hierarchy',
      fix: 'Standardize heading levels',
      severity: 'info'
    },
    {
      type: 'completeness',
      example: 'Missing summary section',
      fix: 'Add required section template',
      severity: 'warning'
    },
    {
      type: 'link_update',
      example: 'Updated link structure',
      fix: 'Update reference links',
      severity: 'info'
    },
    {
      type: 'text_replacement',
      example: 'Deprecated terminology',
      fix: 'Replace with current term',
      severity: 'warning'
    }
  ],
  notFixableIssueTypes: [
    'fabrication_risk (critical)',
    'confidentiality_violation (critical)',
    'evidence_gap (requires manual research)',
    'consistency_conflict (needs review)'
  ],
  successCriteria: [
    '✅ All fixable issues fixed automatically',
    '✅ Files saved with changes',
    '✅ Backup of originals created',
    '✅ Critical issues skipped (manual review needed)',
    '✅ Fix audit trail logged'
  ]
};

// ============================================================================
// TEST SCENARIO 7: SCHEDULER - DAILY SCANS
// ============================================================================

const scenario7SchedulerDaily = {
  name: 'Scheduler - Daily Quality Checks',
  description: 'Set up and verify daily automated scans',
  setup: [
    {
      command: 'psb-quality-agent schedule create "Daily Check" daily',
      expectedResult: 'Schedule created with ID'
    },
    {
      command: 'psb-quality-agent schedule list',
      expectedResult: 'Daily schedule listed, enabled'
    },
    {
      command: 'psb-quality-agent schedule start',
      expectedResult: 'Scheduler started'
    }
  ],
  expectedBehavior: {
    execution_time: '02:00 UTC daily',
    operation: 'scan',
    report_generation: 'automatic',
    notification: 'if_issues_found'
  },
  verificationSteps: [
    '✅ Schedule created successfully',
    '✅ Schedule persisted in .psb/schedules/',
    '✅ First execution within 24 hours',
    '✅ Report generated at scheduled time',
    '✅ Can update/delete schedule'
  ]
};

// ============================================================================
// TEST SCENARIO 8: SCHEDULER - WEEKLY REPORTS
// ============================================================================

const scenario8SchedulerWeekly = {
  name: 'Scheduler - Weekly Summary Reports',
  description: 'Generate comprehensive weekly reports',
  setup: [
    {
      command: 'psb-quality-agent schedule create "Weekly Report" weekly',
      expectedResult: 'Weekly schedule created'
    }
  ],
  expectedBehavior: {
    execution_time: 'Sunday 03:00 UTC weekly',
    operation: 'report',
    report_format: 'html',
    includes: 'trend_analysis'
  },
  reportContent: [
    'Summary metrics',
    'Quality score trends (7-day history)',
    'Issues by dimension',
    'Improvement suggestions',
    'Comparative analysis vs previous week'
  ],
  successCriteria: [
    '✅ Report generated every Sunday',
    '✅ 7 days of historical data included',
    '✅ Trend analysis calculated',
    '✅ Report emailed to team',
    '✅ Dashboard accessible online'
  ]
};

// ============================================================================
// TEST SCENARIO 9: NOTIFICATIONS - CRITICAL ISSUES
// ============================================================================

const scenario9CriticalNotifications = {
  name: 'Notifications - Critical Issue Alerts',
  description: 'Verify critical issues trigger immediate alerts',
  criticalIssueTypes: [
    {
      type: 'confidentiality_violation',
      trigger: 'API key or credential exposed',
      channels: ['console', 'github', 'slack'],
      priority: 'IMMEDIATE'
    },
    {
      type: 'severe_degradation',
      trigger: 'Quality drops > 15% from previous',
      channels: ['console', 'slack', 'email'],
      priority: 'URGENT'
    },
    {
      type: 'multiple_critical',
      trigger: '5+ critical issues found',
      channels: ['console', 'github', 'slack'],
      priority: 'URGENT'
    }
  ],
  notificationChannels: {
    console: 'Real-time CLI output with colors',
    github: 'GitHub issue creation (with auto-label)',
    slack: 'Webhook notification to team channel',
    email: 'Daily digest or critical summary'
  },
  successCriteria: [
    '✅ Critical issues notify immediately',
    '✅ GitHub issue created for confidentiality violations',
    '✅ Slack message includes actionable details',
    '✅ Console output visible to user',
    '✅ No duplicate notifications'
  ]
};

// ============================================================================
// TEST SCENARIO 10: ERROR RECOVERY
// ============================================================================

const scenario10ErrorRecovery = {
  name: 'Error Handling & Recovery',
  description: 'Verify agent handles errors gracefully',
  errorScenarios: [
    {
      scenario: 'Scan interrupted mid-operation',
      recovery: 'Resume from checkpoint',
      verification: 'State preserved, can resume'
    },
    {
      scenario: 'File becomes inaccessible during scan',
      recovery: 'Skip file, continue with others',
      verification: 'Partial results still valid'
    },
    {
      scenario: 'Report directory missing',
      recovery: 'Create directory automatically',
      verification: 'Report generated successfully'
    },
    {
      scenario: 'Configuration file invalid',
      recovery: 'Use defaults, log warning',
      verification: 'Agent continues with defaults'
    },
    {
      scenario: 'Quality checker skill missing',
      recovery: 'Degrade to basic checks',
      verification: 'Partial results with available checks'
    }
  ],
  successCriteria: [
    '✅ No crashes on errors',
    '✅ Clear error messages logged',
    '✅ Partial results preserved',
    '✅ State recoverable after failure',
    '✅ Graceful degradation supported'
  ]
};

// ============================================================================
// TEST SCENARIO 11: PERFORMANCE - LARGE REPOSITORY
// ============================================================================

const scenario11LargeRepoPerformance = {
  name: 'Performance - 100+ File Repository',
  description: 'Verify agent scales efficiently',
  testSetup: {
    files: 100,
    total_size: '50MB',
    file_types: ['md', 'txt', 'yaml', 'json'],
    directories: 20
  },
  performanceTargets: [
    {
      operation: 'scan',
      target_time: '60 seconds',
      max_memory: '500MB'
    },
    {
      operation: 'report_html',
      target_time: '2 seconds',
      max_memory: '200MB'
    },
    {
      operation: 'report_json',
      target_time: '1 second',
      max_memory: '150MB'
    }
  ],
  optimizations: [
    'Parallel file processing (4 workers)',
    'Incremental scanning (only changed files)',
    'Results caching (1 hour TTL)',
    'Batch issue processing (100 per batch)'
  ],
  successCriteria: [
    '✅ Scan completes within 60 seconds',
    '✅ Memory usage < 500MB',
    '✅ All files processed',
    '✅ No timeouts or hangs',
    '✅ Performance degrades gracefully'
  ]
};

// ============================================================================
// TEST SCENARIO 12: TREND ANALYSIS
// ============================================================================

const scenario12TrendAnalysis = {
  name: 'Trend Analysis & Metrics',
  description: 'Verify trend calculation and reporting',
  dataCollection: {
    period: '30 days',
    frequency: 'daily scans',
    metrics_tracked: [
      'overall_quality_score',
      'fabrication_risk',
      'evidence_coverage',
      'confidentiality_risk',
      'completeness',
      'consistency',
      'technology_alignment',
      'link_validity',
      'structure'
    ]
  },
  trendCalculation: {
    delta: 'Current - Previous score',
    improving: 'Delta > +2 points',
    stable: '-2 ≤ Delta ≤ +2 points',
    declining: 'Delta < -2 points'
  },
  velocityCalculation: {
    fast: '|Delta| > 5 points',
    moderate: '2 ≤ |Delta| ≤ 5',
    slow: '|Delta| < 2 points'
  },
  reportOutput: {
    trend: 'improving/stable/declining',
    improvement_percentage: 'positive or negative',
    velocity: 'fast/moderate/slow',
    historical_scores: 'last 30 data points'
  },
  successCriteria: [
    '✅ Trends calculated correctly',
    '✅ Velocity measured accurately',
    '✅ Historical data persisted',
    '✅ Trend visualization in HTML report',
    '✅ Projection of future quality'
  ]
};

// ============================================================================
// TEST SCENARIO 13: GITHUB INTEGRATION
// ============================================================================

const scenario13GitHubIntegration = {
  name: 'GitHub Integration',
  description: 'Verify GitHub issue creation and PR integration',
  features: [
    {
      feature: 'Create issues for critical problems',
      trigger: 'confidentiality_violation OR quality_drops > 15%',
      action: 'Create GitHub issue with labels',
      labels: ['quality', 'automated', 'critical']
    },
    {
      feature: 'Post PR comments',
      trigger: 'Detected issues in changed files',
      action: 'Comment on PR with findings',
      format: 'Markdown with severity badges'
    },
    {
      feature: 'Status check integration',
      trigger: 'Quality threshold not met',
      action: 'PR status check fails',
      can_override: 'yes (with --no-verify)'
    }
  ],
  configuration: {
    github_token: 'environment variable',
    repository: 'owner/repo',
    auto_create_issues: 'true',
    issue_template: 'quality-issue.md'
  },
  successCriteria: [
    '✅ GitHub issues created correctly',
    '✅ PR comments posted with findings',
    '✅ Status checks integrate with workflow',
    '✅ Labels applied to issues',
    '✅ Issues reference quality dimensions'
  ]
};

// ============================================================================
// TEST SCENARIO 14: SLACK INTEGRATION
// ============================================================================

const scenario14SlackIntegration = {
  name: 'Slack Integration',
  description: 'Verify Slack notifications and alerts',
  notifications: [
    {
      type: 'daily_summary',
      time: '08:00 UTC',
      content: 'Quality metrics, trend, key insights',
      channel: '#quality-monitoring'
    },
    {
      type: 'critical_alert',
      trigger: 'Critical issues detected',
      content: 'Issue type, severity, file location',
      channels: ['#quality-monitoring', '@oncall']
    },
    {
      type: 'weekly_report',
      time: 'Monday 09:00 UTC',
      content: 'Full dashboard link, 7-day trend',
      channel: '#quality-monitoring'
    }
  ],
  messageFormat: {
    header: 'Quality Alert 🚨',
    sections: [
      'Issue summary with severity',
      'Impact assessment',
      'Recommended action',
      'Link to dashboard'
    ]
  },
  configuration: {
    slack_webhook_url: 'environment variable',
    mention_on_critical: 'true',
    default_channel: '#quality-monitoring'
  },
  successCriteria: [
    '✅ Messages posted to correct channel',
    '✅ Formatting is clear and actionable',
    '✅ Critical issues mention team',
    '✅ Links to reports included',
    '✅ No duplicate messages'
  ]
};

// ============================================================================
// TEST SCENARIO 15: PRE-COMMIT HOOKS
// ============================================================================

const scenario15PreCommitHooks = {
  name: 'Pre-Commit Hook Integration',
  description: 'Verify quality checks run before commits',
  setup: [
    {
      command: 'psb-quality-agent install-hook',
      result: '.git/hooks/pre-commit created'
    }
  ],
  behavior: {
    when: 'Before every git commit',
    action: 'Run quality scan on changed files',
    threshold: 'Configurable per dimension',
    failure: 'Block commit with message'
  },
  configuration: {
    quality_thresholds: {
      min_overall_score: 70,
      max_critical_issues: 0,
      max_fabrication_risk: 30
    },
    bypass_allowed: 'yes (--no-verify flag)'
  },
  workflowExample: [
    '1. User runs: git commit -m "Update docs"',
    '2. Pre-commit hook triggers',
    '3. Quality agent scans changed files',
    '4. Score 65/100 < threshold 70',
    '5. Commit blocked with message',
    '6. User: npm run quality:fix && git add .',
    '7. User: git commit -m "Update docs"',
    '8. Quality passes, commit succeeds'
  ],
  successCriteria: [
    '✅ Hook installed in .git/hooks/',
    '✅ Runs on every commit attempt',
    '✅ Blocks commits below threshold',
    '✅ Allows --no-verify override',
    '✅ Clear error messages shown'
  ]
};

// Export all scenarios for testing framework
export const qualityAgentTestScenarios = {
  scenario1BasicScan,
  scenario2DirectoryScan,
  scenario3MultiFormatReports,
  scenario4QualityDimensions,
  scenario5AutoFixDryRun,
  scenario6AutoFixApply,
  scenario7SchedulerDaily,
  scenario8SchedulerWeekly,
  scenario9CriticalNotifications,
  scenario10ErrorRecovery,
  scenario11LargeRepoPerformance,
  scenario12TrendAnalysis,
  scenario13GitHubIntegration,
  scenario14SlackIntegration,
  scenario15PreCommitHooks
};

/**
 * Test Execution Guide:
 * 
 * 1. Unit Tests:
 *    npm test -- quality-agent.test.ts
 * 
 * 2. Integration Tests:
 *    npm test -- quality-agent-integration.test.ts
 * 
 * 3. Performance Tests:
 *    npm test -- quality-agent-performance.test.ts
 * 
 * 4. End-to-End Tests:
 *    npm run test:e2e
 * 
 * 5. All Tests:
 *    npm test
 * 
 * 6. With Coverage:
 *    npm test -- --coverage
 */
