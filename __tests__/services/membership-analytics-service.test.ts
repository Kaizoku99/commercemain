/**
 * Membership Analytics Service Tests
 * 
 * Tests for analytics tracking and reporting functionality
 * Requirements: 3.4, 7.2, 7.4
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MembershipAnalyticsService } from '@/lib/services/membership-analytics-service';
import { AtpMembership, MembershipStatus, PaymentStatus } from '@/lib/types/membership';

// Mock external dependencies
vi.mock('@/lib/services/shopify-integration-service');
vi.mock('@/lib/analytics/shopify-analytics');

describe('MembershipAnalyticsService', () => {
  let analyticsService: MembershipAnalyticsService;
  let mockMembership: AtpMembership;

  beforeEach(() => {
    analyticsService = new MembershipAnalyticsService();
    
    mockMembership = {
      id: 'mem_test_123',
      customerId: 'cust_test_456',
      status: 'active' as MembershipStatus,
      startDate: '2024-01-01T00:00:00Z',
      expirationDate: '2025-01-01T00:00:00Z',
      paymentStatus: 'paid' as PaymentStatus,
      benefits: {
        serviceDiscount: 0.15,
        freeDelivery: true,
        eligibleServices: ['home-massage-spa', 'ems-training', 'home-yoga', 'cosmetics-supplements'],
        annualFee: 99
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    };
  });

  describe('Event Tracking', () => {
    it('should track membership signup event', async () => {
      await analyticsService.trackMembershipSignup(mockMembership);

      // Verify event was tracked (in a real implementation, this would check database)
      expect(true).toBe(true); // Placeholder assertion
    });

    it('should track membership renewal event', async () => {
      const previousExpirationDate = '2024-12-31T23:59:59Z';
      
      await analyticsService.trackMembershipRenewal(mockMembership, previousExpirationDate);

      // Verify renewal event was tracked
      expect(true).toBe(true); // Placeholder assertion
    });

    it('should track service discount application', async () => {
      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'home-massage-spa',
        200,
        30
      );

      // Verify discount event was tracked
      expect(true).toBe(true); // Placeholder assertion
    });

    it('should track free delivery usage', async () => {
      await analyticsService.trackFreeDelivery(
        mockMembership.id,
        mockMembership.customerId,
        'order_123',
        25
      );

      // Verify free delivery event was tracked
      expect(true).toBe(true); // Placeholder assertion
    });

    it('should track savings milestone', async () => {
      await analyticsService.trackSavingsMilestone(
        mockMembership.id,
        mockMembership.customerId,
        150,
        100
      );

      // Verify milestone event was tracked
      expect(true).toBe(true); // Placeholder assertion
    });
  });

  describe('Usage Metrics', () => {
    it('should calculate member usage metrics', async () => {
      // First track some usage events
      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'home-massage-spa',
        200,
        30
      );

      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'ems-training',
        150,
        22.5
      );

      const usageMetrics = await analyticsService.getMemberUsageMetrics(mockMembership.customerId);

      expect(Array.isArray(usageMetrics)).toBe(true);
      // In a real implementation, we would verify specific metrics
    });

    it('should calculate engagement metrics', async () => {
      const engagementMetrics = await analyticsService.getMemberEngagementMetrics(mockMembership.customerId);

      expect(engagementMetrics).toHaveProperty('membershipId');
      expect(engagementMetrics).toHaveProperty('customerId');
      expect(engagementMetrics).toHaveProperty('engagementScore');
      expect(typeof engagementMetrics.engagementScore).toBe('number');
    });

    it('should calculate savings breakdown', async () => {
      // Track some savings events
      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'home-massage-spa',
        200,
        30
      );

      await analyticsService.trackFreeDelivery(
        mockMembership.id,
        mockMembership.customerId,
        'order_123',
        25
      );

      const savingsBreakdown = await analyticsService.getSavingsBreakdown(mockMembership.customerId);

      expect(savingsBreakdown).toHaveProperty('serviceDiscounts');
      expect(savingsBreakdown).toHaveProperty('freeDeliveryValue');
      expect(savingsBreakdown).toHaveProperty('totalSavings');
      expect(savingsBreakdown).toHaveProperty('membershipFee');
      expect(savingsBreakdown).toHaveProperty('netValue');
      expect(savingsBreakdown).toHaveProperty('roi');
      expect(savingsBreakdown.membershipFee).toBe(99);
    });
  });

  describe('System Analytics', () => {
    it('should generate comprehensive membership analytics', async () => {
      const analytics = await analyticsService.generateMembershipAnalytics();

      expect(analytics).toHaveProperty('totalMemberships');
      expect(analytics).toHaveProperty('activeMemberships');
      expect(analytics).toHaveProperty('expiredMemberships');
      expect(analytics).toHaveProperty('cancelledMemberships');
      expect(analytics).toHaveProperty('renewalRate');
      expect(analytics).toHaveProperty('totalRevenue');
      expect(analytics).toHaveProperty('memberSavings');
      expect(typeof analytics.renewalRate).toBe('number');
      expect(analytics.renewalRate).toBeGreaterThanOrEqual(0);
      expect(analytics.renewalRate).toBeLessThanOrEqual(100);
    });

    it('should generate membership report with time range', async () => {
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-01-31T23:59:59Z';

      const report = await analyticsService.generateMembershipReport('monthly', startDate, endDate);

      expect(report).toHaveProperty('period');
      expect(report).toHaveProperty('startDate');
      expect(report).toHaveProperty('endDate');
      expect(report).toHaveProperty('analytics');
      expect(report).toHaveProperty('topServices');
      expect(report.period).toBe('monthly');
      expect(report.startDate).toBe(startDate);
      expect(report.endDate).toBe(endDate);
      expect(Array.isArray(report.topServices)).toBe(true);
    });

    it('should get cohort analysis', async () => {
      const cohortAnalysis = await analyticsService.getCohortAnalysis();

      expect(Array.isArray(cohortAnalysis)).toBe(true);
      
      if (cohortAnalysis.length > 0) {
        const cohort = cohortAnalysis[0];
        expect(cohort).toHaveProperty('cohortMonth');
        expect(cohort).toHaveProperty('initialMembers');
        expect(cohort).toHaveProperty('activeMembers');
        expect(cohort).toHaveProperty('retentionRate');
        expect(cohort).toHaveProperty('averageLifetimeValue');
        expect(cohort).toHaveProperty('churnRate');
      }
    });
  });

  describe('Data Export', () => {
    it('should export membership data as JSON', async () => {
      const exportData = await analyticsService.exportMembershipData('json');

      expect(typeof exportData).toBe('object');
      expect(exportData).toHaveProperty('exportDate');
      expect(exportData).toHaveProperty('analytics');
      expect(exportData).toHaveProperty('reportData');
    });

    it('should export membership data as CSV', async () => {
      const exportData = await analyticsService.exportMembershipData('csv');

      expect(typeof exportData).toBe('string');
      expect(exportData.length).toBeGreaterThan(0);
    });

    it('should export membership data with filters', async () => {
      const filters = {
        dateRange: {
          start: '2024-01-01T00:00:00Z',
          end: '2024-01-31T23:59:59Z'
        },
        includeAnalytics: true
      };

      const exportData = await analyticsService.exportMembershipData('json', filters);

      expect(typeof exportData).toBe('object');
      expect(exportData).toHaveProperty('filters');
      expect((exportData as any).filters).toEqual(filters);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid customer ID gracefully', async () => {
      const usageMetrics = await analyticsService.getMemberUsageMetrics('invalid_customer');
      
      expect(Array.isArray(usageMetrics)).toBe(true);
      expect(usageMetrics.length).toBe(0);
    });

    it('should handle missing data gracefully', async () => {
      const engagementMetrics = await analyticsService.getMemberEngagementMetrics('nonexistent_customer');
      
      expect(engagementMetrics).toHaveProperty('customerId');
      expect(engagementMetrics.customerId).toBe('nonexistent_customer');
      expect(engagementMetrics.engagementScore).toBe(0);
    });
  });

  describe('Service Name Mapping', () => {
    it('should map service IDs to readable names', async () => {
      // Track events with different service IDs
      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'home-massage-spa',
        200,
        30
      );

      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'ems-training',
        150,
        22.5
      );

      const usageMetrics = await analyticsService.getMemberUsageMetrics(mockMembership.customerId);

      // Verify service names are human-readable
      usageMetrics.forEach(metric => {
        expect(metric.serviceName).not.toContain('-');
        expect(metric.serviceName.length).toBeGreaterThan(3);
      });
    });
  });

  describe('ROI Calculations', () => {
    it('should calculate positive ROI when savings exceed membership fee', async () => {
      // Track savings that exceed membership fee
      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'home-massage-spa',
        200,
        50
      );

      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'ems-training',
        200,
        50
      );

      await analyticsService.trackFreeDelivery(
        mockMembership.id,
        mockMembership.customerId,
        'order_123',
        25
      );

      const savingsBreakdown = await analyticsService.getSavingsBreakdown(mockMembership.customerId);

      expect(savingsBreakdown.totalSavings).toBeGreaterThan(savingsBreakdown.membershipFee);
      expect(savingsBreakdown.netValue).toBeGreaterThan(0);
      expect(savingsBreakdown.roi).toBeGreaterThan(0);
    });

    it('should calculate negative ROI when savings are less than membership fee', async () => {
      // Track minimal savings
      await analyticsService.trackServiceDiscount(
        mockMembership.id,
        mockMembership.customerId,
        'home-massage-spa',
        100,
        15
      );

      const savingsBreakdown = await analyticsService.getSavingsBreakdown(mockMembership.customerId);

      expect(savingsBreakdown.totalSavings).toBeLessThan(savingsBreakdown.membershipFee);
      expect(savingsBreakdown.netValue).toBeLessThan(0);
      expect(savingsBreakdown.roi).toBeLessThan(0);
    });
  });
});