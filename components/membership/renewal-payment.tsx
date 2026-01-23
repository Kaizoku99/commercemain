/**
 * Renewal Payment Component
 * 
 * Handles membership renewal payment processing with Shopify checkout
 * Requirements: 6.2, 6.3 - Process renewal payment and handle membership extension
 */

'use client';

import React, { useState } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { CreditCard, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { AtpMembership } from '../../lib/types/membership';
import { useMembershipOperations } from '../../hooks/use-atp-membership';
import { MEMBERSHIP_CONFIG } from '../../lib/constants/membership';

interface RenewalPaymentProps {
  membership: AtpMembership;
  onSuccess?: (renewedMembership: AtpMembership) => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function RenewalPayment({
  membership,
  onSuccess,
  onError,
  className = ''
}: RenewalPaymentProps) {
  const t = useTranslations('membership.renewal.payment');
  const { handleRenewal, isLoading } = useMembershipOperations();
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const currentExpiration = new Date(membership.expirationDate);
  const newExpiration = new Date(currentExpiration);
  newExpiration.setMonth(newExpiration.getMonth() + MEMBERSHIP_CONFIG.MEMBERSHIP_DURATION_MONTHS);

  const handleRenewalClick = async () => {
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      const result = await handleRenewal(membership.id);
      
      if (result.success) {
        setPaymentStatus('success');
        // In a real implementation, this would redirect to Shopify checkout
        // For now, we'll simulate the success flow
        setTimeout(() => {
          if (onSuccess) {
            const renewedMembership: AtpMembership = {
              ...membership,
              expirationDate: newExpiration.toISOString(),
              status: 'active',
              paymentStatus: 'paid',
              updatedAt: new Date().toISOString()
            };
            onSuccess(renewedMembership);
          }
        }, 2000);
      } else {
        setPaymentStatus('error');
        setErrorMessage(result.error?.message || t('error.generic'));
        if (onError) {
          onError(result.error || new Error(t('error.generic')));
        }
      }
    } catch (error) {
      setPaymentStatus('error');
      const errorMsg = error instanceof Error ? error.message : t('error.generic');
      setErrorMessage(errorMsg);
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMsg));
      }
    }
  };

  const isExpired = new Date(membership.expirationDate) < new Date();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {isExpired ? t('title.expired') : t('title.renewal')}
          </CardTitle>
          <Badge variant={isExpired ? 'destructive' : 'secondary'}>
            {isExpired ? t('status.expired') : t('status.expiring')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Membership Info */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">{t('current.title')}</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{t('current.expires')}: {currentExpiration.toLocaleDateString()}</p>
            <p>{t('current.status')}: {membership.status}</p>
          </div>
        </div>

        {/* Renewal Details */}
        <div className="space-y-3">
          <h4 className="font-medium">{t('renewal.title')}</h4>
          <div className="flex justify-between items-center">
            <span>{t('renewal.fee')}</span>
            <span className="font-semibold">{MEMBERSHIP_CONFIG.ANNUAL_FEE} {t('currency')}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{t('renewal.newExpiration')}</span>
            <span>{newExpiration.toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{t('renewal.duration')}</span>
            <span>{MEMBERSHIP_CONFIG.MEMBERSHIP_DURATION_MONTHS} {t('months')}</span>
          </div>
        </div>

        {/* Benefits Reminder */}
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
            {t('benefits.title')}
          </h4>
          <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
            <li>• {t('benefits.discount')}</li>
            <li>• {t('benefits.freeDelivery')}</li>
            <li>• {t('benefits.prioritySupport')}</li>
            <li>• {t('benefits.exclusiveOffers')}</li>
          </ul>
        </div>

        {/* Error Display */}
        {paymentStatus === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {paymentStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t('success.message')}
            </AlertDescription>
          </Alert>
        )}

        {/* Payment Button */}
        <div className="space-y-3">
          <Button
            onClick={handleRenewalClick}
            disabled={isLoading || paymentStatus === 'processing' || paymentStatus === 'success'}
            className="w-full"
            size="lg"
          >
            {paymentStatus === 'processing' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('button.processing')}
              </>
            ) : paymentStatus === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('button.success')}
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                {t('button.renew')} - {MEMBERSHIP_CONFIG.ANNUAL_FEE} {t('currency')}
              </>
            )}
          </Button>

          {/* Security Notice */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>{t('security.notice')}</span>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center">
          {t('terms.notice')}
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Quick Renewal Button Component
 * For use in dashboards or compact spaces
 */
interface QuickRenewalButtonProps {
  membership: AtpMembership;
  onRenewalStart?: () => void;
  className?: string;
}

export function QuickRenewalButton({
  membership,
  onRenewalStart,
  className = ''
}: QuickRenewalButtonProps) {
  const t = useTranslations('membership.renewal.quick');
  const { handleRenewal, isLoading } = useMembershipOperations();

  const handleClick = async () => {
    if (onRenewalStart) {
      onRenewalStart();
    } else {
      // Direct renewal flow
      await handleRenewal(membership.id);
    }
  };

  const isExpired = new Date(membership.expirationDate) < new Date();

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      variant={isExpired ? "destructive" : "default"}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {t('processing')}
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {isExpired ? t('renewExpired') : t('renewNow')}
        </>
      )}
    </Button>
  );
}