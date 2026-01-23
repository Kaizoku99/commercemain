/**
 * Admin Membership Analytics Reporting Component
 * 
 * Comprehensive analytics and reporting dashboard for administrators
 * Requirements: 7.2, 7.4
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Calendar,
  Target,
  Award,
  Download,
  Filter,
  RefreshCw,
  Crown,
  Star,
  Package,
  Truck,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from 'lucide-react';
import { useSystemAnalytics, useMembershipAnalytics } from '@/hooks/use-membership-analytics';
import { MembershipAnalytics, MembershipReportData } from '@/lib/types/membership';
import { cn } from '@/lib/utils';

interface AdminAnalyticsReportingProps {
  className?: string;
}

interface DateRange {
  start: string;
  end: string;
}

export function AdminAnalyticsReporting({ className }: AdminAnalyticsReportingProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '',
    end: new Date().toISOString().split('T')[0] ?? ''
  });
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const { 
    systemAnalytics, 
    reportData, 
    isLoading, 
    error, 
    loadSystemAnalytics, 
    generateReport 
  } = useMembershipAnalytics();

  // Load initial data
  useEffect(() => {
    loadSystemAnalytics({
      start: new Date(dateRange.start).toISOString(),
      end: new Date(dateRange.end).toISOString()
    });
  }, [loadSystemAnalytics, dateRange]);

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      await generateReport(selectedPeriod, {
        start: new Date(dateRange.start).toISOString(),
        end: new Date(dateRange.end).toISOString()
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleExportReport = async (format: 'json' | 'csv' | 'excel') => {
    try {
      let url = `/api/membership/analytics?type=export&format=${format}`;
      url += `&startDate=${new Date(dateRange.start).toISOString()}`;
      url += `&endDate=${new Date(dateRange.end).toISOString()}`;
      url += '&includeAnalytics=true';

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to export report');
      }

      // Handle download
      if (format === 'csv') {
        const csvData = await response.text();
        downloadFile(csvData, `membership-report-${dateRange.start}.csv`, 'text/csv');
      } else {
        const data = await response.json();
        downloadFile(
          JSON.stringify(data.data, null, 2), 
          `membership-report-${dateRange.start}.${format}`, 
          'application/json'
        );
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p>Loading analytics data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <p className="text-red-600 mb-4">Error loading analytics: {error}</p>
          <Button onClick={() => loadSystemAnalytics()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Membership Analytics & Reporting</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into membership performance and trends
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadSystemAnalytics()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportReport('json')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Date Range and Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Report Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period">Report Period</Label>
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {isGeneratingReport ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => handleExportReport('csv')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Analytics Overview */}
      {systemAnalytics && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Revenue"
              value={systemAnalytics.totalRevenue}
              format="currency"
              icon={DollarSign}
              trend={{ value: 12, direction: 'up' }}
              className="bg-green-50 border-green-200"
            />
            <MetricCard
              title="Active Members"
              value={systemAnalytics.activeMemberships}
              format="number"
              icon={Users}
              trend={{ value: 8, direction: 'up' }}
              className="bg-blue-50 border-blue-200"
            />
            <MetricCard
              title="Renewal Rate"
              value={systemAnalytics.renewalRate}
              format="percentage"
              icon={Target}
              trend={{ value: 5, direction: 'up' }}
              className="bg-purple-50 border-purple-200"
            />
            <MetricCard
              title="Member Savings"
              value={systemAnalytics.memberSavings}
              format="currency"
              icon={Award}
              trend={{ value: 15, direction: 'up' }}
              className="bg-yellow-50 border-yellow-200"
            />
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Membership Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Membership Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {systemAnalytics.activeMemberships}
                          </span>
                          <Badge variant="secondary">
                            {((systemAnalytics.activeMemberships / systemAnalytics.totalMemberships) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={(systemAnalytics.activeMemberships / systemAnalytics.totalMemberships) * 100} 
                        className="h-2" 
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium">Expired</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {systemAnalytics.expiredMemberships}
                          </span>
                          <Badge variant="secondary">
                            {((systemAnalytics.expiredMemberships / systemAnalytics.totalMemberships) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={(systemAnalytics.expiredMemberships / systemAnalytics.totalMemberships) * 100} 
                        className="h-2" 
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="text-sm font-medium">Cancelled</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {systemAnalytics.cancelledMemberships}
                          </span>
                          <Badge variant="secondary">
                            {((systemAnalytics.cancelledMemberships / systemAnalytics.totalMemberships) * 100).toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <Progress 
                        value={(systemAnalytics.cancelledMemberships / systemAnalytics.totalMemberships) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Key Performance Indicators */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Performance Indicators</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Churn Rate</span>
                      </div>
                      <div className="text-lg font-bold">{systemAnalytics.churnRate}%</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Avg Lifetime Value</span>
                      </div>
                      <div className="text-lg font-bold">{systemAnalytics.averageLifetimeValue.toFixed(0)} AED</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">New This Month</span>
                      </div>
                      <div className="text-lg font-bold">{systemAnalytics.newMembershipsThisMonth}</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Expiring Soon</span>
                      </div>
                      <div className="text-lg font-bold">{systemAnalytics.expiringThisMonth}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>
                    Detailed revenue breakdown and trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {systemAnalytics.totalRevenue.toLocaleString()} AED
                      </div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {systemAnalytics.monthlyRevenue.toLocaleString()} AED
                      </div>
                      <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {systemAnalytics.averageRevenuePerMember.toFixed(0)} AED
                      </div>
                      <div className="text-sm text-muted-foreground">Avg per Member</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Member Analytics</CardTitle>
                  <CardDescription>
                    Member growth, retention, and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Member Growth</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Total Members</span>
                          <span className="font-medium">{systemAnalytics.totalMemberships}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Active Members</span>
                          <span className="font-medium">{systemAnalytics.activeMemberships}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">New This Month</span>
                          <span className="font-medium">{systemAnalytics.newMembershipsThisMonth}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Member Retention</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Renewal Rate</span>
                          <span className="font-medium">{systemAnalytics.renewalRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Churn Rate</span>
                          <span className="font-medium">{systemAnalytics.churnRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Expiring Soon</span>
                          <span className="font-medium">{systemAnalytics.expiringThisMonth}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>
                    Overall membership program performance and member value
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold">Financial Performance</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                          <span className="text-sm font-medium">Total Member Savings</span>
                          <span className="font-bold text-green-600">
                            {systemAnalytics.memberSavings.toLocaleString()} AED
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-sm font-medium">Average Lifetime Value</span>
                          <span className="font-bold text-blue-600">
                            {systemAnalytics.averageLifetimeValue.toFixed(0)} AED
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold">Program Health</h4>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Renewal Rate</span>
                            <span className="font-medium">{systemAnalytics.renewalRate}%</span>
                          </div>
                          <Progress value={systemAnalytics.renewalRate} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Member Satisfaction</span>
                            <span className="font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Report Data */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Report</CardTitle>
            <CardDescription>
              {reportData.period.charAt(0).toUpperCase() + reportData.period.slice(1)} report from{' '}
              {new Date(reportData.startDate).toLocaleDateString()} to{' '}
              {new Date(reportData.endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Top Services</h4>
                  <div className="space-y-2">
                    {reportData.topServices.slice(0, 5).map((service, index) => (
                      <div key={service.serviceId} className="flex justify-between items-center">
                        <span className="text-sm">{service.serviceName}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{service.usageCount} uses</Badge>
                          <span className="text-sm font-medium">
                            {service.totalSavings.toFixed(0)} AED saved
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Report Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Members:</span>
                      <span className="font-medium">{reportData.analytics.totalMemberships}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Members:</span>
                      <span className="font-medium">{reportData.analytics.activeMemberships}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-medium">{reportData.analytics.totalRevenue.toLocaleString()} AED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Member Savings:</span>
                      <span className="font-medium">{reportData.analytics.memberSavings.toLocaleString()} AED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
}

function MetricCard({ title, value, format, icon: Icon, trend, className }: MetricCardProps) {
  const formatValue = (val: number, fmt: string) => {
    switch (fmt) {
      case 'currency':
        return `${val.toLocaleString()} AED`;
      case 'percentage':
        return `${val}%`;
      default:
        return val.toString();
    }
  };

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <div className="text-2xl font-bold">
              {formatValue(value, format)}
            </div>
            {trend && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
              )}>
                {trend.direction === 'up' ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{trend.value}% this month</span>
              </div>
            )}
          </div>
          <div className="p-2 bg-white/50 rounded-full">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminAnalyticsReporting;