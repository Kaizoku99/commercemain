import { getCollectionProducts } from "@/lib/shopify/server";
import { CarouselClient } from "./carousel-client";

export async function CarouselWrapper({
  locale = "en",
}: {
  locale?: "en" | "ar";
}) {
  // Using the actual collection handle from Shopify store
  const products = await getCollectionProducts({
    collection: "water-soil-technology-solutions",
  });

  if (!products?.length) return null;

  return <CarouselClient products={products} locale={locale} />;
}
