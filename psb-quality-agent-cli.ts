#!/usr/bin/env ts-node
/**
 * PSB Quality Agent - Command Line Interface
 * 
 * Provides CLI access to quality agent operations:
 * - scan: Run immediate quality audit
 * - monitor: Start continuous monitoring
 * - report: Generate quality reports
 * - fix: Apply automatic fixes
 * - schedule: Manage scheduled operations
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import chalk from 'chalk';
import {
  PSBQualityAgent,
  QualityAgentInput,
  QualityAgentConfig,
  QualityAgentOutput,
  AgentSchedule
} from './psb-quality-agent-core';
import {
  QualityAgentScheduler
} from './psb-quality-agent-scheduler';

// ============================================================================
// CLI STATE AND CONFIGURATION
// ============================================================================

interface CLIContext {
  agent: PSBQualityAgent;
  scheduler: QualityAgentScheduler;
  config: QualityAgentConfig;
  configPath: string;
}

let context: CLIContext;

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize CLI context - load configuration and set up agent
 */
async function initializeContext(): Promise<CLIContext> {
  try {
    const configPath = path.join(process.cwd(), 'psb-quality-agent-config.yaml');
    
    // Load configuration
    let config: QualityAgentConfig;
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf-8');
      config = yaml.load(configContent) as QualityAgentConfig;
      console.log(chalk.green('✓ Configuration loaded from'), configPath);
    } else {
      config = loadDefaultConfig();
      console.log(chalk.yellow('⚠ Configuration file not found, using defaults'));
    }

    // Initialize agent
    const agent = new PSBQualityAgent(config);
    const scheduler = new QualityAgentScheduler();

    return { agent, scheduler, config, configPath };
  } catch (error) {
    console.error(chalk.red('✗ Failed to initialize context:'), error);
    process.exit(1);
  }
}

/**
 * Load default configuration if file doesn't exist
 */
function loadDefaultConfig(): QualityAgentConfig {
  return {
    enabled: true,
    scan_intervals: {
      hourly: false,
      daily: true,
      weekly: true,
      monthly: false
    },
    quality_thresholds: {
      overall: 70,
      fabrication_risk: 30,
      confidentiality_risk: 10,
      completeness: 75,
      consistency: 80,
      technology_alignment: 75,
      evidence_coverage: 70,
      link_validity: 85
    },
    auto_fix: {
      enabled: true,
      dimensions: ['completeness', 'consistency', 'structure', 'links'],
      severity_levels: ['info', 'warning'],
      dry_run_by_default: false
    },
    monitoring: {
      track_history: true,
      trend_window_days: 30,
      alert_on_degradation: true,
      degradation_threshold: 5
    },
    reporting: {
      formats: ['json', 'markdown', 'html'],
      destination_paths: {
        json: '.psb/reports/quality-reports.json',
        markdown: '.psb/reports/',
        html: '.psb/reports/',
        csv: '.psb/reports/'
      },
      retention_days: 90,
      include_details: true,
      max_issues_per_severity: 20
    },
    notifications: {
      enabled: true,
      channels: ['console']
    },
    logging: {
      level: 'info'
    }
  };
}

// ============================================================================
// COMMAND HANDLERS
// ============================================================================

/**
 * Handle 'scan' command - Run immediate quality scan
 */
async function handleScan(args: string[]): Promise<void> {
  console.log(chalk.blue('\n📊 PSB Quality Scan\n'));
  
  try {
    const input: QualityAgentInput = {
      operation: 'scan',
      scope: 'repository',
      target_path: args[0] || '.',
      quality_threshold: 70,
      report_format: 'markdown',
      auto_fix_enabled: false,
      schedule_interval: undefined
    };

    console.log(chalk.gray('Scanning:', input.target_path));
    console.log(chalk.gray('Quality threshold:', input.quality_threshold));
    console.log('');

    const result = await context.agent.execute(input);
    
    displayScanResults(result);
    
    if (result.report_path) {
      console.log(chalk.green('✓ Report saved to:'), result.report_path);
    }
  } catch (error) {
    console.error(chalk.red('✗ Scan failed:'), error);
    process.exit(1);
  }
}

/**
 * Handle 'monitor' command - Start continuous monitoring
 */
