import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Gallery } from "@/components/product/gallery";
import { ProductProvider } from "@/components/product/product-context";
import { ATPProductDescription } from "@/components/product/atp-product-description";
import { EnhancedRelatedProducts } from "@/components/product/enhanced-related-products";
import { HIDDEN_PRODUCT_TAG } from "@/lib/constants";
import { getProduct, getProductRecommendations } from "@/lib/shopify/server";
import {
  getLocalizedProductTitle,
  getLocalizedProductDescription,
} from "@/lib/shopify/i18n-queries";
import type { Image } from "@/lib/shopify/types";
import Link from "next/link";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string; locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  // Shopify Translate & Adapt already provides the correct localized handle in the URL
  // So we use params.handle directly with the appropriate language context
  const product = await getProduct(params.handle, {
    language: params.locale === "ar" ? "ar" : "en",
    country: "AE",
  });

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  // Use localized content for metadata
  const title = getLocalizedProductTitle(product, params.locale as "en" | "ar");
  const description = getLocalizedProductDescription(
    product,
    params.locale as "en" | "ar"
  );

  return {
    title: product.seo.title || title,
    description: product.seo.description || description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string; locale: string }>;
}) {
  const params = await props.params;

  // Shopify Translate & Adapt already provides the correct localized handle in the URL
  // So we use params.handle directly with the appropriate language context
  const product = await getProduct(params.handle, {
    language: params.locale === "ar" ? "ar" : "en",
    country: "AE",
  });

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: getLocalizedProductTitle(product, params.locale as "en" | "ar"),
    description: getLocalizedProductDescription(
      product,
      params.locale as "en" | "ar"
    ),
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4" dir="ltr">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6" dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
            <Suspense fallback={null}>
              <ATPProductDescription
                product={product}
                locale={params.locale as "en" | "ar"}
              />
            </Suspense>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="py-16 bg-gradient-to-b from-gray-50/50 to-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-8">
                  <div className="h-8 bg-gray-200 rounded-md w-64"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-200 aspect-square rounded-2xl"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <RelatedProducts
            id={product.id}
            locale={params.locale as "en" | "ar"}
          />
        </Suspense>
      </div>
    </ProductProvider>
  );
}

async function RelatedProducts({
  id,
  locale,
}: {
  id: string;
  locale: "en" | "ar";
}) {
  const relatedProducts = await getProductRecommendations(id, {
    language: locale === "ar" ? "ar" : "en",
    country: "AE",
  });

  if (!relatedProducts.length) return null;

  return <EnhancedRelatedProducts products={relatedProducts} locale={locale} />;
}
