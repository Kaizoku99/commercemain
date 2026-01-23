/**
 * Membership Notifications Component
 * 
 * Displays membership-related notifications with RTL support and cultural considerations
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 1.1, 1.2, 1.3, 1.4
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useCurrentLocale } from '@/src/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import {
  Bell,
  Crown,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Gift,
  Truck,
  Star,
  X,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useAtpMembership } from '../../hooks/use-atp-membership';
import { LocalizedCurrency } from '@/components/ui/localized-currency';
import { useMembershipI18n } from '@/lib/utils/membership-i18n';
import { useRTL } from '@/hooks/use-rtl';
import { useUAECultural } from '@/lib/utils/uae-cultural-config';
import { cn } from '@/lib/utils';

interface MembershipNotification {
  id: string;
  type: 'renewal' | 'expired' | 'benefit' | 'welcome' | 'savings' | 'system';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  action?: {
    label: string;
    url?: string;
    handler?: () => void;
  };
  dismissible: boolean;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface MembershipNotificationsProps {
  className?: string;
  maxNotifications?: number;
  showSettings?: boolean;
  autoHide?: boolean;
}

export function MembershipNotifications({
  className,
  maxNotifications = 5,
  showSettings = true,
  autoHide = false,
}: MembershipNotificationsProps) {
  const t = useTranslations('membership.notifications');
  const { locale } = useCurrentLocale();
  const { isRTL, direction } = useRTL();
  const { formatDate, formatDuration } = useMembershipI18n(locale);
  const { getSuccessMessages, getGreeting } = useUAECultural(locale);
  
  const { membership, stats, isActive, isExpired, daysUntilExpiration } = useAtpMembership();
  
  const [notifications, setNotifications] = useState<MembershipNotification[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Generate notifications based on membership status
  useEffect(() => {
    if (!membership) return;

    const newNotifications: MembershipNotification[] = [];

    // Renewal notifications
    if (isActive && daysUntilExpiration <= 30) {
      const urgency = daysUntilExpiration <= 7 ? 'urgent' : 'high';
      newNotifications.push({
        id: 'renewal-reminder',
        type: 'renewal',
        priority: urgency,
        title: locale === 'ar' ? 'تذكير التجديد' : 'Renewal Reminder',
        message: t('membershipExpiring', { days: daysUntilExpiration }),
        timestamp: new Date(),
        read: false,
        actionable: true,
        action: {
          label: locale === 'ar' ? 'جدد الآن' : 'Renew Now',
          url: '/membership/renew',
        },
        dismissible: false,
        icon: Calendar,
        color: urgency === 'urgent' ? 'text-red-600' : 'text-yellow-600',
      });
    }

    // Expired membership notification
    if (isExpired) {
      newNotifications.push({
        id: 'membership-expired',
        type: 'expired',
        priority: 'urgent',
        title: locale === 'ar' ? 'انتهت صلاحية العضوية' : 'Membership Expired',
        message: t('membershipExpired'),
        timestamp: new Date(),
        read: false,
        actionable: true,
        action: {
          label: locale === 'ar' ? 'إعادة تفعيل' : 'Reactivate',
          url: '/membership/renew',
        },
        dismissible: false,
        icon: AlertTriangle,
        color: 'text-red-600',
      });
    }

    // Welcome notification for new members
    if (membership && isActive) {
      const memberSince = new Date(membership.startDate);
      const daysSinceMembership = Math.floor(
        (Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceMembership <= 7) {
        newNotifications.push({
          id: 'welcome-member',
          type: 'welcome',
          priority: 'medium',
          title: locale === 'ar' ? 'مرحباً بك في ATP' : 'Welcome to ATP',
          message: getSuccessMessages().membershipActivated,
          timestamp: memberSince,
          read: false,
          actionable: true,
          action: {
            label: locale === 'ar' ? 'استكشف المزايا' : 'Explore Benefits',
            url: '/membership/benefits',
          },
          dismissible: true,
          icon: Crown,
          color: 'text-atp-gold',
        });
      }
    }

    // Savings milestone notifications
    if (stats && stats.totalSavings > 0) {
      const savingsMilestones = [100, 250, 500, 1000];
      const currentMilestone = savingsMilestones.find(
        milestone => stats.totalSavings >= milestone && stats.totalSavings < milestone + 50
      );

      if (currentMilestone) {
        newNotifications.push({
          id: `savings-milestone-${currentMilestone}`,
          type: 'savings',
          priority: 'medium',
          title: locale === 'ar' ? 'إنجاز في المدخرات!' : 'Savings Milestone!',
          message: locale === 'ar' 
            ? `تهانينا! لقد وفرت ${currentMilestone} درهم مع عضوية ATP`
            : `Congratulations! You've saved د.إ ${currentMilestone} with ATP membership`,
          timestamp: new Date(),
          read: false,
          actionable: false,
          dismissible: true,
          icon: Star,
          color: 'text-green-600',
        });
      }
    }

    // Recent benefit usage notifications
    if (stats && stats.servicesUsed > 0) {
      newNotifications.push({
        id: 'recent-benefit',
        type: 'benefit',
        priority: 'low',
        title: locale === 'ar' ? 'تم استخدام الميزة' : 'Benefit Used',
        message: locale === 'ar' 
          ? 'تم تطبيق خصم العضوية على آخر طلب لك'
          : 'Membership discount applied to your recent order',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        actionable: true,
        action: {
          label: locale === 'ar' ? 'عرض التفاصيل' : 'View Details',
          url: '/account/orders',
        },
        dismissible: true,
        icon: Gift,
        color: 'text-blue-600',
      });
    }

    setNotifications(newNotifications.slice(0, maxNotifications));
  }, [membership, stats, isActive, isExpired, daysUntilExpiration, locale, maxNotifications, t, getSuccessMessages]);

  // Browser notifications
  useEffect(() => {
    if (!notificationsEnabled || !('Notification' in window)) return;

    const requestPermission = async () => {
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
    };

    requestPermission();
  }, [notificationsEnabled]);

  // Show browser notification for urgent items
  useEffect(() => {
    if (!notificationsEnabled || Notification.permission !== 'granted') return;

    const urgentNotifications = notifications.filter(
      n => n.priority === 'urgent' && !n.read
    );

    urgentNotifications.forEach(notification => {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id,
      });

      if (soundEnabled) {
        // Play notification sound
        const audio = new Audio('/notification-sound.mp3');
        audio.play().catch(() => {
          // Ignore audio play errors
        });
      }
    });
  }, [notifications, notificationsEnabled, soundEnabled]);

  const handleDismiss = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    );
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
  };

  const handleAction = (notification: MembershipNotification) => {
    if (notification.action?.handler) {
      notification.action.handler();
    } else if (notification.action?.url) {
      window.location.href = notification.action.url;
    }
    handleMarkAsRead(notification.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500 bg-red-50';
      case 'high': return 'border-yellow-500 bg-yellow-50';
      case 'medium': return 'border-blue-500 bg-blue-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-4 membership-content", className)} dir={direction}>
      {/* Settings Header */}
      {showSettings && (
        <div className={cn(
          "flex items-center justify-between",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}>
          <div className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">
              {locale === 'ar' ? 'الإشعارات' : 'Notifications'}
            </span>
            <Badge variant="secondary" className="text-xs">
              {notifications.filter(n => !n.read).length}
            </Badge>
          </div>
          <div className={cn(
            "flex items-center gap-2",
            isRTL ? "flex-row-reverse" : "flex-row"
          )}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn(
                "flex items-center gap-1",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={cn(
              "transition-all duration-200 hover:shadow-md",
              getPriorityColor(notification.priority),
              !notification.read && "ring-2 ring-offset-2 ring-blue-500/20"
            )}
          >
            <CardContent className="p-4">
              <div className={cn(
                "flex items-start gap-3",
                isRTL ? "flex-row-reverse" : "flex-row"
              )}>
                <div className={cn(
                  "flex-shrink-0 p-2 rounded-full",
                  notification.priority === 'urgent' ? 'bg-red-100' :
                  notification.priority === 'high' ? 'bg-yellow-100' :
                  notification.priority === 'medium' ? 'bg-blue-100' : 'bg-gray-100'
                )}>
                  <notification.icon className={cn("h-4 w-4", notification.color)} />
                </div>
                
                <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                  <div className={cn(
                    "flex items-center justify-between mb-1",
                    isRTL ? "flex-row-reverse" : "flex-row"
                  )}>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(notification.timestamp)}
                      </span>
                      {notification.dismissible && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(notification.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {notification.message}
                  </p>
                  
                  {notification.actionable && notification.action && (
                    <div className={cn(
                      "flex items-center gap-2",
                      isRTL ? "flex-row-reverse" : "flex-row"
                    )}>
                      <Button
                        size="sm"
                        onClick={() => handleAction(notification)}
                        className={cn(
                          notification.priority === 'urgent' ? 'bg-red-600 hover:bg-red-700' :
                          notification.priority === 'high' ? 'bg-yellow-600 hover:bg-yellow-700' :
                          'bg-blue-600 hover:bg-blue-700'
                        )}
                      >
                        {notification.action.label}
                      </Button>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {locale === 'ar' ? 'تم القراءة' : 'Mark as Read'}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auto-hide functionality */}
      {autoHide && notifications.length > 0 && (
        <div className={cn("text-center", isRTL ? "text-right" : "text-left")}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotifications([])}
            className="text-muted-foreground"
          >
            {locale === 'ar' ? 'إخفاء جميع الإشعارات' : 'Hide All Notifications'}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * Toast Notification Hook for Membership Events
 */
export function useMembershipToasts() {
  const { locale } = useCurrentLocale();
  const { getSuccessMessages } = useUAECultural(locale);

  const showMembershipActivated = () => {
    toast.success(getSuccessMessages().membershipActivated, {
      duration: 5000,
      position: locale === 'ar' ? 'top-left' : 'top-right',
    });
  };

  const showPaymentSuccess = () => {
    toast.success(getSuccessMessages().paymentSuccess, {
      duration: 4000,
      position: locale === 'ar' ? 'top-left' : 'top-right',
    });
  };

  const showBenefitsUnlocked = () => {
    toast.success(getSuccessMessages().benefitsUnlocked, {
      duration: 4000,
      position: locale === 'ar' ? 'top-left' : 'top-right',
    });
  };

  const showDiscountApplied = (amount: number) => {
    const message = locale === 'ar' 
      ? `تم تطبيق خصم العضوية - وفرت ${amount} درهم`
      : `Membership discount applied - You saved د.إ ${amount}`;
    
    toast.success(message, {
      duration: 3000,
      position: locale === 'ar' ? 'top-left' : 'top-right',
    });
  };

  const showRenewalReminder = (days: number) => {
    const message = locale === 'ar' 
      ? `تنتهي عضويتك خلال ${days} أيام`
      : `Your membership expires in ${days} days`;
    
    toast.warning(message, {
      duration: 6000,
      position: locale === 'ar' ? 'top-left' : 'top-right',
      action: {
        label: locale === 'ar' ? 'جدد الآن' : 'Renew Now',
        onClick: () => window.location.href = '/membership/renew',
      },
    });
  };

  return {
    showMembershipActivated,
    showPaymentSuccess,
    showBenefitsUnlocked,
    showDiscountApplied,
    showRenewalReminder,
  };
}

export default MembershipNotifications;