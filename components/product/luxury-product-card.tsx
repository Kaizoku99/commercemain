"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Link } from "@/src/i18n/navigation";
import { m } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import clsx from "clsx";
import Price from "../price";
import {
  productCardHover,
  productImageHover,
  quickAddButton,
} from "@/lib/animations";

interface LuxuryProductCardProps {
  product: {
    handle: string;
    title: string;
    featuredImage?: { url: string; altText?: string };
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    compareAtPriceRange?: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
  };
  priority?: boolean;
  isRTL?: boolean;
  onQuickAdd?: (handle: string) => void;
}

export function LuxuryProductCard({
  product,
  priority = false,
  isRTL = false,
  onQuickAdd,
}: LuxuryProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { handle, title, featuredImage, priceRange, compareAtPriceRange } = product;

  const price = priceRange.minVariantPrice;
  const compareAtPrice = compareAtPriceRange?.minVariantPrice;
  const isOnSale =
    compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onQuickAdd) {
      onQuickAdd(handle);
    }
  };

  return (
    <m.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={productCardHover}
      className={clsx(
        "group relative flex flex-col h-full w-full overflow-hidden rounded-lg bg-atp-white",
        "border border-atp-light-gray transition-colors duration-500",
        "hover:border-atp-gold hover:shadow-lg hover:shadow-atp-gold/5"
      )}
    >
      <Link href={`/product/${handle}`} className="flex flex-col h-full">
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-atp-off-white">
          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 z-20">
              <span className="bg-atp-gold text-atp-black px-3 py-1 text-xs font-bold uppercase tracking-wider">
                Sale
              </span>
            </div>
          )}

          {featuredImage ? (
            <m.div variants={productImageHover} className="h-full w-full">
              <Image
                src={featuredImage.url}
                alt={featuredImage.altText || title}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                priority={priority}
                className={clsx(
                  "object-cover transition-opacity duration-500",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
            </m.div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-atp-light-gray/20">
              <span className="text-atp-charcoal/40 text-sm">No Image</span>
            </div>
          )}

          {/* Skeleton Shimmer */}
          {!imageLoaded && (
            <div className="skeleton-atp absolute inset-0 z-10" />
          )}

          {/* Quick Add Button - Always visible on mobile, hover on desktop */}
          {onQuickAdd && (
            <div className={clsx(
              "absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4",
              "transition-all duration-300 ease-out",
              // Mobile: always visible
              "opacity-100 translate-y-0",
              // Desktop: hidden initially, visible on hover with slide up
              "md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0"
            )}>
              <m.button
                variants={quickAddButton}
                initial="visible"
                animate="visible"
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickAdd}
                className={clsx(
                  "flex items-center gap-2 w-full justify-center py-3 px-4",
                  "bg-atp-black/90 backdrop-blur-sm text-white text-sm font-medium uppercase tracking-wide",
                  "shadow-lg transition-colors duration-300",
                  "hover:bg-atp-gold hover:text-atp-black"
                )}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Quick Add</span>
              </m.button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className={clsx("flex flex-col gap-2 p-4 flex-grow", isRTL ? "text-right" : "text-left")}>
          <h3 className="font-medium text-atp-black text-sm md:text-base leading-snug line-clamp-2 min-h-[2.5em]">
            {title}
          </h3>
          
          <div className={clsx("flex items-center gap-2 mt-auto", isRTL && "flex-row-reverse justify-end")}>
            <Price
              amount={price.amount}
              currencyCode={price.currencyCode}
              className="text-atp-black font-semibold text-sm md:text-base"
            />
            {isOnSale && compareAtPrice && (
              <Price
                amount={compareAtPrice.amount}
                currencyCode={compareAtPrice.currencyCode}
                className="text-atp-charcoal/60 text-xs line-through decoration-atp-gold/50"
              />
            )}
          </div>
        </div>
      </Link>
    </m.div>
  );
}
