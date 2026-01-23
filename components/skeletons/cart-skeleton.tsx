import { Skeleton } from "@/components/ui/skeleton"

export function CartItemSkeleton() {
  return (
    <div className="flex gap-4 py-4 border-b border-neutral-200 dark:border-neutral-700">
      {/* Image */}
      <Skeleton className="h-24 w-24 rounded-md flex-shrink-0" />
      
      {/* Details */}
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <div className="flex items-center justify-between mt-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export function CartPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-8">
      {/* Header */}
      <Skeleton className="h-8 w-48 mb-8" />
      
      <div className="flex flex-col lg:flex-row lg:gap-12">
        {/* Cart items */}
        <div className="lg:w-2/3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CartItemSkeleton key={i} />
          ))}
        </div>
        
        {/* Order summary */}
        <div className="lg:w-1/3 mt-8 lg:mt-0">
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
            <Skeleton className="h-6 w-32 mb-6" />
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex justify-between border-t pt-4">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            
            {/* Checkout button */}
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function CartModalSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      
      {Array.from({ length: 2 }).map((_, i) => (
        <CartItemSkeleton key={i} />
      ))}
      
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  )
}
