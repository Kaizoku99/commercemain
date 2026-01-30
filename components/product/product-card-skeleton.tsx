"use client";

import clsx from "clsx";

interface ProductCardSkeletonProps {
  /** Number of skeleton cards to render */
  count?: number;
  /** Use single column on mobile (luxury collection style) */
  mobileColumns?: 1 | 2;
  /** RTL layout support */
  isRTL?: boolean;
}

/**
 * Single product card skeleton with ATP gold shimmer effect
 */
export function LuxuryProductCardSkeleton({ isRTL = false }: { isRTL?: boolean }) {
  return (
    <div
      className={clsx(
        "group relative flex flex-col h-full w-full overflow-hidden rounded-lg bg-atp-white",
        "border border-atp-light-gray"
      )}
    >
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-atp-off-white">
        <div className="skeleton-gold absolute inset-0" />
        
        {/* Quick Add Button Skeleton - Always visible on mobile */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center px-4">
          <div className="skeleton-atp h-12 w-full max-w-[200px] rounded-none" />
        </div>
      </div>

      {/* Product Info Skeleton */}
      <div className={clsx("flex flex-col gap-3 p-4", isRTL ? "items-end" : "items-start")}>
        {/* Title */}
        <div className="skeleton-atp h-4 w-4/5 rounded" />
        <div className="skeleton-atp h-4 w-3/5 rounded" />
        
        {/* Price */}
        <div className="flex items-center gap-2 mt-2">
          <div className="skeleton-gold h-5 w-20 rounded" />
          <div className="skeleton-atp h-4 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of product card skeletons with staggered animation
 */
export function LuxuryProductGridSkeleton({
  count = 8,
  mobileColumns = 2,
  isRTL = false,
}: ProductCardSkeletonProps) {
  return (
    <div
      className={clsx(
        "grid gap-6",
        mobileColumns === 1
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse"
          style={{
            animationDelay: `${index * 0.05}s`,
            animationDuration: "1.5s",
          }}
        >
          <LuxuryProductCardSkeleton isRTL={isRTL} />
        </div>
      ))}
    </div>
  );
}

/**
 * Collection page skeleton with hero, stats, and product grid
 */
export function CollectionPageSkeleton({ isRTL = false }: { isRTL?: boolean }) {
  return (
    <div className="space-y-0">
      {/* Hero Skeleton */}
      <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-atp-black">
        <div className="skeleton-atp absolute inset-0 opacity-30" />
        
        {/* Content skeleton */}
        <div className={clsx(
          "relative z-10 h-full container mx-auto px-4 flex flex-col justify-end pb-24 md:pb-32",
          isRTL ? "items-end" : "items-start"
        )}>
          <div className="max-w-4xl w-full flex flex-col gap-4">
            {/* Subtitle */}
            <div className="skeleton-gold h-4 w-32 rounded opacity-60" />
            {/* Title */}
            <div className="skeleton-atp h-12 md:h-16 w-full max-w-lg rounded opacity-40" />
            <div className="skeleton-atp h-12 md:h-16 w-3/4 max-w-md rounded opacity-40" />
            {/* Description */}
            <div className="skeleton-atp h-6 w-full max-w-xl rounded opacity-30 mt-4" />
          </div>
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className="w-full bg-atp-off-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center text-center p-6">
                <div className="skeleton-gold h-12 w-24 rounded mb-2" />
                <div className="skeleton-atp h-4 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="bg-atp-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="text-center mb-12">
            <div className="skeleton-atp h-10 w-64 mx-auto rounded mb-4" />
            <div className="skeleton-gold h-1 w-24 mx-auto rounded mb-4" />
            <div className="skeleton-atp h-5 w-96 max-w-full mx-auto rounded" />
          </div>
          
          {/* Grid */}
          <LuxuryProductGridSkeleton count={8} mobileColumns={2} isRTL={isRTL} />
        </div>
      </section>
    </div>
  );
}

export default LuxuryProductCardSkeleton;
