/**
 * ATP Membership Dashboard Component
 *
 * Displays ATP membership status, benefits, savings analytics, and management options.
 * Integrates with the ATP membership system (99 د.إ annual membership).
 */

"use client";

import React from "react";
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/src/i18n/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Crown,
  Calendar,
  TrendingUp,
  Gift,
  Truck,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  X,
  DollarSign,
  Package,
  Star,
} from "lucide-react";
import { useMembershipI18n } from "@/lib/utils/membership-i18n";
import { useRTL } from "@/hooks/use-rtl";
import { cn } from "@/lib/utils";
import {
  useAtpMembership,
  useMembershipStatus,
  useMembershipOperations,
} from "../../hooks/use-atp-membership";
import {
  useBenefitSummary,
  useRenewalUrgency,
  useMembershipValue,
} from "../../hooks/use-membership-benefits";
import { useMembershipDashboardErrorHandling } from "../../hooks/use-membership-error-handling";
import { MembershipDashboardErrorBoundary } from "./membership-error-boundary";
import {
  MembershipErrorDisplay,
  LoadingErrorState,
  NetworkStatusDisplay,
} from "./membership-error-display";
import {
  MembershipRenewalSystem,
  RenewalDashboardWidget,
} from "./membership-renewal-system";
import { formatDirhamWithSymbol } from "@/lib/utils";
import { DirhamSymbol } from "@/components/icons/dirham-symbol";

interface AtpMembershipDashboardProps {
  customerId?: string;
  className?: string;
}

function AtpMembershipDashboardContent({
  customerId,
  className,
}: AtpMembershipDashboardProps) {
  const t = useTranslations('membership');
  const locale = useLocale() as "en" | "ar";
  const { isRTL, direction } = useRTL();
  const { formatPrice, formatDate, getRTLClasses, getIconClasses } =
    useMembershipI18n(locale);

  const { membership, stats, isLoading, error, refreshMembership } =
    useAtpMembership();

  const { statusInfo, isActive, isExpired, daysUntilExpiration } =
    useMembershipStatus();
  const { handleRenewal, handleCancellation } = useMembershipOperations();
  const { benefits } = useBenefitSummary();
  const {
    urgency,
    message: renewalMessage,
    showRenewalCTA,
  } = useRenewalUrgency();
  const membershipValue = useMembershipValue();
  const errorHandling = useMembershipDashboardErrorHandling();
  const rtlClasses = getRTLClasses();

  return (
    <LoadingErrorState
      isLoading={isLoading}
      error={error}
      onRetry={refreshMembership}
      loadingText="Loading membership dashboard..."
    >
      {!membership ? (
        <NoMembershipCard className={className} />
      ) : (
        <DashboardContent
          membership={membership}
          stats={stats}
          statusInfo={statusInfo}
          benefits={benefits}
          renewalMessage={renewalMessage}
          showRenewalCTA={showRenewalCTA}
          membershipValue={membershipValue}
          handleRenewal={handleRenewal}
          handleCancellation={handleCancellation}
          refreshMembership={refreshMembership}
          errorHandling={errorHandling}
          className={className}
          t={t}
          locale={locale}
          isRTL={isRTL}
          direction={direction}
          formatPrice={formatPrice}
          formatDate={formatDate}
          rtlClasses={rtlClasses}
          getIconClasses={getIconClasses}
          isActive={isActive}
          daysUntilExpiration={daysUntilExpiration}
        />
      )}
    </LoadingErrorState>
  );
}

