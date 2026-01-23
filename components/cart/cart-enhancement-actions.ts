"use server"

import { revalidateTag } from "next/cache"
import { updateCartNote, updateCartAttributes } from "@/lib/shopify/server"
import { cookies } from "next/headers"
import { TAGS } from "@/lib/constants"

export type CartEnhancementResult = {
  success: boolean
  error?: string
}

/**
 * Update the cart note
 * 
 * @param note - The note to set on the cart
 * @returns Result with success status and any errors
 */
export async function updateCartNoteAction(note: string): Promise<CartEnhancementResult> {
  try {
    const cartId = (await cookies()).get('cartId')?.value

    if (!cartId) {
      return {
        success: false,
        error: "No cart found.",
      }
    }

    const result = await updateCartNote(note)

    if (result.userErrors && result.userErrors.length > 0) {
      return {
        success: false,
        error: result.userErrors[0]?.message || "Failed to update cart note.",
      }
    }

    revalidateTag(TAGS.cart, 'max')

    return {
      success: true,
    }
  } catch (error) {
    console.error("[CartEnhancements] Error updating cart note:", error)
    return {
      success: false,
      error: "An error occurred while updating the cart note. Please try again.",
    }
  }
}

/**
 * Update cart attributes
 * 
 * @param attributes - Array of key/value pairs for cart attributes
 * @returns Result with success status and any errors
 */
export async function updateCartAttributesAction(
  attributes: { key: string; value: string }[]
): Promise<CartEnhancementResult> {
  try {
    const cartId = (await cookies()).get('cartId')?.value

    if (!cartId) {
      return {
        success: false,
        error: "No cart found.",
      }
    }

    const result = await updateCartAttributes(attributes)

    if (result.userErrors && result.userErrors.length > 0) {
      return {
        success: false,
        error: result.userErrors[0]?.message || "Failed to update cart attributes.",
      }
    }

    revalidateTag(TAGS.cart, 'max')

    return {
      success: true,
    }
  } catch (error) {
    console.error("[CartEnhancements] Error updating cart attributes:", error)
    return {
      success: false,
      error: "An error occurred while updating cart options. Please try again.",
    }
  }
}
