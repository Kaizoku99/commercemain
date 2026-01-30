/**
 * Membership Extension Service
 * 
 * Handles membership extension logic after successful renewal payment
 * Requirements: 6.3, 6.4 - Handle membership extension logic after successful renewal
 */

import {
  AtpMembership,
  MembershipStatus,
  PaymentStatus,
  MembershipError,
  MembershipErrorCode,
  MembershipResult
} from '../types/membership';
import { MEMBERSHIP_CONFIG } from '../constants/membership';

export class MembershipExtensionService {
  private static instance: MembershipExtensionService;

  public static getInstance(): MembershipExtensionService {
    if (!MembershipExtensionService.instance) {
      MembershipExtensionService.instance = new MembershipExtensionService();
    }
    return MembershipExtensionService.instance;
  }

  /**
   * Extend membership after successful payment
   * Requirement 6.3: Handle membership extension logic after successful renewal
   */
  async extendMembership(
    membership: AtpMembership,
    paymentConfirmed: boolean = true
  ): Promise<MembershipResult<AtpMembership>> {
    try {
      if (!paymentConfirmed) {
        return {
          success: false,
          error: new MembershipError(
            'Payment must be confirmed before extending membership',
            MembershipErrorCode.PAYMENT_REQUIRED
          )
        };
      }

      // Calculate new expiration date
      const currentExpiration = new Date(membership.expirationDate);
      const now = new Date();
      
      // If membership is still active, extend from current expiration
      // If expired, extend from current date
      const baseDate = currentExpiration > now ? currentExpiration : now;
      const newExpirationDate = new Date(baseDate);
      newExpirationDate.setMonth(newExpirationDate.getMonth() + MEMBERSHIP_CONFIG.MEMBERSHIP_DURATION_MONTHS);

      // Create extended membership
      const extendedMembership: AtpMembership = {
        ...membership,
        status: 'active' as MembershipStatus,
        paymentStatus: 'paid' as PaymentStatus,
        expirationDate: newExpirationDate.toISOString(),
        updatedAt: new Date().toISOString()
      };

      return {
        success: true,
        data: extendedMembership
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          'Failed to extend membership',
          MembershipErrorCode.RENEWAL_FAILED,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Process renewal payment confirmation
   * Requirement 6.4: Send renewal confirmation after successful payment
   */
  async processRenewalConfirmation(
    membershipId: string,
    paymentDetails: {
      transactionId: string;
      amount: number;
      currency: string;
      paymentMethod: string;
    }
  ): Promise<MembershipResult<{
    membership: AtpMembership;
    confirmationSent: boolean;
  }>> {
    try {
      // Validate payment details
      if (paymentDetails.amount !== MEMBERSHIP_CONFIG.ANNUAL_FEE) {
        return {
          success: false,
          error: new MembershipError(
            `Invalid payment amount. Expected ${MEMBERSHIP_CONFIG.ANNUAL_FEE}, received ${paymentDetails.amount}`,
            MembershipErrorCode.PAYMENT_FAILED
          )
        };
      }

      // TODO: Retrieve membership from storage (will be implemented in Shopify integration)
      // For now, create a mock membership for demonstration
      const mockMembership: AtpMembership = {
        id: membershipId,
        customerId: 'customer_123',
        status: 'expired',
        startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        expirationDate: new Date(Date.now() - 1).toISOString(),
        paymentStatus: 'pending',
        benefits: {
          serviceDiscount: MEMBERSHIP_CONFIG.SERVICE_DISCOUNT_PERCENTAGE,
          freeDelivery: MEMBERSHIP_CONFIG.FREE_DELIVERY,
          eligibleServices: [],
          annualFee: MEMBERSHIP_CONFIG.ANNUAL_FEE
        },
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Extend the membership
      const extensionResult = await this.extendMembership(mockMembership, true);
      
      if (!extensionResult.success) {
        return {
          success: false,
          error: extensionResult.error
        };
      }

      // Send confirmation (placeholder implementation)
      const confirmationSent = await this.sendRenewalConfirmation(
        extensionResult.data,
        paymentDetails
      );

      return {
        success: true,
        data: {
          membership: extensionResult.data,
          confirmationSent
        }
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          'Failed to process renewal confirmation',
          MembershipErrorCode.RENEWAL_FAILED,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Send renewal confirmation email/notification
   * Requirement 6.4: Send renewal confirmation after successful payment
   */
  private async sendRenewalConfirmation(
    membership: AtpMembership,
    paymentDetails: {
      transactionId: string;
      amount: number;
      currency: string;
      paymentMethod: string;
    }
  ): Promise<boolean> {
    try {
      // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
      // For now, just log the confirmation details
      
      const confirmationData = {
        membershipId: membership.id,
        customerId: membership.customerId,
        newExpirationDate: membership.expirationDate,
        paymentAmount: paymentDetails.amount,
        transactionId: paymentDetails.transactionId,
        renewalDate: new Date().toISOString()
      };

      console.log('Renewal confirmation sent:', confirmationData);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return true;

    } catch (error) {
      console.error('Failed to send renewal confirmation:', error);
      return false;
    }
  }

  /**
   * Calculate renewal pricing with any applicable discounts
   */
  calculateRenewalPricing(membership: AtpMembership): {
    basePrice: number;
    discount: number;
    finalPrice: number;
    currency: string;
  } {
    const basePrice = MEMBERSHIP_CONFIG.ANNUAL_FEE;
    let discount = 0;

    // Apply early renewal discount (5% if renewing 60+ days before expiration)
    const expirationDate = new Date(membership.expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration >= 60) {
      discount = basePrice * 0.05; // 5% early renewal discount
    }

    return {
      basePrice,
      discount,
      finalPrice: basePrice - discount,
      currency: 'AED'
    };
  }

  /**
   * Validate renewal eligibility
   */
  validateRenewalEligibility(membership: AtpMembership): {
    eligible: boolean;
    reason?: string;
    canRenewEarly: boolean;
  } {
    // Check if membership is cancelled
    if (membership.status === 'cancelled') {
      return {
        eligible: false,
        reason: 'Cancelled memberships cannot be renewed',
        canRenewEarly: false
      };
    }

    // Check if there are pending payments
    if (membership.paymentStatus === 'failed') {
      return {
        eligible: false,
        reason: 'Previous payment failed. Please resolve payment issues first',
        canRenewEarly: false
      };
    }

    const expirationDate = new Date(membership.expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    // Allow early renewal up to 90 days before expiration
    const canRenewEarly = daysUntilExpiration <= 90 && daysUntilExpiration > 0;

    // Allow renewal if expired or expiring within 90 days
    const eligible = daysUntilExpiration <= 90;

    return {
      eligible,
      reason: eligible ? undefined : 'Renewal not available yet. You can renew up to 90 days before expiration',
      canRenewEarly
    };
  }

  /**
   * Generate renewal summary for display
   */
  generateRenewalSummary(membership: AtpMembership): {
    currentExpiration: string;
    newExpiration: string;
    extensionPeriod: string;
    pricing: { basePrice: number; discount: number; finalPrice: number; currency: string };
    eligibility: { eligible: boolean; reason?: string; canRenewEarly: boolean };
  } {
    const currentExpiration = new Date(membership.expirationDate);
    const now = new Date();
    
    // Calculate new expiration date
    const baseDate = currentExpiration > now ? currentExpiration : now;
    const newExpiration = new Date(baseDate);
    newExpiration.setMonth(newExpiration.getMonth() + MEMBERSHIP_CONFIG.MEMBERSHIP_DURATION_MONTHS);

    return {
      currentExpiration: currentExpiration.toISOString(),
      newExpiration: newExpiration.toISOString(),
      extensionPeriod: `${MEMBERSHIP_CONFIG.MEMBERSHIP_DURATION_MONTHS} months`,
      pricing: this.calculateRenewalPricing(membership),
      eligibility: this.validateRenewalEligibility(membership)
    };
  }
}

// Export singleton instance
export const membershipExtensionService = MembershipExtensionService.getInstance();