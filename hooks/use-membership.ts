"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "./use-customer"
import { calculateMembershipStats } from "@/lib/shopify/membership-utils"

export type MembershipTier = "basic" | "premium" | "elite" | null

interface MembershipData {
  tier: MembershipTier
  isActive: boolean
  expiresAt?: string
  discountRate: number
}

// Membership hook integrated with Shopify Customer API
export function useMembership() {
  const { customer, isLoading: customerLoading } = useCustomer()
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

    if (customer) {
      // Calculate membership tier based on customer data
      const membershipStats = calculateMembershipStats(customer)
      
      // Map tier names to match existing interface
      const tierMap: Record<string, MembershipTier> = {
        basic: "basic",
        premium: "premium", 
        elite: "elite"
      }
      
      const discountRates = {
        basic: 0.05,    // 5% discount
        premium: 0.15,  // 15% discount
        elite: 0.25     // 25% discount
      }
      
      setMembership({
        tier: tierMap[membershipStats.tier] || "basic",
        isActive: true,
        expiresAt: "2024-12-31", // This could come from customer metafields
        discountRate: discountRates[membershipStats.tier] || 0.05,
      })
    } else {
      setMembership({
        tier: null,
        isActive: false,
        discountRate: 0,
      })
    }
    
    setIsLoading(false)
  }, [customer, customerLoading])

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
