import 'server-only'

import { createStorefrontApiClient } from '@shopify/storefront-api-client'
import { TAGS } from "@/lib/constants"
import { isShopifyError } from "@/lib/type-guards"
import { ensureStartsWith } from "@/lib/utils"
import { validateEnvironmentVariables } from "@/lib/config"
import { mockCart, mockCollections, mockProducts, createMockResponse } from "./mock-data"
import { revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { config } from "@/lib/config"

// Initialize Shopify Storefront API Client
const storefrontClient = createStorefrontApiClient({
  storeDomain: config.shopify.domain!,
  apiVersion: config.shopify.apiVersion as any,
  publicAccessToken: config.shopify.accessToken!,
})
import {
  Cart,
  Collection,
  Image,
  Menu,
  Page,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCartOperation,
  ShopifyCollectionOperation,
  ShopifyCollectionProductsOperation,
  ShopifyCollectionsOperation,
  ShopifyCreateCartOperation,
  ShopifyMenuOperation,
  ShopifyMenuItem,
  ShopifyPageOperation,
  ShopifyPagesOperation,
  ShopifyProductOperation,
  ShopifyProductRecommendationsOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  Connection,
  ShopifyCart,
  ShopifyCollection,
  ShopifyProduct,
  PaymentSettings,
  ShopifyShopPaymentSettingsOperation,
  ShopPolicy,
  ShopPolicyOperation,
} from "./types"
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  getCartQuery,
  getCollectionQuery,
  getCollectionProductsQuery,
  getCollectionsQuery,
  getMenuQuery,
  getPageQuery,
  getPagesQuery,
  getProductQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
  removeFromCartMutation,
  getFeaturedProductsQuery,
  getNewestProductsQuery,
} from "./queries"
import { getShopPaymentSettingsQuery, getShopPolicyQuery } from "./queries/shop"

import {
  removeEdgesAndNodes,
  reshapeCart,
  reshapeCollection,
  reshapeCollections,
  reshapeImages,
  reshapeProduct,
  reshapeProducts,
} from "./client"

// Validate required environment variables
const isEnvValid = validateEnvironmentVariables()

const domain = ensureStartsWith(config.shopify.domain!, "https://")
// Use the API version from config dynamically
const endpoint = `${domain}/api/${config.shopify.apiVersion}/graphql.json`
const key = config.shopify.accessToken!

type ExtractVariables<T> = T extends { variables: object } ? T["variables"] : never

export async function shopifyFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit
  query: string
  variables?: ExtractVariables<T>
}): Promise<{ status: number; body: T } | never> {
  try {
    // Check if environment variables are properly configured
    if (!isEnvValid) {
      console.warn('[Shopify] Environment variables not configured. Using demo store fallback.')
      console.warn('[Shopify] Please create .env.local with your store credentials.')
    }

    console.log(`[Shopify] Making request to: ${endpoint}`)

    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
      // Disable caching to ensure fresh data with @inContext
      cache: 'no-store',
      // Add timeout for better error handling
      signal: AbortSignal.timeout(15000), // 15 second timeout
    })

    if (!result.ok) {
      console.error(`[Shopify] HTTP ${result.status}: ${result.statusText}`)
      throw new Error(`HTTP ${result.status}: ${result.statusText}`)
    }

    // Check if the response is valid JSON
    const contentType = result.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`[Shopify] Invalid response content type: ${contentType}`)
      const text = await result.text()
      console.error('[Shopify] Response body:', text.substring(0, 200))
      throw new Error(`Invalid response content type: ${contentType}`)
    }

    const body = await result.json()

    if (body.errors) {
      console.error('[Shopify] GraphQL errors:', body.errors)
      throw body.errors[0]
    }

    return {
      status: result.status,
      body,
    }
  } catch (e: any) {
    // Enhanced error logging with helpful context
    console.error('[Shopify] Request failed:', {
      endpoint: endpoint.substring(0, 50) + '...',
      error: e.message,
      cause: e.cause?.toString(),
      queryType: query.includes('query') ? 'query' : 'mutation',
    })

    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || "Network error",
        status: e.status || 500,
        message: e.message || "Shopify API request failed",
        query,
      }
    }

    // Handle network-specific errors with helpful messages
    if (e.name === 'TypeError' && (e.message.includes('fetch') || e.message.includes('ENOTFOUND'))) {
      console.error('🔧 Network Issue: Unable to connect to Shopify store')
      console.error('💡 Solutions:')
      console.error('   1. Check your internet connection')
      console.error('   2. Verify store domain in .env.local')
      console.error('   3. Ensure store exists and is accessible')

      throw {
        cause: 'Network connection failed - store domain not found',
        status: 500,
        message: `Unable to connect to ${config.shopify.domain}. Please check your store domain.`,
        query,
      }
    }

    throw {
      error: e,
      query,
    }
  }
}



