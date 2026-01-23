"use server"

import { revalidateTag } from "next/cache"
import { updateCartDiscountCodes } from "@/lib/shopify/server"
import { cookies } from "next/headers"
import { TAGS } from "@/lib/constants"

export type DiscountActionResult = {
  success: boolean
  error?: string
  warnings?: string[]
}

/**
 * Apply a discount code to the cart
 * 
 * @param code - The discount code to apply
 * @returns Result with success status and any errors/warnings
 */
export async function applyDiscountCode(code: string): Promise<DiscountActionResult> {
  try {
    const cartId = (await cookies()).get('cartId')?.value

    if (!cartId) {
      return {
        success: false,
        error: "No cart found. Please add items to your cart first.",
      }
    }

    if (!code || !code.trim()) {
      return {
        success: false,
        error: "Please enter a discount code.",
      }
    }

    // Get current cart to preserve existing codes
    const { getCart } = await import("@/lib/shopify/server")
    const currentCart = await getCart()
    
    // Get existing codes and add the new one
    const existingCodes = currentCart?.discountCodes
      ?.filter(dc => dc.applicable)
      ?.map(dc => dc.code) || []
    
    const newCodes = [...existingCodes, code.trim().toUpperCase()]
    
    const result = await updateCartDiscountCodes(newCodes)

    if (result.userErrors && result.userErrors.length > 0) {
      return {
        success: false,
        error: result.userErrors[0]?.message || "Failed to apply discount code.",
      }
    }

    // Check if the code was actually applied
    const appliedCode = result.cart?.discountCodes?.find(
      dc => dc.code.toUpperCase() === code.trim().toUpperCase()
    )

    if (!appliedCode) {
      return {
        success: false,
        error: "Discount code not found or is invalid.",
      }
    }

    if (!appliedCode.applicable) {
      return {
        success: true, // Code was added but not applicable
        warnings: ["Discount code was added but is not applicable to your current cart."],
      }
    }

    // Extract any warning messages
    const warnings = result.warnings?.map(w => w.message) || []

    revalidateTag(TAGS.cart, 'max')

    if (warnings.length > 0) {
      return {
        success: true,
        warnings: warnings,
      }
    }
    
    return {
      success: true,
    }
  } catch (error) {
    console.error("[Discount] Error applying discount code:", error)
    return {
      success: false,
      error: "An error occurred while applying the discount code. Please try again.",
    }
  }
}

/**
 * Remove a discount code from the cart
 * 
 * @param code - The discount code to remove
 * @returns Result with success status and any errors
 */
export async function removeDiscountCode(code: string): Promise<DiscountActionResult> {
  try {
    const cartId = (await cookies()).get('cartId')?.value

    if (!cartId) {
      return {
        success: false,
        error: "No cart found.",
      }
    }

    // Get current cart to get existing codes
    const { getCart } = await import("@/lib/shopify/server")
    const currentCart = await getCart()
    
    // Filter out the code to remove
    const remainingCodes = currentCart?.discountCodes
      ?.map(dc => dc.code)
      ?.filter(c => c.toUpperCase() !== code.toUpperCase()) || []
    
    const result = await updateCartDiscountCodes(remainingCodes)

    if (result.userErrors && result.userErrors.length > 0) {
      return {
        success: false,
        error: result.userErrors[0]?.message || "Failed to remove discount code.",
      }
    }

    revalidateTag(TAGS.cart, 'max')

    return {
      success: true,
    }
  } catch (error) {
    console.error("[Discount] Error removing discount code:", error)
    return {
      success: false,
      error: "An error occurred while removing the discount code. Please try again.",
    }
  }
}

/**
 * Clear all discount codes from the cart
 * 
 * @returns Result with success status and any errors
 */
export async function clearAllDiscountCodes(): Promise<DiscountActionResult> {
  try {
    const cartId = (await cookies()).get('cartId')?.value

    if (!cartId) {
      return {
        success: false,
        error: "No cart found.",
      }
    }

    const result = await updateCartDiscountCodes([])

    if (result.userErrors && result.userErrors.length > 0) {
      return {
        success: false,
        error: result.userErrors[0]?.message || "Failed to clear discount codes.",
      }
    }

    revalidateTag(TAGS.cart, 'max')

    return {
      success: true,
    }
  } catch (error) {
    console.error("[Discount] Error clearing discount codes:", error)
    return {
      success: false,
      error: "An error occurred while clearing discount codes. Please try again.",
    }
  }
}
