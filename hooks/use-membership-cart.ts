/**
 * Membership Cart Hook
 * 
 * React hook for managing cart operations with membership benefits.
 * Provides seamless integration between cart state and membership discounts.
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useCart } from '@/components/cart/cart-context';
import { useMembershipDiscount } from './use-atp-membership';
import { EnhancedCart, MembershipCartBenefits } from '@/lib/cart/membership-cart-middleware';
import { 
  addToCartWithMembership,
  removeFromCartWithMembership,
  updateCartQuantityWithMembership,
  getCartWithMembership,
  validateCartMembershipStatus,
  refreshCartMembershipBenefits,
  getCartMembershipSummary
} from '@/components/cart/membership-cart-actions';

export interface UseMembershipCartReturn {
  // Enhanced cart state
  enhancedCart: EnhancedCart | null;
  membershipBenefits: MembershipCartBenefits | null;
  
  // Loading states
  isLoadingBenefits: boolean;
  isValidatingMembership: boolean;
  
  // Membership status
  membershipStatus: 'active' | 'expired' | 'none';
  hasMembershipBenefits: boolean;
  
  // Benefits summary
  benefitsSummary: {
    hasDiscounts: boolean;
    hasFreeDelivery: boolean;
    totalSavings: number;
    discountCount: number;
    statusMessage: string;
  };
  
  // Cart operations with membership
  addToCartWithBenefits: (merchandiseId: string, quantity?: number) => Promise<boolean>;
  removeFromCartWithBenefits: (lineId: string) => Promise<boolean>;
  updateQuantityWithBenefits: (lineId: string, merchandiseId: string, quantity: number) => Promise<boolean>;
  
  // Membership validation
  validateMembershipStatus: () => Promise<boolean>;
  refreshMembershipBenefits: () => Promise<void>;
  
  // Utility
  getMembershipSavings: () => number;
  isEligibleForFreeDelivery: () => boolean;
}

/**
 * Hook for managing cart with membership benefits
 * 
 * Requirements addressed:
 * - 4.3: Automatically apply member discounts during checkout
 * - 4.4: Real-time membership status validation
 * - 5.1: Free delivery for active members
 * - 5.2: Display membership benefits in cart
 */
