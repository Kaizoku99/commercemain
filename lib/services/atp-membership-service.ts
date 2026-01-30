/**
 * ATP Membership Service
 * 
 * Core service class for managing ATP Group Services Membership operations
 * including creation, retrieval, renewal, cancellation, and discount calculations.
 */

import {
  AtpMembership,
  MembershipStatus,
  PaymentStatus,
  MembershipStats,
  CreateMembershipPayload,
  RenewMembershipPayload,
  UpdateMembershipPayload,
  MembershipResult,
  DiscountCalculation,
  ServiceDiscountInfo,
  MembershipValidation,
  EligibleService
} from '../types/membership';

import { 
  MembershipError, 
  MembershipErrorCode, 
  MembershipErrorFactory 
} from '../errors/membership-errors';

import { 
  membershipFallbackService,
  GracefulDegradationUtils 
} from './membership-fallback-service';

import {
  isMembershipActive,
  isMembershipExpired,
  isMembershipExpiringSoon
} from '../types/membership-utils';

import {
  MEMBERSHIP_CONFIG,
  ELIGIBLE_SERVICES,
  SERVICE_DISPLAY_NAMES,
  ERROR_MESSAGES
} from '../constants/membership';

import { ShopifyIntegrationService } from './shopify-integration-service';

export class AtpMembershipService {
  private static instance: AtpMembershipService;
  private shopifyService: ShopifyIntegrationService;
  
  constructor() {
    this.shopifyService = new ShopifyIntegrationService();
  }
  
  // Singleton pattern for service instance
  public static getInstance(): AtpMembershipService {
    if (!AtpMembershipService.instance) {
      AtpMembershipService.instance = new AtpMembershipService();
    }
    return AtpMembershipService.instance;
  }

  /**
   * Create a new ATP membership for a customer
   * Requirement 2.2: System shall create membership record with one-year expiration
   */
  async createMembership(payload: CreateMembershipPayload): Promise<MembershipResult<AtpMembership>> {
    try {
      return await membershipFallbackService.executeWithFallback(
        async (): Promise<MembershipResult<AtpMembership>> => {
          // Validate customer ID
          if (!payload.customerId || payload.customerId.trim() === '') {
            throw MembershipErrorFactory.validationError('customerId', payload.customerId, 'valid customer ID');
          }

          // Check if membership already exists
          const existingMembership = await this.getMembership(payload.customerId);
          if (existingMembership.success && existingMembership.data) {
            throw new MembershipError(
              'Customer already has an active membership',
              MembershipErrorCode.MEMBERSHIP_ALREADY_EXISTS,
              { context: { customerId: payload.customerId } }
            );
          }

          // Create new membership
          const now = new Date();
          const expirationDate = new Date(now);
          expirationDate.setMonth(expirationDate.getMonth() + MEMBERSHIP_CONFIG.MEMBERSHIP_DURATION_MONTHS);

          const membership: AtpMembership = {
            id: this.generateMembershipId(),
            customerId: payload.customerId,
            status: 'pending' as MembershipStatus,
            startDate: now.toISOString(),
            expirationDate: expirationDate.toISOString(),
            subscriptionId: payload.subscriptionId,
            paymentStatus: 'pending' as PaymentStatus,
            benefits: {
              serviceDiscount: MEMBERSHIP_CONFIG.SERVICE_DISCOUNT_PERCENTAGE,
              freeDelivery: MEMBERSHIP_CONFIG.FREE_DELIVERY,
              eligibleServices: [...ELIGIBLE_SERVICES],
              annualFee: MEMBERSHIP_CONFIG.ANNUAL_FEE
            },
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
          };

          // TODO: Store membership in Shopify Customer metafields (will be implemented in task 3)
          // For now, we'll return the created membership object
          
          return {
            success: true as const,
            data: membership
          };
        },
        undefined,
        'createMembership'
      );
    } catch (error) {
      return {
        success: false as const,
        error: error instanceof MembershipError ? error : MembershipErrorFactory.shopifyApiError(error instanceof Error ? error : new Error(String(error)))
      };
    }
  }

