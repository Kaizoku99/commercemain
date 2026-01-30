import { AtpMembership, MembershipStatus } from '../types/membership';
import { AtpMembershipService } from './atp-membership-service';
import { ShopifyIntegrationService } from './shopify-integration-service';
import { MembershipNotificationService } from './membership-notification-service';

export interface LifecycleEvent {
  type: 'expiration' | 'renewal' | 'cancellation' | 'payment_failed';
  membershipId: string;
  customerId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class MembershipLifecycleService {
  private membershipService: AtpMembershipService;
  private shopifyService: ShopifyIntegrationService;
  private notificationService: MembershipNotificationService;

  constructor() {
    this.membershipService = new AtpMembershipService();
    this.shopifyService = new ShopifyIntegrationService();
    this.notificationService = new MembershipNotificationService();
  }

  /**
   * Process expired memberships and update their status
   */
  async processExpiredMemberships(): Promise<void> {
    try {
      const expiredMemberships = await this.findExpiredMemberships();
      
      for (const membership of expiredMemberships) {
        await this.handleMembershipExpiration(membership);
      }
    } catch (error) {
      console.error('Error processing expired memberships:', error);
      throw error;
    }
  }

  /**
   * Find memberships that have expired but haven't been processed
   */
  private async findExpiredMemberships(): Promise<AtpMembership[]> {
    // This would typically query a database, but we'll use Shopify customer search
    // In a real implementation, you'd want a proper database for this
    const now = new Date();
    const expiredMemberships: AtpMembership[] = [];

    // For now, we'll implement a basic check - in production this would be more efficient
    // You'd want to maintain a list of active memberships to check
    return expiredMemberships;
  }

  /**
   * Handle individual membership expiration
   */
  private async handleMembershipExpiration(membership: AtpMembership): Promise<void> {
    try {
      // Update membership status to expired
      const updatedMembership = {
        ...membership,
        status: 'expired' as MembershipStatus
      };

      // Update in Shopify
      await this.shopifyService.updateCustomerMembership(
        membership.customerId,
        updatedMembership
      );

      // Send expiration notification
      await this.notificationService.sendExpirationNotification(membership);

      // Log the lifecycle event
      await this.logLifecycleEvent({
        type: 'expiration',
        membershipId: membership.id,
        customerId: membership.customerId,
        timestamp: new Date()
      });

      console.log(`Processed expiration for membership ${membership.id}`);
    } catch (error) {
      console.error(`Error handling expiration for membership ${membership.id}:`, error);
      throw error;
    }
  }

  /**
   * Check for memberships nearing expiration and send reminders
   */
  async processExpirationReminders(): Promise<void> {
    try {
      const membershipsDueForReminder = await this.findMembershipsNearingExpiration();
      
      for (const membership of membershipsDueForReminder) {
        await this.notificationService.sendRenewalReminder(membership);
      }
    } catch (error) {
      console.error('Error processing expiration reminders:', error);
      throw error;
    }
  }

  /**
   * Find memberships that are within 30 days of expiration
   */
  private async findMembershipsNearingExpiration(): Promise<AtpMembership[]> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    // In a real implementation, this would query a database efficiently
    // For now, return empty array - would need proper database integration
    return [];
  }

  /**
   * Handle payment status updates from webhooks
   */
  async handlePaymentStatusUpdate(
    membershipId: string,
    paymentStatus: 'paid' | 'failed' | 'pending'
  ): Promise<void> {
    try {
      const result = await this.membershipService.getMembership(membershipId);
      if (!result.success || !result.data) {
        throw new Error(`Membership not found: ${membershipId}`);
      }

      const membership = result.data;
      const updatedMembership = {
        ...membership,
        paymentStatus
      };

      // Update membership with new payment status
      await this.shopifyService.updateCustomerMembership(
        membership.customerId,
        updatedMembership
      );

      // Handle specific payment status scenarios
      switch (paymentStatus) {
        case 'paid':
          await this.handleSuccessfulPayment(membership);
          break;
        case 'failed':
          await this.handleFailedPayment(membership);
          break;
        case 'pending':
          await this.handlePendingPayment(membership);
          break;
      }

      // Log the event
      await this.logLifecycleEvent({
        type: paymentStatus === 'failed' ? 'payment_failed' : 'renewal',
        membershipId: membership.id,
        customerId: membership.customerId,
        timestamp: new Date(),
        metadata: { paymentStatus }
      });

    } catch (error) {
      console.error(`Error handling payment status update for ${membershipId}:`, error);
      throw error;
    }
  }

  /**
   * Handle successful payment (renewal)
   */
  private async handleSuccessfulPayment(membership: AtpMembership): Promise<void> {
    // Extend membership by one year
    const newExpirationDate = new Date(membership.expirationDate);
    newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);

    const renewedMembership = {
      ...membership,
      status: 'active' as MembershipStatus,
      expirationDate: newExpirationDate.toISOString(),
      paymentStatus: 'paid' as const
    };

    await this.shopifyService.updateCustomerMembership(
      membership.customerId,
      renewedMembership
    );

    // Send renewal confirmation
    await this.notificationService.sendRenewalConfirmation(renewedMembership);
  }

  /**
   * Handle failed payment
   */
  private async handleFailedPayment(membership: AtpMembership): Promise<void> {
    // Send payment failure notification
    await this.notificationService.sendPaymentFailureNotification(membership);
    
    // If membership is expired and payment failed, keep it expired
    // If it's active but payment failed, might want to give grace period
  }

  /**
   * Handle pending payment
   */
  private async handlePendingPayment(membership: AtpMembership): Promise<void> {
    // Send pending payment notification if needed
    console.log(`Payment pending for membership ${membership.id}`);
  }

  /**
   * Log lifecycle events for audit and analytics
   */
  private async logLifecycleEvent(event: LifecycleEvent): Promise<void> {
    // In a real implementation, this would log to a database or analytics service
    console.log('Membership lifecycle event:', event);
    
    // Could also send to analytics service, logging service, etc.
  }

  /**
   * Run all automated lifecycle processes
   */
  async runLifecycleProcesses(): Promise<void> {
    try {
      console.log('Starting membership lifecycle processes...');
      
      // Process expired memberships
      await this.processExpiredMemberships();
      
      // Send expiration reminders
      await this.processExpirationReminders();
      
      console.log('Membership lifecycle processes completed');
    } catch (error) {
      console.error('Error running lifecycle processes:', error);
      throw error;
    }
  }
}