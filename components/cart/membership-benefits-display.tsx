/**
 * Membership Benefits Display Component
 * 
 * Shows membership benefits, discounts, and free delivery information in cart.
 * Handles different membership states and provides appropriate messaging.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCartMembershipDisplay } from '@/hooks/use-membership-cart';
import { useTranslations } from '@/hooks/use-translations';
import { Crown, Truck, AlertCircle, Gift, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { DirhamSymbol } from '@/components/icons/dirham-symbol';

interface MembershipBenefitsDisplayProps {
  customerId?: string;
  showSignupPrompt?: boolean;
  compact?: boolean;
  className?: string;
}

/**
 * Main membership benefits display component
 * Requirements: 5.2 - Display "Free Delivery - Member Benefit" instead of shipping charges
 */
export function MembershipBenefitsDisplay({
  customerId,
  showSignupPrompt = true,
  compact = false,
  className = ''
}: MembershipBenefitsDisplayProps) {
  const { t } = useTranslations('cart');
  const {
    membershipStatus,
    membershipBenefits,
    isLoadingBenefits,
    displayInfo,
    totalSavings,
    hasAnyBenefits
  } = useCartMembershipDisplay(customerId);

  if (isLoadingBenefits) {
    return (
      <Card className={`border-dashed ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">
              {t('membership.loading')}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active membership with benefits
  if (membershipStatus === 'active' && hasAnyBenefits) {
    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-600" />
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  {t('membership.active')}
                </Badge>
              </div>
              {totalSavings > 0 && (
                <div className="text-right">
                  <div className="text-sm font-medium text-green-700">
                    {t('membership.totalSavings')}
                  </div>
                  <div className="text-lg font-bold text-green-800">
                    <span className="flex items-center gap-1">
                      <DirhamSymbol size={16} />
                      {totalSavings.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {!compact && (
              <>
                <Separator className="bg-green-200" />
                
                {/* Benefits list */}
                <div className="space-y-2">
                  {membershipBenefits?.serviceDiscounts && membershipBenefits.serviceDiscounts.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Sparkles className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">
                        {displayInfo.discountText} • 15% {t('membership.serviceDiscount')}
                      </span>
                    </div>
                  )}
                  
                  {membershipBenefits?.freeDelivery && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">
                        {t('membership.freeDelivery')}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Active membership but no applicable benefits
  if (membershipStatus === 'active' && !hasAnyBenefits) {
    return (
      <Card className={`border-blue-200 bg-blue-50 ${className}`}>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-blue-600" />
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              {t('membership.active')}
            </Badge>
            <span className="text-sm text-blue-700">
              {t('membership.noBenefitsApplicable')}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expired membership
  if (membershipStatus === 'expired') {
    return (
      <Card className={`border-orange-200 bg-orange-50 ${className}`}>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                {t('membership.expired')}
              </Badge>
            </div>
            
            {!compact && (
              <>
                <div className="text-sm text-orange-700">
                  {t('membership.expiredMessage')}
                </div>
                
                <Button asChild size="sm" className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/membership/renew">
                    {t('membership.renewNow')}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No membership - show signup prompt
  if (membershipStatus === 'none' && showSignupPrompt) {
    return (
      <Card className={`border-purple-200 bg-purple-50 ${className}`}>
        <CardContent className={compact ? "p-3" : "p-4"}>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Gift className="h-4 w-4 text-purple-600" />
              <span className="font-medium text-purple-800">
                {t('membership.joinTitle')}
              </span>
            </div>
            
            {!compact && (
              <>
                <div className="text-sm text-purple-700">
                  {t('membership.joinMessage')}
                </div>
                
                <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Link href="/membership/signup">
                    {t('membership.joinNow')}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No membership and no signup prompt
  return null;
}

/**
 * Compact membership status indicator for cart summary
 */
export function MembershipStatusIndicator({
  customerId,
  className = ''
}: {
  customerId?: string;
  className?: string;
}) {
  const { t } = useTranslations('cart');
  const { membershipStatus, totalSavings } = useCartMembershipDisplay(customerId);

  if (membershipStatus === 'active' && totalSavings > 0) {
    return (
      <div className={`flex items-center space-x-2 text-sm text-green-700 ${className}`}>
        <Crown className="h-3 w-3" />
        <span>
          {t('membership.saving')} {totalSavings.toFixed(2)} {t('common.currency')}
        </span>
      </div>
    );
  }

  if (membershipStatus === 'expired') {
    return (
      <div className={`flex items-center space-x-2 text-sm text-orange-600 ${className}`}>
        <AlertCircle className="h-3 w-3" />
        <span>{t('membership.expired')}</span>
      </div>
    );
  }

  return null;
}

/**
 * Free delivery indicator component
 * Requirement 5.2: Display "Free Delivery - Member Benefit"
 */
export function FreeDeliveryIndicator({
  customerId,
  className = ''
}: {
  customerId?: string;
  className?: string;
}) {
  const { t } = useTranslations('cart');
  const { displayInfo, membershipStatus } = useCartMembershipDisplay(customerId);

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <div className="flex items-center space-x-2">
        <Truck className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">
          {t('delivery.label')}
        </span>
      </div>
      
      <div className="text-sm">
        {membershipStatus === 'active' && displayInfo.deliveryText.includes('Free') ? (
          <div className="flex items-center space-x-1">
            <span className="text-green-700 font-medium">
              {t('membership.freeDelivery')}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
              {t('membership.memberBenefit')}
            </Badge>
          </div>
        ) : (
          <span className="text-muted-foreground">
            {t('delivery.standard')}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Service discount indicator for individual cart items
 */
export function ServiceDiscountIndicator({
  lineId,
  customerId,
  className = ''
}: {
  lineId: string;
  customerId?: string;
  className?: string;
}) {
  const { t } = useTranslations('cart');
  const { membershipBenefits } = useCartMembershipDisplay(customerId);

  const discount = membershipBenefits?.serviceDiscounts?.find(d => d.lineId === lineId);

  if (!discount) return null;

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
        15% {t('membership.off')}
      </Badge>
      <span className="text-xs text-green-700">
        <span className="flex items-center gap-1">
          -<DirhamSymbol size={12} />{discount.discountAmount.toFixed(2)}
        </span>
      </span>
    </div>
  );
}