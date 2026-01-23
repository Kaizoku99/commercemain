// Re-export client-safe types and functions
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

// Re-export client-safe utility functions
export {
  removeEdgesAndNodes,
  reshapeCart,
  reshapeCollection,
  reshapeCollections,
  reshapeImages,
  reshapeProduct,
  reshapeProducts,
} from "./client"
