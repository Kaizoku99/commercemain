import { getCollectionProducts } from "@/lib/shopify/server";
import Link from "next/link";
import { GridTileImage } from "./grid/tile";
import { getLocalizedProductHandle } from "@/lib/shopify/i18n-queries";

export async function Carousel({ locale = "en" }: { locale?: "en" | "ar" }) {
  // Using the actual collection handle from Shopify store
  const products = await getCollectionProducts({
    collection: "water-soil-technology-solutions",
  });

  if (!products?.length) return null;

  // Purposefully duplicating products to make the carousel loop and not run out of products on wide screens.
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1">
      <ul className="flex animate-carousel gap-4">
        {carouselProducts.map((product, i) => {
          // Defensive programming: Check for required properties
          if (!product || !product.handle || !product.title) {
            console.warn(
              "Product missing required properties in carousel:",
              product
            );
            return null;
          }

          // Safely access price information with fallbacks
          const priceRange = product.priceRange;
          const maxVariantPrice = priceRange?.maxVariantPrice;
          const amount = maxVariantPrice?.amount || "0.00";
          const currencyCode = maxVariantPrice?.currencyCode || "AED";

          return (
            <li
              key={`${product.handle}${i}`}
              className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
            >
              <Link
                href={`/${locale}/product/${getLocalizedProductHandle(product, locale)}`}
                className="relative h-full w-full"
              >
                <GridTileImage
                  alt={product.title}
                  label={{
                    title: product.title,
                    amount,
                    currencyCode,
                  }}
                  src={product.featuredImage?.url}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
