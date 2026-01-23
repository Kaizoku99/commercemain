'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { MembershipAnalytics } from '@/lib/types/membership';

interface MembershipAnalyticsComponentProps {
  analytics: MembershipAnalytics | null;
}

export function MembershipAnalyticsComponent({ analytics }: MembershipAnalyticsComponentProps) {
  if (!analytics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No analytics data available
      </div>
    );
  }

  const activePercentage = (analytics.activeMemberships / analytics.totalMemberships) * 100;
  const expiredPercentage = (analytics.expiredMemberships / analytics.totalMemberships) * 100;
  const cancelledPercentage = (analytics.cancelledMemberships / analytics.totalMemberships) * 100;

  const getHealthStatus = () => {
    if (analytics.renewalRate >= 80) return { status: 'excellent', color: 'text-green-600', icon: CheckCircle };
    if (analytics.renewalRate >= 60) return { status: 'good', color: 'text-blue-600', icon: TrendingUp };
    if (analytics.renewalRate >= 40) return { status: 'fair', color: 'text-yellow-600', icon: AlertCircle };
    return { status: 'needs attention', color: 'text-red-600', icon: TrendingDown };
  };

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  return (
    <div className="space-y-6">
      {/* Revenue Analytics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRevenue.toLocaleString()} AED</div>
            <p className="text-xs text-muted-foreground">
              {analytics.averageRevenuePerMember.toFixed(0)} AED per member
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.monthlyRevenue.toLocaleString()} AED</div>
            <p className="text-xs text-muted-foreground">
              {analytics.newMembershipsThisMonth} new memberships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Program Health</CardTitle>
            <HealthIcon className={`h-4 w-4 ${healthStatus.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.renewalRate}%</div>
            <p className={`text-xs ${healthStatus.color}`}>
              {healthStatus.status}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Membership Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Distribution</CardTitle>
          <CardDescription>
            Current breakdown of membership statuses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Active Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {analytics.activeMemberships}
                  </span>
                  <Badge variant="secondary">
                    {activePercentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <Progress value={activePercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Expired Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {analytics.expiredMemberships}
                  </span>
                  <Badge variant="secondary">
                    {expiredPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <Progress value={expiredPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm font-medium">Cancelled Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {analytics.cancelledMemberships}
                  </span>
                  <Badge variant="secondary">
                    {cancelledPercentage.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              <Progress value={cancelledPercentage} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm font-medium">Expiring Soon</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    {analytics.expiringThisMonth}
                  </span>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Next 30 days
                  </Badge>
                </div>
              </div>
              <Progress 
                value={(analytics.expiringThisMonth / analytics.activeMemberships) * 100} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Growth Metrics</CardTitle>
            <CardDescription>
              Membership program performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">New Members This Month</span>
              </div>
              <div className="text-lg font-bold">{analytics.newMembershipsThisMonth}</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Renewal Rate</span>
              </div>
              <div className="text-lg font-bold">{analytics.renewalRate}%</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Avg Revenue Per Member</span>
              </div>
              <div className="text-lg font-bold">{analytics.averageRevenuePerMember.toFixed(0)} AED</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Action Items</CardTitle>
            <CardDescription>
              Areas requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.expiringThisMonth > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-orange-800">
                    {analytics.expiringThisMonth} memberships expiring soon
                  </div>
                  <div className="text-xs text-orange-600">
                    Consider sending renewal reminders
                  </div>
                </div>
              </div>
            )}

            {analytics.renewalRate < 60 && (
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-200">
                <TrendingDown className="h-4 w-4 text-red-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-red-800">
                    Low renewal rate ({analytics.renewalRate}%)
                  </div>
                  <div className="text-xs text-red-600">
                    Review member satisfaction and benefits
                  </div>
                </div>
              </div>
            )}

            {analytics.newMembershipsThisMonth === 0 && (
              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-yellow-800">
                    No new memberships this month
                  </div>
                  <div className="text-xs text-yellow-600">
                    Consider marketing campaigns
                  </div>
                </div>
              </div>
            )}

            {analytics.renewalRate >= 80 && analytics.newMembershipsThisMonth > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-green-800">
                    Membership program performing well
                  </div>
                  <div className="text-xs text-green-600">
                    Continue current strategies
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}