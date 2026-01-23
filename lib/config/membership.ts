/**
 * ATP Membership Configuration
 * 
 * Centralized configuration for membership products and pricing
 */

export const MEMBERSHIP_CONFIG = {
  // Shopify Product Configuration
  // Set this to your actual membership product variant ID from Shopify
  // Example: 'gid://shopify/ProductVariant/12345678901234'
  VARIANT_ID: process.env.NEXT_PUBLIC_MEMBERSHIP_VARIANT_ID || '',
  
  // Product handle for direct product page (alternative to checkout)
  PRODUCT_HANDLE: process.env.NEXT_PUBLIC_MEMBERSHIP_PRODUCT_HANDLE || 'atp-membership-annual',
  
  // Pricing
  ANNUAL_FEE: 99,
  CURRENCY: 'AED',
  
  // Features
  SERVICE_DISCOUNT: 15, // percentage
  FREE_DELIVERY: true,
  
  // Checkout behavior
  USE_DIRECT_CHECKOUT: process.env.NEXT_PUBLIC_USE_DIRECT_MEMBERSHIP_CHECKOUT === 'true',
} as const;

/**
 * Check if Shopify product is configured
 */
export function isMembershipProductConfigured(): boolean {
  return Boolean(MEMBERSHIP_CONFIG.VARIANT_ID && MEMBERSHIP_CONFIG.VARIANT_ID.length > 0);
}

/**
 * Get the checkout URL for membership purchase
 */
export function getMembershipCheckoutUrl(membershipId: string, locale: string = 'en'): string {
  if (isMembershipProductConfigured() && MEMBERSHIP_CONFIG.USE_DIRECT_CHECKOUT) {
    // Direct checkout with variant ID
    return `/${locale}/checkout/membership/${membershipId}?variantId=${encodeURIComponent(MEMBERSHIP_CONFIG.VARIANT_ID)}`;
  }
  
  // Fallback: Direct to product page
  return `/${locale}/product/${MEMBERSHIP_CONFIG.PRODUCT_HANDLE}`;
}
