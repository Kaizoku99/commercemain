/**
 * Membership Analytics API Endpoint
 * 
 * Provides comprehensive analytics data for ATP membership system
 * Requirements: 3.4, 7.2, 7.4
 */

import { NextRequest, NextResponse } from 'next/server';
import { membershipAnalyticsService } from '@/lib/services/membership-analytics-service';
import { MembershipError, MembershipErrorCode } from '@/lib/types/membership';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const type = searchParams.get('type') || 'overview';
    const timeRange = searchParams.get('timeRange') || '30d';
    const format = searchParams.get('format') as 'json' | 'csv' | 'excel' || 'json';

    // Validate required parameters
    if (!customerId && type !== 'system') {
      return NextResponse.json({
        error: {
          code: MembershipErrorCode.INVALID_CUSTOMER,
          message: 'Customer ID is required for member analytics'
        }
      }, { status: 400 });
    }

    let responseData: any;

    switch (type) {
      case 'overview':
        if (!customerId) {
          throw new MembershipError('Customer ID required', MembershipErrorCode.INVALID_CUSTOMER);
        }
        
        const [usageMetrics, engagementMetrics, savingsBreakdown] = await Promise.all([
          membershipAnalyticsService.getMemberUsageMetrics(customerId),
          membershipAnalyticsService.getMemberEngagementMetrics(customerId),
          membershipAnalyticsService.getSavingsBreakdown(customerId)
        ]);

        responseData = {
          customerId,
          usageMetrics,
          engagementMetrics,
          savingsBreakdown,
          timeRange
        };
        break;

      case 'usage':
        if (!customerId) {
          throw new MembershipError('Customer ID required', MembershipErrorCode.INVALID_CUSTOMER);
        }
        
        responseData = await membershipAnalyticsService.getMemberUsageMetrics(customerId);
        break;

      case 'engagement':
        if (!customerId) {
          throw new MembershipError('Customer ID required', MembershipErrorCode.INVALID_CUSTOMER);
        }
        
        responseData = await membershipAnalyticsService.getMemberEngagementMetrics(customerId);
        break;

      case 'savings':
        if (!customerId) {
          throw new MembershipError('Customer ID required', MembershipErrorCode.INVALID_CUSTOMER);
        }
        
        responseData = await membershipAnalyticsService.getSavingsBreakdown(customerId);
        break;

      case 'system':
        const startDate = searchParams.get('startDate') || 
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const endDate = searchParams.get('endDate') || new Date().toISOString();
        
        responseData = await membershipAnalyticsService.generateMembershipAnalytics({
          start: startDate,
          end: endDate
        });
        break;

      case 'report':
        const period = searchParams.get('period') as 'daily' | 'weekly' | 'monthly' | 'yearly' || 'monthly';
        const reportStartDate = searchParams.get('startDate') || 
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        const reportEndDate = searchParams.get('endDate') || new Date().toISOString();
        
        responseData = await membershipAnalyticsService.generateMembershipReport(
          period,
          reportStartDate,
          reportEndDate
        );
        break;

      case 'cohort':
        responseData = await membershipAnalyticsService.getCohortAnalysis();
        break;

      case 'export':
        if (!customerId) {
          throw new MembershipError('Customer ID required', MembershipErrorCode.INVALID_CUSTOMER);
        }
        
        const exportStartDate = searchParams.get('startDate');
        const exportEndDate = searchParams.get('endDate');
        const includeAnalytics = searchParams.get('includeAnalytics') === 'true';
        
        const exportData = await membershipAnalyticsService.exportMembershipData(format, {
          dateRange: exportStartDate && exportEndDate ? {
            start: exportStartDate,
            end: exportEndDate
          } : undefined,
          includeAnalytics
        });

        // Handle different export formats
        if (format === 'csv') {
          return new NextResponse(exportData as string, {
            headers: {
              'Content-Type': 'text/csv',
              'Content-Disposition': `attachment; filename="membership-analytics-${new Date().toISOString().split('T')[0]}.csv"`
            }
          });
        }

        responseData = exportData;
        break;

      default:
        return NextResponse.json({
          error: {
            code: MembershipErrorCode.VALIDATION_ERROR,
            message: `Invalid analytics type: ${type}`
          }
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Membership analytics API error:', error);

    if (error instanceof MembershipError) {
      return NextResponse.json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      }, { status: error.statusCode || 400 });
    }

    return NextResponse.json({
      error: {
        code: MembershipErrorCode.NETWORK_ERROR,
        message: 'Internal server error'
      }
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, membershipId, customerId, data } = body;

    // Validate required fields
    if (!type || !membershipId || !customerId) {
      return NextResponse.json({
        error: {
          code: MembershipErrorCode.VALIDATION_ERROR,
          message: 'Missing required fields: type, membershipId, customerId'
        }
      }, { status: 400 });
    }

    // Track analytics event
    await membershipAnalyticsService.trackEvent({
      type,
      membershipId,
      customerId,
      data: data || {}
    });

    return NextResponse.json({
      success: true,
      message: 'Analytics event tracked successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Membership analytics tracking error:', error);

    if (error instanceof MembershipError) {
      return NextResponse.json({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      }, { status: error.statusCode || 400 });
    }

    return NextResponse.json({
      error: {
        code: MembershipErrorCode.NETWORK_ERROR,
        message: 'Internal server error'
      }
    }, { status: 500 });
  }
}