export function useMembershipCart(customerId?: string): UseMembershipCartReturn {
  const { cart } = useCart();
  const { membership, hasActiveMembership } = useMembershipDiscount();
  
  // Local state for enhanced cart data
  const [enhancedCart, setEnhancedCart] = useState<EnhancedCart | null>(null);
  const [membershipBenefits, setMembershipBenefits] = useState<MembershipCartBenefits | null>(null);
  const [isLoadingBenefits, setIsLoadingBenefits] = useState(false);
  const [isValidatingMembership, setIsValidatingMembership] = useState(false);
  const [membershipStatus, setMembershipStatus] = useState<'active' | 'expired' | 'none'>('none');
  const [benefitsSummary, setBenefitsSummary] = useState({
    hasDiscounts: false,
    hasFreeDelivery: false,
    totalSavings: 0,
    discountCount: 0,
    statusMessage: 'No membership benefits'
  });

  // Load enhanced cart with membership benefits
  const loadEnhancedCart = useCallback(async () => {
    if (!cart || !customerId) {
      setEnhancedCart(null);
      setMembershipBenefits(null);
      return;
    }

    setIsLoadingBenefits(true);
    try {
      const result = await getCartWithMembership(customerId);
      if (result.success && result.cart) {
        setEnhancedCart(result.cart);
        setMembershipBenefits(result.cart.membershipBenefits || null);
        setMembershipStatus(result.membershipStatus || 'none');
      }
    } catch (error) {
      console.error('Error loading enhanced cart:', error);
    } finally {
      setIsLoadingBenefits(false);
    }
  }, [cart, customerId]);

  // Load benefits summary
  const loadBenefitsSummary = useCallback(async () => {
    if (!customerId) return;

    try {
      const summary = await getCartMembershipSummary(customerId);
      if (summary.success) {
        setBenefitsSummary({
          hasDiscounts: summary.hasDiscounts,
          hasFreeDelivery: summary.hasFreeDelivery,
          totalSavings: summary.totalSavings,
          discountCount: summary.discountCount,
          statusMessage: summary.statusMessage
        });
        setMembershipStatus(summary.membershipStatus);
      }
    } catch (error) {
      console.error('Error loading benefits summary:', error);
    }
  }, [customerId]);

  // Add to cart with membership benefits
  const addToCartWithBenefits = useCallback(async (
    merchandiseId: string, 
    quantity: number = 1
  ): Promise<boolean> => {
    try {
      const result = await addToCartWithMembership(merchandiseId, quantity, customerId);
      if (result.success && result.cart) {
        setEnhancedCart(result.cart);
        setMembershipBenefits(result.cart.membershipBenefits || null);
        setMembershipStatus(result.membershipStatus || 'none');
        await loadBenefitsSummary();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart with benefits:', error);
      return false;
    }
  }, [customerId, loadBenefitsSummary]);

  // Remove from cart with membership benefits
  const removeFromCartWithBenefits = useCallback(async (lineId: string): Promise<boolean> => {
    try {
      const result = await removeFromCartWithMembership(lineId, customerId);
      if (result.success) {
        if (result.cart) {
          setEnhancedCart(result.cart);
          setMembershipBenefits(result.cart.membershipBenefits || null);
          setMembershipStatus(result.membershipStatus || 'none');
        } else {
          // Cart is empty
          setEnhancedCart(null);
          setMembershipBenefits(null);
        }
        await loadBenefitsSummary();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart with benefits:', error);
      return false;
    }
  }, [customerId, loadBenefitsSummary]);

  // Update quantity with membership benefits
  const updateQuantityWithBenefits = useCallback(async (
    lineId: string,
    merchandiseId: string,
    quantity: number
  ): Promise<boolean> => {
    try {
      const result = await updateCartQuantityWithMembership(lineId, merchandiseId, quantity, customerId);
      if (result.success) {
        if (result.cart) {
          setEnhancedCart(result.cart);
          setMembershipBenefits(result.cart.membershipBenefits || null);
          setMembershipStatus(result.membershipStatus || 'none');
        } else if (quantity === 0) {
          // Item was removed
          await loadEnhancedCart();
        }
        await loadBenefitsSummary();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating quantity with benefits:', error);
      return false;
    }
  }, [customerId, loadBenefitsSummary, loadEnhancedCart]);

  // Validate membership status
  const validateMembershipStatus = useCallback(async (): Promise<boolean> => {
    if (!customerId) return false;

    setIsValidatingMembership(true);
    try {
      const result = await validateCartMembershipStatus(customerId);
      if (result.success) {
        setMembershipStatus(result.membershipStatus);
        if (result.cart) {
          setEnhancedCart(result.cart);
          setMembershipBenefits(result.cart.membershipBenefits || null);
        }
        await loadBenefitsSummary();
        return result.isValid;
      }
      return false;
    } catch (error) {
      console.error('Error validating membership status:', error);
      return false;
    } finally {
      setIsValidatingMembership(false);
    }
  }, [customerId, loadBenefitsSummary]);

  // Refresh membership benefits
  const refreshMembershipBenefits = useCallback(async () => {
    if (!customerId) return;

    setIsLoadingBenefits(true);
    try {
      const result = await refreshCartMembershipBenefits(customerId);
      if (result.success && result.cart) {
        setEnhancedCart(result.cart);
        setMembershipBenefits(result.cart.membershipBenefits || null);
        setMembershipStatus(result.membershipStatus || 'none');
        await loadBenefitsSummary();
      }
    } catch (error) {
      console.error('Error refreshing membership benefits:', error);
    } finally {
      setIsLoadingBenefits(false);
    }
  }, [customerId, loadBenefitsSummary]);

  // Get total membership savings
  const getMembershipSavings = useCallback((): number => {
    return benefitsSummary.totalSavings;
  }, [benefitsSummary.totalSavings]);

  // Check free delivery eligibility
  const isEligibleForFreeDelivery = useCallback((): boolean => {
    return benefitsSummary.hasFreeDelivery;
  }, [benefitsSummary.hasFreeDelivery]);

  // Load enhanced cart when cart or membership changes
  useEffect(() => {
    loadEnhancedCart();
  }, [loadEnhancedCart]);

  // Load benefits summary when customer or membership changes
  useEffect(() => {
    loadBenefitsSummary();
  }, [loadBenefitsSummary]);

  // Update membership status based on membership hook
  useEffect(() => {
    if (hasActiveMembership) {
      setMembershipStatus('active');
    } else if (membership && membership.status === 'expired') {
      setMembershipStatus('expired');
    } else {
      setMembershipStatus('none');
    }
  }, [membership, hasActiveMembership]);

  return {
    // Enhanced cart state
    enhancedCart,
    membershipBenefits,
    
    // Loading states
    isLoadingBenefits,
    isValidatingMembership,
    
    // Membership status
    membershipStatus,
    hasMembershipBenefits: membershipStatus === 'active',
    
    // Benefits summary
    benefitsSummary,
    
    // Cart operations with membership
    addToCartWithBenefits,
    removeFromCartWithBenefits,
    updateQuantityWithBenefits,
    
    // Membership validation
    validateMembershipStatus,
    refreshMembershipBenefits,
    
    // Utility
    getMembershipSavings,
    isEligibleForFreeDelivery
  };
}

/**
 * Hook for cart membership status display
 * Specialized hook for showing membership benefits in cart UI
 */
export function useCartMembershipDisplay(customerId?: string) {
  const { 
    membershipStatus, 
    benefitsSummary, 
    membershipBenefits,
    isLoadingBenefits 
  } = useMembershipCart(customerId);

  const displayInfo = {
    showMembershipBadge: membershipStatus === 'active',
    showExpiredWarning: membershipStatus === 'expired',
    showSignupPrompt: membershipStatus === 'none',
    
    discountText: benefitsSummary.hasDiscounts 
      ? `${benefitsSummary.discountCount} service${benefitsSummary.discountCount > 1 ? 's' : ''} discounted`
      : '',
      
    deliveryText: benefitsSummary.hasFreeDelivery 
      ? 'Free Delivery - Member Benefit'
      : 'Standard Delivery',
      
    savingsText: benefitsSummary.totalSavings > 0 
      ? `You're saving ${benefitsSummary.totalSavings.toFixed(2)} AED`
      : '',
      
    statusMessage: benefitsSummary.statusMessage
  };

  return {
    membershipStatus,
    membershipBenefits,
    isLoadingBenefits,
    displayInfo,
    totalSavings: benefitsSummary.totalSavings,
    hasAnyBenefits: benefitsSummary.hasDiscounts || benefitsSummary.hasFreeDelivery
  };
}