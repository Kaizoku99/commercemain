/**
 * Server functions for new Shopify Storefront API 2026-01 features
 * 
 * These functions leverage the latest API capabilities including:
 * - Localization and multi-currency support
 * - Store availability for pickup
 * - Metaobjects for dynamic content
 * - Enhanced buyer identity management
 */

import { shopifyFetch } from './server';
import { removeEdgesAndNodes, reshapeCart } from './client';
import {
  getAvailableCountriesQuery,
  getAvailableLanguagesQuery,
  getLocalizationQuery
} from './queries/localization';
import {
  getStoreAvailabilityQuery,
  getVariantStoreAvailabilityQuery,
  getStoreLocationsQuery
} from './queries/store-availability';
import {
  getMetaobjectQuery,
  getMetaobjectsQuery,
  getATPMembershipTiersQuery,
  getHomepageBannersQuery,
  getFAQsQuery
} from './queries/metaobjects';
import { updateCartBuyerIdentityMutation } from './mutations/cart';
import type {
  Localization,
  LocalizationOperation,
  AvailableCountriesOperation,
  AvailableLanguagesOperation,
  Country,
  Language,
  StoreAvailability,
  StoreAvailabilityOperation,
  VariantStoreAvailabilityOperation,
  StoreLocation,
  StoreLocationsOperation,
  Metaobject,
  MetaobjectField,
  MetaobjectOperation,
  MetaobjectsOperation,
  ATPMembershipTier,
  HomepageBanner,
  FAQ,
  CartBuyerIdentityInput,
  UpdateCartBuyerIdentityOperation,
  Cart
} from './types';

// ============================================================================
// Localization Functions
// ============================================================================

/**
 * Get complete localization information including country, language, and available options
 */
