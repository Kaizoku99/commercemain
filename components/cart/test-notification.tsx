"use client"

import { Button } from "@/components/ui/button"
import { useCartNotification } from "./cart-provider"
import type { CartItem } from "@/lib/shopify/types"

export function TestNotification() {
  const { showNotification } = useCartNotification()

  const testNotification = () => {
    const testItem: CartItem = {
      id: "test-id",
      quantity: 1,
      cost: {
        totalAmount: {
          amount: "25.00",
          currencyCode: "AED"
        }
      },
      merchandise: {
        id: "test-merchandise-id",
        title: "Test Variant",
        selectedOptions: [],
        product: {
          id: "test-product-id",
          handle: "test-product",
          title: "Test Product",
          featuredImage: {
            url: "/placeholder.svg",
            altText: "Test Product",
            width: 100,
            height: 100
          }
        }
      }
    }

    console.log("🧪 Testing notification with:", testItem)
    showNotification(testItem)
  }

  return (
    <Button onClick={testNotification} variant="outline">
      Test Notification
    </Button>
  )
}