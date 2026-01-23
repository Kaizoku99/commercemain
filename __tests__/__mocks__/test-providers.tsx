import React from 'react';
import { I18nProvider } from '@lingui/react';
import { setupI18n } from '@lingui/core';
import { AtpMembershipProvider } from '../../hooks/use-atp-membership-context';
import { AtpMembership } from '../../lib/types/membership';
import { mockMembership } from './membership-data';

// Mock translations for Lingui
const mockMessages = {
  en: {
    'membership.title': 'ATP Membership',
    'membership.price': '99 د.إ',
    'membership.benefits.discount': '15% discount on all services',
    'membership.benefits.freeDelivery': 'Free delivery on all orders',
    'membership.signup': 'Sign Up Now',
    'membership.dashboard.status': 'Membership Status',
    'membership.dashboard.active': 'Active',
    'membership.dashboard.expired': 'Expired',
    'membership.dashboard.expiresOn': 'Expires on',
    'membership.dashboard.totalSavings': 'Total Savings'
  },
  ar: {
    'membership.title': 'عضوية مجموعة ATP',
    'membership.price': '99 درهم',
    'membership.benefits.discount': 'خصم 15% على جميع الخدمات',
    'membership.benefits.freeDelivery': 'توصيل مجاني على جميع الطلبات',
    'membership.signup': 'اشترك الآن',
    'membership.dashboard.status': 'حالة العضوية',
    'membership.dashboard.active': 'نشطة',
    'membership.dashboard.expired': 'منتهية الصلاحية',
    'membership.dashboard.expiresOn': 'تنتهي في',
    'membership.dashboard.totalSavings': 'إجمالي التوفير'
  }
};

interface TestProvidersProps {
  children: React.ReactNode;
  membership?: AtpMembership | null;
  locale?: 'en' | 'ar';
  loading?: boolean;
  error?: string | null;
}

export function TestProviders({
  children,
  membership = mockMembership,
  locale = 'en',
  loading = false,
  error = null
}: TestProvidersProps) {
  const mockMembershipContext = {
    membership,
    isLoading: loading,
    error,
    stats: {
      totalSavings: 450.75,
      servicesUsed: 12,
      ordersWithFreeDelivery: 8,
      memberSince: '2024-01-01T00:00:00Z'
    },
    loadMembership: vi.fn(),
    purchaseMembership: vi.fn().mockResolvedValue('https://checkout.url'),
    renewMembership: vi.fn(),
    cancelMembership: vi.fn(),
    calculateDiscount: vi.fn((price: number) => price * 0.85),
    isEligibleForDiscount: vi.fn(() => membership?.status === 'active'),
    isEligibleForFreeDelivery: vi.fn(() => membership?.status === 'active')
  };

  // Create mock i18n instance for testing
  const mockI18n = setupI18n({
    locale,
    messages: { [locale]: mockMessages[locale] }
  });

  return (
    <div dir={locale === 'ar' ? 'rtl' : 'ltr'} lang={locale}>
      <I18nProvider i18n={mockI18n}>
        <AtpMembershipProvider value={mockMembershipContext}>
          {children}
        </AtpMembershipProvider>
      </I18nProvider>
    </div>
  );
}

// Mock hooks for testing
export const mockUseMembership = {
  membership: mockMembership,
  isLoading: false,
  error: null,
  stats: {
    totalSavings: 450.75,
    servicesUsed: 12,
    ordersWithFreeDelivery: 8,
    memberSince: '2024-01-01T00:00:00Z'
  },
  loadMembership: vi.fn(),
  purchaseMembership: vi.fn().mockResolvedValue('https://checkout.url'),
  renewMembership: vi.fn(),
  cancelMembership: vi.fn(),
  calculateDiscount: vi.fn((price: number) => price * 0.85),
  isEligibleForDiscount: vi.fn(() => true),
  isEligibleForFreeDelivery: vi.fn(() => true)
};

// Mock Shopify API responses
export const mockShopifyApi = {
  customers: {
    create: vi.fn().mockResolvedValue({
      customer: {
        id: 'gid://shopify/Customer/123456',
        email: 'test@example.com'
      }
    }),
    update: vi.fn().mockResolvedValue({
      customer: {
        id: 'gid://shopify/Customer/123456',
        email: 'test@example.com'
      }
    }),
    get: vi.fn().mockResolvedValue({
      customer: {
        id: 'gid://shopify/Customer/123456',
        email: 'test@example.com',
        metafields: []
      }
    })
  },
  checkout: {
    create: vi.fn().mockResolvedValue({
      checkout: {
        id: 'gid://shopify/Checkout/test-checkout',
        webUrl: 'https://test-store.myshopify.com/checkout/test-checkout'
      }
    })
  },
  metafields: {
    set: vi.fn().mockResolvedValue({
      metafields: [
        {
          id: 'gid://shopify/Metafield/123456',
          key: 'membership_status',
          value: 'active'
        }
      ]
    })
  }
};

// Test utilities
export const testUtils = {
  // Simulate user interactions
  simulateClick: (element: HTMLElement) => {
    element.click();
  },
  
  // Simulate form input
  simulateInput: (element: HTMLInputElement, value: string) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  },
  
  // Wait for async operations
  waitFor: (callback: () => void, timeout = 1000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        try {
          callback();
          resolve(true);
        } catch (error) {
          if (Date.now() - startTime > timeout) {
            reject(error);
          } else {
            setTimeout(check, 10);
          }
        }
      };
      check();
    });
  },
  
  // Mock localStorage
  mockLocalStorage: () => {
    const store: { [key: string]: string } = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      })
    };
  }
};

// Performance testing utilities
export const performanceUtils = {
  measureTime: async (fn: () => Promise<any>) => {
    const start = performance.now();
    await fn();
    return performance.now() - start;
  },
  
  measureMemory: () => {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory;
    }
    return process.memoryUsage();
  },
  
  createLoadTest: (fn: () => Promise<any>, iterations: number) => {
    return Promise.all(
      Array.from({ length: iterations }, () => fn())
    );
  }
};