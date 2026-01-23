import { MembershipLifecycleService } from './membership-lifecycle-service';

/**
 * Cron service for membership lifecycle management
 * This can be used with external cron job systems or serverless functions
 */
export class MembershipCronService {
  private lifecycleService: MembershipLifecycleService;

  constructor() {
    this.lifecycleService = new MembershipLifecycleService();
  }

  /**
   * Daily cron job - runs expiration checks and reminders
   */
  async runDailyCron(): Promise<{ success: boolean; message: string; errors?: string[] }> {
    const errors: string[] = [];
    let success = true;

    try {
      console.log('Starting daily membership cron job...');

      // Process expired memberships
      try {
        await this.lifecycleService.processExpiredMemberships();
        console.log('✓ Processed expired memberships');
      } catch (error) {
        const errorMsg = `Failed to process expired memberships: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        success = false;
      }

      // Send renewal reminders
      try {
        await this.lifecycleService.processExpirationReminders();
        console.log('✓ Sent renewal reminders');
      } catch (error) {
        const errorMsg = `Failed to send renewal reminders: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        success = false;
      }

      const message = success 
        ? 'Daily cron job completed successfully'
        : 'Daily cron job completed with errors';

      console.log(message);
      return { success, message, errors: errors.length > 0 ? errors : undefined };

    } catch (error) {
      const errorMsg = `Daily cron job failed: ${error}`;
      console.error(errorMsg);
      return { success: false, message: errorMsg, errors: [errorMsg] };
    }
  }

  /**
   * Hourly cron job - runs quick expiration checks
   */
  async runHourlyCron(): Promise<{ success: boolean; message: string; errors?: string[] }> {
    try {
      console.log('Starting hourly membership cron job...');
      
      await this.lifecycleService.processExpiredMemberships();
      
      const message = 'Hourly cron job completed successfully';
      console.log(message);
      return { success: true, message };

    } catch (error) {
      const errorMsg = `Hourly cron job failed: ${error}`;
      console.error(errorMsg);
      return { success: false, message: errorMsg, errors: [errorMsg] };
    }
  }

  /**
   * Weekly cron job - runs comprehensive maintenance
   */
  async runWeeklyCron(): Promise<{ success: boolean; message: string; errors?: string[] }> {
    const errors: string[] = [];
    let success = true;

    try {
      console.log('Starting weekly membership cron job...');

      // Run all lifecycle processes
      try {
        await this.lifecycleService.runLifecycleProcesses();
        console.log('✓ Completed all lifecycle processes');
      } catch (error) {
        const errorMsg = `Failed to run lifecycle processes: ${error}`;
        console.error(errorMsg);
        errors.push(errorMsg);
        success = false;
      }

      // Additional weekly maintenance could go here
      // - Cleanup old logs
      // - Generate weekly reports
      // - Update analytics

      const message = success 
        ? 'Weekly cron job completed successfully'
        : 'Weekly cron job completed with errors';

      console.log(message);
      return { success, message, errors: errors.length > 0 ? errors : undefined };

    } catch (error) {
      const errorMsg = `Weekly cron job failed: ${error}`;
      console.error(errorMsg);
      return { success: false, message: errorMsg, errors: [errorMsg] };
    }
  }
}

/**
 * API endpoint handlers for cron jobs
 */
export const cronHandlers = {
  daily: async () => {
    const cronService = new MembershipCronService();
    return await cronService.runDailyCron();
  },

  hourly: async () => {
    const cronService = new MembershipCronService();
    return await cronService.runHourlyCron();
  },

  weekly: async () => {
    const cronService = new MembershipCronService();
    return await cronService.runWeeklyCron();
  }
};