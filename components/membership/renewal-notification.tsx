/**
 * Renewal Notification Component
 * 
 * Displays renewal reminders for expiring memberships
 * Requirements: 6.1, 6.2 - Display renewal notifications 30 days before expiration
 */

'use client';

import React from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { AtpMembership } from '../../lib/types/membership';
import { isMembershipExpiringSoon, isMembershipExpired } from '../../lib/types/membership-utils';

interface RenewalNotificationProps {
  membership: AtpMembership;
  onRenewClick: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function RenewalNotification({
  membership,
  onRenewClick,
  onDismiss,
  className = ''
}: RenewalNotificationProps) {
  const t = useTranslations('membership.renewal');
  
  const expirationDate = new Date(membership.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const isExpired = isMembershipExpired(membership);
  const isExpiringSoon = isMembershipExpiringSoon(membership);
  
  // Don't show notification if membership is active and not expiring soon
  if (!isExpired && !isExpiringSoon) {
    return null;
  }

  const getNotificationVariant = () => {
    if (isExpired) return 'destructive';
    if (daysUntilExpiration <= 7) return 'destructive';
    if (daysUntilExpiration <= 14) return 'warning';
    return 'default';
  };

  const getIcon = () => {
    if (isExpired) return <AlertTriangle className="h-5 w-5" />;
    if (daysUntilExpiration <= 7) return <AlertTriangle className="h-5 w-5" />;
    return <Clock className="h-5 w-5" />;
  };

  const getTitle = () => {
    if (isExpired) return t('expired.title');
    if (daysUntilExpiration <= 7) return t('urgent.title');
    return t('reminder.title');
  };

  const getMessage = () => {
    if (isExpired) {
      return t('expired.message');
    }
    return t('reminder.message', { days: daysUntilExpiration });
  };

  const getButtonText = () => {
    if (isExpired) return t('expired.renewButton');
    return t('reminder.renewButton');
  };

  return (
    <Card className={`border-l-4 ${
      isExpired 
        ? 'border-l-red-500 bg-red-50 dark:bg-red-950/20' 
        : daysUntilExpiration <= 7
        ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20'
        : 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
    } ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getIcon()}
            <CardTitle className="text-lg">{getTitle()}</CardTitle>
            <Badge variant={getNotificationVariant()}>
              {isExpired ? t('expired.badge') : t('reminder.badge', { days: daysUntilExpiration })}
            </Badge>
          </div>
          {onDismiss && !isExpired && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {getMessage()}
        </p>
        <div className="flex items-center gap-3">
          <Button
            onClick={onRenewClick}
            variant={isExpired ? "destructive" : "default"}
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            {getButtonText()}
          </Button>
          {!isExpired && (
            <p className="text-xs text-muted-foreground">
              {t('reminder.expiresOn', { 
                date: expirationDate.toLocaleDateString()
              })}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Compact Renewal Banner Component
 * For use in headers or as a persistent banner
 */
interface RenewalBannerProps {
  membership: AtpMembership;
  onRenewClick: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function RenewalBanner({
  membership,
  onRenewClick,
  onDismiss,
  className = ''
}: RenewalBannerProps) {
  const t = useTranslations('membership.renewal');
  
  const expirationDate = new Date(membership.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const isExpired = isMembershipExpired(membership);
  const isExpiringSoon = isMembershipExpiringSoon(membership);
  
  // Don't show banner if membership is active and not expiring soon
  if (!isExpired && !isExpiringSoon) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${
      isExpired 
        ? 'bg-red-100 border border-red-200 dark:bg-red-950/20 dark:border-red-800' 
        : 'bg-orange-100 border border-orange-200 dark:bg-orange-950/20 dark:border-orange-800'
    } ${className}`}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4" />
        <span className="text-sm font-medium">
          {isExpired 
            ? t('banner.expired') 
            : t('banner.expiring', { days: daysUntilExpiration })
          }
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          onClick={onRenewClick}
          size="sm"
          variant={isExpired ? "destructive" : "default"}
        >
          {t('banner.renewButton')}
        </Button>
        {onDismiss && !isExpired && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}