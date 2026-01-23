import { NextRequest, NextResponse } from 'next/server';
import { getGlobalScheduler } from '../../../../../lib/services/membership-scheduler-service';
import { MembershipLifecycleService } from '../../../../../lib/services/membership-lifecycle-service';

/**
 * Handle POST requests to trigger lifecycle processes
 */
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    const scheduler = getGlobalScheduler();
    const lifecycleService = new MembershipLifecycleService();

    switch (action) {
      case 'run_expiration_check':
        await scheduler.triggerExpirationCheck();
        return NextResponse.json({ 
          success: true, 
          message: 'Expiration check completed' 
        });

      case 'run_reminder_check':
        await scheduler.triggerReminderCheck();
        return NextResponse.json({ 
          success: true, 
          message: 'Reminder check completed' 
        });

      case 'run_all_processes':
        await scheduler.runAllProcesses();
        return NextResponse.json({ 
          success: true, 
          message: 'All lifecycle processes completed' 
        });

      case 'start_scheduler':
        scheduler.start();
        return NextResponse.json({ 
          success: true, 
          message: 'Scheduler started' 
        });

      case 'stop_scheduler':
        scheduler.stop();
        return NextResponse.json({ 
          success: true, 
          message: 'Scheduler stopped' 
        });

      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid action' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in lifecycle API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

/**
 * Handle GET requests to get scheduler status
 */
export async function GET() {
  try {
    const scheduler = getGlobalScheduler();
    const status = scheduler.getStatus();

    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('Error getting scheduler status:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}