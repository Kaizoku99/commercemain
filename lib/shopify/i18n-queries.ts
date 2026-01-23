// Fragment for multilingual product data
export const MULTILINGUAL_PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment MultilingualProduct on Product {
    id
    handle
    title
    description
    descriptionHtml
    
    # Arabic content metafields
    titleAr: metafield(namespace: "i18n", key: "title_ar") {
      value
    }
    descriptionAr: metafield(namespace: "i18n", key: "description_ar") {
      value
    }
    descriptionHtmlAr: metafield(namespace: "i18n", key: "description_html_ar") {
      value
    }
    
    # Category translations
    categoryAr: metafield(namespace: "i18n", key: "category_ar") {
      value
    }
    
    # Product features in Arabic
    featuresAr: metafield(namespace: "i18n", key: "features_ar") {
      value
    }
    
    # Ingredients/specifications in Arabic
    ingredientsAr: metafield(namespace: "i18n", key: "ingredients_ar") {
      value
    }
    technicalSpecsAr: metafield(namespace: "i18n", key: "technical_specs_ar") {
      value
    }
    
    # Usage instructions in Arabic
    usageInstructionsAr: metafield(namespace: "i18n", key: "usage_instructions_ar") {
      value
    }
    
    # Benefits in Arabic
    benefitsAr: metafield(namespace: "i18n", key: "benefits_ar") {
      value
    }
    
    # SEO metafields for Arabic
    seoTitleAr: metafield(namespace: "seo", key: "title_ar") {
      value
    }
    seoDescriptionAr: metafield(namespace: "seo", key: "description_ar") {
      value
    }
    
    # Product tags for Arabic
    tagsAr: metafield(namespace: "i18n", key: "tags_ar") {
      value
    }
  }
`

// Fragment for multilingual collection data
export const MULTILINGUAL_COLLECTION_FRAGMENT = /* GraphQL */ `
  fragment MultilingualCollection on Collection {
    id
    handle
    title
    description
    descriptionHtml
    
    # Arabic content metafields
    titleAr: metafield(namespace: "i18n", key: "title_ar") {
      value
    }
    descriptionAr: metafield(namespace: "i18n", key: "description_ar") {
      value
    }
    descriptionHtmlAr: metafield(namespace: "i18n", key: "description_html_ar") {
      value
    }
    
    # SEO metafields for Arabic
    seoTitleAr: metafield(namespace: "seo", key: "title_ar") {
      value
    }
    seoDescriptionAr: metafield(namespace: "seo", key: "description_ar") {
      value
    }
  }
`

// Query for getting products with multilingual content
export const GET_MULTILINGUAL_PRODUCTS = /* GraphQL */ `
  query GetMultilingualProducts($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      edges {
        node {
          ...MultilingualProduct
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                # Arabic variant title
                titleAr: metafield(namespace: "i18n", key: "title_ar") {
                  value
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${MULTILINGUAL_PRODUCT_FRAGMENT}
`

// Query for getting a single product with multilingual content
export const GET_MULTILINGUAL_PRODUCT = /* GraphQL */ `
  query GetMultilingualProduct($handle: String!) {
    product(handle: $handle) {
      ...MultilingualProduct
      variants(first: 100) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            availableForSale
            quantityAvailable
            selectedOptions {
              name
              value
            }
            # Arabic variant data
            titleAr: metafield(namespace: "i18n", key: "title_ar") {
              value
            }
            selectedOptionsAr: metafield(namespace: "i18n", key: "selected_options_ar") {
              value
            }
          }
        }
      }
      options {
        id
        name
        values
        # Arabic option names and values
        nameAr: metafield(namespace: "i18n", key: "option_name_ar") {
          value
        }
        valuesAr: metafield(namespace: "i18n", key: "option_values_ar") {
          value
        }
      }
    }
  }
  ${MULTILINGUAL_PRODUCT_FRAGMENT}
`

// Query for getting collections with multilingual content
export const GET_MULTILINGUAL_COLLECTIONS = /* GraphQL */ `
  query GetMultilingualCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          ...MultilingualCollection
          products(first: 10) {
            edges {
              node {
                id
                handle
                title
                # Arabic product title for collection display
                titleAr: metafield(namespace: "i18n", key: "title_ar") {
                  value
                }
              }
            }
          }
        }
      }
    }
  }
  ${MULTILINGUAL_COLLECTION_FRAGMENT}
