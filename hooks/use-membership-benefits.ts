/**
 * Membership Benefits Hooks
 * 
 * Specialized hooks for membership benefit calculations and checks.
 * Provides focused functionality for pricing, discounts, and delivery benefits.
 */

'use client';

import { useCallback, useMemo } from 'react';
import { useMembershipDiscount, useMembershipStatus } from './use-atp-membership';
import {
  DiscountCalculation,
  ServiceDiscountInfo,
  EligibleService
} from '../lib/types/membership';

// Service pricing interface
export interface ServicePricing {
  originalPrice: number;
  discountedPrice: number;
  discountAmount: number;
  discountPercentage: number;
  savings: number;
  isDiscounted: boolean;
}

// Cart benefits interface
export interface CartBenefits {
  hasServiceDiscounts: boolean;
  hasFreeDelivery: boolean;
  totalSavings: number;
  deliverySavings: number;
  serviceSavings: number;
}

/**
 * Hook for service pricing with membership discounts
 * 
 * Requirements addressed:
 * - 4.1: Automatically apply 15% discount on premium services
 * - 4.2: Display original and discounted prices
 */
export function useServicePricing(serviceId: string, originalPrice: number): ServicePricing {
  const { calculateServiceDiscount, hasActiveMembership } = useMembershipDiscount();

  return useMemo(() => {
    const discount = calculateServiceDiscount(originalPrice, serviceId);
    
    return {
      originalPrice,
      discountedPrice: discount.finalPrice,
      discountAmount: discount.discountAmount,
      discountPercentage: discount.discountPercentage,
      savings: discount.savings,
      isDiscounted: hasActiveMembership && discount.discountAmount > 0
    };
  }, [serviceId, originalPrice, calculateServiceDiscount, hasActiveMembership]);
}

/**
 * Hook for multiple service pricing calculations
 * Useful for cart or service listing components
 */
export function useMultipleServicePricing(services: Array<{ id: string; price: number }>) {
  const { calculateServiceDiscount, hasActiveMembership } = useMembershipDiscount();

  return useMemo(() => {
    let totalOriginal = 0;
    let totalDiscounted = 0;
    let totalSavings = 0;

    const servicePricing = services.map(service => {
      const discount = calculateServiceDiscount(service.price, service.id);
      
      totalOriginal += service.price;
      totalDiscounted += discount.finalPrice;
      totalSavings += discount.savings;

      return {
        serviceId: service.id,
        originalPrice: service.price,
        discountedPrice: discount.finalPrice,
        discountAmount: discount.discountAmount,
        discountPercentage: discount.discountPercentage,
        savings: discount.savings,
        isDiscounted: hasActiveMembership && discount.discountAmount > 0
      };
    });

    return {
      services: servicePricing,
      totals: {
        originalPrice: totalOriginal,
        discountedPrice: totalDiscounted,
        totalSavings,
        hasDiscounts: hasActiveMembership && totalSavings > 0
      }
    };
  }, [services, calculateServiceDiscount, hasActiveMembership]);
}

/**
 * Hook for delivery benefits
 * 
 * Requirements addressed:
 * - 5.1: Free delivery for active members
 * - 5.2: Display delivery savings
 */
export function useDeliveryBenefits(standardDeliveryFee: number = 25) {
  const { checkFreeDeliveryEligibility, hasActiveMembership } = useMembershipDiscount();

  return useMemo(() => {
    const isFreeDelivery = checkFreeDeliveryEligibility();
    
    return {
      isFreeDelivery,
      deliveryFee: isFreeDelivery ? 0 : standardDeliveryFee,
      deliverySavings: isFreeDelivery ? standardDeliveryFee : 0,
      hasActiveMembership,
      deliveryMessage: isFreeDelivery 
        ? 'Free Delivery - Member Benefit' 
        : `Delivery Fee: ${standardDeliveryFee} AED`
    };
  }, [standardDeliveryFee, checkFreeDeliveryEligibility, hasActiveMembership]);
}

/**
 * Hook for cart-level benefit calculations
 * Combines service discounts and delivery benefits
 */
export function useCartBenefits(
  services: Array<{ id: string; price: number }>,
  standardDeliveryFee: number = 25
): CartBenefits {
  const servicePricing = useMultipleServicePricing(services);
  const deliveryBenefits = useDeliveryBenefits(standardDeliveryFee);

  return useMemo(() => ({
    hasServiceDiscounts: servicePricing.totals.hasDiscounts,
    hasFreeDelivery: deliveryBenefits.isFreeDelivery,
    totalSavings: servicePricing.totals.totalSavings + deliveryBenefits.deliverySavings,
    deliverySavings: deliveryBenefits.deliverySavings,
    serviceSavings: servicePricing.totals.totalSavings
  }), [servicePricing.totals, deliveryBenefits]);
}

/**
 * Hook for service eligibility checks
 * Determines which services are eligible for membership discounts
 */
