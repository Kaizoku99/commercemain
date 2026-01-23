import { ProductPageSkeleton, RelatedProductsSkeleton } from "@/components/skeletons"

export default function Loading() {
  return (
    <div className="py-8">
      <ProductPageSkeleton />
      <RelatedProductsSkeleton />
    </div>
  )
}