export async function createCart(
  lines?: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  try {
    const hasLines = lines && lines.length > 0;
    const res = await shopifyFetch<ShopifyCreateCartOperation>({
      query: createCartMutation,
      variables: hasLines ? { input: { lines } } : undefined
    } as any); // Type workaround for optional variables

    const cart = reshapeCart(res.body.data.cartCreate.cart);

    // Set the cart cookie
    if (cart.id) {
      const cookieStore = await cookies();
      cookieStore.set('cartId', cart.id);
    }

    return cart;
  } catch (error) {
    console.warn('[Shopify] Using mock cart data due to error:', error)
    return mockCart
  }
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  let cartId = (await cookies()).get('cartId')?.value;

  // If no cart exists, create one with the items
  if (!cartId) {
    console.log('[Shopify] No cart found, creating new cart with items');
    return await createCart(lines);
  }

  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId,
      lines
    }
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds
    }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get('cartId')?.value!;
  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines
    }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get('cartId')?.value;

  if (!cartId) {
    return undefined;
  }

  const res = await shopifyFetch<ShopifyCartOperation>({
    query: getCartQuery,
    variables: { cartId }
  });

  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }

  return reshapeCart(res.body.data.cart);
}

// ============================================================================
// Enhanced Cart Functions with Warnings Support (Storefront API 2024-10+)
// ============================================================================

import type { CartWarning, CartUserError, CartMutationResult } from './types';
import {
  addToCartMutation as addToCartWithWarningsMutation,
  createCartMutation as createCartWithWarningsMutation,
  editCartItemsMutation as editCartWithWarningsMutation,
  removeFromCartMutation as removeFromCartWithWarningsMutation,
  updateCartDiscountCodesMutation,
  updateCartNoteMutation,
  updateCartAttributesMutation,
} from './mutations/cart';

/**
 * Extended result type for cart operations with warnings
 */
export type CartOperationResult = {
  cart: Cart | null;
  userErrors: CartUserError[];
  warnings: CartWarning[];
};

/**
 * Add to cart with warnings support
 * Returns cart, user errors, and warnings for inventory/discount issues
 */
