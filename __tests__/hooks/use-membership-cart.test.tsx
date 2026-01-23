/**
 * Tests for useMembershipCart hook
 * 
 * Tests the React hook that manages cart operations with membership benefits
 */

import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMembershipCart } from '@/hooks/use-membership-cart';
import { useCart } from '@/components/cart/cart-context';
import { useMembershipDiscount } from '@/hooks/use-atp-membership';
import * as membershipCartActions from '@/components/cart/membership-cart-actions';

// Mock dependencies
vi.mock('@/components/cart/cart-context', () => ({
  useCart: vi.fn()
}));

vi.mock('@/hooks/use-atp-membership', () => ({
  useMembershipDiscount: vi.fn()
}));

vi.mock('@/components/cart/membership-cart-actions', () => ({
  addToCartWithMembership: vi.fn(),
  removeFromCartWithMembership: vi.fn(),
  updateCartQuantityWithMembership: vi.fn(),
  getCartWithMembership: vi.fn(),
  validateCartMembershipStatus: vi.fn(),
  refreshCartMembershipBenefits: vi.fn(),
  getCartMembershipSummary: vi.fn()
}));

describe('useMembershipCart', () => {
  const mockCart = {
    id: 'cart-1',
    checkoutUrl: 'https://checkout.url',
    totalQuantity: 1,
    lines: [{
      id: 'line-1',
      quantity: 1,
      cost: { totalAmount: { amount: '100.00', currencyCode: 'AED' } },
      merchandise: {
        id: 'variant-1',
        title: 'Test Product',
        selectedOptions: [],
        product: {
          id: 'product-1',
          handle: 'test-product',
          title: 'Test Product',
          featuredImage: { url: '', altText: '', width: 0, height: 0 }
        }
      }
    }],
    cost: {
      subtotalAmount: { amount: '100.00', currencyCode: 'AED' },
      totalAmount: { amount: '100.00', currencyCode: 'AED' },
      totalTaxAmount: { amount: '0.00', currencyCode: 'AED' }
    }
  };

  const mockMembership = {
    id: 'mem-1',
    customerId: 'customer-1',
    status: 'active' as const,
    startDate: '2024-01-01T00:00:00Z',
    expirationDate: '2025-01-01T00:00:00Z',
    paymentStatus: 'paid' as const,
    benefits: {
      serviceDiscount: 0.15,
      freeDelivery: true,
      eligibleServices: ['massage'],
      annualFee: 99
    },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockEnhancedCart = {
    ...mockCart,
    membershipBenefits: {
      serviceDiscounts: [],
      freeDelivery: true,
      totalSavings: 25,
      membershipStatus: 'active' as const,
      validationErrors: []
    },
    deliveryInfo: {
      isFree: true,
      reason: 'Member Benefit'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mocks
    (useCart as Mock).mockReturnValue({
      cart: mockCart
    });

    (useMembershipDiscount as Mock).mockReturnValue({
      membership: mockMembership,
      hasActiveMembership: true
    });

    (membershipCartActions.getCartWithMembership as Mock).mockResolvedValue({
      success: true,
      cart: mockEnhancedCart,
      membershipStatus: 'active'
    });

    (membershipCartActions.getCartMembershipSummary as Mock).mockResolvedValue({
      success: true,
      hasDiscounts: false,
      hasFreeDelivery: true,
      totalSavings: 25,
      discountCount: 0,
      statusMessage: 'ATP Membership benefits applied',
      membershipStatus: 'active'
    });
  });

  describe('initialization', () => {
    it('should initialize with correct default state', async () => {
      const { result } = renderHook(() => useMembershipCart('customer-1'));

      expect(result.current.enhancedCart).toBeNull();
      expect(result.current.membershipBenefits).toBeNull();
      expect(result.current.isLoadingBenefits).toBe(false);
      expect(result.current.membershipStatus).toBe('active');

      // Wait for effects to complete
      await waitFor(() => {
        expect(result.current.enhancedCart).toEqual(mockEnhancedCart);
      });
    });

    it('should load enhanced cart on mount', async () => {
      renderHook(() => useMembershipCart('customer-1'));

      await waitFor(() => {
        expect(membershipCartActions.getCartWithMembership).toHaveBeenCalledWith('customer-1');
        expect(membershipCartActions.getCartMembershipSummary).toHaveBeenCalledWith('customer-1');
      });
    });
  });

  describe('cart operations', () => {
    it('should add item to cart with benefits', async () => {
      (membershipCartActions.addToCartWithMembership as Mock).mockResolvedValue({
        success: true,
        cart: mockEnhancedCart,
        membershipStatus: 'active'
      });

      const { result } = renderHook(() => useMembershipCart('customer-1'));

      let addResult: boolean;
      await act(async () => {
        addResult = await result.current.addToCartWithBenefits('variant-1', 2);
      });

      expect(addResult!).toBe(true);
      expect(membershipCartActions.addToCartWithMembership).toHaveBeenCalledWith(
        'variant-1',
        2,
        'customer-1'
      );
    });

    it('should remove item from cart with benefits', async () => {
      (membershipCartActions.removeFromCartWithMembership as Mock).mockResolvedValue({
        success: true,
        cart: mockEnhancedCart,
        membershipStatus: 'active'
      });

      const { result } = renderHook(() => useMembershipCart('customer-1'));

      let removeResult: boolean;
      await act(async () => {
        removeResult = await result.current.removeFromCartWithBenefits('line-1');
      });

      expect(removeResult!).toBe(true);
      expect(membershipCartActions.removeFromCartWithMembership).toHaveBeenCalledWith(
        'line-1',
        'customer-1'
      );
    });

    it('should update quantity with benefits', async () => {
      (membershipCartActions.updateCartQuantityWithMembership as Mock).mockResolvedValue({
        success: true,
        cart: mockEnhancedCart,
        membershipStatus: 'active'
      });

      const { result } = renderHook(() => useMembershipCart('customer-1'));

      let updateResult: boolean;
      await act(async () => {
        updateResult = await result.current.updateQuantityWithBenefits('line-1', 'variant-1', 3);
      });

      expect(updateResult!).toBe(true);
      expect(membershipCartActions.updateCartQuantityWithMembership).toHaveBeenCalledWith(
        'line-1',
        'variant-1',
        3,
        'customer-1'
      );
    });
  });

  describe('membership validation', () => {
    it('should validate membership status', async () => {
      (membershipCartActions.validateCartMembershipStatus as Mock).mockResolvedValue({
        success: true,
        isValid: true,
        membershipStatus: 'active',
        errors: [],
        cart: mockEnhancedCart
      });

      const { result } = renderHook(() => useMembershipCart('customer-1'));

      let validationResult: boolean;
      await act(async () => {
        validationResult = await result.current.validateMembershipStatus();
      });

      expect(validationResult!).toBe(true);
      expect(membershipCartActions.validateCartMembershipStatus).toHaveBeenCalledWith('customer-1');
    });

    it('should refresh membership benefits', async () => {
      (membershipCartActions.refreshCartMembershipBenefits as Mock).mockResolvedValue({
        success: true,
        cart: mockEnhancedCart,
        membershipStatus: 'active'
      });

      const { result } = renderHook(() => useMembershipCart('customer-1'));

      await act(async () => {
        await result.current.refreshMembershipBenefits();
      });

      expect(membershipCartActions.refreshCartMembershipBenefits).toHaveBeenCalledWith('customer-1');
    });
  });

  describe('utility functions', () => {
    it('should return membership savings', async () => {
      const { result } = renderHook(() => useMembershipCart('customer-1'));

      await waitFor(() => {
        expect(result.current.getMembershipSavings()).toBe(25);
      });
    });

    it('should check free delivery eligibility', async () => {
      const { result } = renderHook(() => useMembershipCart('customer-1'));

      await waitFor(() => {
        expect(result.current.isEligibleForFreeDelivery()).toBe(true);
      });
    });
  });

  describe('error handling', () => {
    it('should handle failed cart operations', async () => {
      (membershipCartActions.addToCartWithMembership as Mock).mockResolvedValue({
        success: false,
        error: 'Failed to add item'
      });

      const { result } = renderHook(() => useMembershipCart('customer-1'));

      let addResult: boolean;
      await act(async () => {
        addResult = await result.current.addToCartWithBenefits('variant-1');
      });

      expect(addResult!).toBe(false);
    });

    it('should handle validation errors', async () => {
      (membershipCartActions.validateCartMembershipStatus as Mock).mockResolvedValue({
        success: false,
        isValid: false,
        membershipStatus: 'none',
        errors: ['Validation failed']
      });

      const { result } = renderHook(() => useMembershipCart('customer-1'));

      let validationResult: boolean;
      await act(async () => {
        validationResult = await result.current.validateMembershipStatus();
      });

      expect(validationResult!).toBe(false);
    });
  });

  describe('without customer ID', () => {
    it('should handle missing customer ID gracefully', () => {
      const { result } = renderHook(() => useMembershipCart());

      expect(result.current.enhancedCart).toBeNull();
      expect(result.current.membershipBenefits).toBeNull();
      expect(result.current.membershipStatus).toBe('active'); // From membership hook
    });
  });
});

describe('useCartMembershipDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useCart as Mock).mockReturnValue({
      cart: mockCart
    });

    (useMembershipDiscount as Mock).mockReturnValue({
      membership: mockMembership,
      hasActiveMembership: true
    });

    (membershipCartActions.getCartWithMembership as Mock).mockResolvedValue({
      success: true,
      cart: mockEnhancedCart,
      membershipStatus: 'active'
    });

    (membershipCartActions.getCartMembershipSummary as Mock).mockResolvedValue({
      success: true,
      hasDiscounts: true,
      hasFreeDelivery: true,
      totalSavings: 40,
      discountCount: 2,
      statusMessage: 'ATP Membership benefits applied',
      membershipStatus: 'active'
    });
  });

  it('should provide correct display information', async () => {
    const { result } = renderHook(() => 
      useMembershipCart('customer-1')
    );

    await waitFor(() => {
      expect(result.current.benefitsSummary.hasDiscounts).toBe(true);
      expect(result.current.benefitsSummary.hasFreeDelivery).toBe(true);
      expect(result.current.benefitsSummary.totalSavings).toBe(40);
      expect(result.current.benefitsSummary.discountCount).toBe(2);
    });
  });
});