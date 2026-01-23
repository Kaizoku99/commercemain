/**
 * ATP Membership Context
 * 
 * React context for managing ATP membership state across the application.
 * Provides membership data, operations, and caching functionality.
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import {
  AtpMembership,
  MembershipStats,
  MembershipError,
  MembershipErrorCode,
  DiscountCalculation,
  ServiceDiscountInfo,
  MembershipValidation
} from '../lib/types/membership';
import { atpMembershipService } from '../lib/services/atp-membership-service';
import { getMembershipCheckoutUrl } from '../lib/config/membership';

// Context state interface
interface MembershipContextState {
  membership: AtpMembership | null;
  stats: MembershipStats | null;
  isLoading: boolean;
  error: MembershipError | null;
  isInitialized: boolean;
  lastUpdated: string | null;
}

// Context actions interface
interface MembershipContextActions {
  loadMembership: (customerId: string) => Promise<void>;
  purchaseMembership: (customerId: string) => Promise<string>;
  renewMembership: (membershipId: string) => Promise<void>;
  cancelMembership: (membershipId: string) => Promise<void>;
  calculateDiscount: (price: number, serviceId?: string) => DiscountCalculation;
  getServiceDiscountInfo: (serviceId: string, price: number) => ServiceDiscountInfo;
  isEligibleForFreeDelivery: () => boolean;
  validateMembership: () => MembershipValidation;
  clearError: () => void;
  refreshMembership: () => Promise<void>;
}

// Combined context interface
interface MembershipContextValue extends MembershipContextState, MembershipContextActions {}

// Action types for reducer
type MembershipAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: { membership: AtpMembership | null; stats: MembershipStats | null } }
  | { type: 'LOAD_ERROR'; payload: MembershipError }
  | { type: 'UPDATE_MEMBERSHIP'; payload: AtpMembership }
  | { type: 'UPDATE_STATS'; payload: MembershipStats }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_INITIALIZED'; payload: boolean };

// Initial state
const initialState: MembershipContextState = {
  membership: null,
  stats: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  lastUpdated: null
};

// Reducer function
function membershipReducer(state: MembershipContextState, action: MembershipAction): MembershipContextState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case 'LOAD_SUCCESS':
      return {
        ...state,
        membership: action.payload.membership,
        stats: action.payload.stats,
        isLoading: false,
        error: null,
        isInitialized: true,
        lastUpdated: new Date().toISOString()
      };

    case 'LOAD_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        isInitialized: true
      };

    case 'UPDATE_MEMBERSHIP':
      return {
        ...state,
        membership: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case 'UPDATE_STATS':
      return {
        ...state,
        stats: action.payload,
        lastUpdated: new Date().toISOString()
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };

    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload
      };

    default:
      return state;
  }
}

// Create context
const MembershipContext = createContext<MembershipContextValue | null>(null);

// Local storage keys
const STORAGE_KEYS = {
  MEMBERSHIP: 'atp_membership',
  STATS: 'atp_membership_stats',
  LAST_UPDATED: 'atp_membership_last_updated'
} as const;

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Provider component props
interface MembershipProviderProps {
  children: React.ReactNode;
  customerId?: string;
}

// Provider component
export function MembershipProvider({ children, customerId }: MembershipProviderProps) {
  const [state, dispatch] = useReducer(membershipReducer, initialState);

  // Load membership data from cache or API
  const loadMembership = useCallback(async (customerIdParam?: string) => {
    const targetCustomerId = customerIdParam || customerId;
    
    if (!targetCustomerId) {
      dispatch({
        type: 'LOAD_ERROR',
        payload: new MembershipError(
          'Customer ID is required to load membership',
          MembershipErrorCode.INVALID_CUSTOMER
        )
      });
      return;
    }

    dispatch({ type: 'LOAD_START' });

    try {
      // Try to load from cache first
      const cachedData = loadFromCache();
      if (cachedData && isCacheValid(cachedData.lastUpdated)) {
        dispatch({
          type: 'LOAD_SUCCESS',
          payload: {
            membership: cachedData.membership,
            stats: cachedData.stats
          }
        });
        return;
      }

      // Load from API
      const [membershipResult, statsResult] = await Promise.all([
        atpMembershipService.getMembership(targetCustomerId),
        atpMembershipService.getMembershipStats(targetCustomerId)
      ]);

      if (!membershipResult.success) {
        throw membershipResult.error;
      }

      if (!statsResult.success) {
        throw statsResult.error;
      }

      const membership = membershipResult.data;
      const stats = statsResult.data;

      // Cache the results
      saveToCache(membership, stats);

      dispatch({
        type: 'LOAD_SUCCESS',
        payload: { membership, stats }
      });

    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            'Failed to load membership data',
            MembershipErrorCode.NETWORK_ERROR,
            error
          );

      dispatch({
        type: 'LOAD_ERROR',
        payload: membershipError
      });
    }
  }, [customerId]);

  // Purchase membership
  const purchaseMembership = useCallback(async (customerIdParam: string): Promise<string> => {
    try {
      const result = await atpMembershipService.createMembership({
        customerId: customerIdParam
      });

      if (!result.success) {
        throw result.error;
      }

      // Update state with new membership
      dispatch({
        type: 'UPDATE_MEMBERSHIP',
        payload: result.data
      });

      // Clear cache to force refresh
      clearCache();

      // Return checkout URL with proper variant ID if configured
      // Falls back to product page if no variant ID is set
      return getMembershipCheckoutUrl(result.data.id, 'en');

    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            'Failed to purchase membership',
            MembershipErrorCode.PAYMENT_FAILED,
            error
          );

      dispatch({
        type: 'LOAD_ERROR',
        payload: membershipError
      });

      throw membershipError;
    }
  }, []);

  // Renew membership
  const renewMembership = useCallback(async (membershipId: string): Promise<void> => {
    try {
      const result = await atpMembershipService.renewMembership({
        membershipId,
        extendFromCurrentExpiration: true
      });

      if (!result.success) {
        throw result.error;
      }

      // Update state with renewed membership
      dispatch({
        type: 'UPDATE_MEMBERSHIP',
        payload: result.data
      });

      // Clear cache to force refresh
      clearCache();

    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            'Failed to renew membership',
            MembershipErrorCode.RENEWAL_FAILED,
            error
          );

      dispatch({
        type: 'LOAD_ERROR',
        payload: membershipError
      });

      throw membershipError;
    }
  }, []);

  // Cancel membership
  const cancelMembership = useCallback(async (membershipId: string): Promise<void> => {
    try {
      const result = await atpMembershipService.cancelMembership(membershipId);

      if (!result.success) {
        throw result.error;
      }

      // Update state with cancelled membership
      dispatch({
        type: 'UPDATE_MEMBERSHIP',
        payload: result.data
      });

      // Clear cache to force refresh
      clearCache();

    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            'Failed to cancel membership',
            MembershipErrorCode.CANCELLATION_FAILED,
            error
          );

      dispatch({
        type: 'LOAD_ERROR',
        payload: membershipError
      });

      throw membershipError;
    }
  }, []);

  // Calculate discount for a price
  const calculateDiscount = useCallback((price: number, serviceId?: string): DiscountCalculation => {
    return atpMembershipService.calculateServiceDiscount(price, state.membership, serviceId);
  }, [state.membership]);

  // Get service discount information
  const getServiceDiscountInfo = useCallback((serviceId: string, price: number): ServiceDiscountInfo => {
    return atpMembershipService.getServiceDiscountInfo(serviceId, price, state.membership);
  }, [state.membership]);

  // Check if eligible for free delivery
  const isEligibleForFreeDelivery = useCallback((): boolean => {
    return atpMembershipService.isEligibleForFreeDelivery(state.membership);
  }, [state.membership]);

  // Validate membership
  const validateMembership = useCallback((): MembershipValidation => {
    return atpMembershipService.validateMembership(state.membership);
  }, [state.membership]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Refresh membership data
  const refreshMembership = useCallback(async (): Promise<void> => {
    if (customerId) {
      clearCache();
      await loadMembership(customerId);
    }
  }, [customerId, loadMembership]);

  // Load membership on mount if customerId is provided
  useEffect(() => {
    if (customerId && !state.isInitialized) {
      loadMembership(customerId);
    }
  }, [customerId, loadMembership, state.isInitialized]);

  // Context value
  const contextValue: MembershipContextValue = {
    // State
    ...state,
    // Actions
    loadMembership,
    purchaseMembership,
    renewMembership,
    cancelMembership,
    calculateDiscount,
    getServiceDiscountInfo,
    isEligibleForFreeDelivery,
    validateMembership,
    clearError,
    refreshMembership
  };

  return (
    <MembershipContext.Provider value={contextValue}>
      {children}
    </MembershipContext.Provider>
  );
}

// Hook to use membership context
export function useMembershipContext(): MembershipContextValue {
  const context = useContext(MembershipContext);
  
  if (!context) {
    throw new Error('useMembershipContext must be used within a MembershipProvider');
  }
  
  return context;
}

// Cache management functions
function loadFromCache(): { membership: AtpMembership | null; stats: MembershipStats | null; lastUpdated: string } | null {
  try {
    if (typeof window === 'undefined') return null;

    const membershipData = localStorage.getItem(STORAGE_KEYS.MEMBERSHIP);
    const statsData = localStorage.getItem(STORAGE_KEYS.STATS);
    const lastUpdated = localStorage.getItem(STORAGE_KEYS.LAST_UPDATED);

    if (!lastUpdated) return null;

    return {
      membership: membershipData ? JSON.parse(membershipData) : null,
      stats: statsData ? JSON.parse(statsData) : null,
      lastUpdated
    };
  } catch (error) {
    console.warn('Failed to load membership data from cache:', error);
    return null;
  }
}

function saveToCache(membership: AtpMembership | null, stats: MembershipStats | null): void {
  try {
    if (typeof window === 'undefined') return;

    const now = new Date().toISOString();

    if (membership) {
      localStorage.setItem(STORAGE_KEYS.MEMBERSHIP, JSON.stringify(membership));
    } else {
      localStorage.removeItem(STORAGE_KEYS.MEMBERSHIP);
    }

    if (stats) {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } else {
      localStorage.removeItem(STORAGE_KEYS.STATS);
    }

    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, now);
  } catch (error) {
    console.warn('Failed to save membership data to cache:', error);
  }
}

function clearCache(): void {
  try {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(STORAGE_KEYS.MEMBERSHIP);
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.LAST_UPDATED);
  } catch (error) {
    console.warn('Failed to clear membership cache:', error);
  }
}

function isCacheValid(lastUpdated: string): boolean {
  try {
    const lastUpdatedTime = new Date(lastUpdated).getTime();
    const now = Date.now();
    return (now - lastUpdatedTime) < CACHE_DURATION;
  } catch (error) {
    return false;
  }
}

// Alias export for backward compatibility
export { MembershipProvider as AtpMembershipProvider };