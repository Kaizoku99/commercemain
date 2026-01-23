/**
 * Membership Analytics Service
 * 
 * Comprehensive analytics tracking and reporting for ATP membership system
 * Requirements: 3.4, 7.2, 7.4
 */

import { 
  AtpMembership, 
  MembershipStats, 
  MembershipAnalytics,
  MembershipReportData,
  EligibleService,
  MembershipStatus
} from '@/lib/types/membership';
// Import will be conditional based on environment
// import { ShopifyIntegrationService } from './shopify-integration-service';
import { trackEvent } from '@/lib/analytics/shopify-analytics';

export interface AnalyticsEvent {
  type: 'membership_signup' | 'membership_renewal' | 'service_discount_applied' | 
        'free_delivery_used' | 'membership_cancelled' | 'membership_expired' |
        'savings_milestone' | 'engagement_activity';
  membershipId: string;
  customerId: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface UsageMetrics {
  serviceId: string;
  serviceName: string;
  usageCount: number;
  totalSavings: number;
  averageOrderValue: number;
  lastUsed: string;
}

export interface EngagementMetrics {
  membershipId: string;
  customerId: string;
  loginFrequency: number;
  serviceUsageFrequency: number;
  averageSessionDuration: number;
  lastActivity: string;
  engagementScore: number;
}

export interface SavingsBreakdown {
  serviceDiscounts: number;
  freeDeliveryValue: number;
  totalSavings: number;
  membershipFee: number;
  netValue: number;
  roi: number;
}

export interface MembershipCohortAnalysis {
  cohortMonth: string;
  initialMembers: number;
  activeMembers: number;
  retentionRate: number;
  averageLifetimeValue: number;
  churnRate: number;
}

export class MembershipAnalyticsService {
  private shopifyService: any; // Will be initialized conditionally
  private analyticsEvents: AnalyticsEvent[] = [];

  constructor() {
    // Only initialize Shopify service on server side
    if (typeof window === 'undefined') {
      // Server-side initialization would happen here
      // this.shopifyService = new ShopifyIntegrationService();
    }
  }

  /**
   * Track membership analytics event
   */
  async trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    // Store event locally (in production, this would go to a database)
    this.analyticsEvents.push(analyticsEvent);

    // Track with external analytics services
    await this.trackExternalAnalytics(analyticsEvent);

    // Update member statistics
    await this.updateMemberStats(analyticsEvent);
  }

  /**
   * Track membership signup
   */
  async trackMembershipSignup(membership: AtpMembership): Promise<void> {
    await this.trackEvent({
      type: 'membership_signup',
      membershipId: membership.id,
      customerId: membership.customerId,
      data: {
        membershipFee: membership.benefits.annualFee,
        paymentStatus: membership.paymentStatus,
        startDate: membership.startDate,
        expirationDate: membership.expirationDate
      }
    });
  }

  /**
   * Track membership renewal
   */
  async trackMembershipRenewal(membership: AtpMembership, previousExpirationDate: string): Promise<void> {
    await this.trackEvent({
      type: 'membership_renewal',
      membershipId: membership.id,
      customerId: membership.customerId,
      data: {
        membershipFee: membership.benefits.annualFee,
        previousExpirationDate,
        newExpirationDate: membership.expirationDate,
        renewalType: 'manual'
      }
    });
  }

  /**
   * Track service discount application
   */
  async trackServiceDiscount(
    membershipId: string, 
    customerId: string, 
    serviceId: string, 
    originalPrice: number, 
    discountAmount: number
  ): Promise<void> {
    await this.trackEvent({
      type: 'service_discount_applied',
      membershipId,
      customerId,
      data: {
        serviceId,
        originalPrice,
        discountAmount,
        discountPercentage: 0.15,
        finalPrice: originalPrice - discountAmount
      }
    });
  }

  /**
   * Track free delivery usage
   */
  async trackFreeDelivery(
    membershipId: string, 
    customerId: string, 
    orderId: string, 
    deliveryValue: number
  ): Promise<void> {
    await this.trackEvent({
      type: 'free_delivery_used',
      membershipId,
      customerId,
      data: {
        orderId,
        deliveryValue,
        orderDate: new Date().toISOString()
      }
    });
  }

  /**
   * Track savings milestone
   */
  async trackSavingsMilestone(
    membershipId: string, 
    customerId: string, 
    totalSavings: number, 
    milestone: number
  ): Promise<void> {
    await this.trackEvent({
      type: 'savings_milestone',
      membershipId,
      customerId,
      data: {
        totalSavings,
        milestone,
        membershipFee: 99,
        netSavings: totalSavings - 99
      }
    });
  }

