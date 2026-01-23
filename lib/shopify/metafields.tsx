// Enhanced product queries with metafields support
export const getProductWithMetafieldsQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      availableForSale
      title
      description
      descriptionHtml
      vendor
      productType
      tags
      options {
        id
        name
        values
      }
      priceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        maxVariantPrice {
          amount
          currencyCode
        }
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            quantityAvailable
            sku
            weight
            weightUnit
          }
        }
      }
      featuredImage {
        id
        altText
        url
        width
        height
      }
      images(first: 20) {
        edges {
          node {
            id
            altText
            url
            width
            height
          }
        }
      }
      seo {
        description
        title
      }
      # Enhanced metafields for product features
      metafields(identifiers: [
        {namespace: "custom", key: "features"},
        {namespace: "custom", key: "specifications"},
        {namespace: "custom", key: "warranty"},
        {namespace: "custom", key: "care_instructions"},
        {namespace: "custom", key: "materials"},
        {namespace: "custom", key: "dimensions"},
        {namespace: "custom", key: "weight_details"},
        {namespace: "custom", key: "country_of_origin"},
        {namespace: "custom", key: "certifications"},
        {namespace: "custom", key: "sustainability"},
        {namespace: "reviews", key: "average_rating"},
        {namespace: "reviews", key: "total_reviews"},
        {namespace: "inventory", key: "low_stock_threshold"},
        {namespace: "shipping", key: "free_shipping_eligible"},
        {namespace: "shipping", key: "estimated_delivery"},
        {namespace: "marketing", key: "badge"},
        {namespace: "marketing", key: "promotion_text"}
      ]) {
        key
        namespace
        value
        type
        description
      }
      updatedAt
    }
  }
`

// Types for metafields
export interface ProductMetafield {
  key: string
  namespace: string
  value: string
  type: string
  description?: string
}

export interface EnhancedProduct {
  // ... existing product fields
  metafields: ProductMetafield[]
  // Parsed metafield data
  features?: string[]
  specifications?: Record<string, string>
  warranty?: string
  careInstructions?: string
  materials?: string[]
  dimensions?: {
    length?: number
    width?: number
    height?: number
    unit?: string
  }
  weightDetails?: {
    weight: number
    unit: string
  }
  countryOfOrigin?: string
  certifications?: string[]
  sustainability?: {
    rating?: string
    description?: string
  }
  reviews?: {
    averageRating?: number
    totalReviews?: number
  }
  inventory?: {
    lowStockThreshold?: number
  }
  shipping?: {
    freeShippingEligible?: boolean
    estimatedDelivery?: string
  }
  marketing?: {
    badge?: string
    promotionText?: string
  }
}

// Helper function to parse metafields
export function parseProductMetafields(metafields: ProductMetafield[]): Partial<EnhancedProduct> {
  const parsed: Partial<EnhancedProduct> = {}

  metafields.forEach(metafield => {
    const { namespace, key, value, type } = metafield

    try {
      switch (`${namespace}.${key}`) {
        case 'custom.features':
          parsed.features = type === 'list.single_line_text_field' 
            ? JSON.parse(value) 
            : value.split(',').map(f => f.trim())
          break

        case 'custom.specifications':
          parsed.specifications = type === 'json' 
            ? JSON.parse(value) 
            : {}
          break

        case 'custom.warranty':
          parsed.warranty = value
          break

        case 'custom.care_instructions':
          parsed.careInstructions = value
          break

        case 'custom.materials':
          parsed.materials = type === 'list.single_line_text_field' 
            ? JSON.parse(value) 
            : value.split(',').map(m => m.trim())
          break

        case 'custom.dimensions':
          parsed.dimensions = type === 'json' 
            ? JSON.parse(value) 
            : {}
          break

        case 'custom.weight_details':
          parsed.weightDetails = type === 'json' 
            ? JSON.parse(value) 
            : { weight: parseFloat(value), unit: 'kg' }
          break

        case 'custom.country_of_origin':
          parsed.countryOfOrigin = value
          break

        case 'custom.certifications':
          parsed.certifications = type === 'list.single_line_text_field' 
            ? JSON.parse(value) 
            : value.split(',').map(c => c.trim())
          break

        case 'custom.sustainability':
          parsed.sustainability = type === 'json' 
            ? JSON.parse(value) 
            : { description: value }
          break

        case 'reviews.average_rating':
          if (!parsed.reviews) parsed.reviews = {}
          parsed.reviews.averageRating = parseFloat(value)
          break

        case 'reviews.total_reviews':
          if (!parsed.reviews) parsed.reviews = {}
          parsed.reviews.totalReviews = parseInt(value)
          break

        case 'inventory.low_stock_threshold':
          parsed.inventory = { lowStockThreshold: parseInt(value) }
          break

        case 'shipping.free_shipping_eligible':
          if (!parsed.shipping) parsed.shipping = {}
          parsed.shipping.freeShippingEligible = value === 'true'
          break

        case 'shipping.estimated_delivery':
          if (!parsed.shipping) parsed.shipping = {}
          parsed.shipping.estimatedDelivery = value
          break

        case 'marketing.badge':
          if (!parsed.marketing) parsed.marketing = {}
          parsed.marketing.badge = value
          break

        case 'marketing.promotion_text':
          if (!parsed.marketing) parsed.marketing = {}
          parsed.marketing.promotionText = value
          break
      }
    } catch (error) {
      console.warn(`Failed to parse metafield ${namespace}.${key}:`, error)
    }
  })

  return parsed
}

// Component to display product metafields
export function ProductMetafieldsDisplay({ metafields }: { metafields: ProductMetafield[] }) {
  const parsed = parseProductMetafields(metafields)

  return (
    <div className="space-y-6">
      {/* Features */}
      {parsed.features && parsed.features.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Key Features</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            {parsed.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Specifications */}
      {parsed.specifications && Object.keys(parsed.specifications).length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Specifications</h3>
          <dl className="grid grid-cols-1 gap-2 text-sm">
            {Object.entries(parsed.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <dt className="text-gray-600">{key}:</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Materials */}
      {parsed.materials && parsed.materials.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Materials</h3>
          <p className="text-sm text-gray-600">
            {parsed.materials.join(', ')}
          </p>
        </div>
      )}

      {/* Care Instructions */}
      {parsed.careInstructions && (
        <div>
          <h3 className="font-semibold mb-2">Care Instructions</h3>
          <p className="text-sm text-gray-600">{parsed.careInstructions}</p>
        </div>
      )}

      {/* Warranty */}
      {parsed.warranty && (
        <div>
          <h3 className="font-semibold mb-2">Warranty</h3>
          <p className="text-sm text-gray-600">{parsed.warranty}</p>
        </div>
      )}

      {/* Country of Origin */}
      {parsed.countryOfOrigin && (
        <div>
          <h3 className="font-semibold mb-2">Country of Origin</h3>
          <p className="text-sm text-gray-600">{parsed.countryOfOrigin}</p>
        </div>
      )}

      {/* Certifications */}
      {parsed.certifications && parsed.certifications.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {parsed.certifications.map((cert, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}