function DashboardContent({
  membership,
  stats,
  statusInfo,
  benefits,
  renewalMessage,
  showRenewalCTA,
  membershipValue,
  handleRenewal,
  handleCancellation,
  refreshMembership,
  errorHandling,
  className,
  t,
  locale,
  isRTL,
  direction,
  formatPrice,
  formatDate,
  rtlClasses,
  getIconClasses,
  isActive,
  daysUntilExpiration,
}: any) {
  return (
    <div
      className={cn("space-y-6 membership-content", className)}
      dir={direction}
    >
      {/* Renewal System Integration */}
      <MembershipRenewalSystem
        membership={membership}
        displayMode="banner"
        onRenewalComplete={(renewedMembership) => {
          console.log("Membership renewed:", renewedMembership);
          refreshMembership();
        }}
      />

      {/* Renewal Dashboard Widget */}
      <RenewalDashboardWidget
        membership={membership}
        onRenewalComplete={(renewedMembership) => {
          console.log("Membership renewed:", renewedMembership);
          refreshMembership();
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Membership Status Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Membership Card */}
          <Card className="membership-card">
            <CardHeader>
              <div
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                  isRTL ? "sm:flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex items-center gap-3",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className="p-2 bg-atp-gold/10 rounded-full">
                    <Crown className="h-6 w-6 text-atp-gold" />
                  </div>
                  <div className={cn(isRTL ? "text-right" : "text-left")}>
                    <CardTitle className="text-xl">
                      {t('dashboardTitle')}
                    </CardTitle>
                    <CardDescription>
                      {t('annualPremium')}
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={cn(
                    "membership-status",
                    isActive ? "bg-green-500 hover:bg-green-600" : "",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {isActive ? (
                    t('statusActive')
                  ) : statusInfo.status === "expired" ? (
                    t('statusExpired')
                  ) : (
                    t('statusInactive')
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Membership Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={cn(
                    "space-y-2",
                    isRTL ? "text-right" : "text-left"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm text-muted-foreground",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{t('memberSince')}</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(membership.startDate)}
                  </p>
                </div>
                <div
                  className={cn(
                    "space-y-2",
                    isRTL ? "text-right" : "text-left"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm text-muted-foreground",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <Calendar className="h-4 w-4" />
                    <span>{t('expiresOn')}</span>
                  </div>
                  <p className="font-medium">
                    {formatDate(membership.expirationDate)}
                  </p>
                </div>
              </div>

              {/* Expiration Progress */}
              {isActive && (
                <div className="space-y-2">
                  <div
                    className={cn(
                      "flex justify-between text-sm",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span>{t('daysRemaining')}</span>
                    <span className="font-medium">
                      {t('daysCount', { count: daysUntilExpiration })}
                    </span>
                  </div>
                  <Progress
                    value={Math.max(0, (daysUntilExpiration / 365) * 100)}
                    className="h-2"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div
                className={cn(
                  "flex flex-wrap gap-3",
                  isRTL ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshMembership}
                  className={cn(
                    "flex items-center gap-2",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>{t('refresh')}</span>
                </Button>
                {isActive && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRenewal(membership.id)}
                      className={cn(
                        "flex items-center gap-2",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>{t('renewEarly')}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancellation(membership.id)}
                      className={cn(
                        "flex items-center gap-2 text-destructive hover:text-destructive",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}
                    >
                      <X className="h-4 w-4" />
                      <span>{t('cancel')}</span>
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          {stats && stats.totalOrders > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5 text-atp-gold" />
                  {t('recentActivity')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div>
                        <p className="font-medium text-sm">
                          {t('serviceDiscountApplied')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stats.lastServiceDate
                            ? new Date(
                                stats.lastServiceDate
                              ).toLocaleDateString()
                            : t('recently')}
                        </p>
                      </div>
                    </div>
                    <div className="text-green-600 font-medium text-sm flex items-center gap-1">
                      <DirhamSymbol size={12} />
                      {(stats.totalSavings / stats.servicesUsed || 0).toFixed(
                        0
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div>
                        <p className="font-medium text-sm">
                          {t('freeDeliveryUsed')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t('timesThisYear', { count: stats.ordersWithFreeDelivery })}
                        </p>
                      </div>
                    </div>
                    <div className="text-blue-600 font-medium text-sm flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {t('free')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Benefits Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-atp-gold" />
                {t('yourBenefits')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {benefits.map((benefit: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        benefit.active ? "bg-green-500" : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">{benefit.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {benefit.value}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Membership Value */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                {t('membershipValue')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500 flex items-center justify-center gap-1">
                  <DirhamSymbol size={20} />
                  {membershipValue.netSavings.toFixed(0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('netSavings')}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>{t('serviceDiscounts')}</span>
                  <span className="flex items-center gap-1">
                    <DirhamSymbol size={12} />
                    {membershipValue.serviceDiscountSavings.toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('freeDelivery')}</span>
                  <span className="flex items-center gap-1">
                    <DirhamSymbol size={12} />
                    {membershipValue.deliverySavings.toFixed(0)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>{t('roi')}</span>
                  <span className="text-green-500">
                    {membershipValue.roi.toFixed(0)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t`Total Savings`}
            value={stats.totalSavings}
            icon={DollarSign}
            format="currency"
          />
          <StatCard
            title={t`Services Used`}
            value={stats.servicesUsed}
            icon={Star}
            format="number"
          />
          <StatCard
            title={t`Free Deliveries`}
            value={stats.ordersWithFreeDelivery}
            icon={Truck}
            format="number"
          />
          <StatCard
            title={t`Total Orders`}
            value={stats.totalOrders}
            icon={Package}
            format="number"
          />
        </div>
      )}
    </div>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  format: "currency" | "number";
}

function StatCard({ title, value, icon: Icon, format }: StatCardProps) {
  const formattedValue =
    format === "currency" ? formatDirhamWithSymbol(value) : value.toString();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {format === "currency" ? (
                <span className="flex items-center gap-1">
                  <DirhamSymbol size={20} />
                  {formattedValue.display}
                </span>
              ) : (
                formattedValue
              )}
            </p>
          </div>
          <div className="p-2 bg-atp-gold/10 rounded-full">
            <Icon className="h-5 w-5 text-atp-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// No Membership Card
function NoMembershipCard({ className }: { className?: string }) {
  const t = useTranslations('membership');
  const locale = useLocale() as "en" | "ar";
  const { isRTL, direction } = useRTL();

  return (
    <Card className={cn("membership-content", className)} dir={direction}>
      <CardContent className={cn("p-8", isRTL ? "text-right" : "text-center")}>
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Crown className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {t('noMembership')}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t('noMembershipDescription')}
        </p>
        <div className="space-y-3">
          <Button className="atp-button-gold" asChild>
            <Link href="/atp-membership">
              {t('joinMembershipCta')}
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            {t('savingsMessage')}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function MembershipDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-8 bg-gray-200 rounded animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse" />
                      <div className="space-y-1">
                        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="w-12 h-5 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export wrapped with error boundary
export function AtpMembershipDashboard(props: AtpMembershipDashboardProps) {
  return (
    <MembershipDashboardErrorBoundary>
      <NetworkStatusDisplay
        isOffline={!navigator.onLine}
        onRetry={() => window.location.reload()}
      />
      <AtpMembershipDashboardContent {...props} />
    </MembershipDashboardErrorBoundary>
  );
}

// Export the wrapped version as default
export default AtpMembershipDashboard;
