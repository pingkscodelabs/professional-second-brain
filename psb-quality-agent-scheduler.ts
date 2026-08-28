/**
 * PSB Quality Agent - Scheduler Module
 * Manages scheduled quality monitoring operations
 */

import * as fs from 'fs';
import * as path from 'path';

import {
  ScheduledOperation,
  ScheduleInterval,
  QualityAgentInput,
  QualityAgentOutput,
  OperationType,
  ScopeType,
} from './psb-quality-agent-types';

import PSBQualityAgent from './psb-quality-agent-core';

// ============================================================================
// SCHEDULER
// ============================================================================

export class QualityAgentScheduler {
  private agent: PSBQualityAgent;
  private schedulesFile: string;
  private schedules: Map<string, ScheduledOperation>;
  private timers: Map<string, NodeJS.Timeout>;
  private isRunning: boolean = false;

  constructor(agent: PSBQualityAgent) {
    this.agent = agent;
    this.schedulesFile = path.join(process.cwd(), '.psb', 'schedules.json');
    this.schedules = new Map();
    this.timers = new Map();
    this.loadSchedules();
  }

  // ============================================================================
  // SCHEDULE MANAGEMENT
  // ============================================================================

  /**
   * Create a new scheduled operation
   */
  createSchedule(
    name: string,
    operation: OperationType,
    interval: ScheduleInterval,
    config: Partial<QualityAgentInput> = {}
  ): ScheduledOperation {
    const schedule: ScheduledOperation = {
      id: this.generateId(),
      name,
      operation,
      schedule: {
        interval,
        time: config.schedule_interval ? '02:00' : undefined, // Default 2 AM
      },
      enabled: true,
      created_at: new Date().toISOString(),
      next_run: this.calculateNextRun(interval),
    };

    this.schedules.set(schedule.id, schedule);
    this.saveSchedules();

    return schedule;
  }

  /**
   * Get all schedules
   */
  getSchedules(): ScheduledOperation[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Get schedule by ID
   */
  getSchedule(id: string): ScheduledOperation | undefined {
    return this.schedules.get(id);
  }

  /**
   * Update schedule
   */
  updateSchedule(id: string, updates: Partial<ScheduledOperation>): ScheduledOperation | null {
    const schedule = this.schedules.get(id);
    if (!schedule) return null;

    Object.assign(schedule, updates);
    this.saveSchedules();

    return schedule;
  }

  /**
   * Delete schedule
   */
  deleteSchedule(id: string): boolean {
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id)!);
      this.timers.delete(id);
    }

    const deleted = this.schedules.delete(id);
    if (deleted) {
      this.saveSchedules();
    }

    return deleted;
  }

  /**
   * Enable all schedules and start monitoring
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    console.log('Quality Agent Scheduler started');

    // Start monitoring for each enabled schedule
    for (const [id, schedule] of this.schedules.entries()) {
      if (schedule.enabled) {
        this.scheduleOperation(id, schedule);
      }
    }
  }

  /**
   * Stop all scheduled operations
   */
  stop(): void {
    this.isRunning = false;

    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();

    console.log('Quality Agent Scheduler stopped');
  }

  /**
   * Manually trigger a scheduled operation
   */
  async executeSchedule(id: string): Promise<QualityAgentOutput> {
    const schedule = this.schedules.get(id);
    if (!schedule) {
      throw new Error(`Schedule ${id} not found`);
    }

    const input: QualityAgentInput = {
      operation: schedule.operation,
      scope: 'repository',
      quality_threshold: 70,
      report_format: 'json',
      auto_fix_enabled: false,
    };

    const result = await this.agent.execute(input);

    // Update schedule with last run time
    schedule.last_run = new Date().toISOString();
    schedule.next_run = this.calculateNextRun(schedule.schedule.interval);
    this.saveSchedules();

    // Reschedule if enabled
    if (schedule.enabled && this.isRunning) {
      this.scheduleOperation(id, schedule);
    }

    return result;
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    is_running: boolean;
    active_schedules: number;
    next_execution: string | null;
  } {
    let nextExecution: string | null = null;

    for (const schedule of this.schedules.values()) {
      if (schedule.enabled && schedule.next_run) {
        if (!nextExecution || schedule.next_run < nextExecution) {
          nextExecution = schedule.next_run;
        }
      }
    }

    return {
      is_running: this.isRunning,
      active_schedules: Array.from(this.schedules.values()).filter((s) => s.enabled).length,
      next_execution: nextExecution,
    };
  }

  // ============================================================================
  // PRIVATE METHODS
  // ============================================================================

  /**
   * Schedule an operation for execution
   */
  private scheduleOperation(id: string, schedule: ScheduledOperation): void {
    // Clear existing timer if any
    if (this.timers.has(id)) {
      clearTimeout(this.timers.get(id)!);
    }

    const nextRun = new Date(schedule.next_run || new Date());
    const now = new Date();
    let delayMs = nextRun.getTime() - now.getTime();

    // If next run is in the past, schedule for next interval
    if (delayMs < 0) {
      const newNextRun = this.calculateNextRun(schedule.schedule.interval);
      delayMs = new Date(newNextRun).getTime() - now.getTime();
    }

    // Minimum 1 second delay
    delayMs = Math.max(1000, delayMs);

    const timer = setTimeout(async () => {
      if (!schedule.enabled) return;

      try {
        await this.executeSchedule(id);
      } catch (error) {
        console.error(`Error executing schedule ${id}:`, error);
      }
    }, delayMs);

    this.timers.set(id, timer);
  }

  /**
   * Calculate next run time
   */
  private calculateNextRun(interval: ScheduleInterval): string {
    const now = new Date();
    let nextRun = new Date(now);

    switch (interval) {
      case 'hourly':
        nextRun.setHours(nextRun.getHours() + 1);
        nextRun.setMinutes(0);
        nextRun.setSeconds(0);
        break;

      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1);
        nextRun.setHours(2, 0, 0, 0); // 2 AM
        break;

      case 'weekly':
        nextRun.setDate(nextRun.getDate() + (7 - nextRun.getDay())); // Next Sunday
        nextRun.setHours(2, 0, 0, 0);
        break;

      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1);
        nextRun.setDate(1);
        nextRun.setHours(2, 0, 0, 0);
        break;
    }

    return nextRun.toISOString();
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `schedule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Load schedules from file
   */
  private loadSchedules(): void {
    try {
      if (fs.existsSync(this.schedulesFile)) {
        const content = fs.readFileSync(this.schedulesFile, 'utf-8');
        const data = JSON.parse(content);

        if (Array.isArray(data)) {
          data.forEach((schedule) => {
            this.schedules.set(schedule.id, schedule);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load schedules:', error);
    }
  }

  /**
   * Save schedules to file
   */
  private saveSchedules(): void {
    try {
      const schedulesDir = path.dirname(this.schedulesFile);
      if (!fs.existsSync(schedulesDir)) {
        fs.mkdirSync(schedulesDir, { recursive: true });
      }

      const data = Array.from(this.schedules.values());
      fs.writeFileSync(this.schedulesFile, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Failed to save schedules:', error);
    }
  }
}

// Export for use
export default QualityAgentScheduler;