async function handleMonitor(args: string[]): Promise<void> {
  console.log(chalk.blue('\n🔍 PSB Quality Monitoring\n'));
  
  try {
    const interval = args[0] || 'daily';
    const durationMinutes = parseInt(args[1]) || 60;

    console.log(chalk.gray('Interval:', interval));
    console.log(chalk.gray('Duration:', durationMinutes, 'minutes'));
    console.log('');

    const input: QualityAgentInput = {
      operation: 'monitor',
      scope: 'repository',
      quality_threshold: 70,
      report_format: 'json',
      auto_fix_enabled: context.config.auto_fix.enabled,
      schedule_interval: interval as 'hourly' | 'daily' | 'weekly'
    };

    const startTime = Date.now();
    let isRunning = true;

    process.on('SIGINT', () => {
      console.log('\n' + chalk.yellow('⚠ Monitoring stopped by user'));
      isRunning = false;
    });

    while (isRunning && (Date.now() - startTime) < durationMinutes * 60 * 1000) {
      console.log(chalk.gray(new Date().toISOString()), 'Running quality check...');
      
      const result = await context.agent.execute(input);
      console.log(chalk.green('✓ Quality score:'), result.quality_scores.overall);
      
      if (result.notifications && result.notifications.length > 0) {
        displayNotifications(result.notifications);
      }

      // Wait before next iteration
      await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds
    }

    console.log(chalk.green('✓ Monitoring completed'));
  } catch (error) {
    console.error(chalk.red('✗ Monitoring failed:'), error);
    process.exit(1);
  }
}

/**
 * Handle 'report' command - Generate quality reports
 */
async function handleReport(args: string[]): Promise<void> {
  console.log(chalk.blue('\n📋 PSB Quality Report\n'));
  
  try {
    const format = args[0] || 'markdown';
    const outputPath = args[1];

    console.log(chalk.gray('Format:', format));
    if (outputPath) {
      console.log(chalk.gray('Output path:', outputPath));
    }
    console.log('');

    const input: QualityAgentInput = {
      operation: 'report',
      scope: 'repository',
      quality_threshold: 70,
      report_format: format as 'json' | 'markdown' | 'html' | 'csv',
      auto_fix_enabled: false
    };

    console.log(chalk.gray('Generating report...'));
    const result = await context.agent.execute(input);

    displayReportSummary(result);

    if (result.report_path) {
      console.log('\n' + chalk.green('✓ Report saved to:'), result.report_path);
    }
  } catch (error) {
    console.error(chalk.red('✗ Report generation failed:'), error);
    process.exit(1);
  }
}

/**
 * Handle 'fix' command - Apply automatic fixes
 */
async function handleFix(args: string[]): Promise<void> {
  console.log(chalk.blue('\n🔧 PSB Quality Auto-Fix\n'));
  
  try {
    const dryRun = args[0] === '--dry-run';

    console.log(chalk.gray('Auto-fix enabled:', context.config.auto_fix.enabled));
    console.log(chalk.gray('Dry run:', dryRun));
    console.log('');

    const input: QualityAgentInput = {
      operation: 'fix',
      scope: 'repository',
      quality_threshold: 70,
      report_format: 'json',
      auto_fix_enabled: true
    };

    console.log(chalk.gray('Scanning for fixable issues...'));
    const result = await context.agent.execute(input);

    if (result.fixes_applied) {
      console.log(chalk.green('✓ Fixes applied:'), result.fixes_applied.count);
      console.log(chalk.gray('Types:'), result.fixes_applied.types.join(', '));
    } else {
      console.log(chalk.yellow('⚠ No fixes were applied'));
    }

    displayScanResults(result);
  } catch (error) {
    console.error(chalk.red('✗ Auto-fix failed:'), error);
    process.exit(1);
  }
}

/**
 * Handle 'schedule' command - Manage scheduled operations
 */
async function handleSchedule(args: string[]): Promise<void> {
  console.log(chalk.blue('\n⏱️  PSB Quality Schedule\n'));
  
  try {
    const operation = args[0];

    switch (operation) {
      case 'list':
        await listSchedules();
        break;
      case 'create':
        await createSchedule(args.slice(1));
        break;
      case 'delete':
        await deleteSchedule(args[1]);
        break;
      case 'start':
        await startScheduler();
        break;
      case 'stop':
        await stopScheduler();
        break;
      default:
        console.log(chalk.yellow('⚠ Unknown schedule operation:'), operation);
        printScheduleHelp();
    }
  } catch (error) {
    console.error(chalk.red('✗ Schedule operation failed:'), error);
    process.exit(1);
  }
}

