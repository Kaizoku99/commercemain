import { Skeleton } from "@/components/ui/skeleton"

export function MembershipCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 bg-white dark:bg-black">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      
      {/* Benefits list */}
      <div className="space-y-3 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        ))}
      </div>
      
      {/* Price */}
      <div className="text-center mb-6">
        <Skeleton className="h-8 w-24 mx-auto mb-2" />
        <Skeleton className="h-3 w-16 mx-auto" />
      </div>
      
      {/* CTA Button */}
      <Skeleton className="h-12 w-full rounded-full" />
    </div>
  )
}

export function MembershipPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl px-4 py-12">
      {/* Hero section */}
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-5 w-96 mx-auto mb-2" />
        <Skeleton className="h-5 w-80 mx-auto" />
      </div>
      
      {/* Membership cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <MembershipCardSkeleton />
        <MembershipCardSkeleton />
        <MembershipCardSkeleton />
      </div>
      
      {/* Features section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center p-6">
            <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
            <Skeleton className="h-5 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function MembershipDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Status card */}
      <div className="rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Benefits usage */}
      <div className="rounded-lg border p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
