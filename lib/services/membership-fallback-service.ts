/**
 * Graceful degradation service for membership system
 * Provides fallback functionality when APIs are unavailable
 */

import { MembershipError, MembershipErrorCode, MembershipErrorFactory } from '../errors/membership-errors';
import type { AtpMembership, MembershipStats } from '../types/membership';

export interface FallbackConfig {
  enableLocalStorage: boolean;
  enableOfflineMode: boolean;
  retryAttempts: number;
  retryDelay: number;
  cacheTimeout: number;
}

export interface CachedMembershipData {
  membership: AtpMembership | null;
  stats: MembershipStats | null;
  timestamp: number;
  version: string;
}

export class MembershipFallbackService {
  private static readonly STORAGE_KEY = 'atp_membership_cache';
  private static readonly CACHE_VERSION = '1.0.0';
  private static readonly DEFAULT_CONFIG: FallbackConfig = {
    enableLocalStorage: true,
    enableOfflineMode: true,
    retryAttempts: 3,
    retryDelay: 1000,
    cacheTimeout: 5 * 60 * 1000 // 5 minutes
  };

  private config: FallbackConfig;

  constructor(config: Partial<FallbackConfig> = {}) {
    this.config = { ...MembershipFallbackService.DEFAULT_CONFIG, ...config };
  }

