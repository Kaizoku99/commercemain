"use client";

import Grid from "@/components/grid";
import { GridTileImage } from "@/components/grid/tile";
import type { Product } from "@/lib/shopify/types";
import { getLocalizedProductTitle, getLocalizedProductHandle } from "@/lib/shopify/i18n-queries";
import Link from "next/link";

export default function ProductGridItems({
  products,
  locale = 'en',
}: {
  products: Product[];
  locale?: 'en' | 'ar';
}) {
  return (
    <>
      {products.map((product, index) => {
        // Defensive programming: Check for required properties
        if (!product || !product.handle || !product.title) {
          console.warn("Product missing required properties:", product);
          return null;
        }

        // Get localized title and handle
        const localizedTitle = getLocalizedProductTitle(product, locale);
        const localizedHandle = getLocalizedProductHandle(product, locale);

        // Safely access price information with fallbacks
        const priceRange = product.priceRange;
        const maxVariantPrice = priceRange?.maxVariantPrice;
        const amount = maxVariantPrice?.amount || "0.00";
        const currencyCode = maxVariantPrice?.currencyCode || "AED";

        const isATPMember =
          product.tags?.includes("atp-member") ||
          product.tags?.includes("atp") ||
          localizedTitle.toLowerCase().includes("atp");

        return (
          <Grid.Item
            key={product.handle}
            index={index}
            className="animate-fadeIn"
          >
            <Link
              className="relative inline-block h-full w-full min-h-[400px] overflow-hidden"
              href={`/${locale}/product/${localizedHandle}`}
              prefetch={true}
            >
              <GridTileImage
                alt={localizedTitle}
                label={{
                  title: localizedTitle,
                  amount,
                  currencyCode,
                  isATPMember,
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
            </Link>
          </Grid.Item>
        );
      })}
    </>
  );
}