export async function addToCartWithWarnings(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<CartOperationResult> {
  let cartId = (await cookies()).get('cartId')?.value;

  // If no cart exists, create one with the items
  if (!cartId) {
    console.log('[Shopify] No cart found, creating new cart with items');
    return await createCartWithWarnings(lines);
  }

  const res = await shopifyFetch<{
    data: {
      cartLinesAdd: {
        cart: ShopifyCart;
        userErrors: CartUserError[];
        warnings: CartWarning[];
      };
    };
  }>({
    query: addToCartWithWarningsMutation,
    variables: { cartId, lines }
  } as any);

  const { cart, userErrors = [], warnings = [] } = res.body.data.cartLinesAdd;

  return {
    cart: cart ? reshapeCart(cart) : null,
    userErrors,
    warnings,
  };
}

/**
 * Create cart with warnings support
 */
export async function createCartWithWarnings(
  lines?: { merchandiseId: string; quantity: number }[]
): Promise<CartOperationResult> {
  try {
    const res = await shopifyFetch<{
      data: {
        cartCreate: {
          cart: ShopifyCart;
          userErrors: CartUserError[];
          warnings: CartWarning[];
        };
      };
    }>({
      query: createCartWithWarningsMutation,
      variables: lines?.length ? { lineItems: lines } : undefined
    } as any);

    const { cart, userErrors = [], warnings = [] } = res.body.data.cartCreate;

    // Set the cart cookie
    if (cart?.id) {
      const cookieStore = await cookies();
      cookieStore.set('cartId', cart.id);
    }

    return {
      cart: cart ? reshapeCart(cart) : null,
      userErrors,
      warnings,
    };
  } catch (error) {
    console.warn('[Shopify] Error creating cart:', error);
    return {
      cart: mockCart,
      userErrors: [],
      warnings: [],
    };
  }
}

/**
 * Update cart with warnings support
 */
export async function updateCartWithWarnings(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<CartOperationResult> {
  const cartId = (await cookies()).get('cartId')?.value!;

  const res = await shopifyFetch<{
    data: {
      cartLinesUpdate: {
        cart: ShopifyCart;
        userErrors: CartUserError[];
        warnings: CartWarning[];
      };
    };
  }>({
    query: editCartWithWarningsMutation,
    variables: { cartId, lines }
  } as any);

  const { cart, userErrors = [], warnings = [] } = res.body.data.cartLinesUpdate;

  return {
    cart: cart ? reshapeCart(cart) : null,
    userErrors,
    warnings,
  };
}

/**
 * Remove from cart with warnings support
 */
export async function removeFromCartWithWarnings(
  lineIds: string[]
): Promise<CartOperationResult> {
  const cartId = (await cookies()).get('cartId')?.value!;

  const res = await shopifyFetch<{
    data: {
      cartLinesRemove: {
        cart: ShopifyCart;
        userErrors: CartUserError[];
        warnings: CartWarning[];
      };
    };
  }>({
    query: removeFromCartWithWarningsMutation,
    variables: { cartId, lineIds }
  } as any);

  const { cart, userErrors = [], warnings = [] } = res.body.data.cartLinesRemove;

  return {
    cart: cart ? reshapeCart(cart) : null,
    userErrors,
    warnings,
  };
}

/**
 * Update cart discount codes
 */
export async function updateCartDiscountCodes(
  discountCodes: string[]
): Promise<CartOperationResult> {
  const cartId = (await cookies()).get('cartId')?.value!;

  const res = await shopifyFetch<{
    data: {
      cartDiscountCodesUpdate: {
        cart: ShopifyCart;
        userErrors: CartUserError[];
        warnings: CartWarning[];
      };
    };
  }>({
    query: updateCartDiscountCodesMutation,
    variables: { cartId, discountCodes }
  } as any);

  const { cart, userErrors = [], warnings = [] } = res.body.data.cartDiscountCodesUpdate;

  return {
    cart: cart ? reshapeCart(cart) : null,
    userErrors,
    warnings,
  };
}

/**
 * Update cart note
 */
export async function updateCartNote(
  note: string
): Promise<CartOperationResult> {
  const cartId = (await cookies()).get('cartId')?.value!;

  const res = await shopifyFetch<{
    data: {
      cartNoteUpdate: {
        cart: ShopifyCart;
        userErrors: CartUserError[];
        warnings: CartWarning[];
      };
    };
  }>({
    query: updateCartNoteMutation,
    variables: { cartId, note }
  } as any);

  const { cart, userErrors = [], warnings = [] } = res.body.data.cartNoteUpdate;

  return {
    cart: cart ? reshapeCart(cart) : null,
    userErrors,
    warnings,
  };
}

/**
 * Update cart attributes
 */
export async function updateCartAttributes(
  attributes: { key: string; value: string }[]
): Promise<CartOperationResult> {
  const cartId = (await cookies()).get('cartId')?.value!;

  const res = await shopifyFetch<{
    data: {
      cartAttributesUpdate: {
        cart: ShopifyCart;
        userErrors: CartUserError[];
        warnings: CartWarning[];
      };
    };
  }>({
    query: updateCartAttributesMutation,
    variables: { cartId, attributes }
  } as any);

  const { cart, userErrors = [], warnings = [] } = res.body.data.cartAttributesUpdate;

  return {
    cart: cart ? reshapeCart(cart) : null,
    userErrors,
    warnings,
  };
}

export async function getCollection(
  handle: string,
  locale?: { language?: string; country?: string }
): Promise<Collection | undefined> {
  const res = await shopifyFetch<ShopifyCollectionOperation>({
    query: getCollectionQuery,
    variables: {
      handle,
      ...(locale?.language && { language: locale.language.toUpperCase() }),
      ...(locale?.country && { country: locale.country.toUpperCase() })
    }
  });

  return reshapeCollection(res.body.data.collection);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  locale
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  locale?: { language?: string; country?: string };
}): Promise<Product[]> {
  const variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
    language?: string;
    country?: string;
  } = {
    handle: collection
  };

  if (reverse !== undefined) variables.reverse = reverse;
  if (sortKey) variables.sortKey = sortKey === 'CREATED_AT' ? 'CREATED' : sortKey;
  if (locale?.language) variables.language = locale.language.toUpperCase();
  if (locale?.country) variables.country = locale.country.toUpperCase();

  console.log('[Shopify] getCollectionProducts variables:', JSON.stringify(variables));

  const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  // Log first product to verify handle translation
  const firstProduct = res.body.data.collection.products?.edges?.[0]?.node;
  if (firstProduct) {
    console.log('[Shopify] First product from collection:', {
      handle: firstProduct.handle,
      title: firstProduct.title,
      hasArabicHandle: /[\u0600-\u06FF]/.test(firstProduct.handle),
      hasArabicTitle: /[\u0600-\u06FF]/.test(firstProduct.title),
    });
  }

  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}

