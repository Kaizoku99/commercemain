/**
 * Renewal Checkout Integration Component
 * 
 * Integrates with Shopify checkout for membership renewal payments
 * Requirements: 6.2, 6.3 - Add renewal payment processing with Shopify checkout
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useRouter } from 'next/navigation';
import { CreditCard, Shield, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { AtpMembership } from '../../lib/types/membership';
import { membershipExtensionService } from '../../lib/services/membership-extension-service';
import { MEMBERSHIP_CONFIG } from '../../lib/constants/membership';

interface RenewalCheckoutIntegrationProps {
  membership: AtpMembership;
  onSuccess?: (renewedMembership: AtpMembership) => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  className?: string;
}

export function RenewalCheckoutIntegration({
  membership,
  onSuccess,
  onError,
  onCancel,
  className = ''
}: RenewalCheckoutIntegrationProps) {
  const t = useTranslations('membership.renewal.checkout');
  const router = useRouter();
  
  const [checkoutState, setCheckoutState] = useState<'idle' | 'preparing' | 'redirecting' | 'processing' | 'success' | 'error'>('idle');
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [renewalSummary, setRenewalSummary] = useState<ReturnType<typeof membershipExtensionService.generateRenewalSummary> | null>(null);

  // Generate renewal summary on component mount
  useEffect(() => {
    const summary = membershipExtensionService.generateRenewalSummary(membership);
    setRenewalSummary(summary);
  }, [membership]);

  const handleStartCheckout = async () => {
    if (!renewalSummary?.eligibility.eligible) {
      setErrorMessage(renewalSummary?.eligibility.reason || 'Renewal not available');
      setCheckoutState('error');
      return;
    }

    setCheckoutState('preparing');
    setErrorMessage('');

    try {
      // Create Shopify checkout for membership renewal
      const checkoutData = await createRenewalCheckout(membership, renewalSummary.pricing);
      
      if (checkoutData.success) {
        setCheckoutUrl(checkoutData.checkoutUrl);
        setCheckoutState('redirecting');
        
        // Redirect to Shopify checkout
        window.location.href = checkoutData.checkoutUrl;
      } else {
        throw new Error(checkoutData.error || 'Failed to create checkout');
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t('error.checkoutFailed');
      setErrorMessage(errorMsg);
      setCheckoutState('error');
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMsg));
      }
    }
  };

  const handlePaymentSuccess = async (paymentDetails: any) => {
    setCheckoutState('processing');

    try {
      // Process renewal confirmation
      const confirmationResult = await membershipExtensionService.processRenewalConfirmation(
        membership.id,
        paymentDetails
      );

      if (confirmationResult.success) {
        setCheckoutState('success');
        
        if (onSuccess) {
          onSuccess(confirmationResult.data.membership);
        }
      } else {
        throw confirmationResult.error;
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t('error.confirmationFailed');
      setErrorMessage(errorMsg);
      setCheckoutState('error');
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMsg));
      }
    }
  };

  if (!renewalSummary) {
    return (
      <Card className={className}>
        <CardContent className="p-6 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{t('loading')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {t('title')}
          </CardTitle>
          <Badge variant={renewalSummary.eligibility.eligible ? 'default' : 'destructive'}>
            {renewalSummary.eligibility.eligible ? t('status.eligible') : t('status.notEligible')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Eligibility Check */}
        {!renewalSummary.eligibility.eligible && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {renewalSummary.eligibility.reason}
            </AlertDescription>
          </Alert>
        )}

        {/* Renewal Summary */}
        <div className="space-y-4">
          <h4 className="font-medium">{t('summary.title')}</h4>
          
          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between text-sm">
              <span>{t('summary.currentExpiration')}</span>
              <span>{new Date(renewalSummary.currentExpiration).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('summary.newExpiration')}</span>
              <span className="font-medium">{new Date(renewalSummary.newExpiration).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>{t('summary.extensionPeriod')}</span>
              <span>{renewalSummary.extensionPeriod}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium">{t('pricing.title')}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t('pricing.basePrice')}</span>
                <span>{renewalSummary.pricing.basePrice} {renewalSummary.pricing.currency}</span>
              </div>
              {renewalSummary.pricing.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t('pricing.earlyRenewalDiscount')}</span>
                  <span>-{renewalSummary.pricing.discount} {renewalSummary.pricing.currency}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-medium">
                <span>{t('pricing.total')}</span>
                <span>{renewalSummary.pricing.finalPrice} {renewalSummary.pricing.currency}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {checkoutState === 'error' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {checkoutState === 'success' && (
          <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {t('success.message')}
            </AlertDescription>
          </Alert>
        )}

        {/* Checkout Actions */}
        <div className="space-y-4">
          {checkoutState === 'redirecting' && checkoutUrl && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm font-medium">{t('redirecting.title')}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {t('redirecting.message')}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.href = checkoutUrl}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                {t('redirecting.openCheckout')}
              </Button>
            </div>
          )}

          {checkoutState !== 'success' && checkoutState !== 'redirecting' && (
            <div className="flex gap-3">
              <Button
                onClick={handleStartCheckout}
                disabled={!renewalSummary.eligibility.eligible || checkoutState === 'preparing'}
                className="flex-1"
                size="lg"
              >
                {checkoutState === 'preparing' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('button.preparing')}
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('button.proceedToCheckout')} - {renewalSummary.pricing.finalPrice} {renewalSummary.pricing.currency}
                  </>
                )}
              </Button>
              
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={checkoutState === 'preparing' || checkoutState === 'processing'}
                >
                  {t('button.cancel')}
                </Button>
              )}
            </div>
          )}

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
 * Create Shopify checkout for membership renewal
 * This would integrate with actual Shopify Checkout API in production
 */
async function createRenewalCheckout(
  membership: AtpMembership,
  pricing: { finalPrice: number; currency: string }
): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> {
  try {
    // TODO: Integrate with actual Shopify Checkout API
    // This is a placeholder implementation
    
    const checkoutData = {
      lineItems: [
        {
          variantId: 'atp-membership-renewal',
          quantity: 1,
          customAttributes: [
            { key: 'membership_id', value: membership.id },
            { key: 'customer_id', value: membership.customerId },
            { key: 'renewal_type', value: 'annual' }
          ]
        }
      ],
      customAttributes: [
        { key: 'membership_renewal', value: 'true' },
        { key: 'original_membership_id', value: membership.id }
      ],
      note: `ATP Membership Renewal for ${membership.id}`
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return mock checkout URL
    const checkoutUrl = `/checkout/membership-renewal/${membership.id}?amount=${pricing.finalPrice}&currency=${pricing.currency}`;

    return {
      success: true,
      checkoutUrl
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout'
    };
  }
}