/**
 * List all active schedules
 */
async function listSchedules(): Promise<void> {
  const schedules = context.scheduler.getSchedules();
  
  if (schedules.length === 0) {
    console.log(chalk.yellow('⚠ No schedules configured'));
    return;
  }

  console.log(chalk.gray('Active Schedules:\n'));
  schedules.forEach((schedule, index) => {
    console.log(`${index + 1}. ${chalk.cyan(schedule.name)}`);
    console.log(`   ID: ${schedule.id}`);
    console.log(`   Interval: ${schedule.interval}`);
    console.log(`   Next run: ${schedule.next_run_at}`);
    console.log('');
  });
}

/**
 * Create a new schedule
 */
async function createSchedule(args: string[]): Promise<void> {
  const name = args[0] || 'Daily Quality Check';
  const interval = (args[1] || 'daily') as 'hourly' | 'daily' | 'weekly' | 'monthly';

  const schedule: AgentSchedule = {
    id: `schedule-${Date.now()}`,
    name,
    interval,
    enabled: true,
    operation: 'scan',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    next_run_at: new Date().toISOString(),
    last_run_at: undefined,
    run_count: 0
  };

  context.scheduler.createSchedule(schedule);
  console.log(chalk.green('✓ Schedule created:'), schedule.name);
  console.log(chalk.gray('  ID:'), schedule.id);
  console.log(chalk.gray('  Interval:'), interval);
}

/**
 * Delete a schedule
 */
async function deleteSchedule(scheduleId: string): Promise<void> {
  context.scheduler.deleteSchedule(scheduleId);
  console.log(chalk.green('✓ Schedule deleted:'), scheduleId);
}

/**
 * Start the scheduler
 */
async function startScheduler(): Promise<void> {
  context.scheduler.start();
  console.log(chalk.green('✓ Scheduler started'));
  console.log(chalk.gray('Press Ctrl+C to stop'));

  // Keep scheduler running
  await new Promise(() => {
    process.on('SIGINT', () => {
      console.log('\n' + chalk.yellow('⚠ Scheduler stopped'));
      context.scheduler.stop();
      process.exit(0);
    });
  });
}

/**
 * Stop the scheduler
 */
async function stopScheduler(): Promise<void> {
  context.scheduler.stop();
  console.log(chalk.green('✓ Scheduler stopped'));
}

// ============================================================================
// OUTPUT FORMATTING
// ============================================================================

/**
 * Display scan results in formatted output
 */
function displayScanResults(result: QualityAgentOutput): void {
  console.log(chalk.cyan('Scan Results:'));
  console.log('─'.repeat(50));
  console.log(`Files scanned:        ${result.scan_result.files_scanned}`);
  console.log(`Issues found:         ${result.scan_result.issues_found}`);
  console.log(`  Critical:           ${result.scan_result.critical_count}`);
  console.log(`  Warning:            ${result.scan_result.warning_count}`);
  console.log(`  Info:               ${result.scan_result.info_count}`);
  console.log('');
  
  console.log(chalk.cyan('Quality Scores:'));
  console.log('─'.repeat(50));
  console.log(`Overall:              ${formatScore(result.quality_scores.overall)}`);
  console.log(`Fabrication Risk:     ${formatScore(result.quality_scores.fabrication_risk, true)}`);
  console.log(`Confidentiality Risk: ${formatScore(result.quality_scores.confidentiality_risk, true)}`);
  console.log(`Completeness:         ${formatScore(result.quality_scores.completeness)}`);
  console.log(`Consistency:          ${formatScore(result.quality_scores.consistency)}`);
  console.log('');
  
  if (result.trend_analysis) {
    console.log(chalk.cyan('Trend Analysis:'));
    console.log('─'.repeat(50));
    console.log(`Trend:                ${result.trend_analysis.trend}`);
    console.log(`Improvement:          ${result.trend_analysis.improvement_percentage}%`);
    console.log(`Velocity:             ${result.trend_analysis.velocity}`);
    console.log('');
  }
}

/**
 * Display report summary
 */
function displayReportSummary(result: QualityAgentOutput): void {
  console.log(chalk.cyan('Report Summary:'));
  console.log('─'.repeat(50));
  console.log(`Files scanned:        ${result.scan_result.files_scanned}`);
  console.log(`Issues found:         ${result.scan_result.issues_found}`);
  console.log(`Overall quality:      ${formatScore(result.quality_scores.overall)}`);
  console.log('');
}

