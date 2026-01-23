// Client-safe types and functions
import type {
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
} from "./types"

// Re-export types for consumers
export type {
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
} from "./types"

// Client-safe utility functions
export const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  if (!array || !array.edges) {
    return [];
  }
  return array.edges.map((edge) => edge?.node).filter(Boolean);
};

// Client-safe data transformation functions
export const reshapeCart = (cart: ShopifyCart): Cart => {
  // NOTE: totalTaxAmount was removed in Shopify Storefront API 2025-01
  // Tax is now calculated at checkout only, so we no longer need to handle it here

  return {
    ...cart,
    lines: cart.lines ? removeEdgesAndNodes(cart.lines) : []
  };
};

export const reshapeCollection = (
  collection: ShopifyCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }

  return {
    ...collection,
    path: `/search/${collection.handle}`
  };
};

export const reshapeCollections = (collections: ShopifyCollection[]) => {
  const reshapedCollections = [];

  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);

      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }

  return reshapedCollections;
};

export const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);

  return flattened.map((image) => {
    const filename = image.url.match(/.*\/(.*)\..*/)?.[1];
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`
    };
  });
};

export const reshapeProduct = (
  product: ShopifyProduct,
  filterHiddenProducts: boolean = true
) => {
  const HIDDEN_PRODUCT_TAG = 'nextjs-frontend-hidden';

  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }

  // Validate and fix priceRange structure
  let validatedPriceRange = product.priceRange;
  if (validatedPriceRange) {
    // Ensure maxVariantPrice is an object with proper structure
    if (typeof validatedPriceRange.maxVariantPrice === 'string') {
      console.warn(`[Shopify] Invalid maxVariantPrice structure for product ${product.handle}, fixing...`);
      validatedPriceRange = {
        ...validatedPriceRange,
        maxVariantPrice: {
          amount: validatedPriceRange.maxVariantPrice,
          currencyCode: 'AED' // Default currency
        }
      };
    }

    // Ensure minVariantPrice is an object with proper structure
    if (typeof validatedPriceRange.minVariantPrice === 'string') {
      console.warn(`[Shopify] Invalid minVariantPrice structure for product ${product.handle}, fixing...`);
      validatedPriceRange = {
        ...validatedPriceRange,
        minVariantPrice: {
          amount: validatedPriceRange.minVariantPrice,
          currencyCode: 'AED' // Default currency
        }
      };
    }
  }

  const { images, variants, ...rest } = product;

  return {
    ...rest,
    priceRange: validatedPriceRange,
    images: reshapeImages(images, product.title),
    variants: removeEdgesAndNodes(variants)
  };
};

export const reshapeProducts = (products: ShopifyProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);

      if (reshapedProduct) {
        reshapedProducts.push(reshapedProduct);
      }
    }
  }

  return reshapedProducts;
};