  /**
   * Retrieve membership for a customer
   * Requirement 2.2: System shall retrieve membership information
   */
  async getMembership(customerId: string): Promise<MembershipResult<AtpMembership | null>> {
    try {
      if (!customerId || customerId.trim() === '') {
        return {
          success: false,
          error: new MembershipError(
            ERROR_MESSAGES.INVALID_CUSTOMER,
            MembershipErrorCode.INVALID_CUSTOMER
          )
        };
      }

      // TODO: Retrieve from Shopify Customer metafields (will be implemented in task 3)
      // For now, return null to indicate no membership found
      
      return {
        success: true,
        data: null
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          'Failed to retrieve membership',
          MembershipErrorCode.SHOPIFY_API_ERROR,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Renew an existing membership
   * Requirement 6.1: System shall process renewal payment and extend membership
   */
  async renewMembership(payload: RenewMembershipPayload): Promise<MembershipResult<AtpMembership>> {
    try {
      // Get existing membership
      const existingResult = await this.getMembershipById(payload.membershipId);
      if (!existingResult.success || !existingResult.data) {
        return {
          success: false,
          error: new MembershipError(
            ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND,
            MembershipErrorCode.MEMBERSHIP_NOT_FOUND
          )
        };
      }

      const existingMembership = existingResult.data;
      
      // Calculate new expiration date
      const currentExpiration = new Date(existingMembership.expirationDate);
      const now = new Date();
      
      // If extending from current expiration or membership is still active, extend from expiration date
      // Otherwise, extend from current date
      const baseDate = payload.extendFromCurrentExpiration || currentExpiration > now 
        ? currentExpiration 
        : now;
      
      const newExpirationDate = new Date(baseDate);
      newExpirationDate.setMonth(newExpirationDate.getMonth() + MEMBERSHIP_CONFIG.MEMBERSHIP_DURATION_MONTHS);

      // Update membership
      const renewedMembership: AtpMembership = {
        ...existingMembership,
        status: 'active' as MembershipStatus,
        paymentStatus: 'pending' as PaymentStatus, // Will be updated after payment confirmation
        expirationDate: newExpirationDate.toISOString(),
        updatedAt: now.toISOString()
      };

      // TODO: Update in Shopify Customer metafields (will be implemented in task 3)
      
      return {
        success: true,
        data: renewedMembership
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          ERROR_MESSAGES.RENEWAL_FAILED,
          MembershipErrorCode.RENEWAL_FAILED,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Generate Shopify checkout URL for membership renewal
   * Requirement 6.2: System shall process renewal payment with Shopify checkout
   */
  async generateRenewalCheckoutUrl(membershipId: string): Promise<MembershipResult<string>> {
    try {
      // Get existing membership
      const existingResult = await this.getMembershipById(membershipId);
      if (!existingResult.success || !existingResult.data) {
        return {
          success: false,
          error: new MembershipError(
            ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND,
            MembershipErrorCode.MEMBERSHIP_NOT_FOUND
          )
        };
      }

      // TODO: Integrate with Shopify Checkout API to create renewal checkout
      // For now, return a placeholder URL
      const checkoutUrl = `/checkout/membership-renewal/${membershipId}`;
      
      return {
        success: true,
        data: checkoutUrl
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          'Failed to generate renewal checkout URL',
          MembershipErrorCode.SHOPIFY_API_ERROR,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Check if membership requires renewal reminder
   * Requirement 6.1: System shall display renewal notifications 30 days before expiration
   */
  shouldShowRenewalReminder(membership: AtpMembership): boolean {
    return isMembershipExpiringSoon(membership) || isMembershipExpired(membership);
  }

  /**
   * Get renewal reminder urgency level
   */
  getRenewalUrgency(membership: AtpMembership): 'none' | 'low' | 'medium' | 'high' | 'critical' {
    if (!this.shouldShowRenewalReminder(membership)) {
      return 'none';
    }

    const expirationDate = new Date(membership.expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiration < 0) return 'critical'; // Expired
    if (daysUntilExpiration <= 3) return 'high';
    if (daysUntilExpiration <= 7) return 'medium';
    if (daysUntilExpiration <= 14) return 'low';
    return 'low'; // 15-30 days
  }

  /**
   * Update membership status
   */
  async updateMembershipStatus(membershipId: string, status: MembershipStatus): Promise<MembershipResult<AtpMembership>> {
    try {
      // Get existing membership
      const existingResult = await this.getMembershipById(membershipId);
      if (!existingResult.success || !existingResult.data) {
        return {
          success: false,
          error: new MembershipError(
            'Membership not found',
            MembershipErrorCode.MEMBERSHIP_NOT_FOUND
          )
        };
      }

      const updatedMembership = {
        ...existingResult.data,
        status
      };

      // Update in Shopify
      const updateResult = await this.shopifyService.updateCustomerMetafields(
        existingResult.data.customerId,
        updatedMembership
      );

      if (!updateResult.success) {
        return {
          success: false as const,
          error: updateResult.error || new MembershipError(
            'Failed to update membership status',
            MembershipErrorCode.SHOPIFY_API_ERROR
          )
        };
      }

      return {
        success: true as const,
        data: updatedMembership
      };
    } catch (error) {
      return {
        success: false as const,
        error: new MembershipError(
          error instanceof Error ? error.message : 'Failed to update membership status',
          MembershipErrorCode.SHOPIFY_API_ERROR,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Cancel a membership
   * Requirement 6.1: System shall allow membership cancellation
   */
  async cancelMembership(membershipId: string): Promise<MembershipResult<AtpMembership>> {
    try {
      // Get existing membership
      const existingResult = await this.getMembershipById(membershipId);
      if (!existingResult.success || !existingResult.data) {
        return {
          success: false,
          error: new MembershipError(
            ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND,
            MembershipErrorCode.MEMBERSHIP_NOT_FOUND
          )
        };
      }

      const existingMembership = existingResult.data;
      
      // Update membership status to cancelled
      const cancelledMembership: AtpMembership = {
        ...existingMembership,
        status: 'cancelled' as MembershipStatus,
        updatedAt: new Date().toISOString()
      };

      // TODO: Update in Shopify Customer metafields (will be implemented in task 3)
      
      return {
        success: true,
        data: cancelledMembership
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          ERROR_MESSAGES.CANCELLATION_FAILED,
          MembershipErrorCode.CANCELLATION_FAILED,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Calculate service discount for a member
   * Requirement 4.1: System shall automatically apply 15% discount to premium services
   */
  calculateServiceDiscount(
    price: number, 
    membership: AtpMembership | null,
    serviceId?: string
  ): DiscountCalculation {
    // Default calculation with no discount
    const noDiscountResult: DiscountCalculation = {
      originalPrice: price,
      discountAmount: 0,
      discountPercentage: 0,
      finalPrice: price,
      savings: 0
    };

    // Check if membership exists and is active
    if (!membership || !isMembershipActive(membership)) {
      return noDiscountResult;
    }

    // Check if service is eligible for discount
    if (serviceId && !this.isServiceEligibleForDiscount(serviceId)) {
      return noDiscountResult;
    }

    // Calculate discount
    const discountPercentage = membership.benefits.serviceDiscount;
    const discountAmount = price * discountPercentage;
    const finalPrice = price - discountAmount;

    return {
      originalPrice: price,
      discountAmount,
      discountPercentage,
      finalPrice,
      savings: discountAmount
    };
  }

  /**
   * Check if member is eligible for free delivery
   * Requirement 5.1: System shall provide free delivery for active members
   */
  isEligibleForFreeDelivery(membership: AtpMembership | null): boolean {
    if (!membership || !isMembershipActive(membership)) {
      return false;
    }

    return membership.benefits.freeDelivery;
  }

  /**
   * Check if a service is eligible for membership discount
   * Requirement 4.1: System shall apply discount to eligible premium services
   */
  isServiceEligibleForDiscount(serviceId: string): boolean {
    return ELIGIBLE_SERVICES.includes(serviceId as EligibleService);
  }

  /**
   * Get detailed service discount information
   */
  getServiceDiscountInfo(
    serviceId: string,
    price: number,
    membership: AtpMembership | null
  ): ServiceDiscountInfo {
    const isEligible = this.isServiceEligibleForDiscount(serviceId);
    const discountCalculation = this.calculateServiceDiscount(price, membership, serviceId);
    
    return {
      serviceId,
      serviceName: SERVICE_DISPLAY_NAMES[serviceId as EligibleService] || serviceId,
      isEligible,
      discountPercentage: discountCalculation.discountPercentage,
      originalPrice: price,
      discountedPrice: discountCalculation.finalPrice
    };
  }

  /**
   * Validate membership status and eligibility
   */
  validateMembership(membership: AtpMembership | null): MembershipValidation {
    if (!membership) {
      return {
        isValid: false,
        isActive: false,
        isExpired: false,
        daysUntilExpiration: 0,
        requiresRenewal: false,
        errors: ['No membership found']
      };
    }

    const isActive = isMembershipActive(membership);
    const isExpired = isMembershipExpired(membership);
    const isExpiringSoon = isMembershipExpiringSoon(membership);
    
    const expirationDate = new Date(membership.expirationDate);
    const now = new Date();
    const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const errors: string[] = [];
    if (isExpired) {
      errors.push('Membership has expired');
    }
    if (membership.paymentStatus !== 'paid') {
      errors.push('Payment is not completed');
    }
    if (membership.status === 'cancelled') {
      errors.push('Membership has been cancelled');
    }

    return {
      isValid: isActive,
      isActive,
      isExpired,
      daysUntilExpiration: Math.max(0, daysUntilExpiration),
      requiresRenewal: isExpiringSoon || isExpired,
      errors
    };
  }

  /**
   * Get membership statistics for a customer
   * Requirement 3.4: System shall show total savings and usage statistics
   */
  async getMembershipStats(customerId: string): Promise<MembershipResult<MembershipStats>> {
    try {
      // TODO: Retrieve stats from Shopify Customer metafields (will be implemented in task 3)
      // For now, return default stats
      
      const defaultStats: MembershipStats = {
        totalSavings: 0,
        servicesUsed: 0,
        ordersWithFreeDelivery: 0,
        memberSince: new Date().toISOString(),
        averageOrderValue: 0,
        totalOrders: 0
      };

      return {
        success: true,
        data: defaultStats
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          'Failed to retrieve membership statistics',
          MembershipErrorCode.SHOPIFY_API_ERROR,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  /**
   * Update membership payment status after payment confirmation
   */
  async updatePaymentStatus(
    membershipId: string, 
    paymentStatus: PaymentStatus
  ): Promise<MembershipResult<AtpMembership>> {
    try {
      const existingResult = await this.getMembershipById(membershipId);
      if (!existingResult.success || !existingResult.data) {
        return {
          success: false,
          error: new MembershipError(
            ERROR_MESSAGES.MEMBERSHIP_NOT_FOUND,
            MembershipErrorCode.MEMBERSHIP_NOT_FOUND
          )
        };
      }

      const updatedMembership: AtpMembership = {
        ...existingResult.data,
        paymentStatus,
        status: paymentStatus === 'paid' ? 'active' : existingResult.data.status,
        updatedAt: new Date().toISOString()
      };

      // TODO: Update in Shopify Customer metafields (will be implemented in task 3)
      
      return {
        success: true,
        data: updatedMembership
      };

    } catch (error) {
      return {
        success: false,
        error: new MembershipError(
          'Failed to update payment status',
          MembershipErrorCode.VALIDATION_ERROR,
          { context: { originalError: error instanceof Error ? error.message : String(error) } }
        )
      };
    }
  }

  // Private helper methods

  private async getMembershipById(membershipId: string): Promise<MembershipResult<AtpMembership | null>> {
    // TODO: Implement retrieval by membership ID (will be implemented in task 3)
    // For now, return null
    return {
      success: true,
      data: null
    };
  }

  private generateMembershipId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `atp_mem_${timestamp}_${random}`;
  }
}

// Export singleton instance
export const atpMembershipService = AtpMembershipService.getInstance();