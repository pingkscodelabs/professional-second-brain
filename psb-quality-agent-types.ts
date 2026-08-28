/**
 * PSB Quality Agent - Type Definitions
 * Core types and interfaces for the autonomous quality monitoring agent
 */

// ============================================================================
// AGENT OPERATION TYPES
// ============================================================================

export type OperationType = 'scan' | 'monitor' | 'report' | 'fix' | 'schedule';
export type ScopeType = 'file' | 'directory' | 'repository';
export type ReportFormat = 'json' | 'markdown' | 'html' | 'csv';
export type ScheduleInterval = 'hourly' | 'daily' | 'weekly' | 'monthly';
export type TrendType = 'improving' | 'stable' | 'declining';
export type VelocityType = 'fast' | 'moderate' | 'slow';
export type SeverityLevel = 'critical' | 'warning' | 'info';

// ============================================================================
// AGENT INPUT/OUTPUT SPECIFICATION
// ============================================================================

export interface QualityAgentInput {
  operation: OperationType;
  scope: ScopeType;
  target_path?: string;
  quality_threshold: number; // 0-100
  report_format: ReportFormat;
  auto_fix_enabled: boolean;
  schedule_interval?: ScheduleInterval;
  dry_run?: boolean; // Preview fixes without applying
  verbose?: boolean;
}

export interface QualityAgentOutput {
  scan_result: ScanResult;
  quality_scores: QualityScores;
  trend_analysis: TrendAnalysis;
  issues_by_severity: IssueBySeverity[];
  fixes_applied?: FixesApplied;
  notifications?: Notification[];
  report_path?: string;
  execution_time_ms?: number;
  success: boolean;
  error_message?: string;
}

// ============================================================================
// SCAN RESULT
// ============================================================================

export interface ScanResult {
  files_scanned: number;
  files_failed: number;
  issues_found: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  scan_start_time: string;
  scan_end_time: string;
  files_analyzed: string[];
}

// ============================================================================
// QUALITY SCORES
// ============================================================================

export interface QualityScores {
  overall: number; // 0-100
  fabrication_risk: number; // 0-100 (lower is better)
  confidentiality_risk: number; // 0-100 (lower is better)
  completeness: number; // 0-100
  consistency: number; // 0-100
  technology_alignment: number; // 0-100
  evidence_coverage: number; // 0-100
  link_validity: number; // 0-100
  structure_compliance: number; // 0-100
}

// ============================================================================
// TREND ANALYSIS
// ============================================================================

export interface TrendAnalysis {
  trend: TrendType;
  improvement_percentage: number;
  velocity: VelocityType;
  historical_scores: HistoricalScore[];
  score_deltas: {
    fabrication_risk_delta: number;
    confidentiality_risk_delta: number;
    completeness_delta: number;
    consistency_delta: number;
  };
}

export interface HistoricalScore {
  timestamp: string;
  overall_score: number;
  dimension_scores: Partial<QualityScores>;
}

// ============================================================================
// ISSUES AND FIXES
// ============================================================================

export interface QualityIssue {
  id: string;
  type: IssueDimension;
  severity: SeverityLevel;
  file_path: string;
  location: string;
  message: string;
  suggestion: string;
  auto_fixable: boolean;
  fix_suggestion?: FixSuggestion;
}

export interface IssueBySeverity {
  severity: SeverityLevel;
  count: number;
  examples: QualityIssue[];
}

export interface FixSuggestion {
  action: 'replace' | 'add' | 'remove' | 'reformat';
  target: string;
  before?: string;
  after?: string;
  explanation: string;
}

export interface FixesApplied {
  count: number;
  types: string[];
  fixes: AppliedFix[];
}

export interface AppliedFix {
  file_path: string;
  issue_id: string;
  type: string;
  status: 'success' | 'failed' | 'skipped';
  error?: string;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  level: SeverityLevel;
  message: string;
  issue_count: number;
  issue_types: IssueDimension[];
  timestamp: string;
}

// ============================================================================
// QUALITY DIMENSIONS
// ============================================================================

