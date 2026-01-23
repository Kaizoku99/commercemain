import { MembershipLifecycleService } from './membership-lifecycle-service';

export interface SchedulerConfig {
  expirationCheckInterval: number; // in milliseconds
  reminderCheckInterval: number; // in milliseconds
  enableScheduler: boolean;
}

export class MembershipSchedulerService {
  private lifecycleService: MembershipLifecycleService;
  private config: SchedulerConfig;
  private expirationTimer: NodeJS.Timeout | null = null;
  private reminderTimer: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(config?: Partial<SchedulerConfig>) {
    this.lifecycleService = new MembershipLifecycleService();
    this.config = {
      expirationCheckInterval: 60 * 60 * 1000, // 1 hour
      reminderCheckInterval: 24 * 60 * 60 * 1000, // 24 hours
      enableScheduler: process.env.NODE_ENV === 'production',
      ...config
    };
  }

  /**
   * Start the automated scheduler
   */
  start(): void {
    if (this.isRunning) {
      console.log('Membership scheduler is already running');
      return;
    }

    if (!this.config.enableScheduler) {
      console.log('Membership scheduler is disabled');
      return;
    }

    console.log('Starting membership scheduler...');
    this.isRunning = true;

    // Start expiration check timer
    this.expirationTimer = setInterval(async () => {
      try {
        await this.runExpirationCheck();
      } catch (error) {
        console.error('Error in expiration check:', error);
      }
    }, this.config.expirationCheckInterval);

    // Start reminder check timer
    this.reminderTimer = setInterval(async () => {
      try {
        await this.runReminderCheck();
      } catch (error) {
        console.error('Error in reminder check:', error);
      }
    }, this.config.reminderCheckInterval);

    // Run initial checks
    this.runInitialChecks();

    console.log('Membership scheduler started successfully');
  }

  /**
   * Stop the automated scheduler
   */
  stop(): void {
    if (!this.isRunning) {
      console.log('Membership scheduler is not running');
      return;
    }

    console.log('Stopping membership scheduler...');

    if (this.expirationTimer) {
      clearInterval(this.expirationTimer);
      this.expirationTimer = null;
    }

    if (this.reminderTimer) {
      clearInterval(this.reminderTimer);
      this.reminderTimer = null;
    }

    this.isRunning = false;
    console.log('Membership scheduler stopped');
  }

  /**
   * Check if scheduler is running
   */
  isSchedulerRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Run expiration check process
   */
  private async runExpirationCheck(): Promise<void> {
    try {
      console.log('Running membership expiration check...');
      await this.lifecycleService.processExpiredMemberships();
      console.log('Expiration check completed');
    } catch (error) {
      console.error('Error in expiration check:', error);
      throw error;
    }
  }

  /**
   * Run reminder check process
   */
  private async runReminderCheck(): Promise<void> {
    try {
      console.log('Running membership reminder check...');
      await this.lifecycleService.processExpirationReminders();
      console.log('Reminder check completed');
    } catch (error) {
      console.error('Error in reminder check:', error);
      throw error;
    }
  }

  /**
   * Run initial checks when scheduler starts
   */
  private async runInitialChecks(): Promise<void> {
    try {
      console.log('Running initial membership checks...');
      
      // Run both checks initially
      await Promise.all([
        this.runExpirationCheck(),
        this.runReminderCheck()
      ]);
      
      console.log('Initial checks completed');
    } catch (error) {
      console.error('Error in initial checks:', error);
    }
  }

  /**
   * Manually trigger expiration check
   */
  async triggerExpirationCheck(): Promise<void> {
    await this.runExpirationCheck();
  }

  /**
   * Manually trigger reminder check
   */
  async triggerReminderCheck(): Promise<void> {
    await this.runReminderCheck();
  }

  /**
   * Run all lifecycle processes manually
   */
  async runAllProcesses(): Promise<void> {
    try {
      console.log('Running all membership lifecycle processes...');
      await this.lifecycleService.runLifecycleProcesses();
      console.log('All processes completed');
    } catch (error) {
      console.error('Error running all processes:', error);
      throw error;
    }
  }

  /**
   * Get scheduler status
   */
  getStatus(): {
    isRunning: boolean;
    config: SchedulerConfig;
    nextExpirationCheck: Date | null;
    nextReminderCheck: Date | null;
  } {
    const now = new Date();
    
    return {
      isRunning: this.isRunning,
      config: this.config,
      nextExpirationCheck: this.isRunning 
        ? new Date(now.getTime() + this.config.expirationCheckInterval)
        : null,
      nextReminderCheck: this.isRunning
        ? new Date(now.getTime() + this.config.reminderCheckInterval)
        : null
    };
  }

  /**
   * Update scheduler configuration
   */
  updateConfig(newConfig: Partial<SchedulerConfig>): void {
    const wasRunning = this.isRunning;
    
    if (wasRunning) {
      this.stop();
    }

    this.config = { ...this.config, ...newConfig };

    if (wasRunning && this.config.enableScheduler) {
      this.start();
    }

    console.log('Scheduler configuration updated:', this.config);
  }
}

// Global scheduler instance
let globalScheduler: MembershipSchedulerService | null = null;

/**
 * Get or create global scheduler instance
 */
export function getGlobalScheduler(): MembershipSchedulerService {
  if (!globalScheduler) {
    globalScheduler = new MembershipSchedulerService();
  }
  return globalScheduler;
}

/**
 * Initialize scheduler on application startup
 */
export function initializeScheduler(config?: Partial<SchedulerConfig>): void {
  const scheduler = getGlobalScheduler();
  
  if (config) {
    scheduler.updateConfig(config);
  }
  
  scheduler.start();
}

/**
 * Cleanup scheduler on application shutdown
 */
export function cleanupScheduler(): void {
  if (globalScheduler) {
    globalScheduler.stop();
    globalScheduler = null;
  }
}