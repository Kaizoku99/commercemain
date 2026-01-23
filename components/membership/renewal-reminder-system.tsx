/**
 * Renewal Reminder System Component
 * 
 * Manages automatic renewal reminders and notifications
 * Requirements: 6.1, 6.4 - Automatic renewal reminders 30 days before expiration
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Bell, X, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { RenewalNotification, RenewalBanner } from './renewal-notification';
import { RenewalPayment } from './renewal-payment';
import { AtpMembership, MembershipNotification } from '../../lib/types/membership';
import { useAtpMembership } from '../../hooks/use-atp-membership';
import { isMembershipExpiringSoon, isMembershipExpired } from '../../lib/types/membership-utils';

interface RenewalReminderSystemProps {
  membership: AtpMembership;
  onRenewalComplete?: (renewedMembership: AtpMembership) => void;
  showBanner?: boolean;
  showCard?: boolean;
  className?: string;
}

export function RenewalReminderSystem({
  membership,
  onRenewalComplete,
  showBanner = true,
  showCard = true,
  className = ''
}: RenewalReminderSystemProps) {
  const t = useTranslations('membership.renewal.system');
  const { refreshMembership } = useAtpMembership();
  
  const [notifications, setNotifications] = useState<MembershipNotification[]>([]);
  const [dismissedNotifications, setDismissedNotifications] = useState<Set<string>>(new Set());
  const [showRenewalPayment, setShowRenewalPayment] = useState(false);
  const [reminderSettings, setReminderSettings] = useState({
    emailReminders: true,
    browserNotifications: true,
    dashboardNotifications: true
  });

  // Check if membership needs renewal reminders
  const needsRenewal = isMembershipExpiringSoon(membership) || isMembershipExpired(membership);
  const isExpired = isMembershipExpired(membership);
  
  const expirationDate = new Date(membership.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  // Generate renewal notifications
  const generateNotifications = useCallback(() => {
    if (!needsRenewal) return [];

    const notifications: MembershipNotification[] = [];

    if (isExpired) {
      notifications.push({
        type: 'expired',
        membershipId: membership.id,
        customerId: membership.customerId,
        message: t('notifications.expired.message'),
        actionRequired: true,
        expirationDate: membership.expirationDate,
        renewalUrl: `/membership/renew/${membership.id}`
      });
    } else if (daysUntilExpiration <= 30) {
      notifications.push({
        type: 'renewal_reminder',
        membershipId: membership.id,
        customerId: membership.customerId,
        message: t('notifications.reminder.message', { days: daysUntilExpiration }),
        actionRequired: daysUntilExpiration <= 7,
        expirationDate: membership.expirationDate,
        renewalUrl: `/membership/renew/${membership.id}`
      });
    }

    return notifications;
  }, [membership, needsRenewal, isExpired, daysUntilExpiration, t]);

  // Update notifications when membership changes
  useEffect(() => {
    const newNotifications = generateNotifications();
    setNotifications(newNotifications);
  }, [generateNotifications]);

  // Request browser notification permission
  useEffect(() => {
    if (reminderSettings.browserNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [reminderSettings.browserNotifications]);

  // Send browser notifications for urgent reminders
  useEffect(() => {
    if (
      reminderSettings.browserNotifications &&
      'Notification' in window &&
      Notification.permission === 'granted' &&
      (isExpired || daysUntilExpiration <= 7)
    ) {
      const title = isExpired 
        ? t('browserNotification.expired.title')
        : t('browserNotification.urgent.title');
      
      const body = isExpired
        ? t('browserNotification.expired.body')
        : t('browserNotification.urgent.body', { days: daysUntilExpiration });

      new Notification(title, {
        body,
        icon: '/favicon.ico',
        tag: `renewal-${membership.id}`,
        requireInteraction: true
      });
    }
  }, [membership.id, isExpired, daysUntilExpiration, reminderSettings.browserNotifications, t]);

  const handleDismissNotification = (notificationId: string) => {
    setDismissedNotifications(prev => new Set([...prev, notificationId]));
  };

  const handleRenewalClick = () => {
    setShowRenewalPayment(true);
  };

  const handleRenewalSuccess = (renewedMembership: AtpMembership) => {
    setShowRenewalPayment(false);
    setDismissedNotifications(new Set()); // Clear dismissed notifications
    refreshMembership(); // Refresh membership data
    
    if (onRenewalComplete) {
      onRenewalComplete(renewedMembership);
    }
  };

  const handleRenewalError = (error: Error) => {
    console.error('Renewal error:', error);
    // Keep renewal payment form open for retry
  };

  const activeNotifications = notifications.filter(
    notification => !dismissedNotifications.has(notification.membershipId + notification.type)
  );

  if (!needsRenewal && !showRenewalPayment) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Renewal Payment Modal/Card */}
      {showRenewalPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full">
            <div className="flex justify-end mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRenewalPayment(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <RenewalPayment
              membership={membership}
              onSuccess={handleRenewalSuccess}
              onError={handleRenewalError}
            />
          </div>
        </div>
      )}

      {/* Banner Notification */}
      {showBanner && activeNotifications.length > 0 && (
        <RenewalBanner
          membership={membership}
          onRenewClick={handleRenewalClick}
          onDismiss={() => handleDismissNotification(membership.id + 'banner')}
        />
      )}

      {/* Card Notifications */}
      {showCard && activeNotifications.map((notification) => (
        <RenewalNotification
          key={`${notification.membershipId}-${notification.type}`}
          membership={membership}
          onRenewClick={handleRenewalClick}
          onDismiss={() => handleDismissNotification(notification.membershipId + notification.type)}
        />
      ))}

      {/* Reminder Settings */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings className="h-4 w-4" />
            {t('settings.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-reminders" className="text-sm">
              {t('settings.emailReminders')}
            </Label>
            <Switch
              id="email-reminders"
              checked={reminderSettings.emailReminders}
              onCheckedChange={(checked) =>
                setReminderSettings(prev => ({ ...prev, emailReminders: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="browser-notifications" className="text-sm">
              {t('settings.browserNotifications')}
            </Label>
            <Switch
              id="browser-notifications"
              checked={reminderSettings.browserNotifications}
              onCheckedChange={(checked) =>
                setReminderSettings(prev => ({ ...prev, browserNotifications: checked }))
              }
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="dashboard-notifications" className="text-sm">
              {t('settings.dashboardNotifications')}
            </Label>
            <Switch
              id="dashboard-notifications"
              checked={reminderSettings.dashboardNotifications}
              onCheckedChange={(checked) =>
                setReminderSettings(prev => ({ ...prev, dashboardNotifications: checked }))
              }
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {t('settings.description')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Renewal Status Indicator Component
 * Shows renewal status in a compact format
 */
interface RenewalStatusIndicatorProps {
  membership: AtpMembership;
  onClick?: () => void;
  className?: string;
}

export function RenewalStatusIndicator({
  membership,
  onClick,
  className = ''
}: RenewalStatusIndicatorProps) {
  const t = useTranslations('membership.renewal.indicator');
  
  const isExpired = isMembershipExpired(membership);
  const isExpiringSoon = isMembershipExpiringSoon(membership);
  
  if (!isExpired && !isExpiringSoon) {
    return null;
  }

  const expirationDate = new Date(membership.expirationDate);
  const now = new Date();
  const daysUntilExpiration = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={`flex items-center gap-2 ${
        isExpired ? 'text-red-600 hover:text-red-700' : 'text-orange-600 hover:text-orange-700'
      } ${className}`}
    >
      <Bell className="h-4 w-4" />
      <span className="text-xs">
        {isExpired 
          ? t('expired')
          : t('expiring', { days: daysUntilExpiration })
        }
      </span>
    </Button>
  );
}