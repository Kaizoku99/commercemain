/**
 * Membership Benefits Hooks Tests
 * 
 * Unit tests for specialized membership benefit hooks.
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import {
  useServicePricing,
  useMultipleServicePricing,
  useDeliveryBenefits,
  useCartBenefits,
  useServiceEligibility,
  useMembershipValue,
  useRenewalUrgency,
  useBenefitSummary
} from '../../hooks/use-membership-benefits';
import { MembershipProvider } from '../../hooks/use-atp-membership-context';
import { atpMembershipService } from '../../lib/services/atp-membership-service';
import {
  AtpMembership,
  EligibleService
} from '../../lib/types/membership';

// Mock the membership service and hooks
jest.mock('../../lib/services/atp-membership-service');
jest.mock('../../hooks/use-atp-membership', () => ({
  useMembershipDiscount: () => ({
    membership: mockActiveMembership,
    calculateServiceDiscount: jest.fn((price, serviceId) => ({
      originalPrice: price,
      discountAmount: price * 0.15,
      discountPercentage: 0.15,
      finalPrice: price * 0.85,
      savings: price * 0.15
    })),
    getDiscountInfo: jest.fn((serviceId, price) => ({
      serviceId,
      serviceName: 'Test Service',
      isEligible: true,
      discountPercentage: 0.15,
      originalPrice: price,
      discountedPrice: price * 0.85
    })),
    checkFreeDeliveryEligibility: jest.fn(() => true),
    hasActiveMembership: true
  }),
  useMembershipStatus: () => ({
    membership: mockActiveMembership,
    isActive: true,
    isExpired: false,
    isExpiringSoon: false,
    daysUntilExpiration: 300,
    validateMembership: jest.fn(() => ({
      isValid: true,
      isActive: true,
      isExpired: false,
      daysUntilExpiration: 300,
      requiresRenewal: false,
      errors: []
    }))
  })
}));

const mockMembershipService = atpMembershipService as jest.Mocked<typeof atpMembershipService>;

// Test data
const mockActiveMembership: AtpMembership = {
  id: 'mem_test_123',
  customerId: 'cust_test_456',
  status: 'active',
  startDate: '2024-01-01T00:00:00Z',
  expirationDate: '2025-01-01T00:00:00Z',
  paymentStatus: 'paid',
  benefits: {
    serviceDiscount: 0.15,
    freeDelivery: true,
    eligibleServices: ['home-massage-spa', 'ems-training'],
    annualFee: 99
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
};

// Wrapper component for testing
const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => (
    <MembershipProvider customerId="cust_test_456">
      {children}
    </MembershipProvider>
  );
};

describe('useServicePricing', () => {
  it('should calculate service pricing with discount', () => {
    const { result } = renderHook(
      () => useServicePricing('home-massage-spa', 100),
      { wrapper: createWrapper() }
    );

    expect(result.current).toEqual({
      originalPrice: 100,
      discountedPrice: 85,
      discountAmount: 15,
      discountPercentage: 0.15,
      savings: 15,
      isDiscounted: true
    });
  });

  it('should recalculate when price changes', () => {
    const { result, rerender } = renderHook(
      ({ price }) => useServicePricing('home-massage-spa', price),
      { 
        wrapper: createWrapper(),
        initialProps: { price: 100 }
      }
    );

    expect(result.current.discountedPrice).toBe(85);

    rerender({ price: 200 });

    expect(result.current.discountedPrice).toBe(170);
    expect(result.current.savings).toBe(30);
  });
});

describe('useMultipleServicePricing', () => {
  const testServices = [
    { id: 'home-massage-spa', price: 100 },
    { id: 'ems-training', price: 150 },
    { id: 'home-yoga', price: 80 }
  ];

  it('should calculate pricing for multiple services', () => {
    const { result } = renderHook(
      () => useMultipleServicePricing(testServices),
      { wrapper: createWrapper() }
    );

    expect(result.current.services).toHaveLength(3);
    expect(result.current.totals).toEqual({
      originalPrice: 330,
      discountedPrice: 280.5,
      totalSavings: 49.5,
      hasDiscounts: true
    });
  });

  it('should handle empty services array', () => {
    const { result } = renderHook(
      () => useMultipleServicePricing([]),
      { wrapper: createWrapper() }
    );

    expect(result.current.services).toHaveLength(0);
    expect(result.current.totals).toEqual({
      originalPrice: 0,
      discountedPrice: 0,
      totalSavings: 0,
      hasDiscounts: false
    });
  });
});

describe('useDeliveryBenefits', () => {
  it('should provide free delivery benefits for active member', () => {
    const { result } = renderHook(
      () => useDeliveryBenefits(25),
      { wrapper: createWrapper() }
    );

    expect(result.current).toEqual({
      isFreeDelivery: true,
      deliveryFee: 0,
      deliverySavings: 25,
      hasActiveMembership: true,
      deliveryMessage: 'Free Delivery - Member Benefit'
    });
  });

  it('should use default delivery fee when not provided', () => {
    const { result } = renderHook(
      () => useDeliveryBenefits(),
      { wrapper: createWrapper() }
    );

    expect(result.current.deliverySavings).toBe(25); // Default fee
  });
});

describe('useCartBenefits', () => {
  const testServices = [
    { id: 'home-massage-spa', price: 100 },
    { id: 'ems-training', price: 150 }
  ];

  it('should combine service and delivery benefits', () => {
    const { result } = renderHook(
      () => useCartBenefits(testServices, 25),
      { wrapper: createWrapper() }
    );

    expect(result.current).toEqual({
      hasServiceDiscounts: true,
      hasFreeDelivery: true,
      totalSavings: 62.5, // 37.5 service + 25 delivery
      deliverySavings: 25,
      serviceSavings: 37.5
    });
  });
});

describe('useServiceEligibility', () => {
  beforeEach(() => {
    mockMembershipService.isServiceEligibleForDiscount = jest.fn((serviceId) => 
      Object.values(EligibleService).includes(serviceId as EligibleService)
    );
  });

  it('should check service eligibility', () => {
    const { result } = renderHook(
      () => useServiceEligibility(),
      { wrapper: createWrapper() }
    );

    expect(result.current.checkServiceEligibility('home-massage-spa')).toBe(true);
    expect(result.current.checkServiceEligibility('invalid-service')).toBe(false);
  });

  it('should get eligible services list', () => {
    const { result } = renderHook(
      () => useServiceEligibility(),
      { wrapper: createWrapper() }
    );

    const eligibleServices = result.current.getEligibleServices();
    expect(eligibleServices).toContain(EligibleService.HOME_MASSAGE_SPA);
    expect(eligibleServices).toContain(EligibleService.EMS_TRAINING);
  });

  it('should get service discount info', () => {
    const { result } = renderHook(
      () => useServiceEligibility(),
      { wrapper: createWrapper() }
    );

    const serviceInfo = result.current.getServiceInfo('home-massage-spa', 100);
    
    expect(serviceInfo).toEqual({
      serviceId: 'home-massage-spa',
      serviceName: 'Test Service',
      isEligible: true,
      discountPercentage: 0.15,
      originalPrice: 100,
      discountedPrice: 85
    });
  });
});

describe('useMembershipValue', () => {
  it('should calculate membership value proposition', () => {
    const { result } = renderHook(
      () => useMembershipValue(200, 25),
      { wrapper: createWrapper() }
    );

    expect(result.current).toEqual({
      annualSpending: 2400,
      serviceDiscountSavings: 360,
      deliverySavings: 300,
      totalPotentialSavings: 660,
      membershipFee: 99,
      netSavings: 561,
      roi: expect.closeTo(566.67, 2),
      breakEvenSpending: 660,
      isWorthwhile: true,
      hasActiveMembership: true
    });
  });

  it('should use default values when not provided', () => {
    const { result } = renderHook(
      () => useMembershipValue(),
      { wrapper: createWrapper() }
    );

    expect(result.current.annualSpending).toBe(2400); // 200 * 12
    expect(result.current.deliverySavings).toBe(300); // 25 * 12
  });

  it('should indicate when membership is not worthwhile', () => {
    const { result } = renderHook(
      () => useMembershipValue(50, 5), // Low spending
      { wrapper: createWrapper() }
    );

    expect(result.current.isWorthwhile).toBe(false);
    expect(result.current.netSavings).toBeLessThan(0);
  });
});

describe('useRenewalUrgency', () => {
  it('should show no urgency for no membership', () => {
    // Mock no membership
    jest.doMock('../../hooks/use-atp-membership', () => ({
      useMembershipStatus: () => ({
        membership: null,
        isExpired: false,
        isExpiringSoon: false,
        daysUntilExpiration: 0
      })
    }));

    const { result } = renderHook(
      () => useRenewalUrgency(),
      { wrapper: createWrapper() }
    );

    expect(result.current).toEqual({
      urgency: 'none',
      message: 'No membership to renew',
      showRenewalCTA: false,
      daysLeft: 0
    });
  });

  it('should show critical urgency for expired membership', () => {
    // Mock expired membership
    jest.doMock('../../hooks/use-atp-membership', () => ({
      useMembershipStatus: () => ({
        membership: mockActiveMembership,
        isExpired: true,
        isExpiringSoon: false,
        daysUntilExpiration: 0
      })
    }));

    const { result } = renderHook(
      () => useRenewalUrgency(),
      { wrapper: createWrapper() }
    );

    expect(result.current.urgency).toBe('critical');
    expect(result.current.showRenewalCTA).toBe(true);
  });

  it('should show high urgency for membership expiring within 7 days', () => {
    // Mock expiring soon membership
    jest.doMock('../../hooks/use-atp-membership', () => ({
      useMembershipStatus: () => ({
        membership: mockActiveMembership,
        isExpired: false,
        isExpiringSoon: true,
        daysUntilExpiration: 5
      })
    }));

    const { result } = renderHook(
      () => useRenewalUrgency(),
      { wrapper: createWrapper() }
    );

    expect(result.current.urgency).toBe('high');
    expect(result.current.showRenewalCTA).toBe(true);
    expect(result.current.message).toContain('expires in 5 days');
  });
});

describe('useBenefitSummary', () => {
  it('should provide benefit summary for active membership', () => {
    const { result } = renderHook(
      () => useBenefitSummary(),
      { wrapper: createWrapper() }
    );

    expect(result.current.hasActiveBenefits).toBe(true);
    expect(result.current.serviceDiscount).toBe(0.15);
    expect(result.current.freeDelivery).toBe(true);
    expect(result.current.membershipFee).toBe(99);
    expect(result.current.benefits).toHaveLength(4);
    
    const discountBenefit = result.current.benefits.find(b => b.title === '15% Service Discount');
    expect(discountBenefit?.active).toBe(true);
  });

  it('should provide empty summary for no membership', () => {
    // Mock no membership
    jest.doMock('../../hooks/use-atp-membership', () => ({
      useMembershipStatus: () => ({
        membership: null,
        isActive: false
      }),
      useMembershipDiscount: () => ({
        checkFreeDeliveryEligibility: () => false
      })
    }));

    const { result } = renderHook(
      () => useBenefitSummary(),
      { wrapper: createWrapper() }
    );

    expect(result.current.hasActiveBenefits).toBe(false);
    expect(result.current.serviceDiscount).toBe(0);
    expect(result.current.benefits).toHaveLength(0);
  });
});