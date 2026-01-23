import { AtpMembership, MembershipStats, MembershipAnalytics, MembershipStatus } from '../types/membership';
import { ShopifyIntegrationService } from './shopify-integration-service';

export interface AdminMembershipFilters {
  status?: MembershipStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

export interface MembershipSearchResult {
  memberships: AtpMembership[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface MembershipRevenue {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  averageRevenuePerMember: number;
  renewalRate: number;
}

export class AdminMembershipService {
  private shopifyService: ShopifyIntegrationService;

  constructor() {
    this.shopifyService = new ShopifyIntegrationService();
  }

  /**
   * Search and filter memberships with pagination
   */
  async searchMemberships(
    filters: AdminMembershipFilters,
    page: number = 1,
    limit: number = 20
  ): Promise<MembershipSearchResult> {
    try {
      // Get all customers with membership metafields
      const customers = await this.shopifyService.getCustomersWithMemberships();
      
      let filteredMemberships = customers
        .map(customer => this.shopifyService.parseMembershipFromCustomer(customer))
        .filter(membership => membership !== null) as AtpMembership[];

      // Apply filters
      if (filters.status) {
        filteredMemberships = filteredMemberships.filter(
          membership => membership.status === filters.status
        );
      }

      if (filters.dateRange) {
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        filteredMemberships = filteredMemberships.filter(membership => {
          const membershipDate = new Date(membership.startDate);
          return membershipDate >= startDate && membershipDate <= endDate;
        });
      }

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredMemberships = filteredMemberships.filter(membership =>
          membership.customerId.toLowerCase().includes(searchLower) ||
          membership.id.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const totalCount = filteredMemberships.length;
      const totalPages = Math.ceil(totalCount / limit);
      const startIndex = (page - 1) * limit;
      const paginatedMemberships = filteredMemberships.slice(startIndex, startIndex + limit);

      return {
        memberships: paginatedMemberships,
        totalCount,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error('Error searching memberships:', error);
      throw new Error('Failed to search memberships');
    }
  }

  /**
   * Get membership analytics and statistics
   */
  async getMembershipAnalytics(): Promise<MembershipAnalytics> {
    try {
      const customers = await this.shopifyService.getCustomersWithMemberships();
      const memberships = customers
        .map(customer => this.shopifyService.parseMembershipFromCustomer(customer))
        .filter(membership => membership !== null) as AtpMembership[];

      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

      const activeMemberships = memberships.filter(m => m.status === 'active');
      const expiredMemberships = memberships.filter(m => m.status === 'expired');
      const cancelledMemberships = memberships.filter(m => m.status === 'cancelled');

      const newMembershipsThisMonth = memberships.filter(m => 
        new Date(m.startDate) >= thirtyDaysAgo
      );

      const renewalsThisYear = memberships.filter(m => {
        const startDate = new Date(m.startDate);
        return startDate >= oneYearAgo && m.subscriptionId; // Has renewal
      });

      const totalRevenue = memberships.length * 99; // 99 د.إ per membership
      const monthlyRevenue = newMembershipsThisMonth.length * 99;
      const renewalRate = renewalsThisYear.length / Math.max(expiredMemberships.length, 1);
      const churnRate = cancelledMemberships.length / Math.max(memberships.length, 1);
      const averageLifetimeValue = totalRevenue / Math.max(activeMemberships.length, 1);
      const memberSavings = activeMemberships.length * 99 * 0.15 * 5; // Estimated average 5 orders per member

      return {
        totalMemberships: memberships.length,
        activeMemberships: activeMemberships.length,
        expiredMemberships: expiredMemberships.length,
        cancelledMemberships: cancelledMemberships.length,
        newMembershipsThisMonth: newMembershipsThisMonth.length,
        renewalRate: Math.round(renewalRate * 100),
        totalRevenue,
        monthlyRevenue,
        averageRevenuePerMember: totalRevenue / Math.max(memberships.length, 1),
        expiringThisMonth: activeMemberships.filter(m => {
          const expirationDate = new Date(m.expirationDate);
          const nextMonth = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return expirationDate <= nextMonth;
        }).length,
        // Additional required fields
        totalMembers: memberships.length,
        activeMembers: activeMemberships.length,
        expiredMembers: expiredMemberships.length,
        cancelledMembers: cancelledMemberships.length,
        averageLifetimeValue,
        churnRate: Math.round(churnRate * 100),
        memberSavings
      };
    } catch (error) {
      console.error('Error getting membership analytics:', error);
      throw new Error('Failed to get membership analytics');
    }
  }

  /**
   * Manually extend a membership
   */
  async extendMembership(
    membershipId: string,
    extensionMonths: number,
    reason: string
  ): Promise<AtpMembership> {
    try {
      const membership = await this.shopifyService.getMembershipById(membershipId);
      if (!membership) {
        throw new Error('Membership not found');
      }

      const currentExpiration = new Date(membership.expirationDate);
      const newExpiration = new Date(currentExpiration);
      newExpiration.setMonth(newExpiration.getMonth() + extensionMonths);

      const updatedMembership: AtpMembership = {
        ...membership,
        expirationDate: newExpiration.toISOString(),
        status: 'active'
      };

      await this.shopifyService.updateCustomerMembership(
        membership.customerId,
        updatedMembership
      );

      // Log the extension for audit purposes
      await this.logMembershipAction(membershipId, 'extension', {
        extensionMonths,
        reason,
        newExpirationDate: newExpiration.toISOString()
      });

      return updatedMembership;
    } catch (error) {
      console.error('Error extending membership:', error);
      throw new Error('Failed to extend membership');
    }
  }

  /**
   * Manually cancel a membership
   */
  async cancelMembership(
    membershipId: string,
    reason: string
  ): Promise<void> {
    try {
      const membership = await this.shopifyService.getMembershipById(membershipId);
      if (!membership) {
        throw new Error('Membership not found');
      }

      const cancelledMembership: AtpMembership = {
        ...membership,
        status: 'cancelled'
      };

      await this.shopifyService.updateCustomerMembership(
        membership.customerId,
        cancelledMembership
      );

      // Log the cancellation for audit purposes
      await this.logMembershipAction(membershipId, 'cancellation', {
        reason,
        cancelledDate: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error cancelling membership:', error);
      throw new Error('Failed to cancel membership');
    }
  }

  /**
   * Get detailed membership information including customer details
   */
  async getMembershipDetails(membershipId: string): Promise<{
    membership: AtpMembership;
    customerInfo: any;
    stats: MembershipStats | null;
  }> {
    try {
      const membership = await this.shopifyService.getMembershipById(membershipId);
      if (!membership) {
        throw new Error('Membership not found');
      }

      const customerInfo = await this.shopifyService.getCustomerInfo(membership.customerId);
      const statsResult = await this.shopifyService.getMembershipStats(membership.customerId);
      
      // Handle the MembershipResult type
      const stats = statsResult && 'success' in statsResult && statsResult.success 
        ? statsResult.data 
        : null;

      return {
        membership,
        customerInfo,
        stats
      };
    } catch (error) {
      console.error('Error getting membership details:', error);
      throw new Error('Failed to get membership details');
    }
  }

  /**
   * Log membership actions for audit trail
   */
  private async logMembershipAction(
    membershipId: string,
    action: string,
    details: any
  ): Promise<void> {
    // In a real implementation, this would log to a database or audit system
    console.log('Membership Action Log:', {
      membershipId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Export membership data for reporting
   */
  async exportMembershipData(
    filters: AdminMembershipFilters,
    format: 'csv' | 'json' = 'csv'
  ): Promise<string> {
    try {
      const searchResult = await this.searchMemberships(filters, 1, 1000); // Get all matching
      const memberships = searchResult.memberships;

      if (format === 'json') {
        return JSON.stringify(memberships, null, 2);
      }

      // CSV format
      const headers = [
        'Membership ID',
        'Customer ID',
        'Status',
        'Start Date',
        'Expiration Date',
        'Payment Status',
        'Total Savings'
      ];

      const csvRows = [
        headers.join(','),
        ...memberships.map(m => [
          m.id,
          m.customerId,
          m.status,
          m.startDate,
          m.expirationDate,
          m.paymentStatus,
          '0' // Would be calculated from stats
        ].join(','))
      ];

      return csvRows.join('\n');
    } catch (error) {
      console.error('Error exporting membership data:', error);
      throw new Error('Failed to export membership data');
    }
  }
}