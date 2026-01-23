import { AtpMembership, MembershipStatus } from '../types/membership';
import { AtpMembershipService } from './atp-membership-service';

export interface ValidationResult {
  isValid: boolean;
  status: MembershipStatus;
  expirationDate?: string;
  daysUntilExpiration?: number;
  requiresRenewal?: boolean;
  message?: string;
}

/**
 * Service for real-time membership status validation
 * Used during checkout and cart operations to ensure accurate benefit application
 */
export class MembershipStatusValidator {
  private membershipService: AtpMembershipService;

  constructor() {
    this.membershipService = new AtpMembershipService();
  }

  /**
   * Validate membership status in real-time
   * Requirement: 8.5 - Validate membership status in real-time before applying benefits
   */
  async validateMembershipStatus(customerId: string): Promise<ValidationResult> {
    try {
      const membership = await this.membershipService.getMembership(customerId);
      
      if (!membership) {
        return {
          isValid: false,
          status: 'expired',
          message: 'No membership found'
        };
      }

      const now = new Date();
      const expirationDate = new Date(membership.expirationDate);
      const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Check if membership has expired
      if (now > expirationDate) {
        return {
          isValid: false,
          status: 'expired',
          expirationDate: membership.expirationDate,
          daysUntilExpiration: 0,
          requiresRenewal: true,
          message: 'Membership has expired'
        };
      }

      // Check if membership is active
      if (membership.status === 'active') {
        return {
          isValid: true,
          status: 'active',
          expirationDate: membership.expirationDate,
          daysUntilExpiration,
          requiresRenewal: daysUntilExpiration <= 30,
          message: daysUntilExpiration <= 30 
            ? `Membership expires in ${daysUntilExpiration} days`
            : 'Membership is active'
        };
      }

      // Handle other statuses
      return {
        isValid: false,
        status: membership.status,
        expirationDate: membership.expirationDate,
        daysUntilExpiration,
        requiresRenewal: true,
        message: `Membership status: ${membership.status}`
      };

    } catch (error) {
      console.error('Error validating membership status:', error);
      return {
        isValid: false,
        status: 'expired',
        message: 'Error validating membership'
      };
    }
  }

  /**
   * Quick validation for cart operations
   */
  async isEligibleForBenefits(customerId: string): Promise<boolean> {
    const validation = await this.validateMembershipStatus(customerId);
    return validation.isValid;
  }

  /**
   * Validate and get discount percentage
   */
  async getDiscountPercentage(customerId: string): Promise<number> {
    const validation = await this.validateMembershipStatus(customerId);
    return validation.isValid ? 0.15 : 0; // 15% discount for active members
  }

  /**
   * Check if customer is eligible for free delivery
   */
  async isEligibleForFreeDelivery(customerId: string): Promise<boolean> {
    return await this.isEligibleForBenefits(customerId);
  }

  /**
   * Get membership validation with benefits summary
   */
  async validateWithBenefits(customerId: string): Promise<ValidationResult & {
    benefits: {
      serviceDiscount: number;
      freeDelivery: boolean;
      discountPercentage: string;
    };
  }> {
    const validation = await this.validateMembershipStatus(customerId);
    
    return {
      ...validation,
      benefits: {
        serviceDiscount: validation.isValid ? 0.15 : 0,
        freeDelivery: validation.isValid,
        discountPercentage: validation.isValid ? '15%' : '0%'
      }
    };
  }

  /**
   * Batch validate multiple customers (for admin operations)
   */
  async batchValidate(customerIds: string[]): Promise<Map<string, ValidationResult>> {
    const results = new Map<string, ValidationResult>();
    
    const validationPromises = customerIds.map(async (customerId) => {
      const result = await this.validateMembershipStatus(customerId);
      return { customerId, result };
    });

    const validations = await Promise.allSettled(validationPromises);
    
    validations.forEach((validation, index) => {
      const customerId = customerIds[index];
      if (validation.status === 'fulfilled') {
        results.set(customerId, validation.value.result);
      } else {
        results.set(customerId, {
          isValid: false,
          status: 'expired',
          message: 'Validation failed'
        });
      }
    });

    return results;
  }

  /**
   * Update expired memberships found during validation
   */
  async updateExpiredMembership(membership: AtpMembership): Promise<void> {
    try {
      const updatedMembership = {
        ...membership,
        status: 'expired' as MembershipStatus
      };

      // Update the membership status
      await this.membershipService.updateMembershipStatus(
        membership.id,
        'expired'
      );

      console.log(`Updated expired membership: ${membership.id}`);
    } catch (error) {
      console.error(`Error updating expired membership ${membership.id}:`, error);
    }
  }

  /**
   * Get validation summary for admin dashboard
   */
  async getValidationSummary(): Promise<{
    totalValidated: number;
    activeMembers: number;
    expiredMembers: number;
    expiringThisMonth: number;
    validationErrors: number;
  }> {
    // This would typically query all memberships and validate them
    // For now, return a placeholder summary
    return {
      totalValidated: 0,
      activeMembers: 0,
      expiredMembers: 0,
      expiringThisMonth: 0,
      validationErrors: 0
    };
  }
}