import { getCollectionProducts, getFeaturedProducts } from "@/lib/shopify/server"
import { NewArrivalsCarousel } from "./new-arrivals-carousel"
import { type Locale } from "@/lib/i18n/config"

interface NewArrivalsWrapperProps {
  locale: Locale
}

export async function NewArrivalsWrapper({ locale }: NewArrivalsWrapperProps) {
  // Fetch featured products from the dedicated collection (limit: 5)
  // To customize: Go to Shopify Admin → Products → Collections → "Featured Products"
  // Add exactly 5 products you want to feature in your preferred order
  const featuredProducts = await getFeaturedProducts({
    collection: "featured-products",
    limit: 5,
  })

  const carouselProducts = await getCollectionProducts({
    collection: "water-soil-technology-solutions",
  })

  // Fallback to amazing-thai-products if featured-products collection is empty
  const products = featuredProducts?.length 
    ? featuredProducts 
    : await getCollectionProducts({ collection: "amazing-thai-products" })

  if (!products?.length) return null

  return <NewArrivalsCarousel products={products} carouselProducts={carouselProducts || []} locale={locale} />
}