  /**
   * Get member usage metrics
   */
  async getMemberUsageMetrics(customerId: string): Promise<UsageMetrics[]> {
    const events = this.analyticsEvents.filter(
      event => event.customerId === customerId && 
      event.type === 'service_discount_applied'
    );

    const serviceUsage = new Map<string, UsageMetrics>();

    events.forEach(event => {
      const serviceId = event.data.serviceId;
      const serviceName = this.getServiceName(serviceId);
      
      if (!serviceUsage.has(serviceId)) {
        serviceUsage.set(serviceId, {
          serviceId,
          serviceName,
          usageCount: 0,
          totalSavings: 0,
          averageOrderValue: 0,
          lastUsed: event.timestamp
        });
      }

      const metrics = serviceUsage.get(serviceId)!;
      metrics.usageCount++;
      metrics.totalSavings += event.data.discountAmount;
      metrics.lastUsed = event.timestamp;
    });

    // Calculate average order values
    serviceUsage.forEach(metrics => {
      if (metrics.usageCount > 0) {
        const serviceEvents = events.filter(e => e.data.serviceId === metrics.serviceId);
        const totalOrderValue = serviceEvents.reduce((sum, e) => sum + e.data.originalPrice, 0);
        metrics.averageOrderValue = totalOrderValue / metrics.usageCount;
      }
    });

    return Array.from(serviceUsage.values());
  }

  /**
   * Get member engagement metrics
   */
  async getMemberEngagementMetrics(customerId: string): Promise<EngagementMetrics> {
    const memberEvents = this.analyticsEvents.filter(
      event => event.customerId === customerId
    );

    const serviceUsageEvents = memberEvents.filter(
      event => event.type === 'service_discount_applied' || event.type === 'free_delivery_used'
    );

    const engagementActivities = memberEvents.filter(
      event => event.type === 'engagement_activity'
    );

    // Calculate engagement score based on activity frequency and recency
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const recentActivities = memberEvents.filter(
      event => new Date(event.timestamp) > thirtyDaysAgo
    );

    const engagementScore = Math.min(100, 
      (recentActivities.length * 10) + 
      (serviceUsageEvents.length * 5) + 
      (engagementActivities.length * 2)
    );

    return {
      membershipId: memberEvents[0]?.membershipId || '',
      customerId,
      loginFrequency: engagementActivities.length,
      serviceUsageFrequency: serviceUsageEvents.length,
      averageSessionDuration: 0, // Would be calculated from session data
      lastActivity: memberEvents[memberEvents.length - 1]?.timestamp || '',
      engagementScore
    };
  }

  /**
   * Get savings breakdown for a member
   */
  async getSavingsBreakdown(customerId: string): Promise<SavingsBreakdown> {
    const serviceDiscountEvents = this.analyticsEvents.filter(
      event => event.customerId === customerId && event.type === 'service_discount_applied'
    );

    const freeDeliveryEvents = this.analyticsEvents.filter(
      event => event.customerId === customerId && event.type === 'free_delivery_used'
    );

    const serviceDiscounts = serviceDiscountEvents.reduce(
      (sum, event) => sum + event.data.discountAmount, 0
    );

    const freeDeliveryValue = freeDeliveryEvents.reduce(
      (sum, event) => sum + event.data.deliveryValue, 0
    );

    const totalSavings = serviceDiscounts + freeDeliveryValue;
    const membershipFee = 99;
    const netValue = totalSavings - membershipFee;
    const roi = membershipFee > 0 ? (netValue / membershipFee) * 100 : 0;

    return {
      serviceDiscounts,
      freeDeliveryValue,
      totalSavings,
      membershipFee,
      netValue,
      roi
    };
  }

  /**
   * Generate comprehensive membership analytics
   */
  async generateMembershipAnalytics(timeRange?: { start: string; end: string }): Promise<MembershipAnalytics> {
    // In production, this would query the database
    // For now, we'll simulate with stored events and mock data
    
    const totalMemberships = 150;
    const activeMemberships = 120;
    const expiredMemberships = 20;
    const cancelledMemberships = 10;
    const newMembershipsThisMonth = 15;
    const expiringThisMonth = 8;

    const renewalEvents = this.analyticsEvents.filter(e => e.type === 'membership_renewal');
    const signupEvents = this.analyticsEvents.filter(e => e.type === 'membership_signup');
    
    const renewalRate = signupEvents.length > 0 ? 
      (renewalEvents.length / signupEvents.length) * 100 : 0;

    const totalRevenue = totalMemberships * 99;
    const monthlyRevenue = newMembershipsThisMonth * 99;
    const averageRevenuePerMember = totalRevenue / totalMemberships;

    const memberSavingsEvents = this.analyticsEvents.filter(
      e => e.type === 'service_discount_applied' || e.type === 'free_delivery_used'
    );
    
    const memberSavings = memberSavingsEvents.reduce((sum, event) => {
      return sum + (event.data.discountAmount || event.data.deliveryValue || 0);
    }, 0);

    return {
      totalMemberships,
      activeMemberships,
      expiredMemberships,
      cancelledMemberships,
      newMembershipsThisMonth,
      renewalRate: Math.round(renewalRate),
      totalRevenue,
      monthlyRevenue,
      averageRevenuePerMember,
      expiringThisMonth,
      totalMembers: totalMemberships,
      activeMembers: activeMemberships,
      expiredMembers: expiredMemberships,
      cancelledMembers: cancelledMemberships,
      averageLifetimeValue: averageRevenuePerMember * 2.5, // Estimated
      churnRate: Math.round((cancelledMemberships / totalMemberships) * 100),
      memberSavings
    };
  }