export async function getLocalization(
  locale?: { language?: string; country?: string }
): Promise<Localization | null> {
  try {
    const res = await shopifyFetch<LocalizationOperation>({
      query: getLocalizationQuery,
      variables: {
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    return res.body.data.localization;
  } catch (error) {
    console.error('[Shopify] Error fetching localization:', error);
    return null;
  }
}

/**
 * Get list of available countries with currency information
 */
export async function getAvailableCountries(
  language?: string
): Promise<Country[]> {
  try {
    const res = await shopifyFetch<AvailableCountriesOperation>({
      query: getAvailableCountriesQuery,
      variables: language ? { language: language.toUpperCase() } : {}
    });

    return res.body.data.localization.availableCountries;
  } catch (error) {
    console.error('[Shopify] Error fetching available countries:', error);
    return [];
  }
}

/**
 * Get list of available languages
 */
export async function getAvailableLanguages(): Promise<Language[]> {
  try {
    const res = await shopifyFetch<{ data: { localization: { availableLanguages: Language[] } } }>({
      query: getAvailableLanguagesQuery
    });

    return res.body.data.localization.availableLanguages;
  } catch (error) {
    console.error('[Shopify] Error fetching available languages:', error);
    return [];
  }
}

// ============================================================================
// Store Availability Functions
// ============================================================================

/**
 * Check product variant availability at physical store locations
 */
export async function getProductStoreAvailability(
  productId: string,
  locale?: { language?: string; country?: string }
): Promise<StoreAvailability[]> {
  try {
    const res = await shopifyFetch<StoreAvailabilityOperation>({
      query: getStoreAvailabilityQuery,
      variables: {
        productId,
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    const variants = res.body.data.product.variants.edges;
    const allAvailabilities: StoreAvailability[] = [];

    variants.forEach((variantEdge) => {
      const availabilities = removeEdgesAndNodes(variantEdge.node.storeAvailability) as StoreAvailability[];
      allAvailabilities.push(...availabilities);
    });

    return allAvailabilities;
  } catch (error) {
    console.error('[Shopify] Error fetching product store availability:', error);
    return [];
  }
}

/**
 * Check specific variant availability at physical store locations
 */
export async function getVariantStoreAvailability(
  variantId: string,
  locale?: { language?: string; country?: string }
): Promise<StoreAvailability[]> {
  try {
    const res = await shopifyFetch<VariantStoreAvailabilityOperation>({
      query: getVariantStoreAvailabilityQuery,
      variables: {
        variantId,
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    return removeEdgesAndNodes(res.body.data.productVariant.storeAvailability);
  } catch (error) {
    console.error('[Shopify] Error fetching variant store availability:', error);
    return [];
  }
}

/**
 * Get all physical store locations
 */
export async function getStoreLocations(
  locale?: { language?: string; country?: string }
): Promise<StoreLocation[]> {
  try {
    const res = await shopifyFetch<StoreLocationsOperation>({
      query: getStoreLocationsQuery,
      variables: {
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    return removeEdgesAndNodes(res.body.data.locations);
  } catch (error) {
    console.error('[Shopify] Error fetching store locations:', error);
    return [];
  }
}

// ============================================================================
// Metaobjects Functions
// ============================================================================

/**
 * Get a single metaobject by handle and type
 */
export async function getMetaobject(
  handle: string,
  type: string,
  locale?: { language?: string; country?: string }
): Promise<Metaobject | null> {
  try {
    const res = await shopifyFetch<MetaobjectOperation>({
      query: getMetaobjectQuery,
      variables: {
        handle,
        type,
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    return res.body.data.metaobject;
  } catch (error) {
    console.error('[Shopify] Error fetching metaobject:', error);
    return null;
  }
}

/**
 * Get multiple metaobjects by type
 */
export async function getMetaobjects(
  type: string,
  first: number = 10,
  locale?: { language?: string; country?: string }
): Promise<Metaobject[]> {
  try {
    const res = await shopifyFetch<MetaobjectsOperation>({
      query: getMetaobjectsQuery,
      variables: {
        type,
        first,
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    return removeEdgesAndNodes(res.body.data.metaobjects);
  } catch (error) {
    console.error('[Shopify] Error fetching metaobjects:', error);
    return [];
  }
}

/**
 * Get ATP membership tiers from metaobjects
 */
export async function getATPMembershipTiers(
  locale?: { language?: string; country?: string }
): Promise<ATPMembershipTier[]> {
  try {
    const res = await shopifyFetch<MetaobjectsOperation>({
      query: getATPMembershipTiersQuery,
      variables: {
        type: 'atp_membership_tier',
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    const metaobjects = removeEdgesAndNodes(res.body.data.metaobjects) as Metaobject[];
    
    // Transform metaobjects to typed membership tiers
    return metaobjects.map((mo: Metaobject): ATPMembershipTier => {
      const getField = (key: string) => mo.fields.find((f: MetaobjectField) => f.key === key)?.value || '';
      const iconField = mo.fields.find((f: MetaobjectField) => f.key === 'icon');
      const descAr = getField('description_ar');
      
      return {
        id: mo.id,
        handle: mo.handle,
        name: getField('name'),
        discountPercentage: parseFloat(getField('discount_percentage')) || 0,
        freeDelivery: getField('free_delivery') === 'true',
        prioritySupport: getField('priority_support') === 'true',
        exclusiveAccess: getField('exclusive_access') === 'true',
        annualFee: getField('annual_fee'),
        description: getField('description'),
        ...(descAr && { descriptionAr: descAr }),
        benefits: getField('benefits')?.split(',').map((b: string) => b.trim()) || [],
        ...(iconField?.reference?.image && { icon: iconField.reference.image })
      };
    });
  } catch (error) {
    console.error('[Shopify] Error fetching ATP membership tiers:', error);
    return [];
  }
}

/**
 * Get homepage banners from metaobjects
 */
export async function getHomepageBanners(
  locale?: { language?: string; country?: string }
): Promise<HomepageBanner[]> {
  try {
    const res = await shopifyFetch<MetaobjectsOperation>({
      query: getHomepageBannersQuery,
      variables: {
        type: 'homepage_banner',
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    const metaobjects = removeEdgesAndNodes(res.body.data.metaobjects) as Metaobject[];
    
    return metaobjects.map((mo: Metaobject): HomepageBanner => {
      const getField = (key: string) => mo.fields.find((f: MetaobjectField) => f.key === key)?.value || '';
      
      const titleAr = getField('title_ar');
      const descAr = getField('description_ar');
      const linkText = getField('link');
      const imageField = mo.fields.find((f: MetaobjectField) => f.key === 'image');
      
      return {
        id: mo.id,
        handle: mo.handle,
        title: getField('title'),
        ...(titleAr && { titleAr }),
        description: getField('description'),
        ...(descAr && { descriptionAr: descAr }),
        ...(imageField?.reference?.image && { image: imageField.reference.image }),
        ...(linkText && { link: linkText }),
        ctaText: getField('cta_text'),
        ctaTextAr: getField('cta_text_ar'),
        active: getField('active') === 'true',
        position: parseInt(getField('position')) || 0
      };
    }).filter((banner: HomepageBanner) => banner.active).sort((a: HomepageBanner, b: HomepageBanner) => a.position - b.position);
  } catch (error) {
    console.error('[Shopify] Error fetching homepage banners:', error);
    return [];
  }
}

/**
 * Get FAQs from metaobjects
 */
export async function getFAQs(
  locale?: { language?: string; country?: string }
): Promise<FAQ[]> {
  try {
    const res = await shopifyFetch<MetaobjectsOperation>({
      query: getFAQsQuery,
      variables: {
        type: 'faq',
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    const metaobjects = removeEdgesAndNodes(res.body.data.metaobjects) as Metaobject[];
    
    return metaobjects.map((mo: Metaobject): FAQ => {
      const getField = (key: string) => mo.fields.find((f: MetaobjectField) => f.key === key)?.value || '';
      
      const questionAr = getField('question_ar');
      const answerAr = getField('answer_ar');
      
      return {
        id: mo.id,
        handle: mo.handle,
        question: getField('question'),
        ...(questionAr && { questionAr }),
        answer: getField('answer'),
        ...(answerAr && { answerAr }),
        category: getField('category'),
        position: parseInt(getField('position')) || 0,
        featured: getField('featured') === 'true'
      };
    }).sort((a: FAQ, b: FAQ) => a.position - b.position);
  } catch (error) {
    console.error('[Shopify] Error fetching FAQs:', error);
    return [];
  }
}

// ============================================================================
// Cart Buyer Identity Functions
// ============================================================================

/**
 * Update cart buyer identity with email, phone, and delivery preferences
 */
export async function updateCartBuyerIdentity(
  cartId: string,
  buyerIdentity: CartBuyerIdentityInput,
  locale?: { language?: string; country?: string }
): Promise<{ cart: Cart | null; errors: string[] }> {
  try {
    const res = await shopifyFetch<UpdateCartBuyerIdentityOperation>({
      query: updateCartBuyerIdentityMutation,
      variables: {
        cartId,
        buyerIdentity,
        language: locale?.language?.toUpperCase() || 'EN',
        country: locale?.country?.toUpperCase() || 'AE'
      }
    });

    const { cart, userErrors } = res.body.data.cartBuyerIdentityUpdate;
    
    if (userErrors && userErrors.length > 0) {
      return {
        cart: null,
        errors: userErrors.map((e) => e.message)
      };
    }

    return {
      cart: cart ? reshapeCart(cart) : null,
      errors: []
    };
  } catch (error) {
    console.error('[Shopify] Error updating cart buyer identity:', error);
    return {
      cart: null,
      errors: ['Failed to update buyer identity']
    };
  }
}
