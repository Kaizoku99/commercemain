/**
 * ATP Membership Hook Tests
 * 
 * Unit tests for the main useAtpMembership hook and its specialized variants.
 */

import React from 'react';
import { renderHook } from '@testing-library/react';
import {
  useAtpMembership,
  useMembershipDiscount,
  useMembershipStatus,
  useMembershipOperations
} from '../../hooks/use-atp-membership';
import { MembershipProvider } from '../../hooks/use-atp-membership-context';
import { atpMembershipService } from '../../lib/services/atp-membership-service';
import {
  AtpMembership,
  MembershipStats,
  MembershipValidation
} from '../../lib/types/membership';

// Mock the membership service
jest.mock('../../lib/services/atp-membership-service');
const mockMembershipService = atpMembershipService as jest.Mocked<typeof atpMembershipService>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

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

const mockExpiredMembership: AtpMembership = {
  ...mockActiveMembership,
  status: 'expired',
  expirationDate: '2023-01-01T00:00:00Z'
};

const mockExpiringSoonMembership: AtpMembership = {
  ...mockActiveMembership,
  expirationDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
};

const mockStats: MembershipStats = {
  totalSavings: 150,
  servicesUsed: 5,
  ordersWithFreeDelivery: 12,
  memberSince: '2024-01-01T00:00:00Z',
  averageOrderValue: 200,
  totalOrders: 15
};

// Wrapper component for testing
const createWrapper = (membership: AtpMembership | null = null) => {
  return ({ children }: { children: React.ReactNode }) => {
    // Mock the context to return our test membership
    const MockProvider = ({ children }: { children: React.ReactNode }) => {
      React.useEffect(() => {
        if (membership) {
          mockMembershipService.getMembership.mockResolvedValue({
            success: true,
            data: membership
          });
          mockMembershipService.getMembershipStats.mockResolvedValue({
            success: true,
            data: mockStats
          });
        }
      }, []);

      return (
        <MembershipProvider customerId="cust_test_456">
          {children}
        </MembershipProvider>
      );
    };

    return <MockProvider>{children}</MockProvider>;
  };
};

describe('useAtpMembership', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    
    // Default mock implementations
    mockMembershipService.validateMembership.mockReturnValue({
      isValid: true,
      isActive: true,
      isExpired: false,
      daysUntilExpiration: 300,
      requiresRenewal: false,
      errors: []
    });
  });

  describe('basic functionality', () => {
    it('should return initial state', () => {
      const { result } = renderHook(() => useAtpMembership(), {
        wrapper: createWrapper()
      });

      expect(result.current.membership).toBeNull();
      expect(result.current.stats).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isInitialized).toBe(false);
    });

    it('should provide computed state for active membership', () => {
      mockMembershipService.validateMembership.mockReturnValue({
        isValid: true,
        isActive: true,
        isExpired: false,
        daysUntilExpiration: 300,
        requiresRenewal: false,
        errors: []
      });

      const { result } = renderHook(() => useAtpMembership(), {
        wrapper: createWrapper(mockActiveMembership)
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.isExpired).toBe(false);
      expect(result.current.isExpiringSoon).toBe(false);
      expect(result.current.daysUntilExpiration).toBe(300);
      expect(result.current.requiresRenewal).toBe(false);
    });

    it('should provide computed state for expired membership', () => {
      mockMembershipService.validateMembership.mockReturnValue({
        isValid: false,
        isActive: false,
        isExpired: true,
        daysUntilExpiration: 0,
        requiresRenewal: true,
        errors: ['Membership has expired']
      });

      const { result } = renderHook(() => useAtpMembership(), {
        wrapper: createWrapper(mockExpiredMembership)
      });

      expect(result.current.isActive).toBe(false);
      expect(result.current.isExpired).toBe(true);
      expect(result.current.isExpiringSoon).toBe(false);
      expect(result.current.requiresRenewal).toBe(true);
    });

    it('should provide computed state for expiring soon membership', () => {
      mockMembershipService.validateMembership.mockReturnValue({
        isValid: true,
        isActive: true,
        isExpired: false,
        daysUntilExpiration: 15,
        requiresRenewal: true,
        errors: []
      });

      const { result } = renderHook(() => useAtpMembership(), {
        wrapper: createWrapper(mockExpiringSoonMembership)
      });

      expect(result.current.isActive).toBe(true);
      expect(result.current.isExpired).toBe(false);
      expect(result.current.isExpiringSoon).toBe(true);
      expect(result.current.requiresRenewal).toBe(true);
    });
  });

  describe('operations', () => {
    it('should provide all required operations', () => {
      const { result } = renderHook(() => useAtpMembership(), {
        wrapper: createWrapper()
      });

      expect(typeof result.current.loadMembership).toBe('function');
      expect(typeof result.current.purchaseMembership).toBe('function');
      expect(typeof result.current.renewMembership).toBe('function');
      expect(typeof result.current.cancelMembership).toBe('function');
      expect(typeof result.current.refreshMembership).toBe('function');
      expect(typeof result.current.calculateDiscount).toBe('function');
      expect(typeof result.current.getServiceDiscountInfo).toBe('function');
      expect(typeof result.current.isEligibleForFreeDelivery).toBe('function');
      expect(typeof result.current.validateMembership).toBe('function');
      expect(typeof result.current.clearError).toBe('function');
    });
  });
});

