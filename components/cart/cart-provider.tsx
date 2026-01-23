"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { CartNotification } from "./cart-notification"
import type { CartItem } from "@/lib/shopify/types"

interface CartNotificationContextType {
  showNotification: (item: CartItem) => void
}

const CartNotificationContext = createContext<CartNotificationContextType | undefined>(undefined)

export function CartNotificationProvider({ children }: { children: ReactNode }) {
  const [notificationItem, setNotificationItem] = useState<CartItem | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const showNotification = (item: CartItem) => {
    console.log("🔔 CartNotificationProvider: showNotification called with:", item)
    setNotificationItem(item)
    setIsVisible(true)
    console.log("🔔 CartNotificationProvider: notification state updated")
  }

  const hideNotification = () => {
    setIsVisible(false)
    setTimeout(() => setNotificationItem(null), 300) // Wait for animation to complete
  }

  return (
    <CartNotificationContext.Provider value={{ showNotification }}>
      {children}
      <CartNotification
        item={notificationItem}
        isVisible={isVisible}
        onClose={hideNotification}
      />
    </CartNotificationContext.Provider>
  )
}

export function useCartNotification() {
  const context = useContext(CartNotificationContext)
  if (context === undefined) {
    throw new Error("useCartNotification must be used within a CartNotificationProvider")
  }
  return context
}