export function useServiceEligibility() {
  const { getDiscountInfo, hasActiveMembership } = useMembershipDiscount();

  const checkServiceEligibility = useCallback((serviceId: string): boolean => {
    const eligibleServices = Object.values(EligibleService);
    return eligibleServices.includes(serviceId as EligibleService);
  }, []);

  const getServiceInfo = useCallback((serviceId: string, price: number): ServiceDiscountInfo => {
    return getDiscountInfo(serviceId, price);
  }, [getDiscountInfo]);

  const getEligibleServices = useCallback((): EligibleService[] => {
    return Object.values(EligibleService);
  }, []);

  return {
    checkServiceEligibility,
    getServiceInfo,
    getEligibleServices,
    hasActiveMembership
  };
}

/**
 * Hook for membership value proposition
 * Calculates potential savings and ROI for membership
 */
export function useMembershipValue(
  estimatedMonthlySpending: number = 200,
  standardDeliveryFee: number = 25
) {
  const { isActive } = useMembershipStatus();

  return useMemo(() => {
    const annualSpending = estimatedMonthlySpending * 12;
    const serviceDiscountSavings = annualSpending * 0.15; // 15% discount
    const deliverySavings = standardDeliveryFee * 12; // Assuming 1 order per month
    const totalPotentialSavings = serviceDiscountSavings + deliverySavings;
    const membershipFee = 99; // د.إ
    const netSavings = totalPotentialSavings - membershipFee;
    const roi = (netSavings / membershipFee) * 100;
    const breakEvenSpending = membershipFee / 0.15; // Amount needed to break even on service discounts alone

    return {
      annualSpending,
      serviceDiscountSavings,
      deliverySavings,
      totalPotentialSavings,
      membershipFee,
      netSavings,
      roi,
      breakEvenSpending,
      isWorthwhile: netSavings > 0,
      hasActiveMembership: isActive
    };
  }, [estimatedMonthlySpending, standardDeliveryFee, isActive]);
}

/**
 * Hook for membership renewal urgency
 * Provides renewal messaging and urgency indicators
 */
export function useRenewalUrgency() {
  const { membership, isExpired, isExpiringSoon, daysUntilExpiration } = useMembershipStatus();

  return useMemo(() => {
    if (!membership) {
      return {
        urgency: 'none' as const,
        message: 'No membership to renew',
        showRenewalCTA: false,
        daysLeft: 0
      };
    }

    if (isExpired) {
      return {
        urgency: 'critical' as const,
        message: 'Your membership has expired. Renew now to restore benefits.',
        showRenewalCTA: true,
        daysLeft: 0
      };
    }

    if (isExpiringSoon) {
      if (daysUntilExpiration <= 7) {
        return {
          urgency: 'high' as const,
          message: `Your membership expires in ${daysUntilExpiration} days. Renew now to avoid interruption.`,
          showRenewalCTA: true,
          daysLeft: daysUntilExpiration
        };
      }

      if (daysUntilExpiration <= 30) {
        return {
          urgency: 'medium' as const,
          message: `Your membership expires in ${daysUntilExpiration} days. Consider renewing soon.`,
          showRenewalCTA: true,
          daysLeft: daysUntilExpiration
        };
      }
    }

    return {
      urgency: 'low' as const,
      message: `Your membership is active until ${new Date(membership.expirationDate).toLocaleDateString()}.`,
      showRenewalCTA: false,
      daysLeft: daysUntilExpiration
    };
  }, [membership, isExpired, isExpiringSoon, daysUntilExpiration]);
}

/**
 * Hook for benefit summary
 * Provides a comprehensive overview of membership benefits
 */
export function useBenefitSummary() {
  const { membership, isActive } = useMembershipStatus();
  const { checkFreeDeliveryEligibility } = useMembershipDiscount();

  return useMemo(() => {
    if (!membership || !isActive) {
      return {
        hasActiveBenefits: false,
        serviceDiscount: 0,
        freeDelivery: false,
        eligibleServices: [],
        membershipFee: 99,
        benefits: []
      };
    }

    const benefits = [
      {
        title: '15% Service Discount',
        description: 'Save 15% on all premium services',
        active: true,
        value: '15%'
      },
      {
        title: 'Free Delivery',
        description: 'Free delivery on all product orders',
        active: checkFreeDeliveryEligibility(),
        value: 'Free'
      },
      {
        title: 'Priority Support',
        description: 'Get priority customer support',
        active: true,
        value: 'Priority'
      },
      {
        title: 'Exclusive Offers',
        description: 'Access to member-only promotions',
        active: true,
        value: 'Exclusive'
      }
    ];

    return {
      hasActiveBenefits: true,
      serviceDiscount: membership.benefits.serviceDiscount,
      freeDelivery: membership.benefits.freeDelivery,
      eligibleServices: membership.benefits.eligibleServices,
      membershipFee: membership.benefits.annualFee,
      benefits
    };
  }, [membership, isActive, checkFreeDeliveryEligibility]);
}