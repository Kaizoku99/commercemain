import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Hero skeleton */}
      <div className="relative h-[50vh] min-h-[400px] bg-neutral-100 dark:bg-neutral-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4 px-4">
            <Skeleton className="h-12 w-64 mx-auto" />
            <Skeleton className="h-6 w-96 max-w-full mx-auto" />
            <Skeleton className="h-12 w-40 mx-auto rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Featured products skeleton */}
      <div className="mx-auto max-w-screen-2xl px-4 py-16">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="group relative">
              <div className="aspect-square overflow-hidden rounded-lg">
                <Skeleton className="h-full w-full" />
              </div>
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-5 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Categories skeleton */}
      <div className="bg-neutral-50 dark:bg-neutral-900 py-16">
        <div className="mx-auto max-w-screen-2xl px-4">
          <Skeleton className="h-8 w-40 mb-8 mx-auto" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="text-center">
                <Skeleton className="aspect-square rounded-full w-32 mx-auto mb-4" />
                <Skeleton className="h-5 w-24 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
