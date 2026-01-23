/**
 * ATP Membership Context Tests
 * 
 * Unit tests for the membership context and provider functionality.
 */

import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { MembershipProvider, useMembershipContext } from '../../hooks/use-atp-membership-context';
import { atpMembershipService } from '../../lib/services/atp-membership-service';
import {
  AtpMembership,
  MembershipStats,
  MembershipError,
  MembershipErrorCode
} from '../../lib/types/membership';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { vi } from 'vitest';
import { it } from 'vitest';
import { beforeEach } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { expect } from 'vitest';
import { vi } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { describe } from 'vitest';
import { vi } from 'vitest';
import { beforeEach } from 'vitest';
import { describe } from 'vitest';
import { vi } from 'vitest';
import { vi } from 'vitest';
import { vi } from 'vitest';
import { vi } from 'vitest';
import { vi } from 'vitest';

// Mock the membership service
vi.mock('../../lib/services/atp-membership-service');
const mockMembershipService = atpMembershipService as any;

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test data
const mockMembership: AtpMembership = {
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

const mockStats: MembershipStats = {
  totalSavings: 150,
  servicesUsed: 5,
  ordersWithFreeDelivery: 12,
  memberSince: '2024-01-01T00:00:00Z',
  averageOrderValue: 200,
  totalOrders: 15
};

// Wrapper component for testing
const createWrapper = (customerId?: string) => {
  return ({ children }: { children: React.ReactNode }) => (
    <MembershipProvider customerId={customerId}>
      {children}
    </MembershipProvider>
  );
};

describe('MembershipProvider and useMembershipContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Context Provider', () => {
    it('should provide initial state', () => {
      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      expect(result.current.membership).toBeNull();
      expect(result.current.stats).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isInitialized).toBe(false);
    });

    it('should throw error when used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useMembershipContext());
      }).toThrow('useMembershipContext must be used within a MembershipProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('loadMembership', () => {
    it('should load membership successfully', async () => {
      mockMembershipService.getMembership.mockResolvedValue({
        success: true,
        data: mockMembership
      });
      mockMembershipService.getMembershipStats.mockResolvedValue({
        success: true,
        data: mockStats
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.loadMembership('cust_test_456');
      });

      expect(result.current.membership).toEqual(mockMembership);
      expect(result.current.stats).toEqual(mockStats);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.isInitialized).toBe(true);
    });

    it('should handle membership service error', async () => {
      const error = new MembershipError(
        'Service error',
        MembershipErrorCode.SHOPIFY_API_ERROR
      );

      mockMembershipService.getMembership.mockResolvedValue({
        success: false,
        error
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.loadMembership('cust_test_456');
      });

      expect(result.current.membership).toBeNull();
      expect(result.current.error).toEqual(error);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isInitialized).toBe(true);
    });

    it('should require customer ID', async () => {
      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.loadMembership();
      });

      expect(result.current.error).toEqual(
        expect.objectContaining({
          code: MembershipErrorCode.INVALID_CUSTOMER
        })
      );
    });
  });

  describe('purchaseMembership', () => {
    it('should purchase membership successfully', async () => {
      mockMembershipService.createMembership.mockResolvedValue({
        success: true,
        data: mockMembership
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      let checkoutUrl: string;
      await act(async () => {
        checkoutUrl = await result.current.purchaseMembership('cust_test_456');
      });

      expect(checkoutUrl!).toBe(`/checkout/membership/${mockMembership.id}`);
      expect(result.current.membership).toEqual(mockMembership);
    });

    it('should handle purchase error', async () => {
      const error = new MembershipError(
        'Payment failed',
        MembershipErrorCode.PAYMENT_FAILED
      );

      mockMembershipService.createMembership.mockResolvedValue({
        success: false,
        error
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await expect(
        act(async () => {
          await result.current.purchaseMembership('cust_test_456');
        })
      ).rejects.toThrow('Payment failed');

      expect(result.current.error).toEqual(error);
    });
  });

  describe('renewMembership', () => {
    it('should renew membership successfully', async () => {
      const renewedMembership = {
        ...mockMembership,
        expirationDate: '2026-01-01T00:00:00Z'
      };

      mockMembershipService.renewMembership.mockResolvedValue({
        success: true,
        data: renewedMembership
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.renewMembership('mem_test_123');
      });

      expect(result.current.membership).toEqual(renewedMembership);
    });

    it('should handle renewal error', async () => {
      const error = new MembershipError(
        'Renewal failed',
        MembershipErrorCode.RENEWAL_FAILED
      );

      mockMembershipService.renewMembership.mockResolvedValue({
        success: false,
        error
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await expect(
        act(async () => {
          await result.current.renewMembership('mem_test_123');
        })
      ).rejects.toThrow('Renewal failed');

      expect(result.current.error).toEqual(error);
    });
  });

  describe('cancelMembership', () => {
    it('should cancel membership successfully', async () => {
      const cancelledMembership = {
        ...mockMembership,
        status: 'cancelled' as const
      };

      mockMembershipService.cancelMembership.mockResolvedValue({
        success: true,
        data: cancelledMembership
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.cancelMembership('mem_test_123');
      });

      expect(result.current.membership).toEqual(cancelledMembership);
    });
  });

  describe('discount calculations', () => {
    beforeEach(() => {
      mockMembershipService.calculateServiceDiscount.mockReturnValue({
        originalPrice: 100,
        discountAmount: 15,
        discountPercentage: 0.15,
        finalPrice: 85,
        savings: 15
      });

      mockMembershipService.isEligibleForFreeDelivery.mockReturnValue(true);
    });

    it('should calculate discount correctly', () => {
      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      // Set membership in state
      act(() => {
        result.current.loadMembership = vi.fn();
      });

      const discount = result.current.calculateDiscount(100, 'home-massage-spa');

      expect(discount).toEqual({
        originalPrice: 100,
        discountAmount: 15,
        discountPercentage: 0.15,
        finalPrice: 85,
        savings: 15
      });
    });

    it('should check free delivery eligibility', () => {
      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      const isEligible = result.current.isEligibleForFreeDelivery();

      expect(isEligible).toBe(true);
    });
  });

  describe('localStorage caching', () => {
    it('should load from cache when available and valid', async () => {
      const cacheData = {
        membership: JSON.stringify(mockMembership),
        stats: JSON.stringify(mockStats),
        lastUpdated: new Date().toISOString()
      };

      mockLocalStorage.getItem.mockImplementation((key) => {
        switch (key) {
          case 'atp_membership':
            return cacheData.membership;
          case 'atp_membership_stats':
            return cacheData.stats;
          case 'atp_membership_last_updated':
            return cacheData.lastUpdated;
          default:
            return null;
        }
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.loadMembership('cust_test_456');
      });

      expect(result.current.membership).toEqual(mockMembership);
      expect(result.current.stats).toEqual(mockStats);
      expect(mockMembershipService.getMembership).not.toHaveBeenCalled();
    });

    it('should save to cache after successful API call', async () => {
      mockMembershipService.getMembership.mockResolvedValue({
        success: true,
        data: mockMembership
      });
      mockMembershipService.getMembershipStats.mockResolvedValue({
        success: true,
        data: mockStats
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      await act(async () => {
        await result.current.loadMembership('cust_test_456');
      });

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'atp_membership',
        JSON.stringify(mockMembership)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'atp_membership_stats',
        JSON.stringify(mockStats)
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'atp_membership_last_updated',
        expect.any(String)
      );
    });

    it('should clear cache on refresh', async () => {
      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper('cust_test_456')
      });

      await act(async () => {
        await result.current.refreshMembership();
      });

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('atp_membership');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('atp_membership_stats');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('atp_membership_last_updated');
    });
  });

  describe('error handling', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      // Set an error first
      act(() => {
        result.current.loadMembership('');
      });

      expect(result.current.error).not.toBeNull();

      // Clear the error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('should handle cache loading errors gracefully', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper()
      });

      // Should not throw and should fall back to API
      await act(async () => {
        await result.current.loadMembership('cust_test_456');
      });

      expect(mockMembershipService.getMembership).toHaveBeenCalled();
    });
  });

  describe('auto-loading with customerId', () => {
    it('should auto-load membership when customerId is provided', async () => {
      mockMembershipService.getMembership.mockResolvedValue({
        success: true,
        data: mockMembership
      });
      mockMembershipService.getMembershipStats.mockResolvedValue({
        success: true,
        data: mockStats
      });

      const { result } = renderHook(() => useMembershipContext(), {
        wrapper: createWrapper('cust_test_456')
      });

      await waitFor(() => {
        expect(result.current.isInitialized).toBe(true);
      });

      expect(result.current.membership).toEqual(mockMembership);
      expect(mockMembershipService.getMembership).toHaveBeenCalledWith('cust_test_456');
    });
  });
});