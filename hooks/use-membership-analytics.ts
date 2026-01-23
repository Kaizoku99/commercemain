/**
 * Membership Analytics Hook
 * 
 * React hook for accessing membership analytics data and tracking events
 * Requirements: 3.4, 7.2, 7.4
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  UsageMetrics, 
  EngagementMetrics, 
  SavingsBreakdown,
  AnalyticsEvent
} from '@/lib/services/membership-analytics-service';
import { MembershipAnalytics, MembershipReportData } from '@/lib/types/membership';

interface AnalyticsOverview {
  usageMetrics: UsageMetrics[];
  engagementMetrics: EngagementMetrics;
  savingsBreakdown: SavingsBreakdown;
}

interface UseAnalyticsOptions {
  customerId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseAnalyticsReturn {
  // Data
  overview: AnalyticsOverview | null;
  systemAnalytics: MembershipAnalytics | null;
  reportData: MembershipReportData | null;
  
  // Loading states
  isLoading: boolean;
  isRefreshing: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp'>) => Promise<void>;
  exportData: (format: 'json' | 'csv' | 'excel', options?: ExportOptions) => Promise<void>;
  generateReport: (period: 'daily' | 'weekly' | 'monthly' | 'yearly', dateRange?: DateRange) => Promise<void>;
  
  // System analytics (admin only)
  loadSystemAnalytics: (dateRange?: DateRange) => Promise<void>;
}

interface ExportOptions {
  dateRange?: DateRange;
  includeAnalytics?: boolean;
}

interface DateRange {
  start: string;
  end: string;
}

export function useMembershipAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const { customerId, autoRefresh = false, refreshInterval = 300000 } = options; // 5 minutes default

  // State
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [systemAnalytics, setSystemAnalytics] = useState<MembershipAnalytics | null>(null);
  const [reportData, setReportData] = useState<MembershipReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load analytics overview
  const loadOverview = useCallback(async () => {
    if (!customerId) return;

    try {
      setError(null);
      const response = await fetch(`/api/membership/analytics?customerId=${customerId}&type=overview`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load analytics');
      }

      const data = await response.json();
      setOverview(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
      console.error('Analytics loading error:', err);
    }
  }, [customerId]);

  // Load system analytics (admin)
  const loadSystemAnalytics = useCallback(async (dateRange?: DateRange) => {
    try {
      setError(null);
      let url = '/api/membership/analytics?type=system';
      
      if (dateRange) {
        url += `&startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to load system analytics');
      }

      const data = await response.json();
      setSystemAnalytics(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system analytics');
      console.error('System analytics loading error:', err);
    }
  }, []);

  // Generate report
  const generateReport = useCallback(async (
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    dateRange?: DateRange
  ) => {
    try {
      setError(null);
      let url = `/api/membership/analytics?type=report&period=${period}`;
      
      if (dateRange) {
        url += `&startDate=${dateRange.start}&endDate=${dateRange.end}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate report');
      }

      const data = await response.json();
      setReportData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
      console.error('Report generation error:', err);
    }
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await loadOverview();
    } finally {
      setIsRefreshing(false);
    }
  }, [loadOverview]);

  // Track analytics event
  const trackEvent = useCallback(async (event: Omit<AnalyticsEvent, 'timestamp'>) => {
    try {
      const response = await fetch('/api/membership/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to track event');
      }
    } catch (err) {
      console.error('Event tracking error:', err);
      // Don't throw here as tracking failures shouldn't break the UI
    }
  }, []);

  // Export data
  const exportData = useCallback(async (
    format: 'json' | 'csv' | 'excel',
    options: ExportOptions = {}
  ) => {
    if (!customerId) {
      throw new Error('Customer ID required for export');
    }

    try {
      let url = `/api/membership/analytics?customerId=${customerId}&type=export&format=${format}`;
      
      if (options.dateRange) {
        url += `&startDate=${options.dateRange.start}&endDate=${options.dateRange.end}`;
      }
      
      if (options.includeAnalytics) {
        url += '&includeAnalytics=true';
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to export data');
      }

      // Handle CSV download
      if (format === 'csv') {
        const csvData = await response.text();
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `membership-analytics-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        // Handle JSON/Excel download
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data.data, null, 2)], { 
          type: 'application/json' 
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `membership-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
      console.error('Export error:', err);
      throw err;
    }
  }, [customerId]);

  // Initial load
  useEffect(() => {
    if (customerId) {
      setIsLoading(true);
      loadOverview().finally(() => setIsLoading(false));
    }
  }, [customerId, loadOverview]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh || !customerId) return;

    const interval = setInterval(() => {
      refreshData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, customerId, refreshInterval, refreshData]);

  return {
    // Data
    overview,
    systemAnalytics,
    reportData,
    
    // Loading states
    isLoading,
    isRefreshing,
    
    // Error handling
    error,
    
    // Actions
    refreshData,
    trackEvent,
    exportData,
    generateReport,
    loadSystemAnalytics,
  };
}

// Convenience hooks for specific analytics types
export function useMemberUsageAnalytics(customerId?: string) {
  const { overview, isLoading, error, refreshData } = useMembershipAnalytics({ customerId });
  
  return {
    usageMetrics: overview?.usageMetrics || [],
    isLoading,
    error,
    refreshData,
  };
}

export function useMemberEngagementAnalytics(customerId?: string) {
  const { overview, isLoading, error, refreshData } = useMembershipAnalytics({ customerId });
  
  return {
    engagementMetrics: overview?.engagementMetrics || null,
    isLoading,
    error,
    refreshData,
  };
}

export function useMemberSavingsAnalytics(customerId?: string) {
  const { overview, isLoading, error, refreshData } = useMembershipAnalytics({ customerId });
  
  return {
    savingsBreakdown: overview?.savingsBreakdown || null,
    isLoading,
    error,
    refreshData,
  };
}

export function useSystemAnalytics() {
  const { systemAnalytics, isLoading, error, loadSystemAnalytics } = useMembershipAnalytics();
  
  return {
    systemAnalytics,
    isLoading,
    error,
    loadSystemAnalytics,
  };
}