  /**
   * Generate membership report data
   */
  async generateMembershipReport(
    period: 'daily' | 'weekly' | 'monthly' | 'yearly',
    startDate: string,
    endDate: string
  ): Promise<MembershipReportData> {
    const analytics = await this.generateMembershipAnalytics({ start: startDate, end: endDate });

    // Get top services by usage
    const serviceUsageMap = new Map<string, { count: number; savings: number }>();
    
    this.analyticsEvents
      .filter(e => e.type === 'service_discount_applied')
      .forEach(event => {
        const serviceId = event.data.serviceId;
        if (!serviceUsageMap.has(serviceId)) {
          serviceUsageMap.set(serviceId, { count: 0, savings: 0 });
        }
        const usage = serviceUsageMap.get(serviceId)!;
        usage.count++;
        usage.savings += event.data.discountAmount;
      });

    const topServices = Array.from(serviceUsageMap.entries())
      .map(([serviceId, usage]) => ({
        serviceId,
        serviceName: this.getServiceName(serviceId),
        usageCount: usage.count,
        totalSavings: usage.savings
      }))
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10);

    return {
      period,
      startDate,
      endDate,
      analytics,
      topServices
    };
  }

  /**
   * Export membership data
   */
  async exportMembershipData(
    format: 'csv' | 'json' | 'excel',
    filters?: {
      status?: MembershipStatus[];
      dateRange?: { start: string; end: string };
      includeAnalytics?: boolean;
    }
  ): Promise<string | object> {
    const analytics = await this.generateMembershipAnalytics(filters?.dateRange);
    const reportData = await this.generateMembershipReport(
      'monthly',
      filters?.dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      filters?.dateRange?.end || new Date().toISOString()
    );

    const exportData = {
      exportDate: new Date().toISOString(),
      filters,
      analytics,
      reportData,
      events: filters?.includeAnalytics ? this.analyticsEvents : undefined
    };

    switch (format) {
      case 'json':
        return exportData;
      
      case 'csv':
        return this.convertToCSV(exportData);
      
      case 'excel':
        // In production, this would generate an actual Excel file
        return JSON.stringify(exportData, null, 2);
      
      default:
        return exportData;
    }
  }

  /**
   * Get cohort analysis
   */
  async getCohortAnalysis(): Promise<MembershipCohortAnalysis[]> {
    // Mock cohort data - in production, this would be calculated from actual membership data
    const cohorts: MembershipCohortAnalysis[] = [
      {
        cohortMonth: '2024-01',
        initialMembers: 25,
        activeMembers: 20,
        retentionRate: 80,
        averageLifetimeValue: 247.5,
        churnRate: 20
      },
      {
        cohortMonth: '2024-02',
        initialMembers: 30,
        activeMembers: 26,
        retentionRate: 86.7,
        averageLifetimeValue: 267.3,
        churnRate: 13.3
      },
      {
        cohortMonth: '2024-03',
        initialMembers: 35,
        activeMembers: 32,
        retentionRate: 91.4,
        averageLifetimeValue: 285.6,
        churnRate: 8.6
      }
    ];

    return cohorts;
  }

  /**
   * Private helper methods
   */
  private async trackExternalAnalytics(event: AnalyticsEvent): Promise<void> {
    try {
      // Track with Shopify Analytics
      trackEvent({
        event: `membership_${event.type}`,
        properties: {
          membershipId: event.membershipId,
          customerId: event.customerId,
          ...event.data
        },
        userId: event.customerId
      });
    } catch (error) {
      console.error('Failed to track external analytics:', error);
    }
  }

  private async updateMemberStats(event: AnalyticsEvent): Promise<void> {
    try {
      // Update member statistics in Shopify customer metafields
      if (this.shopifyService) {
        const customer = await this.shopifyService.getCustomerMembership(event.customerId);
        if (customer) {
          // Update stats based on event type
          // This would be implemented based on the specific event
        }
      }
    } catch (error) {
      console.error('Failed to update member stats:', error);
    }
  }

  private getServiceName(serviceId: string): string {
    const serviceNames: Record<string, string> = {
      [EligibleService.HOME_MASSAGE_SPA]: 'Home Massage & Spa Services',
      [EligibleService.EMS_TRAINING]: 'EMS Training',
      [EligibleService.HOME_YOGA]: 'Home Yoga Sessions',
      [EligibleService.COSMETICS_SUPPLEMENTS]: 'Cosmetics & Supplements'
    };

    return serviceNames[serviceId] || serviceId;
  }

  private convertToCSV(data: any): string {
    // Simple CSV conversion - in production, use a proper CSV library
    const headers = Object.keys(data.analytics);
    const values = Object.values(data.analytics);
    
    return [
      headers.join(','),
      values.join(',')
    ].join('\n');
  }
}

// Export singleton instance
export const membershipAnalyticsService = new MembershipAnalyticsService();