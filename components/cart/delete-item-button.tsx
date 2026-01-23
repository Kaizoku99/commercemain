"use client"

import { XMarkIcon } from "@heroicons/react/24/outline"
import type { CartItem } from "@/lib/shopify/types"
import { useTranslations } from "next-intl"

type OptimisticUpdateFunction = (merchandiseId: string, updateType: "delete") => Promise<void>

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem
  optimisticUpdate: OptimisticUpdateFunction
}) {
  const t = useTranslations('cart')
  const merchandiseId = item.merchandise.id

  const handleDelete = async () => {
    console.log("🔴 Delete button clicked for:", merchandiseId)
    try {
      await optimisticUpdate(merchandiseId, "delete")
      console.log("🔴 Delete button: optimisticUpdate completed")
    } catch (error) {
      console.error("🔴 Delete button error:", error)
    }
  }

  return (
    <button
      type="button"
      aria-label={t('removeCartItem')}
      className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      onClick={handleDelete}
    >
      <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
    </button>
  )
}