`

// Utility types for multilingual content
export interface MultilingualProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  titleAr?: string
  descriptionAr?: string
  descriptionHtmlAr?: string
  categoryAr?: string
  featuresAr?: string
  ingredientsAr?: string
  technicalSpecsAr?: string
  usageInstructionsAr?: string
  benefitsAr?: string
  seoTitleAr?: string
  seoDescriptionAr?: string
  tagsAr?: string
}

export interface MultilingualCollection {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  titleAr?: string
  descriptionAr?: string
  descriptionHtmlAr?: string
  seoTitleAr?: string
  seoDescriptionAr?: string
}

// Helper function to get localized content
export function getLocalizedContent<T extends MultilingualProduct | MultilingualCollection>(
  item: T,
  locale: 'en' | 'ar',
  field: keyof T
): string {
  if (locale === 'ar') {
    const arabicField = `${String(field)}Ar` as keyof T
    const arabicValue = item[arabicField]
    if (arabicValue && typeof arabicValue === 'string') {
      return arabicValue
    }
  }

  const defaultValue = item[field]
  return typeof defaultValue === 'string' ? defaultValue : ''
}

// Helper function to get localized content from Shopify translations or metafields
export function getLocalizedProductContent(
  product: any,
  locale: 'en' | 'ar',
  field: 'title' | 'description' | 'descriptionHtml'
): string {
  if (locale === 'ar') {
    // First try native Shopify translations with locale check
    // This works with Shopify's Translate & Adapt app
    if (product.translations && Array.isArray(product.translations)) {
      // Try to find translation for Arabic locale
      const translation = product.translations.find(
        (t: any) => t.key === field && t.locale === 'ar'
      )
      if (translation?.value) {
        return translation.value
      }
      
      // Fallback: try without locale check (for older format)
      const fallbackTranslation = product.translations.find((t: any) => t.key === field)
      if (fallbackTranslation?.value) {
        return fallbackTranslation.value
      }
    }

    // Fallback to metafields (for manual translations)
    const metafieldKey = `${field}Ar`
    const metafield = product[metafieldKey]
    if (metafield?.value) {
      return metafield.value
    }
  }

  // Return default English content
  return product[field] || ''
}

// Helper function to get localized product title
export function getLocalizedProductTitle(product: any, locale: 'en' | 'ar'): string {
  return getLocalizedProductContent(product, locale, 'title')
}

// Helper function to get localized product description
export function getLocalizedProductDescription(product: any, locale: 'en' | 'ar'): string {
  return getLocalizedProductContent(product, locale, 'description')
}

// Helper function to get localized product description HTML
export function getLocalizedProductDescriptionHtml(product: any, locale: 'en' | 'ar'): string {
  return getLocalizedProductContent(product, locale, 'descriptionHtml')
}

// Helper function to get localized collection title
export function getLocalizedCollectionTitle(collection: MultilingualCollection, locale: 'en' | 'ar'): string {
  return getLocalizedContent(collection, locale, 'title')
}

// Helper function to parse Arabic tags
export function getLocalizedTags(product: MultilingualProduct, locale: 'en' | 'ar'): string[] {
  if (locale === 'ar' && product.tagsAr) {
    try {
      return JSON.parse(product.tagsAr)
    } catch {
      return product.tagsAr.split(',').map(tag => tag.trim())
    }
  }

  // Fallback to default tags (would need to be added to the fragment)
  return []
}

// Helper function to parse Arabic features/ingredients
export function getLocalizedList(product: MultilingualProduct, locale: 'en' | 'ar', type: 'features' | 'ingredients'): string[] {
  const field = locale === 'ar' ? `${type}Ar` : type
  const value = product[field as keyof MultilingualProduct]

  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return value.split('\n').filter(item => item.trim())
    }
  }

  return []
}

// Helper function to get localized handle
// Note: Shopify's @inContext directive should return the translated handle automatically
// if the product has a translated handle set in Translate & Adapt.
// This function is a fallback for cases where the handle might not be translated.
export function getLocalizedProductHandle(product: any, locale: 'en' | 'ar'): string {
  // First, check if the handle already contains Arabic characters (already localized)
  if (locale === 'ar' && /[\u0600-\u06FF]/.test(product.handle)) {
    return product.handle;
  }
  
  // Check if there's a handle translation in the translations array
  if (locale === 'ar' && product.translations && Array.isArray(product.translations)) {
    const handleTranslation = product.translations.find(
      (t: any) => t.key === 'handle' && t.locale === 'ar'
    );
    if (handleTranslation?.value) {
      return handleTranslation.value;
    }
  }
  
  // Check for handle metafield (manual translation)
  if (locale === 'ar' && product.handleAr?.value) {
    return product.handleAr.value;
  }
  
  // Return the original handle (Shopify should have returned the correct one via @inContext)
  return product.handle;
}
