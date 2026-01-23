/**
 * Membership Analytics Hook Tests
 * 
 * Tests for the useMembershipAnalytics hook and related functionality
 * Requirements: 3.4, 7.2, 7.4
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { 
  useMembershipAnalytics, 
  useMemberUsageAnalytics,
  useMemberEngagementAnalytics,
  useMemberSavingsAnalytics,
  useSystemAnalytics
} from '@/hooks/use-membership-analytics';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Mock data
const mockAnalyticsOverview = {
  usageMetrics: [
    {
      serviceId: 'home-massage-spa',
      serviceName: 'Home Massage & Spa Services',
      usageCount: 5,
      totalSavings: 180,
      averageOrderValue: 240,
      lastUsed: '2024-01-15T10:00:00Z'
    }
  ],
  engagementMetrics: {
    membershipId: 'mem_test_123',
    customerId: 'cust_test_456',
    loginFrequency: 12,
    serviceUsageFrequency: 8,
    averageSessionDuration: 300,
    lastActivity: '2024-01-15T10:00:00Z',
    engagementScore: 85
  },
  savingsBreakdown: {
    serviceDiscounts: 180,
    freeDeliveryValue: 75,
    totalSavings: 255,
    membershipFee: 99,
    netValue: 156,
    roi: 157.58
  }
};

const mockSystemAnalytics = {
  totalMemberships: 150,
  activeMemberships: 120,
  expiredMemberships: 20,
  cancelledMemberships: 10,
  newMembershipsThisMonth: 15,
  renewalRate: 85,
  totalRevenue: 14850,
  monthlyRevenue: 1485,
  averageRevenuePerMember: 99,
  expiringThisMonth: 8,
  totalMembers: 150,
  activeMembers: 120,
  expiredMembers: 20,
  cancelledMembers: 10,
  averageLifetimeValue: 247.5,
  churnRate: 7,
  memberSavings: 38250
};

describe('useMembershipAnalytics', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Hook Functionality', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useMembershipAnalytics());

      expect(result.current.overview).toBeNull();
      expect(result.current.systemAnalytics).toBeNull();
      expect(result.current.reportData).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should load analytics overview when customerId is provided', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockAnalyticsOverview,
          timestamp: new Date().toISOString()
        })
      });

      const { result } = renderHook(() => 
        useMembershipAnalytics({ customerId: 'cust_test_456' })
      );

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.overview).toEqual(mockAnalyticsOverview);
      expect(result.current.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/membership/analytics?customerId=cust_test_456&type=overview'
      );
    });

    it('should handle API errors gracefully', async () => {
      const errorMessage = 'Failed to load analytics';
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: errorMessage }
        })
      });

      const { result } = renderHook(() => 
        useMembershipAnalytics({ customerId: 'cust_test_456' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.overview).toBeNull();
    });
  });

  describe('Data Refresh', () => {
    it('should refresh data when refreshData is called', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          data: mockAnalyticsOverview,
          timestamp: new Date().toISOString()
        })
      });

      const { result } = renderHook(() => 
        useMembershipAnalytics({ customerId: 'cust_test_456' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshData();
      });

      expect(mockFetch).toHaveBeenCalledTimes(2); // Initial load + refresh
    });

    it('should set refreshing state during refresh', async () => {
      mockFetch.mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({
              success: true,
              data: mockAnalyticsOverview,
              timestamp: new Date().toISOString()
            })
          }), 100)
        )
      );

      const { result } = renderHook(() => 
        useMembershipAnalytics({ customerId: 'cust_test_456' })
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      act(() => {
        result.current.refreshData();
      });

      expect(result.current.isRefreshing).toBe(true);

      await waitFor(() => {
        expect(result.current.isRefreshing).toBe(false);
      });
    });
  });

  describe('Event Tracking', () => {
    it('should track analytics events', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Event tracked successfully',
          timestamp: new Date().toISOString()
        })
      });

      const { result } = renderHook(() => useMembershipAnalytics());

      const event = {
        type: 'service_discount_applied' as const,
        membershipId: 'mem_test_123',
        customerId: 'cust_test_456',
        data: {
          serviceId: 'home-massage-spa',
          originalPrice: 200,
          discountAmount: 30
        }
      };

      await act(async () => {
        await result.current.trackEvent(event);
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/membership/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });
    });

    it('should handle tracking errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: { message: 'Tracking failed' }
        })
      });

      const { result } = renderHook(() => useMembershipAnalytics());

      const event = {
        type: 'service_discount_applied' as const,
        membershipId: 'mem_test_123',
        customerId: 'cust_test_456',
        data: {}
      };

      // Should not throw error
      await act(async () => {
        await result.current.trackEvent(event);
      });

      expect(result.current.error).toBeNull(); // Tracking errors don't set hook error
    });
  });

  describe('Data Export', () => {
    it('should export data as JSON', async () => {
      const mockExportData = { exportDate: new Date().toISOString(), analytics: mockAnalyticsOverview };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockExportData,
          timestamp: new Date().toISOString()
        })
      });

      // Mock DOM methods
      const mockCreateElement = vi.fn(() => ({
        href: '',
        download: '',
        click: vi.fn(),
      }));
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockCreateObjectURL = vi.fn(() => 'blob:url');
      const mockRevokeObjectURL = vi.fn();

      Object.defineProperty(document, 'createElement', { value: mockCreateElement });
      Object.defineProperty(document.body, 'appendChild', { value: mockAppendChild });
      Object.defineProperty(document.body, 'removeChild', { value: mockRemoveChild });
      Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL });
      Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL });

      const { result } = renderHook(() => 
        useMembershipAnalytics({ customerId: 'cust_test_456' })
      );

      await act(async () => {
        await result.current.exportData('json');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/membership/analytics?customerId=cust_test_456&type=export&format=json'
      );
      expect(mockCreateElement).toHaveBeenCalledWith('a');
      expect(mockCreateObjectURL).toHaveBeenCalled();
    });

    it('should export data as CSV', async () => {
      const csvData = 'header1,header2\nvalue1,value2';
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => csvData
      });

      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };
      const mockCreateElement = vi.fn(() => mockLink);
      const mockAppendChild = vi.fn();
      const mockRemoveChild = vi.fn();
      const mockCreateObjectURL = vi.fn(() => 'blob:url');
      const mockRevokeObjectURL = vi.fn();

      Object.defineProperty(document, 'createElement', { value: mockCreateElement });
      Object.defineProperty(document.body, 'appendChild', { value: mockAppendChild });
      Object.defineProperty(document.body, 'removeChild', { value: mockRemoveChild });
      Object.defineProperty(URL, 'createObjectURL', { value: mockCreateObjectURL });
      Object.defineProperty(URL, 'revokeObjectURL', { value: mockRevokeObjectURL });

      const { result } = renderHook(() => 
        useMembershipAnalytics({ customerId: 'cust_test_456' })
      );

      await act(async () => {
        await result.current.exportData('csv');
      });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/membership/analytics?customerId=cust_test_456&type=export&format=csv'
      );
      expect(mockLink.click).toHaveBeenCalled();
    });
  });

  describe('System Analytics', () => {
    it('should load system analytics', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSystemAnalytics,
          timestamp: new Date().toISOString()
        })
      });

      const { result } = renderHook(() => useMembershipAnalytics());

      await act(async () => {
        await result.current.loadSystemAnalytics();
      });

      expect(result.current.systemAnalytics).toEqual(mockSystemAnalytics);
      expect(mockFetch).toHaveBeenCalledWith('/api/membership/analytics?type=system');
    });

    it('should load system analytics with date range', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockSystemAnalytics,
          timestamp: new Date().toISOString()
        })
      });

      const { result } = renderHook(() => useMembershipAnalytics());

      const dateRange = {
        start: '2024-01-01T00:00:00Z',
        end: '2024-01-31T23:59:59Z'
      };

      await act(async () => {
        await result.current.loadSystemAnalytics(dateRange);
      });

      expect(mockFetch).toHaveBeenCalledWith(
        `/api/membership/analytics?type=system&startDate=${dateRange.start}&endDate=${dateRange.end}`
      );
    });
  });

  describe('Report Generation', () => {
    it('should generate membership report', async () => {
      const mockReportData = {
        period: 'monthly',
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-01-31T23:59:59Z',
        analytics: mockSystemAnalytics,
        topServices: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockReportData,
          timestamp: new Date().toISOString()
        })
      });

      const { result } = renderHook(() => useMembershipAnalytics());

      await act(async () => {
        await result.current.generateReport('monthly');
      });

      expect(result.current.reportData).toEqual(mockReportData);
      expect(mockFetch).toHaveBeenCalledWith('/api/membership/analytics?type=report&period=monthly');
    });
  });
});

describe('Convenience Hooks', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('should provide usage analytics through useMemberUsageAnalytics', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockAnalyticsOverview,
        timestamp: new Date().toISOString()
      })
    });

    const { result } = renderHook(() => 
      useMemberUsageAnalytics('cust_test_456')
    );

    await waitFor(() => {
      expect(result.current.usageMetrics).toEqual(mockAnalyticsOverview.usageMetrics);
    });
  });

  it('should provide engagement analytics through useMemberEngagementAnalytics', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockAnalyticsOverview,
        timestamp: new Date().toISOString()
      })
    });

    const { result } = renderHook(() => 
      useMemberEngagementAnalytics('cust_test_456')
    );

    await waitFor(() => {
      expect(result.current.engagementMetrics).toEqual(mockAnalyticsOverview.engagementMetrics);
    });
  });

  it('should provide savings analytics through useMemberSavingsAnalytics', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockAnalyticsOverview,
        timestamp: new Date().toISOString()
      })
    });

    const { result } = renderHook(() => 
      useMemberSavingsAnalytics('cust_test_456')
    );

    await waitFor(() => {
      expect(result.current.savingsBreakdown).toEqual(mockAnalyticsOverview.savingsBreakdown);
    });
  });

  it('should provide system analytics through useSystemAnalytics', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockSystemAnalytics,
        timestamp: new Date().toISOString()
      })
    });

    const { result } = renderHook(() => useSystemAnalytics());

    await act(async () => {
      await result.current.loadSystemAnalytics();
    });

    expect(result.current.systemAnalytics).toEqual(mockSystemAnalytics);
  });
});