export type IssueDimension =
  | 'fabrication'
  | 'missing_evidence'
  | 'confidentiality'
  | 'consistency'
  | 'structure'
  | 'links'
  | 'completeness'
  | 'technology_mismatch';

// ============================================================================
// AGENT CONFIGURATION
// ============================================================================

export interface AgentConfig {
  name: string;
  version: string;
  enabled: boolean;
  scan_intervals: {
    hourly: boolean;
    daily: boolean;
    weekly: boolean;
    monthly: boolean;
  };
  quality_thresholds: {
    overall: number;
    fabrication_risk: number;
    confidentiality_risk: number;
    completeness: number;
    consistency: number;
  };
  auto_fix: {
    enabled: boolean;
    dimensions: IssueDimension[];
    severity_levels: SeverityLevel[];
  };
  monitoring: {
    track_history: boolean;
    trend_window_days: number;
    alert_on_degradation: boolean;
  };
  reporting: {
    formats: ReportFormat[];
    destination_paths: Record<ReportFormat, string>;
    retention_days: number;
  };
  notifications: {
    enabled: boolean;
    channels: string[]; // 'email', 'slack', 'github', 'console'
    severity_filter: SeverityLevel[];
  };
}

// ============================================================================
// SCHEDULED OPERATION
// ============================================================================

export interface ScheduledOperation {
  id: string;
  name: string;
  operation: OperationType;
  schedule: {
    interval: ScheduleInterval;
    time?: string; // HH:mm format
    day_of_week?: number; // 0-6 for weekly
  };
  enabled: boolean;
  created_at: string;
  last_run?: string;
  next_run?: string;
}

// ============================================================================
// HISTORY AND STATE
// ============================================================================

export interface QualityAgentState {
  current_operation?: string;
  last_scan_time?: string;
  last_scan_result?: ScanResult;
  historical_scores: HistoricalScore[];
  scheduled_operations: ScheduledOperation[];
  total_fixes_applied: number;
  total_issues_found: number;
}

export interface QualityHistory {
  scan_id: string;
  timestamp: string;
  duration_ms: number;
  scan_result: ScanResult;
  quality_scores: QualityScores;
  issues: QualityIssue[];
  fixes: AppliedFix[];
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  implementation_effort: 'easy' | 'medium' | 'hard';
  affected_dimensions: IssueDimension[];
  suggested_action: string;
}

// ============================================================================
// REPORT STRUCTURES
// ============================================================================

export interface QualityReport {
  title: string;
  generated_at: string;
  scope: ScopeType;
  target_path: string;
  execution_summary: ScanResult;
  quality_scores: QualityScores;
  trend_analysis: TrendAnalysis;
  critical_issues: QualityIssue[];
  warning_issues: QualityIssue[];
  info_issues: QualityIssue[];
  recommendations: Recommendation[];
  fixes_applied: FixesApplied;
}

export interface DashboardData {
  current_scores: QualityScores;
  score_trend: HistoricalScore[];
  top_issues: QualityIssue[];
  recent_fixes: AppliedFix[];
  recommendations: Recommendation[];
  system_health: {
    agent_status: 'healthy' | 'warning' | 'critical';
    last_successful_scan: string;
    uptime_percentage: number;
  };
}

// ============================================================================
// AGENT EVENT TYPES
// ============================================================================

export interface AgentEvent {
  event_id: string;
  event_type:
    | 'scan_started'
    | 'scan_completed'
    | 'issue_detected'
    | 'fix_applied'
    | 'report_generated'
    | 'notification_sent'
    | 'error_occurred';
  timestamp: string;
  data: Record<string, any>;
  severity?: SeverityLevel;
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

export interface BatchScanRequest {
  id: string;
  name: string;
  targets: ScanTarget[];
  report_format: ReportFormat;
  auto_fix_enabled: boolean;
  created_at: string;
}

export interface ScanTarget {
  scope: ScopeType;
  path: string;
  quality_threshold: number;
}

export interface BatchScanResult {
  batch_id: string;
  status: 'completed' | 'failed' | 'partial';
  total_targets: number;
  successful_scans: number;
  failed_scans: number;
  results: QualityAgentOutput[];
  completed_at: string;
}