/**
 * Get featured products from a dedicated collection with a configurable limit.
 * Use this for featured products sections where you want to manually curate products.
 * 
 * @param collection - The collection handle (default: 'featured-products')
 * @param limit - Maximum number of products to return (default: 5)
 * @param locale - Optional locale for translations
 */
export async function getFeaturedProducts({
  collection = "featured-products",
  limit = 5,
  locale
}: {
  collection?: string;
  limit?: number;
  locale?: { language?: string; country?: string };
}): Promise<Product[]> {
  try {
    const variables: {
      handle: string;
      first: number;
      language?: string;
      country?: string;
    } = {
      handle: collection,
      first: limit
    };

    if (locale?.language) variables.language = locale.language.toUpperCase();
    if (locale?.country) variables.country = locale.country.toUpperCase();

    console.log('[Shopify] getFeaturedProducts variables:', JSON.stringify(variables));

    const res = await shopifyFetch<ShopifyCollectionProductsOperation>({
      query: getFeaturedProductsQuery,
      variables
    });

    if (!res.body.data.collection) {
      console.log(`No collection found for \`${collection}\`. Make sure the collection exists in Shopify Admin.`);
      return [];
    }

    return reshapeProducts(
      removeEdgesAndNodes(res.body.data.collection.products)
    );
  } catch (error) {
    console.warn('[Shopify] getFeaturedProducts failed, returning empty array:', error);
    return [];
  }
}

export async function getCollections(
  locale?: { language?: string; country?: string }
): Promise<Collection[]> {
  try {
    const variables: Record<string, string> = {};

    if (locale?.language) variables.language = locale.language.toUpperCase();
    if (locale?.country) variables.country = locale.country.toUpperCase();

    const fetchParams: {
      query: string;
      variables?: Record<string, string>;
    } = { query: getCollectionsQuery };

    if (Object.keys(variables).length > 0) {
      fetchParams.variables = variables;
    }

    const res = await shopifyFetch<ShopifyCollectionsOperation>(fetchParams);
    const shopifyCollections = removeEdgesAndNodes(res.body?.data?.collections);
    const collections = [
      {
        handle: '',
        title: 'All',
        description: 'All products',
        seo: {
          title: 'All',
          description: 'All products'
        },
        path: '/search',
        updatedAt: new Date().toISOString()
      },
      // Filter out the `hidden` collections.
      // Collections that start with `hidden-*` need to be hidden on the search page.
      ...reshapeCollections(shopifyCollections).filter(
        (collection) => !collection.handle.startsWith('hidden')
      )
    ];

    return collections;
  } catch (error) {
    console.warn('[Shopify] Using mock collections data due to error:', error)
    return mockCollections
  }
}

export async function getMenuItems(handle: string): Promise<ShopifyMenuItem[]> {
  const res = await shopifyFetch<ShopifyMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle
    }
  });

  return res.body?.data?.menu?.items || [];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  const items = await getMenuItems(handle);

  return items.map((item) => {
    const url = item.url || '';
    const path = url
      ? url
        .replace(domain, '')
        .replace('/pages', '')
      : '/';

    return {
      title: item.title,
      path
    };
  });
}

export async function getPage(handle: string): Promise<Page> {
  const res = await shopifyFetch<ShopifyPageOperation>({
    query: getPageQuery,
    variables: { handle }
  });

  return res.body.data.pageByHandle;
}

export async function getPages(): Promise<Page[]> {
  const res = await shopifyFetch<ShopifyPagesOperation>({
    query: getPagesQuery
  });

  return removeEdgesAndNodes(res.body.data.pages);
}

// Get shop policy from Shopify
export async function getShopPolicy(
  policyType: 'privacyPolicy' | 'refundPolicy' | 'shippingPolicy' | 'termsOfService',
  locale?: { language?: string; country?: string }
): Promise<ShopPolicy | null> {
  try {
    const variables: ShopPolicyOperation['variables'] = {
      privacyPolicy: policyType === 'privacyPolicy',
      refundPolicy: policyType === 'refundPolicy',
      shippingPolicy: policyType === 'shippingPolicy',
      termsOfService: policyType === 'termsOfService',
    };

    if (locale?.language) variables.language = locale.language.toUpperCase();
    if (locale?.country) variables.country = locale.country.toUpperCase();

    const res = await shopifyFetch<ShopPolicyOperation>({
      query: getShopPolicyQuery,
      variables
    });

    const policy = res.body.data.shop[policyType];
    return policy || null;
  } catch (error) {
    console.warn(`[Shopify] Failed to fetch ${policyType}:`, error);
    return null;
  }
}

