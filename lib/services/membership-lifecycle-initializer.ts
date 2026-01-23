import { initializeScheduler } from './membership-scheduler-service';

/**
 * Initialize membership lifecycle management on application startup
 */
export function initializeMembershipLifecycle() {
  // Only initialize in production or when explicitly enabled
  const shouldInitialize = 
    process.env.NODE_ENV === 'production' || 
    process.env.ENABLE_MEMBERSHIP_SCHEDULER === 'true';

  if (shouldInitialize) {
    console.log('Initializing membership lifecycle management...');
    
    initializeScheduler({
      // Check for expired memberships every hour
      expirationCheckInterval: 60 * 60 * 1000,
      // Check for renewal reminders once per day
      reminderCheckInterval: 24 * 60 * 60 * 1000,
      enableScheduler: true
    });
    
    console.log('Membership lifecycle management initialized');
  } else {
    console.log('Membership lifecycle management disabled (development mode)');
  }
}

/**
 * Initialize lifecycle management if running on server side
 */
if (typeof window === 'undefined') {
  // Only run on server side
  initializeMembershipLifecycle();
}