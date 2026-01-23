"use client"

import { GridTileImage } from "@/components/grid/tile"
import { getCollectionProducts } from "@/lib/shopify/server"
import type { Product } from "@/lib/shopify/types"
import Link from "next/link"
import { m } from "framer-motion"
import clsx from "clsx"

function ThreeItemGridItem({
  item,
  size,
  priority,
  index = 0,
}: {
  item: Product
  size: "full" | "half"
  priority?: boolean
  index?: number
}) {
  // Defensive programming: Check for required properties
  if (!item || !item.handle || !item.title) {
    console.warn("Product missing required properties in ThreeItemGridItem:", item)
    return null
  }

  // Safely access price information with fallbacks
  const priceRange = item.priceRange
  const maxVariantPrice = priceRange?.maxVariantPrice
  const amount = maxVariantPrice?.amount || "0.00"
  const currencyCode = maxVariantPrice?.currencyCode || "AED"

  const isATPMember = item.tags?.includes("atp-member") || item.title.toLowerCase().includes("atp")

  return (
    <m.div
      className={clsx("relative overflow-hidden rounded-lg", {
        "md:col-span-4 md:row-span-2": size === "full",
        "md:col-span-2 md:row-span-1": size === "half",
      })}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.6,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
    >
      <Link
        className="relative block aspect-square h-full w-full min-h-[300px]"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage?.url}
          fill
          sizes={size === "full" ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount,
            currencyCode,
            isATPMember,
          }}
        />
      </Link>
    </m.div>
  )
}

export async function ThreeItemGrid() {
  // Using the actual collection handle from Shopify store
  const homepageItems = await getCollectionProducts({
    collection: "amazing-thai-products",
  })

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null

  const [firstProduct, secondProduct, thirdProduct] = homepageItems

  return (
    <m.section
      className="container-premium"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-atp-black mb-4">Featured Collection</h2>
        <div className="w-24 h-1 bg-atp-gold mx-auto mb-6"></div>
        <p className="text-lg text-atp-charcoal max-w-2xl mx-auto">
          Discover our most popular products, carefully selected for their exceptional quality and customer
          satisfaction.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-6 md:grid-rows-2 max-h-[800px]">
        <ThreeItemGridItem size="full" item={firstProduct} priority={true} index={0} />
        <ThreeItemGridItem size="half" item={secondProduct} priority={true} index={1} />
        <ThreeItemGridItem size="half" item={thirdProduct} index={2} />
      </div>
    </m.section>
  )
}