describe('useMembershipDiscount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should provide discount calculation functions', () => {
    const { result } = renderHook(() => useMembershipDiscount(), {
      wrapper: createWrapper(mockActiveMembership)
    });

    expect(typeof result.current.calculateServiceDiscount).toBe('function');
    expect(typeof result.current.getDiscountInfo).toBe('function');
    expect(typeof result.current.checkFreeDeliveryEligibility).toBe('function');
    expect(result.current.hasActiveMembership).toBe(true);
  });

  it('should calculate service discount correctly', () => {
    mockMembershipService.calculateServiceDiscount.mockReturnValue({
      originalPrice: 100,
      discountAmount: 15,
      discountPercentage: 0.15,
      finalPrice: 85,
      savings: 15
    });

    const { result } = renderHook(() => useMembershipDiscount(), {
      wrapper: createWrapper(mockActiveMembership)
    });

    const discount = result.current.calculateServiceDiscount(100, 'home-massage-spa');

    expect(discount).toEqual({
      originalPrice: 100,
      discountAmount: 15,
      discountPercentage: 0.15,
      finalPrice: 85,
      savings: 15
    });
  });

  it('should check free delivery eligibility', () => {
    mockMembershipService.isEligibleForFreeDelivery.mockReturnValue(true);

    const { result } = renderHook(() => useMembershipDiscount(), {
      wrapper: createWrapper(mockActiveMembership)
    });

    const isEligible = result.current.checkFreeDeliveryEligibility();

    expect(isEligible).toBe(true);
    expect(mockMembershipService.isEligibleForFreeDelivery).toHaveBeenCalledWith(mockActiveMembership);
  });

  it('should return false for active membership when no membership exists', () => {
    const { result } = renderHook(() => useMembershipDiscount(), {
      wrapper: createWrapper(null)
    });

    expect(result.current.hasActiveMembership).toBe(false);
  });
});

