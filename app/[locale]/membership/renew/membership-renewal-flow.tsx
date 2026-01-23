/**
 * Membership Renewal Flow Component
 * 
 * Complete client-side renewal flow with all renewal components
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5 - Complete renewal system implementation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { MembershipRenewalSystem } from '../../../../components/membership/membership-renewal-system';
import { RenewalCheckoutIntegration } from '../../../../components/membership/renewal-checkout-integration';
import { useAtpMembership } from '../../../../hooks/use-atp-membership';
import { AtpMembership } from '../../../../lib/types/membership';

interface MembershipRenewalFlowProps {
  membershipId?: string | undefined;
  customerId?: string | undefined;
  locale: string;
}

type RenewalStep = 'loading' | 'review' | 'checkout' | 'processing' | 'success' | 'error';

export function MembershipRenewalFlow({
  membershipId,
  customerId,
  locale
}: MembershipRenewalFlowProps) {
  const { t } = useTranslations('membership.renewal.flow');
  const router = useRouter();
  
  const { membership, isLoading, error, loadMembership } = useAtpMembership();
  const [currentStep, setCurrentStep] = useState<RenewalStep>('loading');
  const [renewedMembership, setRenewedMembership] = useState<AtpMembership | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Load membership data on component mount
  useEffect(() => {
    const loadMembershipData = async () => {
      if (customerId) {
        await loadMembership(customerId);
        setCurrentStep('review');
      } else if (membershipId) {
        // TODO: Load membership by ID when Shopify integration is complete
        setCurrentStep('error');
        setErrorMessage('Membership ID lookup not yet implemented');
      } else {
        setCurrentStep('error');
        setErrorMessage('No membership or customer ID provided');
      }
    };

    loadMembershipData();
  }, [membershipId, customerId, loadMembership]);

  // Handle membership loading states
  useEffect(() => {
    if (isLoading) {
      setCurrentStep('loading');
    } else if (error) {
      setCurrentStep('error');
      setErrorMessage(error.message);
    } else if (membership && currentStep === 'loading') {
      setCurrentStep('review');
    }
  }, [isLoading, error, membership, currentStep]);

  const handleProceedToCheckout = () => {
    setCurrentStep('checkout');
  };

  const handleRenewalSuccess = (renewed: AtpMembership) => {
    setRenewedMembership(renewed);
    setCurrentStep('success');
  };

  const handleRenewalError = (error: Error) => {
    setErrorMessage(error.message);
    setCurrentStep('error');
  };

  const handleBackToReview = () => {
    setCurrentStep('review');
    setErrorMessage('');
  };

  const handleReturnToDashboard = () => {
    router.push(`/${locale}/account/membership`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'loading':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('loading')}</p>
            </CardContent>
          </Card>
        );

      case 'review':
        if (!membership) {
          return (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{t('error.noMembership')}</AlertDescription>
            </Alert>
          );
        }

        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('review.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  {t('review.description')}
                </p>
                <MembershipRenewalSystem
                  membership={membership}
                  displayMode="full"
                  onRenewalComplete={handleRenewalSuccess}
                />
                <div className="mt-6 flex gap-3">
                  <Button onClick={handleProceedToCheckout} className="flex-1">
                    {t('review.proceedButton')}
                  </Button>
                  <Button variant="outline" onClick={() => router.back()}>
                    {t('review.cancelButton')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'checkout':
        if (!membership) {
          return (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{t('error.noMembership')}</AlertDescription>
            </Alert>
          );
        }

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToReview}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t('checkout.backButton')}
              </Button>
              <h1 className="text-2xl font-bold">{t('checkout.title')}</h1>
            </div>

            <RenewalCheckoutIntegration
              membership={membership}
              onSuccess={handleRenewalSuccess}
              onError={handleRenewalError}
              onCancel={handleBackToReview}
            />
          </div>
        );

      case 'success':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('success.title')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('success.description')}
              </p>
              {renewedMembership && (
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg mb-6">
                  <p className="text-sm">
                    {t('success.newExpiration')}: {' '}
                    <span className="font-medium">
                      {new Date(renewedMembership.expirationDate).toLocaleDateString()}
                    </span>
                  </p>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Button onClick={handleReturnToDashboard}>
                  {t('success.dashboardButton')}
                </Button>
                <Button variant="outline" onClick={() => router.push(`/${locale}`)}>
                  {t('success.homeButton')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'error':
        return (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t('error.title')}</h2>
              <p className="text-muted-foreground mb-2">
                {t('error.description')}
              </p>
              {errorMessage && (
                <p className="text-sm text-red-600 mb-6">
                  {errorMessage}
                </p>
              )}
              <div className="flex gap-3 justify-center">
                <Button onClick={() => window.location.reload()}>
                  {t('error.retryButton')}
                </Button>
                <Button variant="outline" onClick={() => router.back()}>
                  {t('error.backButton')}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t('step')}</span>
            <span className="font-medium">
              {currentStep === 'loading' && '1'}
              {currentStep === 'review' && '1'}
              {currentStep === 'checkout' && '2'}
              {(currentStep === 'success' || currentStep === 'error') && '3'}
            </span>
            <span>/</span>
            <span>3</span>
          </div>
        </div>
        
        {/* Step Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{
              width: 
                currentStep === 'loading' || currentStep === 'review' ? '33%' :
                currentStep === 'checkout' ? '66%' :
                '100%'
            }}
          />
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
}