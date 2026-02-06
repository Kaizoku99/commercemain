"use client"

import { useState, useEffect } from "react"
import { useCustomerOAuth } from "./use-customer-oauth"

export type MembershipTier = "basic" | "premium" | "elite" | null

interface MembershipData {
  tier: MembershipTier
  isActive: boolean
  expiresAt?: string
  discountRate: number
}

// Membership hook integrated with Shopify Customer Account API (OAuth)
export function useMembership() {
  const { customer, isLoading: customerLoading, isLoggedIn } = useCustomerOAuth()
  const [membership, setMembership] = useState<MembershipData>({
    tier: null,
    isActive: false,
    discountRate: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (customerLoading) {
      setIsLoading(true)
      return
    }

    if (isLoggedIn && customer) {
      // With OAuth, we don't have order history from the basic customer query
      // The membership would need to come from a separate API call or customer metafields
      // For now, we'll set a default membership tier for logged-in users
      // TODO: Fetch order history separately for membership calculation
      
      setMembership({
        tier: "basic", // Default tier for authenticated users
        isActive: true,
        expiresAt: "2024-12-31",
        discountRate: 0.05, // 5% discount for basic tier
      })
    } else {
      setMembership({
        tier: null,
        isActive: false,
        discountRate: 0,
      })
    }
    
    setIsLoading(false)
  }, [customer, customerLoading, isLoggedIn])

  const applyMemberDiscount = (price: number): number => {
    if (!membership.isActive || !membership.tier) return price
    return price * (1 - membership.discountRate)
  }

  const getMemberPrice = (
    originalPrice: string,
  ): {
    originalPrice: number
    memberPrice: number
    savings: number
  } => {
    const price = Number.parseFloat(originalPrice)
    const memberPrice = applyMemberDiscount(price)
    return {
      originalPrice: price,
      memberPrice,
      savings: price - memberPrice,
    }
  }

  return {
    membership,
    isLoading,
    applyMemberDiscount,
    getMemberPrice,
    isMember: membership.isActive && membership.tier !== null,
  }
}