describe('useMembershipStatus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should provide status information for no membership', () => {
    const { result } = renderHook(() => useMembershipStatus(), {
      wrapper: createWrapper(null)
    });

    expect(result.current.statusInfo).toEqual({
      status: 'none',
      message: 'No membership found',
      actionRequired: false
    });
  });

  it('should provide status information for active membership', () => {
    mockMembershipService.validateMembership.mockReturnValue({
      isValid: true,
      isActive: true,
      isExpired: false,
      daysUntilExpiration: 300,
      requiresRenewal: false,
      errors: []
    });

    const { result } = renderHook(() => useMembershipStatus(), {
      wrapper: createWrapper(mockActiveMembership)
    });

    expect(result.current.statusInfo.status).toBe('active');
    expect(result.current.statusInfo.actionRequired).toBe(false);
    expect(result.current.statusInfo.message).toContain('active until');
  });

  it('should provide status information for expired membership', () => {
    mockMembershipService.validateMembership.mockReturnValue({
      isValid: false,
      isActive: false,
      isExpired: true,
      daysUntilExpiration: 0,
      requiresRenewal: true,
      errors: ['Membership has expired']
    });

    const { result } = renderHook(() => useMembershipStatus(), {
      wrapper: createWrapper(mockExpiredMembership)
    });

    expect(result.current.statusInfo).toEqual({
      status: 'expired',
      message: 'Your membership has expired. Renew now to restore benefits.',
      actionRequired: true
    });
  });

  it('should provide status information for expiring soon membership', () => {
    mockMembershipService.validateMembership.mockReturnValue({
      isValid: true,
      isActive: true,
      isExpired: false,
      daysUntilExpiration: 5,
      requiresRenewal: true,
      errors: []
    });

    const { result } = renderHook(() => useMembershipStatus(), {
      wrapper: createWrapper(mockExpiringSoonMembership)
    });

    expect(result.current.statusInfo.status).toBe('expiring');
    expect(result.current.statusInfo.actionRequired).toBe(true);
    expect(result.current.statusInfo.message).toContain('expires in 5 days');
  });
});

describe('useMembershipOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('should provide operation functions', () => {
    const { result } = renderHook(() => useMembershipOperations(), {
      wrapper: createWrapper()
    });

    expect(typeof result.current.handlePurchase).toBe('function');
    expect(typeof result.current.handleRenewal).toBe('function');
    expect(typeof result.current.handleCancellation).toBe('function');
    expect(typeof result.current.refreshMembership).toBe('function');
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should handle successful purchase', async () => {
    mockMembershipService.createMembership.mockResolvedValue({
      success: true,
      data: mockActiveMembership
    });

    const { result } = renderHook(() => useMembershipOperations(), {
      wrapper: createWrapper()
    });

    const purchaseResult = await result.current.handlePurchase('cust_test_456');

    expect(purchaseResult.success).toBe(true);
    expect(purchaseResult.checkoutUrl).toBe(`/checkout/membership/${mockActiveMembership.id}`);
  });

  it('should handle purchase failure', async () => {
    const error = new Error('Payment failed');
    mockMembershipService.createMembership.mockRejectedValue(error);

    const { result } = renderHook(() => useMembershipOperations(), {
      wrapper: createWrapper()
    });

    const purchaseResult = await result.current.handlePurchase('cust_test_456');

    expect(purchaseResult.success).toBe(false);
    expect(purchaseResult.error).toBeDefined();
  });

  it('should handle successful renewal', async () => {
    mockMembershipService.renewMembership.mockResolvedValue({
      success: true,
      data: mockActiveMembership
    });

    const { result } = renderHook(() => useMembershipOperations(), {
      wrapper: createWrapper()
    });

    const renewalResult = await result.current.handleRenewal('mem_test_123');

    expect(renewalResult.success).toBe(true);
  });

  it('should handle renewal failure', async () => {
    const error = new Error('Renewal failed');
    mockMembershipService.renewMembership.mockRejectedValue(error);

    const { result } = renderHook(() => useMembershipOperations(), {
      wrapper: createWrapper()
    });

    const renewalResult = await result.current.handleRenewal('mem_test_123');

    expect(renewalResult.success).toBe(false);
    expect(renewalResult.error).toBeDefined();
  });

  it('should handle successful cancellation', async () => {
    mockMembershipService.cancelMembership.mockResolvedValue({
      success: true,
      data: { ...mockActiveMembership, status: 'cancelled' }
    });

    const { result } = renderHook(() => useMembershipOperations(), {
      wrapper: createWrapper()
    });

    const cancellationResult = await result.current.handleCancellation('mem_test_123');

    expect(cancellationResult.success).toBe(true);
  });

  it('should handle cancellation failure', async () => {
    const error = new Error('Cancellation failed');
    mockMembershipService.cancelMembership.mockRejectedValue(error);

    const { result } = renderHook(() => useMembershipOperations(), {
      wrapper: createWrapper()
    });

    const cancellationResult = await result.current.handleCancellation('mem_test_123');

    expect(cancellationResult.success).toBe(false);
    expect(cancellationResult.error).toBeDefined();
  });
});