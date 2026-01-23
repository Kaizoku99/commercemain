/**
 * ATP Membership Service Unit Tests
 * 
 * Comprehensive unit tests for the AtpMembershipService class
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AtpMembershipService } from '../../lib/services/atp-membership-service';
import {
  AtpMembership,
  MembershipStatus,
  PaymentStatus,
  CreateMembershipPayload,
  RenewMembershipPayload,
  MembershipErrorCode,
  EligibleService
} from '../../lib/types/membership';
import { MEMBERSHIP_CONFIG, ELIGIBLE_SERVICES } from '../../lib/constants/membership';

describe('AtpMembershipService', () => {
  let service: AtpMembershipService;
  let mockMembership: AtpMembership;

  beforeEach(() => {
    service = AtpMembershipService.getInstance();
    
    // Mock membership data
    mockMembership = {
      id: 'atp_mem_test_123',
      customerId: 'cust_test_456',
      status: 'active' as MembershipStatus,
      startDate: '2025-01-01T00:00:00Z',
      expirationDate: '2026-01-01T00:00:00Z',
      paymentStatus: 'paid' as PaymentStatus,
      benefits: {
        serviceDiscount: 0.15,
        freeDelivery: true,
        eligibleServices: [...ELIGIBLE_SERVICES],
        annualFee: 99
      },
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    };
  });

  describe('Singleton Pattern', () => {
    it('should return the same instance', () => {
      const instance1 = AtpMembershipService.getInstance();
      const instance2 = AtpMembershipService.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe('createMembership', () => {
    it('should create a new membership successfully', async () => {
      const payload: CreateMembershipPayload = {
        customerId: 'cust_test_123',
        subscriptionId: 'sub_test_456'
      };

      const result = await service.createMembership(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.customerId).toBe(payload.customerId);
        expect(result.data.subscriptionId).toBe(payload.subscriptionId);
        expect(result.data.status).toBe('pending');
        expect(result.data.paymentStatus).toBe('pending');
        expect(result.data.benefits.serviceDiscount).toBe(MEMBERSHIP_CONFIG.SERVICE_DISCOUNT_PERCENTAGE);
        expect(result.data.benefits.freeDelivery).toBe(MEMBERSHIP_CONFIG.FREE_DELIVERY);
        expect(result.data.benefits.annualFee).toBe(MEMBERSHIP_CONFIG.ANNUAL_FEE);
        
        // Check expiration date is 12 months from now
        const expirationDate = new Date(result.data.expirationDate);
        const expectedExpiration = new Date();
        expectedExpiration.setMonth(expectedExpiration.getMonth() + 12);
        
        // Allow for small time differences in test execution
        const timeDiff = Math.abs(expirationDate.getTime() - expectedExpiration.getTime());
        expect(timeDiff).toBeLessThan(5000); // Less than 5 seconds difference
      }
    });

    it('should fail with invalid customer ID', async () => {
      const payload: CreateMembershipPayload = {
        customerId: ''
      };

      const result = await service.createMembership(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(MembershipErrorCode.INVALID_CUSTOMER);
      }
    });

    it('should generate unique membership IDs', async () => {
      const payload1: CreateMembershipPayload = { customerId: 'cust_1' };
      const payload2: CreateMembershipPayload = { customerId: 'cust_2' };

      const result1 = await service.createMembership(payload1);
      const result2 = await service.createMembership(payload2);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      
      if (result1.success && result2.success) {
        expect(result1.data.id).not.toBe(result2.data.id);
        expect(result1.data.id).toMatch(/^atp_mem_\d+_[a-z0-9]+$/);
        expect(result2.data.id).toMatch(/^atp_mem_\d+_[a-z0-9]+$/);
      }
    });
  });

  describe('getMembership', () => {
    it('should handle invalid customer ID', async () => {
      const result = await service.getMembership('');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(MembershipErrorCode.INVALID_CUSTOMER);
      }
    });

    it('should return null for non-existent membership', async () => {
      const result = await service.getMembership('cust_nonexistent');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeNull();
      }
    });
  });

  describe('renewMembership', () => {
    it('should handle non-existent membership', async () => {
      const payload: RenewMembershipPayload = {
        membershipId: 'nonexistent_id'
      };

      const result = await service.renewMembership(payload);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(MembershipErrorCode.MEMBERSHIP_NOT_FOUND);
      }
    });
  });

  describe('cancelMembership', () => {
    it('should handle non-existent membership', async () => {
      const result = await service.cancelMembership('nonexistent_id');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(MembershipErrorCode.MEMBERSHIP_NOT_FOUND);
      }
    });
  });

  describe('calculateServiceDiscount', () => {
    it('should calculate correct discount for active membership', () => {
      const price = 100;
      const result = service.calculateServiceDiscount(price, mockMembership);

      expect(result.originalPrice).toBe(100);
      expect(result.discountPercentage).toBe(0.15);
      expect(result.discountAmount).toBe(15);
      expect(result.finalPrice).toBe(85);
      expect(result.savings).toBe(15);
    });

    it('should return no discount for null membership', () => {
      const price = 100;
      const result = service.calculateServiceDiscount(price, null);

      expect(result.originalPrice).toBe(100);
      expect(result.discountPercentage).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(100);
      expect(result.savings).toBe(0);
    });

    it('should return no discount for expired membership', () => {
      const expiredMembership: AtpMembership = {
        ...mockMembership,
        status: 'expired',
        expirationDate: '2023-01-01T00:00:00Z'
      };

      const price = 100;
      const result = service.calculateServiceDiscount(price, expiredMembership);

      expect(result.originalPrice).toBe(100);
      expect(result.discountPercentage).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(100);
      expect(result.savings).toBe(0);
    });

    it('should return no discount for unpaid membership', () => {
      const unpaidMembership: AtpMembership = {
        ...mockMembership,
        paymentStatus: 'pending'
      };

      const price = 100;
      const result = service.calculateServiceDiscount(price, unpaidMembership);

      expect(result.originalPrice).toBe(100);
      expect(result.discountPercentage).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(100);
      expect(result.savings).toBe(0);
    });

    it('should handle zero price correctly', () => {
      const price = 0;
      const result = service.calculateServiceDiscount(price, mockMembership);

      expect(result.originalPrice).toBe(0);
      expect(result.discountAmount).toBe(0);
      expect(result.finalPrice).toBe(0);
      expect(result.savings).toBe(0);
    });

    it('should handle decimal prices correctly', () => {
      const price = 99.99;
      const result = service.calculateServiceDiscount(price, mockMembership);

      expect(result.originalPrice).toBe(99.99);
      expect(result.discountAmount).toBeCloseTo(14.9985, 4);
      expect(result.finalPrice).toBeCloseTo(84.9915, 4);
      expect(result.savings).toBeCloseTo(14.9985, 4);
    });
  });

  describe('isEligibleForFreeDelivery', () => {
    it('should return true for active membership with free delivery benefit', () => {
      const result = service.isEligibleForFreeDelivery(mockMembership);
      expect(result).toBe(true);
    });

    it('should return false for null membership', () => {
      const result = service.isEligibleForFreeDelivery(null);
      expect(result).toBe(false);
    });

    it('should return false for expired membership', () => {
      const expiredMembership: AtpMembership = {
        ...mockMembership,
        status: 'expired',
        expirationDate: '2023-01-01T00:00:00Z'
      };

      const result = service.isEligibleForFreeDelivery(expiredMembership);
      expect(result).toBe(false);
    });

    it('should return false for membership without free delivery benefit', () => {
      const membershipWithoutFreeDelivery: AtpMembership = {
        ...mockMembership,
        benefits: {
          ...mockMembership.benefits,
          freeDelivery: false
        }
      };

      const result = service.isEligibleForFreeDelivery(membershipWithoutFreeDelivery);
      expect(result).toBe(false);
    });
  });

  describe('isServiceEligibleForDiscount', () => {
    it('should return true for eligible services', () => {
      expect(service.isServiceEligibleForDiscount(EligibleService.HOME_MASSAGE_SPA)).toBe(true);
      expect(service.isServiceEligibleForDiscount(EligibleService.EMS_TRAINING)).toBe(true);
      expect(service.isServiceEligibleForDiscount(EligibleService.HOME_YOGA)).toBe(true);
      expect(service.isServiceEligibleForDiscount(EligibleService.COSMETICS_SUPPLEMENTS)).toBe(true);
    });

    it('should return false for non-eligible services', () => {
      expect(service.isServiceEligibleForDiscount('non-eligible-service')).toBe(false);
      expect(service.isServiceEligibleForDiscount('')).toBe(false);
    });
  });

  describe('getServiceDiscountInfo', () => {
    it('should return correct discount info for eligible service', () => {
      const serviceId = EligibleService.HOME_MASSAGE_SPA;
      const price = 200;
      
      const result = service.getServiceDiscountInfo(serviceId, price, mockMembership);

      expect(result.serviceId).toBe(serviceId);
      expect(result.serviceName).toBe('Home Massage & Spa Services');
      expect(result.isEligible).toBe(true);
      expect(result.discountPercentage).toBe(0.15);
      expect(result.originalPrice).toBe(200);
      expect(result.discountedPrice).toBe(170);
    });

    it('should return correct info for non-eligible service', () => {
      const serviceId = 'non-eligible-service';
      const price = 200;
      
      const result = service.getServiceDiscountInfo(serviceId, price, mockMembership);

      expect(result.serviceId).toBe(serviceId);
      expect(result.serviceName).toBe(serviceId); // Falls back to serviceId
      expect(result.isEligible).toBe(false);
      expect(result.discountPercentage).toBe(0);
      expect(result.originalPrice).toBe(200);
      expect(result.discountedPrice).toBe(200);
    });
  });

  describe('validateMembership', () => {
    it('should validate active membership correctly', () => {
      const result = service.validateMembership(mockMembership);

      expect(result.isValid).toBe(true);
      expect(result.isActive).toBe(true);
      expect(result.isExpired).toBe(false);
      expect(result.requiresRenewal).toBe(false);
      expect(result.errors).toHaveLength(0);
      expect(result.daysUntilExpiration).toBeGreaterThan(0);
    });

    it('should validate null membership correctly', () => {
      const result = service.validateMembership(null);

      expect(result.isValid).toBe(false);
      expect(result.isActive).toBe(false);
      expect(result.isExpired).toBe(false);
      expect(result.requiresRenewal).toBe(false);
      expect(result.daysUntilExpiration).toBe(0);
      expect(result.errors).toContain('No membership found');
    });

    it('should validate expired membership correctly', () => {
      const expiredMembership: AtpMembership = {
        ...mockMembership,
        status: 'expired',
        expirationDate: '2023-01-01T00:00:00Z'
      };

      const result = service.validateMembership(expiredMembership);

      expect(result.isValid).toBe(false);
      expect(result.isActive).toBe(false);
      expect(result.isExpired).toBe(true);
      expect(result.requiresRenewal).toBe(true);
      expect(result.daysUntilExpiration).toBe(0);
      expect(result.errors).toContain('Membership has expired');
    });

    it('should validate cancelled membership correctly', () => {
      const cancelledMembership: AtpMembership = {
        ...mockMembership,
        status: 'cancelled'
      };

      const result = service.validateMembership(cancelledMembership);

      expect(result.isValid).toBe(false);
      expect(result.isActive).toBe(false);
      expect(result.errors).toContain('Membership has been cancelled');
    });

    it('should validate pending payment membership correctly', () => {
      const pendingPaymentMembership: AtpMembership = {
        ...mockMembership,
        paymentStatus: 'pending'
      };

      const result = service.validateMembership(pendingPaymentMembership);

      expect(result.isValid).toBe(false);
      expect(result.isActive).toBe(false);
      expect(result.errors).toContain('Payment is not completed');
    });
  });

  describe('getMembershipStats', () => {
    it('should return default stats for valid customer', async () => {
      const result = await service.getMembershipStats('cust_test_123');

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.totalSavings).toBe(0);
        expect(result.data.servicesUsed).toBe(0);
        expect(result.data.ordersWithFreeDelivery).toBe(0);
        expect(result.data.averageOrderValue).toBe(0);
        expect(result.data.totalOrders).toBe(0);
        expect(result.data.memberSince).toBeDefined();
      }
    });
  });

  describe('updatePaymentStatus', () => {
    it('should handle non-existent membership', async () => {
      const result = await service.updatePaymentStatus('nonexistent_id', 'paid');

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe(MembershipErrorCode.MEMBERSHIP_NOT_FOUND);
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle very large discount calculations', () => {
      const price = Number.MAX_SAFE_INTEGER;
      const result = service.calculateServiceDiscount(price, mockMembership);

      expect(result.originalPrice).toBe(price);
      expect(result.discountPercentage).toBe(0.15);
      expect(result.finalPrice).toBeLessThan(price);
      expect(result.savings).toBeGreaterThan(0);
    });

    it('should handle negative prices gracefully', () => {
      const price = -100;
      const result = service.calculateServiceDiscount(price, mockMembership);

      expect(result.originalPrice).toBe(-100);
      expect(result.discountAmount).toBe(-15); // 15% of -100
      expect(result.finalPrice).toBe(-85); // -100 - (-15)
    });

    it('should handle membership with future start date', () => {
      const futureStartMembership: AtpMembership = {
        ...mockMembership,
        startDate: '2025-12-01T00:00:00Z',
        expirationDate: '2026-12-01T00:00:00Z'
      };

      // Should still be considered active if payment is complete and not expired
      const result = service.calculateServiceDiscount(100, futureStartMembership);
      expect(result.discountAmount).toBe(15);
    });
  });
});