  /**
   * Execute operation with fallback handling
   */
  async executeWithFallback<T>(
    operation: () => Promise<T>,
    fallbackOperation?: () => Promise<T> | T,
    operationName: string = 'operation'
  ): Promise<T> {
    let lastError: Error | null = null;

    // Try main operation with retries
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const result = await operation();
        return result;
      } catch (error) {
        lastError = error as Error;
        
        console.warn(`${operationName} attempt ${attempt} failed:`, error);

        // If it's the last attempt, don't wait
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempt);
        }
      }
    }

    // Try fallback operation if available
    if (fallbackOperation) {
      try {
        console.info(`Using fallback for ${operationName}`);
        return await fallbackOperation();
      } catch (fallbackError) {
        console.error(`Fallback for ${operationName} also failed:`, fallbackError);
      }
    }

    // If all attempts failed, throw appropriate error
    throw this.createFallbackError(lastError!, operationName);
  }

  /**
   * Cache membership data locally
   */
  cacheMembershipData(membership: AtpMembership | null, stats: MembershipStats | null): void {
    if (!this.config.enableLocalStorage) return;

    try {
      const cacheData: CachedMembershipData = {
        membership,
        stats,
        timestamp: Date.now(),
        version: MembershipFallbackService.CACHE_VERSION
      };

      localStorage.setItem(
        MembershipFallbackService.STORAGE_KEY,
        JSON.stringify(cacheData)
      );
    } catch (error) {
      console.warn('Failed to cache membership data:', error);
    }
  }

  /**
   * Get cached membership data
   */
  getCachedMembershipData(): CachedMembershipData | null {
    if (!this.config.enableLocalStorage) return null;

    try {
      const cached = localStorage.getItem(MembershipFallbackService.STORAGE_KEY);
      if (!cached) return null;

      const data: CachedMembershipData = JSON.parse(cached);
      
      // Check version compatibility
      if (data.version !== MembershipFallbackService.CACHE_VERSION) {
        this.clearCache();
        return null;
      }

      // Check if cache is still valid
      const isExpired = Date.now() - data.timestamp > this.config.cacheTimeout;
      if (isExpired) {
        this.clearCache();
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Failed to read cached membership data:', error);
      this.clearCache();
      return null;
    }
  }

  /**
   * Clear cached data
   */
  clearCache(): void {
    try {
      localStorage.removeItem(MembershipFallbackService.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear membership cache:', error);
    }
  }

  /**
   * Get fallback membership data when API is unavailable
   */
  getFallbackMembership(customerId: string): AtpMembership | null {
    const cached = this.getCachedMembershipData();
    
    if (cached?.membership && cached.membership.customerId === customerId) {
      // Add warning that this is cached data
      console.warn('Using cached membership data due to API unavailability');
      return {
        ...cached.membership,
        // Mark as potentially stale
        _isCached: true
      } as AtpMembership & { _isCached: boolean };
    }

    return null;
  }

  /**
   * Get fallback membership stats
   */
  getFallbackStats(customerId: string): MembershipStats | null {
    const cached = this.getCachedMembershipData();
    
    if (cached?.stats) {
      console.warn('Using cached membership stats due to API unavailability');
      return cached.stats;
    }

    // Return basic fallback stats
    return {
      totalSavings: 0,
      servicesUsed: 0,
      ordersWithFreeDelivery: 0,
      memberSince: new Date().toISOString(),
      averageOrderValue: 0,
      totalOrders: 0
    };
  }

  /**
   * Fallback discount calculation when API is unavailable
   */
  calculateFallbackDiscount(originalPrice: number, membership: AtpMembership | null): number {
    if (!membership || membership.status !== 'active') {
      return originalPrice;
    }

    // Check if membership is expired (basic check)
    const now = new Date();
    const expirationDate = new Date(membership.expirationDate);
    
    if (expirationDate <= now) {
      return originalPrice;
    }

    // Apply standard 15% discount
    const discountAmount = originalPrice * 0.15;
    return originalPrice - discountAmount;
  }

  /**
   * Check if free delivery should be applied (fallback)
   */
  shouldApplyFreeDeliveryFallback(membership: AtpMembership | null): boolean {
    if (!membership || membership.status !== 'active') {
      return false;
    }

    // Basic expiration check
    const now = new Date();
    const expirationDate = new Date(membership.expirationDate);
    
    return expirationDate > now;
  }

  /**
   * Handle offline mode functionality
   */
  isOfflineMode(): boolean {
    return !navigator.onLine && this.config.enableOfflineMode;
  }

  /**
   * Get offline-friendly error message
   */
  getOfflineMessage(): string {
    return 'You appear to be offline. Some features may be limited until connection is restored.';
  }

  /**
   * Create appropriate fallback error
   */
  private createFallbackError(originalError: Error, operationName: string): MembershipError {
    if (originalError instanceof MembershipError) {
      return originalError;
    }

    // Network-related errors
    if (this.isNetworkError(originalError)) {
      return MembershipErrorFactory.networkError(originalError);
    }

    // API-related errors
    if (this.isApiError(originalError)) {
      return MembershipErrorFactory.shopifyApiError(originalError);
    }

    // Generic service unavailable
    return new MembershipError(
      `Service temporarily unavailable: ${operationName}`,
      MembershipErrorCode.SERVICE_UNAVAILABLE,
      { context: { operationName, originalMessage: originalError.message } },
      true,
      503
    );
  }

  /**
   * Check if error is network-related
   */
  private isNetworkError(error: Error): boolean {
    const networkKeywords = [
      'network',
      'fetch',
      'connection',
      'timeout',
      'offline',
      'unreachable'
    ];

    return networkKeywords.some(keyword =>
      error.message.toLowerCase().includes(keyword)
    );
  }

  /**
   * Check if error is API-related
   */
  private isApiError(error: Error): boolean {
    const apiKeywords = [
      'api',
      'shopify',
      'graphql',
      'unauthorized',
      'forbidden',
      'rate limit'
    ];

    return apiKeywords.some(keyword =>
      error.message.toLowerCase().includes(keyword)
    );
  }

  /**
   * Delay utility for retries
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Monitor network status and clear cache when back online
   */
  setupNetworkMonitoring(): (() => void) | undefined {
    if (typeof window === 'undefined') return undefined;

    const handleOnline = () => {
      console.info('Network connection restored');
      // Optionally clear cache to force fresh data
      // this.clearCache();
    };

    const handleOffline = () => {
      console.warn('Network connection lost - entering offline mode');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }
}

/**
 * Default instance for use throughout the application
 */
export const membershipFallbackService = new MembershipFallbackService();

/**
 * Utility functions for graceful degradation
 */
export class GracefulDegradationUtils {
  /**
   * Wrap async operation with fallback handling
   */
  static async withFallback<T>(
    operation: () => Promise<T>,
    fallback: T,
    operationName?: string
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.warn(`Operation ${operationName || 'unknown'} failed, using fallback:`, error);
      return fallback;
    }
  }

  /**
   * Create a degraded version of membership features
   */
  static createDegradedMembership(customerId: string): AtpMembership {
    return {
      id: `degraded_${customerId}`,
      customerId,
      status: 'active',
      startDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      paymentStatus: 'paid',
      benefits: {
        serviceDiscount: 0.15,
        freeDelivery: true,
        eligibleServices: ['massage', 'ems', 'yoga', 'supplements']
      },
      _isDegraded: true
    } as AtpMembership & { _isDegraded: boolean };
  }

  /**
   * Show user-friendly degradation notice
   */
  static getDegradationNotice(feature: string): string {
    return `${feature} is currently running in limited mode due to connectivity issues. Full functionality will be restored when connection improves.`;
  }
}