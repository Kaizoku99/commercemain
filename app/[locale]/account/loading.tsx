import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-screen-xl px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-5 w-96 max-w-full mx-auto" />
        </div>
        
        {/* Account info card */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-8">
            {/* Profile section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            
            {/* Menu items */}
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
