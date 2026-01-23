'use client'

import { useEffect } from 'react'
import { ProductReviews } from '@/components/reviews/product-reviews'
import { trackProductView } from '@/lib/analytics/shopify-analytics'
import type { Product } from '@/lib/shopify/types'

interface EnhancedProductPageProps {
  product: Product
  children: React.ReactNode
}

export function EnhancedProductPage({ product, children }: EnhancedProductPageProps) {
  useEffect(() => {
    // Track product view
    trackProductView(
      product.id,
      product.title,
      parseFloat(product.priceRange.minVariantPrice.amount),
      product.productType || 'Product'
    )
  }, [product])

  return (
    <div className="space-y-12">
      {/* Original product content */}
      {children}
      
      {/* Product Reviews Section */}
      <section className="border-t pt-12">
        <ProductReviews 
          productId={product.id}
          productTitle={product.title}
        />
      </section>
    </div>
  )
}