export async function getProduct(
  handle: string,
  locale?: { language?: string; country?: string }
): Promise<Product | undefined> {
  const variables: {
    handle: string;
    language?: string;
    country?: string;
  } = { handle };

  if (locale?.language) variables.language = locale.language.toUpperCase();
  if (locale?.country) variables.country = locale.country.toUpperCase();

  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables
  });

  return reshapeProduct(res.body.data.product, false);
}

export async function getProductRecommendations(
  productId: string,
  locale?: { language?: string; country?: string }
): Promise<Product[]> {
  const variables: {
    productId: string;
    language?: string;
    country?: string;
  } = { productId };

  if (locale?.language) variables.language = locale.language.toUpperCase();
  if (locale?.country) variables.country = locale.country.toUpperCase();

  const res = await shopifyFetch<ShopifyProductRecommendationsOperation>({
    query: getProductRecommendationsQuery,
    variables
  });

  return reshapeProducts(res.body.data.productRecommendations);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  locale
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  locale?: { language?: string; country?: string };
}): Promise<Product[]> {
  try {
    const variables: {
      query?: string;
      reverse?: boolean;
      sortKey?: string;
      language?: string;
      country?: string;
    } = {};

    if (query) variables.query = query;
    if (reverse !== undefined) variables.reverse = reverse;
    if (sortKey) variables.sortKey = sortKey;
    if (locale?.language) variables.language = locale.language.toUpperCase();
    if (locale?.country) variables.country = locale.country.toUpperCase();

    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getProductsQuery,
      variables
    });

    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
  } catch (error) {
    console.warn('[Shopify] Using mock products data due to error:', error)
    return mockProducts
  }
}

/**
 * Get the newest products sorted by creation date (descending).
 * Uses the products query with sortKey: CREATED_AT and reverse: true.
 * Perfect for "New Arrivals" sections that automatically show the latest products.
 * 
 * @param limit - Maximum number of products to return (default: 10)
 * @param locale - Optional locale for translations
 */
export async function getNewestProducts({
  limit = 10,
  locale
}: {
  limit?: number;
  locale?: { language?: string; country?: string };
}): Promise<Product[]> {
  try {
    const variables: {
      first: number;
      sortKey: string;
      reverse: boolean;
      language?: string;
      country?: string;
    } = {
      first: limit,
      sortKey: 'CREATED_AT',
      reverse: true  // newest first
    };

    if (locale?.language) variables.language = locale.language.toUpperCase();
    if (locale?.country) variables.country = locale.country.toUpperCase();

    console.log('[Shopify] getNewestProducts variables:', JSON.stringify(variables));

    const res = await shopifyFetch<ShopifyProductsOperation>({
      query: getNewestProductsQuery,
      variables
    });

    return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
  } catch (error) {
    console.warn('[Shopify] getNewestProducts failed, returning empty array:', error);
    return [];
  }
}

// This is called from `app/api/revalidate.ts` so providers can control revalidation logic.
export async function revalidate(req: NextRequest): Promise<NextResponse> {
  // We always need to respond with a 200 status code to Shopify,
  // otherwise it will continue to retry the request.
  const collectionWebhooks = [
    'collections/create',
    'collections/delete',
    'collections/update'
  ];
  const productWebhooks = [
    'products/create',
    'products/delete',
    'products/update'
  ];
  const topic = req.headers.get('x-shopify-topic') || 'unknown';
  const secret = req.nextUrl.searchParams.get('secret');
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);

  if (!secret || secret !== process.env.SHOPIFY_REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 401 });
  }

  if (!isCollectionUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(TAGS.collections, 'max');
  }

  if (isProductUpdate) {
    revalidateTag(TAGS.products, 'max');
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export async function getShopPaymentSettings(
  locale?: { language?: string; country?: string }
): Promise<PaymentSettings | undefined> {
  const res = await shopifyFetch<ShopifyShopPaymentSettingsOperation>({
    query: getShopPaymentSettingsQuery,
    variables: {
      ...(locale?.language && { language: locale.language.toUpperCase() }),
      ...(locale?.country && { country: locale.country.toUpperCase() })
    } as any
  });

  return res.body.data.shop.paymentSettings;
}
