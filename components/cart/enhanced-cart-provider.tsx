/**
 * Enhanced Cart Provider
 * 
 * Comprehensive cart provider that integrates membership benefits,
 * customer authentication, and cart state management.
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartProvider } from './cart-context';
import { CartNotificationProvider } from './cart-provider';
import { AtpMembershipProvider } from '@/hooks/use-atp-membership-context';
import { useCartCustomerContext } from '@/lib/cart/cart-customer-utils';
import { useMembershipCart } from '@/hooks/use-membership-cart';
import { EnhancedCart } from '@/lib/cart/membership-cart-middleware';
import { Cart } from '@/lib/shopify/types';

interface EnhancedCartContextType {
  // Customer context
  customerId?: string | undefined;
  isAuthenticated: boolean;
  
  // Enhanced cart with membership benefits
  enhancedCart: EnhancedCart | null;
  originalCart: Cart | undefined;
  
  // Membership integration
  hasMembershipBenefits: boolean;
  membershipStatus: 'active' | 'expired' | 'none';
  totalSavings: number;
  
  // Loading states
  isLoadingBenefits: boolean;
  isValidatingMembership: boolean;
  
  // Actions
  refreshMembershipBenefits: () => Promise<void>;
  validateMembershipStatus: () => Promise<boolean>;
}

const EnhancedCartContext = createContext<EnhancedCartContextType | undefined>(undefined);

interface EnhancedCartProviderProps {
  children: React.ReactNode;
  initialCart?: Cart;
}

/**
 * Enhanced Cart Provider that integrates all cart functionality
 * Requirements: 4.3, 4.4, 5.1, 5.2 - Comprehensive cart integration
 */
export function EnhancedCartProvider({ 
  children, 
  initialCart 
}: EnhancedCartProviderProps) {
  const { customerId, isAuthenticated, isLoading: isLoadingAuth } = useCartCustomerContext();
  
  return (
    <CartProvider initialCart={initialCart}>
      <CartNotificationProvider>
        <AtpMembershipProvider>
          <EnhancedCartContextProvider 
            customerId={customerId}
            isAuthenticated={isAuthenticated}
            isLoadingAuth={isLoadingAuth}
          >
            {children}
          </EnhancedCartContextProvider>
        </AtpMembershipProvider>
      </CartNotificationProvider>
    </CartProvider>
  );
}

/**
 * Internal context provider for enhanced cart functionality
 */
function EnhancedCartContextProvider({
  children,
  customerId,
  isAuthenticated,
  isLoadingAuth
}: {
  children: React.ReactNode;
  customerId?: string | undefined;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
}) {
  const {
    enhancedCart,
    benefitsSummary,
    membershipStatus,
    isLoadingBenefits,
    isValidatingMembership,
    refreshMembershipBenefits,
    validateMembershipStatus
  } = useMembershipCart(customerId);

  const [originalCart, setOriginalCart] = useState<Cart | undefined>();

  // Track original cart for comparison
  useEffect(() => {
    if (enhancedCart) {
      // Extract original cart data (without membership enhancements)
      const { membershipBenefits, deliveryInfo, ...originalCartData } = enhancedCart;
      setOriginalCart(originalCartData as Cart);
    }
  }, [enhancedCart]);

  const contextValue: EnhancedCartContextType = {
    // Customer context
    customerId,
    isAuthenticated,
    
    // Enhanced cart with membership benefits
    enhancedCart,
    originalCart,
    
    // Membership integration
    hasMembershipBenefits: membershipStatus === 'active',
    membershipStatus,
    totalSavings: benefitsSummary.totalSavings,
    
    // Loading states
    isLoadingBenefits: isLoadingBenefits || isLoadingAuth,
    isValidatingMembership,
    
    // Actions
    refreshMembershipBenefits,
    validateMembershipStatus
  };

  return (
    <EnhancedCartContext.Provider value={contextValue}>
      {children}
    </EnhancedCartContext.Provider>
  );
}

/**
 * Hook to use enhanced cart context
 */
export function useEnhancedCart(): EnhancedCartContextType {
  const context = useContext(EnhancedCartContext);
  if (context === undefined) {
    throw new Error('useEnhancedCart must be used within an EnhancedCartProvider');
  }
  return context;
}

/**
 * Hook for cart operations with automatic membership integration
 */
export function useEnhancedCartOperations() {
  const { customerId } = useEnhancedCart();
  const {
    addToCartWithBenefits,
    removeFromCartWithBenefits,
    updateQuantityWithBenefits
  } = useMembershipCart(customerId);

  return {
    addToCart: addToCartWithBenefits,
    removeFromCart: removeFromCartWithBenefits,
    updateQuantity: updateQuantityWithBenefits
  };
}

/**
 * Hook for cart display with membership benefits
 */
export function useEnhancedCartDisplay() {
  const {
    enhancedCart,
    originalCart,
    hasMembershipBenefits,
    membershipStatus,
    totalSavings,
    isLoadingBenefits
  } = useEnhancedCart();

  const displayCart = enhancedCart || originalCart;
  const hasItems = displayCart && displayCart.lines.length > 0;
  const itemCount = displayCart?.totalQuantity || 0;

  // Calculate display values
  const subtotal = displayCart ? parseFloat(displayCart.cost.subtotalAmount.amount) : 0;
  const total = displayCart ? parseFloat(displayCart.cost.totalAmount.amount) : 0;
  const savings = totalSavings;
  const finalTotal = Math.max(0, total - savings);

  return {
    // Cart data
    cart: displayCart,
    hasItems,
    itemCount,
    
    // Pricing
    subtotal,
    total,
    savings,
    finalTotal,
    
    // Membership
    hasMembershipBenefits,
    membershipStatus,
    
    // Display states
    isLoadingBenefits,
    showMembershipBadge: membershipStatus === 'active',
    showExpiredWarning: membershipStatus === 'expired',
    showSignupPrompt: membershipStatus === 'none'
  };
}

/**
 * Hook for checkout with membership validation
 */
export function useEnhancedCheckout() {
  const { 
    enhancedCart, 
    customerId, 
    validateMembershipStatus,
    isValidatingMembership 
  } = useEnhancedCart();

  const proceedToCheckout = async (): Promise<boolean> => {
    try {
      // Validate membership status before checkout if customer is authenticated
      if (customerId) {
        const isValid = await validateMembershipStatus();
        if (!isValid) {
          console.warn('Membership validation failed, proceeding with standard checkout');
        }
      }

      // Redirect to checkout
      if (enhancedCart?.checkoutUrl) {
        window.location.href = enhancedCart.checkoutUrl;
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error during checkout:', error);
      return false;
    }
  };

  return {
    proceedToCheckout,
    isValidatingMembership,
    canCheckout: !!enhancedCart?.checkoutUrl
  };
}

/**
 * Component wrapper that provides enhanced cart context
 */
export function withEnhancedCart<P extends object>(
  Component: React.ComponentType<P>
) {
  return function EnhancedCartWrapper(props: P) {
    return (
      <EnhancedCartProvider>
        <Component {...props} />
      </EnhancedCartProvider>
    );
  };
}