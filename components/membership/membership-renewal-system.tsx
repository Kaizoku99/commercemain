/**
 * Comprehensive Membership Renewal System
 * 
 * Main component that orchestrates all renewal functionality
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5 - Complete renewal system implementation
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { RenewalReminderSystem, RenewalStatusIndicator } from './renewal-reminder-system';
import { RenewalNotification, RenewalBanner } from './renewal-notification';
import { RenewalPayment, QuickRenewalButton } from './renewal-payment';
import { AtpMembership } from '../../lib/types/membership';
import { useAtpMembership } from '../../hooks/use-atp-membership';
import { isMembershipExpiringSoon, isMembershipExpired } from '../../lib/types/membership-utils';

interface MembershipRenewalSystemProps {
  membership: AtpMembership;
  displayMode?: 'full' | 'banner' | 'indicator' | 'button';
  onRenewalComplete?: (renewedMembership: AtpMembership) => void;
  className?: string;
}

/**
 * Main Renewal System Component
 * Provides complete renewal functionality based on display mode
 */
export function MembershipRenewalSystem({
  membership,
  displayMode = 'full',
  onRenewalComplete,
  className = ''
}: MembershipRenewalSystemProps) {
  const t = useTranslations('membership.renewal');
  const { refreshMembership } = useAtpMembership();
  
  const [showRenewalFlow, setShowRenewalFlow] = useState(false);
  const needsRenewal = isMembershipExpiringSoon(membership) || isMembershipExpired(membership);

  // Don't render if membership doesn't need renewal and not in full mode
  if (!needsRenewal && displayMode !== 'full') {
    return null;
  }

  const handleRenewalComplete = async (renewedMembership: AtpMembership) => {
    setShowRenewalFlow(false);
    await refreshMembership();
    
    if (onRenewalComplete) {
      onRenewalComplete(renewedMembership);
    }
  };

  const handleRenewalStart = () => {
    setShowRenewalFlow(true);
  };

  // Render based on display mode
  switch (displayMode) {
    case 'banner':
      return (
        <div className={className}>
          <RenewalBanner
            membership={membership}
            onRenewClick={handleRenewalStart}
          />
          {showRenewalFlow && (
            <div className="mt-4">
              <RenewalPayment
                membership={membership}
                onSuccess={handleRenewalComplete}
                onError={(error) => console.error('Renewal error:', error)}
              />
            </div>
          )}
        </div>
      );

    case 'indicator':
      return (
        <RenewalStatusIndicator
          membership={membership}
          onClick={handleRenewalStart}
          className={className}
        />
      );

    case 'button':
      return (
        <QuickRenewalButton
          membership={membership}
          onRenewalStart={handleRenewalStart}
          className={className}
        />
      );

    case 'full':
    default:
      return (
        <div className={className}>
          <RenewalReminderSystem
            membership={membership}
            onRenewalComplete={handleRenewalComplete}
            showBanner={true}
            showCard={true}
          />
        </div>
      );
  }
}

/**
 * Renewal Dashboard Widget
 * For use in membership dashboards
 */
interface RenewalDashboardWidgetProps {
  membership: AtpMembership;
  onRenewalComplete?: (renewedMembership: AtpMembership) => void;
  className?: string;
}

export function RenewalDashboardWidget({
  membership,
  onRenewalComplete,
  className = ''
}: RenewalDashboardWidgetProps) {
  const t = useTranslations('membership.renewal.dashboard');
  
  const isExpired = isMembershipExpired(membership);
  const isExpiringSoon = isMembershipExpiringSoon(membership);
  const needsRenewal = isExpired || isExpiringSoon;

  if (!needsRenewal) {
    return null;
  }

  const expirationDate = new Date(membership.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className={`bg-gradient-to-r ${
      isExpired 
        ? 'from-red-50 to-red-100 dark:from-red-950/20 dark:to-red-900/20' 
        : 'from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20'
    } p-4 rounded-lg border ${
      isExpired ? 'border-red-200 dark:border-red-800' : 'border-orange-200 dark:border-orange-800'
    } ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-sm">
            {isExpired ? t('widget.expired.title') : t('widget.expiring.title')}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {isExpired 
              ? t('widget.expired.message')
              : t('widget.expiring.message', { days: daysUntilExpiration })
            }
          </p>
        </div>
        <MembershipRenewalSystem
          membership={membership}
          displayMode="button"
          onRenewalComplete={onRenewalComplete}
        />
      </div>
    </div>
  );
}

/**
 * Renewal Status Badge
 * Shows renewal status in a compact badge format
 */
interface RenewalStatusBadgeProps {
  membership: AtpMembership;
  onClick?: () => void;
  className?: string;
}

export function RenewalStatusBadge({
  membership,
  onClick,
  className = ''
}: RenewalStatusBadgeProps) {
  const t = useTranslations('membership.renewal.badge');
  
  const isExpired = isMembershipExpired(membership);
  const isExpiringSoon = isMembershipExpiringSoon(membership);
  
  if (!isExpired && !isExpiringSoon) {
    return null;
  }

  const expirationDate = new Date(membership.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const badgeVariant = isExpired ? 'destructive' : daysUntilExpiration <= 7 ? 'destructive' : 'secondary';
  const badgeText = isExpired ? t('expired') : t('expiring', { days: daysUntilExpiration });

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
        badgeVariant === 'destructive'
          ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
          : 'bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300'
      } ${className}`}
    >
      {badgeText}
    </span>
  );
}

/**
 * Auto Renewal Checker Hook
 * Automatically checks for renewal needs and triggers notifications
 */
export function useAutoRenewalChecker(membership: AtpMembership | null) {
  const [lastCheck, setLastCheck] = useState<string | null>(null);
  
  useEffect(() => {
    if (!membership) return;

    const checkRenewalStatus = () => {
      const now = new Date().toISOString();
      const needsRenewal = isMembershipExpiringSoon(membership) || isMembershipExpired(membership);
      
      if (needsRenewal && lastCheck !== membership.id) {
        // Trigger renewal check logic here
        // This could include analytics tracking, email triggers, etc.
        console.log('Membership needs renewal:', membership.id);
        setLastCheck(membership.id);
      }
    };

    // Check immediately
    checkRenewalStatus();

    // Set up periodic checking (every hour)
    const interval = setInterval(checkRenewalStatus, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [membership, lastCheck]);

  return {
    needsRenewal: membership ? (isMembershipExpiringSoon(membership) || isMembershipExpired(membership)) : false,
    isExpired: membership ? isMembershipExpired(membership) : false,
    isExpiringSoon: membership ? isMembershipExpiringSoon(membership) : false
  };
}

// Export all renewal components for easy access
export {
  RenewalReminderSystem,
  RenewalNotification,
  RenewalBanner,
  RenewalPayment,
  QuickRenewalButton,
  RenewalStatusIndicator
};