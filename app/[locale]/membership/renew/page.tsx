/**
 * Membership Renewal Page
 * 
 * Complete membership renewal flow with payment processing
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5 - Complete renewal system
 */

import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { MembershipRenewalFlow } from './membership-renewal-flow';

interface RenewalPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    membershipId?: string;
    customerId?: string;
  };
}

export async function generateMetadata({ params }: RenewalPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'membership.renewal' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default function RenewalPage({ params, searchParams }: RenewalPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <MembershipRenewalFlow
          membershipId={searchParams.membershipId}
          customerId={searchParams.customerId}
          locale={params.locale}
        />
      </div>
    </div>
  );
}