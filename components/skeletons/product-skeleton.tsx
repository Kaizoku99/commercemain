import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="group relative">
      {/* Image skeleton */}
      <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
        <Skeleton className="h-full w-full" />
      </div>
      
      {/* Product info skeleton */}
      <div className="mt-4 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />
        {/* Price */}
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4">
      <div className="flex flex-col lg:flex-row lg:gap-8">
        {/* Gallery skeleton */}
        <div className="lg:w-3/5">
          <div className="aspect-square overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
            <Skeleton className="h-full w-full" />
          </div>
          {/* Thumbnails */}
          <div className="mt-4 flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-md" />
            ))}
          </div>
        </div>
        
        {/* Product details skeleton */}
        <div className="mt-6 lg:mt-0 lg:w-2/5">
          {/* Title */}
          <Skeleton className="h-8 w-3/4 mb-4" />
          
          {/* Price */}
          <Skeleton className="h-6 w-1/4 mb-6" />
          
          {/* Description */}
          <div className="space-y-2 mb-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          
          {/* Variant selector */}
          <div className="mb-6">
            <Skeleton className="h-4 w-20 mb-2" />
            <div className="flex gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-16 rounded-full" />
              ))}
            </div>
          </div>
          
          {/* Add to cart button */}
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function RelatedProductsSkeleton() {
  return (
    <div className="mt-16">
      <Skeleton className="h-6 w-48 mb-6" />
      <ProductGridSkeleton count={4} />
    </div>
  )
}