/**
 * Display notifications
 */
function displayNotifications(notifications: Array<{level: string, message: string}>): void {
  console.log('');
  notifications.forEach(notification => {
    const icon = notification.level === 'critical' ? '🚨' : notification.level === 'warning' ? '⚠️' : 'ℹ️';
    const color = notification.level === 'critical' ? chalk.red : notification.level === 'warning' ? chalk.yellow : chalk.blue;
    console.log(icon, color(notification.message));
  });
}

/**
 * Format quality score with color
 */
function formatScore(score: number, isRisk: boolean = false): string {
  const value = isRisk ? score : score;
  const threshold = isRisk ? 30 : 70;
  
  if (isRisk) {
    if (value <= 10) return chalk.green(`${value} ✓`);
    if (value <= 30) return chalk.yellow(`${value} ⚠`);
    return chalk.red(`${value} ✗`);
  } else {
    if (value >= 80) return chalk.green(`${value} ✓`);
    if (value >= 70) return chalk.yellow(`${value} ⚠`);
    return chalk.red(`${value} ✗`);
  }
}

// ============================================================================
// HELP AND USAGE
// ============================================================================

/**
 * Print main help message
 */
function printHelp(): void {
  console.log(chalk.blue.bold('\nPSB Quality Agent - CLI\n'));
  console.log(chalk.gray('Usage: psb-quality-agent <command> [options]\n'));
  
  console.log(chalk.cyan('Commands:\n'));
  
  console.log('  scan [path]');
  console.log('    Run immediate quality audit on repository');
  console.log('    Example: psb-quality-agent scan .\n');
  
  console.log('  monitor [interval] [duration]');
  console.log('    Start continuous monitoring (hourly, daily, weekly)');
  console.log('    Example: psb-quality-agent monitor daily 120\n');
  
  console.log('  report [format] [output]');
  console.log('    Generate quality report (json, markdown, html, csv)');
  console.log('    Example: psb-quality-agent report markdown report.md\n');
  
  console.log('  fix [--dry-run]');
  console.log('    Apply automatic fixes to issues');
  console.log('    Example: psb-quality-agent fix --dry-run\n');
  
  console.log('  schedule <operation> [args]');
  console.log('    Manage scheduled operations');
  console.log('    Example: psb-quality-agent schedule list\n');
  
  console.log(chalk.cyan('Schedule Operations:\n'));
  console.log('  list              List all active schedules');
  console.log('  create [name] [interval]');
  console.log('    Create new schedule (hourly, daily, weekly, monthly)');
  console.log('  delete <id>       Delete schedule by ID');
  console.log('  start             Start the scheduler');
  console.log('  stop              Stop the scheduler\n');
  
  console.log(chalk.cyan('Options:\n'));
  console.log('  -h, --help        Show this help message');
  console.log('  -v, --version     Show version number');
  console.log('  -c, --config      Path to config file\n');
}

/**
 * Print schedule help
 */
function printScheduleHelp(): void {
  console.log(chalk.gray('Usage: psb-quality-agent schedule <operation> [args]\n'));
  console.log('Operations:');
  console.log('  list              List active schedules');
  console.log('  create [name] [interval]');
  console.log('  delete <id>');
  console.log('  start');
  console.log('  stop');
}

/**
 * Print version
 */
function printVersion(): void {
  console.log('PSB Quality Agent v1.0.0');
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  // Initialize context
  context = await initializeContext();

  // Handle commands
  switch (command) {
    case 'scan':
      await handleScan(args.slice(1));
      break;
    case 'monitor':
      await handleMonitor(args.slice(1));
      break;
    case 'report':
      await handleReport(args.slice(1));
      break;
    case 'fix':
      await handleFix(args.slice(1));
      break;
    case 'schedule':
      await handleSchedule(args.slice(1));
      break;
    case '-h':
    case '--help':
    case 'help':
      printHelp();
      break;
    case '-v':
    case '--version':
    case 'version':
      printVersion();
      break;
    default:
      if (command) {
        console.log(chalk.red('✗ Unknown command:'), command);
      }
      printHelp();
  }
}

// Run main
main().catch(error => {
  console.error(chalk.red('✗ Fatal error:'), error);
  process.exit(1);
});

export default {
  handleScan,
  handleMonitor,
  handleReport,
  handleFix,
  handleSchedule,
  printHelp
};
