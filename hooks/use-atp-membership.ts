/**
 * ATP Membership Hook
 * 
 * Main hook for accessing ATP membership functionality.
 * Provides a simplified interface for membership operations and state.
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useMembershipContext } from './use-atp-membership-context';
import { useMembershipApiErrorHandling } from './use-membership-error-handling';
import {
  AtpMembership,
  MembershipStats,
  DiscountCalculation,
  ServiceDiscountInfo,
  MembershipValidation,
  MembershipError as TypesMembershipError
} from '../lib/types/membership';
import { MembershipError, MembershipErrorFactory } from '../lib/errors/membership-errors';

// Hook return interface
export interface UseAtpMembershipReturn {
  // State
  membership: AtpMembership | null;
  stats: MembershipStats | null;
  isLoading: boolean;
  error: TypesMembershipError | MembershipError | null;
  isInitialized: boolean;
  lastUpdated: string | null;

  // Computed state
  isActive: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  daysUntilExpiration: number;
  requiresRenewal: boolean;

  // Operations
  loadMembership: (customerId: string) => Promise<void>;
  purchaseMembership: (customerId: string) => Promise<string>;
  renewMembership: (membershipId: string) => Promise<void>;
  cancelMembership: (membershipId: string) => Promise<void>;
  refreshMembership: () => Promise<void>;

  // Discount and benefits
  calculateDiscount: (price: number, serviceId?: string) => DiscountCalculation;
  getServiceDiscountInfo: (serviceId: string, price: number) => ServiceDiscountInfo;
  isEligibleForFreeDelivery: () => boolean;
  validateMembership: () => MembershipValidation;

  // Utility
  clearError: () => void;
}

/**
 * Main hook for ATP membership functionality
 * 
 * Requirements addressed:
 * - 3.2: Display membership status and benefits
 * - 3.3: Show membership details and savings
 * - 4.4: Real-time membership status validation
 * - 5.2: Free delivery eligibility check
 */
export function useAtpMembership(): UseAtpMembershipReturn {
  const context = useMembershipContext();
  const errorHandling = useMembershipApiErrorHandling();

  // Computed state based on membership data
  const computedState = useMemo(() => {
    const validation = context.validateMembership();
    
    return {
      isActive: validation.isActive,
      isExpired: validation.isExpired,
      isExpiringSoon: validation.requiresRenewal && !validation.isExpired,
      daysUntilExpiration: validation.daysUntilExpiration,
      requiresRenewal: validation.requiresRenewal
    };
  }, [context.membership]);

  // Memoized operations to prevent unnecessary re-renders
  const operations = useMemo(() => ({
    loadMembership: context.loadMembership,
    purchaseMembership: context.purchaseMembership,
    renewMembership: context.renewMembership,
    cancelMembership: context.cancelMembership,
    refreshMembership: context.refreshMembership,
    calculateDiscount: context.calculateDiscount,
    getServiceDiscountInfo: context.getServiceDiscountInfo,
    isEligibleForFreeDelivery: context.isEligibleForFreeDelivery,
    validateMembership: context.validateMembership,
    clearError: context.clearError
  }), [context]);

  return {
    // State from context
    membership: context.membership,
    stats: context.stats,
    isLoading: context.isLoading,
    error: context.error,
    isInitialized: context.isInitialized,
    lastUpdated: context.lastUpdated,

    // Computed state
    ...computedState,

    // Operations
    ...operations
  };
}

/**
 * Hook for membership discount calculations
 * Specialized hook for pricing components
 */
export function useMembershipDiscount() {
  const { membership, calculateDiscount, getServiceDiscountInfo, isEligibleForFreeDelivery } = useAtpMembership();

  const calculateServiceDiscount = useCallback((price: number, serviceId?: string) => {
    return calculateDiscount(price, serviceId);
  }, [calculateDiscount]);

  const getDiscountInfo = useCallback((serviceId: string, price: number) => {
    return getServiceDiscountInfo(serviceId, price);
  }, [getServiceDiscountInfo]);

  const checkFreeDeliveryEligibility = useCallback(() => {
    return isEligibleForFreeDelivery();
  }, [isEligibleForFreeDelivery]);

  return {
    membership,
    calculateServiceDiscount,
    getDiscountInfo,
    checkFreeDeliveryEligibility,
    hasActiveMembership: !!membership && membership.status === 'active'
  };
}

/**
 * Hook for membership status checks
 * Specialized hook for conditional rendering
 */
export function useMembershipStatus() {
  const { 
    membership, 
    isActive, 
    isExpired, 
    isExpiringSoon, 
    daysUntilExpiration, 
    requiresRenewal,
    validateMembership 
  } = useAtpMembership();

  const statusInfo = useMemo(() => {
    if (!membership) {
      return {
        status: 'none' as const,
        message: 'No membership found',
        actionRequired: false
      };
    }

    if (isExpired) {
      return {
        status: 'expired' as const,
        message: 'Membership has expired',
        actionRequired: true
      };
    }

    if (isExpiringSoon) {
      return {
        status: 'expiring' as const,
        message: `Membership expires in ${daysUntilExpiration} days`,
        actionRequired: true
      };
    }

    if (isActive) {
      return {
        status: 'active' as const,
        message: `Membership active until ${new Date(membership.expirationDate).toLocaleDateString()}`,
        actionRequired: false
      };
    }

    return {
      status: 'inactive' as const,
      message: 'Membership is not active',
      actionRequired: true
    };
  }, [membership, isActive, isExpired, isExpiringSoon, daysUntilExpiration]);

  return {
    membership,
    isActive,
    isExpired,
    isExpiringSoon,
    daysUntilExpiration,
    requiresRenewal,
    statusInfo,
    validateMembership
  };
}

/**
 * Hook for membership operations
 * Specialized hook for membership management components
 */
export function useMembershipOperations() {
  const { 
    membership,
    isLoading,
    error,
    purchaseMembership,
    renewMembership,
    cancelMembership,
    refreshMembership,
    clearError
  } = useAtpMembership();
  
  const errorHandling = useMembershipApiErrorHandling();

  const handlePurchase = useCallback(async (customerId: string) => {
    const result = await errorHandling.handleAsyncError(async () => {
      return await purchaseMembership(customerId);
    });
    
    if (result) {
      return { success: true, checkoutUrl: result };
    } else {
      return { 
        success: false, 
        error: errorHandling.errors[0] || MembershipErrorFactory.paymentFailed('Purchase operation failed')
      };
    }
  }, [purchaseMembership, errorHandling]);

  const handleRenewal = useCallback(async (membershipId: string) => {
    const result = await errorHandling.handleAsyncError(async () => {
      await renewMembership(membershipId);
      return true;
    });
    
    if (result) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: errorHandling.errors[0] || MembershipErrorFactory.paymentFailed('Renewal operation failed')
      };
    }
  }, [renewMembership, errorHandling]);

  const handleCancellation = useCallback(async (membershipId: string) => {
    const result = await errorHandling.handleAsyncError(async () => {
      await cancelMembership(membershipId);
      return true;
    });
    
    if (result) {
      return { success: true };
    } else {
      return { 
        success: false, 
        error: errorHandling.errors[0] || new MembershipError(
          'Cancellation failed',
          'CANCELLATION_FAILED' as any
        )
      };
    }
  }, [cancelMembership, errorHandling]);

  return {
    membership,
    isLoading,
    error,
    handlePurchase,
    handleRenewal,
    handleCancellation,
    refreshMembership,
    clearError
  };
}