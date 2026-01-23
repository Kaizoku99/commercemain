"use client"

import { Button } from "@/components/ui/button"
import { useCartNotification } from "./cart-provider"

export function TestNotification() {
  const { showNotification } = useCartNotification()

  const testNotification = () => {
    const testItem = {
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
            altText: "Test Product"
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