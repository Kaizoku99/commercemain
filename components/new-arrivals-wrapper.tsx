import { getCollectionProducts } from "@/lib/shopify/server"
import { NewArrivalsCarousel } from "./new-arrivals-carousel"
import { type Locale } from "@/lib/i18n/config"

interface NewArrivalsWrapperProps {
  locale: Locale
}

export async function NewArrivalsWrapper({ locale }: NewArrivalsWrapperProps) {
  const products = await getCollectionProducts({
    collection: "amazing-thai-products",
  })

  const carouselProducts = await getCollectionProducts({
    collection: "water-soil-technology-solutions",
  })

  if (!products?.length) return null

  return <NewArrivalsCarousel products={products} carouselProducts={carouselProducts || []} locale={locale} />
}
