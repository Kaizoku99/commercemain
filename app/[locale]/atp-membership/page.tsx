/**
 * ATP Membership Main Page
 * 
 * Main landing page for ATP membership featuring the signup component.
 * This is the page linked from the main navigation.
 * Requirements: 1.1, 1.2, 1.3, 1.4, 2.1, 2.2
 */

import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AtpMembershipSignup } from '@/components/membership/atp-membership-signup';
import { DirhamSymbol } from '@/components/icons/dirham-symbol';

interface AtpMembershipPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: AtpMembershipPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'membership' });

  return {
    title: `${t('title')} - ATP Group Services`,
    description: t('subtitle'),
    keywords: 'ATP membership, wellness membership, UAE, premium services, discounts, free delivery',
    openGraph: {
      title: `${t('title')} - ATP Group Services`,
      description: t('subtitle'),
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} - ATP Group Services`,
      description: t('subtitle'),
    },
  };
}

export default async function AtpMembershipPage({ params }: AtpMembershipPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'membership' });

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-atp-gold/20 via-atp-gold/10 to-transparent py-20">
        <div className="absolute inset-0 bg-[url('/hero-atp-products.png')] bg-cover bg-center opacity-5"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-lg">
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {t('serviceDiscounts')}
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                {t('freeDelivery')}
              </div>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                {t('prioritySupport')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Signup Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <AtpMembershipSignup
            className="w-full"
          />
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {t('exceptionalValue')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('exceptionalValueDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Benefits List */}
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-lg">15%</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('premiumServiceDiscounts')}
                  </h3>
                  <p className="text-gray-600">
                    {t('premiumServiceDiscountsDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold text-sm">{t('free')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('complimentaryDelivery')}
                  </h3>
                  <p className="text-gray-600">
                    {t('complimentaryDeliveryDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-600 font-bold text-sm">{t('vip')}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t('priorityAccessSupport')}
                  </h3>
                  <p className="text-gray-600">
                    {t('priorityAccessSupportDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* ROI Calculation */}
            <div className="bg-gradient-to-br from-atp-gold/10 to-atp-gold/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                {t('membershipROI')}
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t('annualMembershipFee')}</span>
                  <span className="font-semibold flex items-center gap-1">
                    99 <DirhamSymbol size={16} />
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t('averageServiceBooking')}</span>
                  <span className="font-semibold flex items-center gap-1">
                    500 <DirhamSymbol size={16} />
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t('discountSavings')}</span>
                  <span className="font-semibold text-green-600 flex items-center gap-1">
                    75 <DirhamSymbol size={16} />
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">{t('deliverySavingsAvg')}</span>
                  <span className="font-semibold text-blue-600 flex items-center gap-1">
                    25 <DirhamSymbol size={16} />
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 mb-2">{t('breakEvenAfter')}</p>
                <p className="text-3xl font-bold text-atp-gold">{t('oneBooking')}</p>
                <p className="text-sm text-gray-600 mt-2">
                  {t.rich('saveAnnually', {
                    strong: (chunks) => <strong>{chunks}</strong>
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-atp-gold/20 to-atp-gold/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('readyToSave')}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {t('readyToSaveDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                99 <DirhamSymbol size={20} />
              </div>
              <div className="text-sm text-gray-600">{t('perYear')}</div>
            </div>
            <div className="text-gray-400">•</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
                500+ <DirhamSymbol size={20} />
              </div>
              <div className="text-sm text-gray-600">{t('potentialSavings')}</div>
            </div>
            <div className="text-gray-400">•</div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{t('free')}</div>
              <div className="text-sm text-gray-600">{t('deliveryAlways')}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}