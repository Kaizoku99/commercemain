"use client"

import { useState, useEffect } from "react"
import { useCustomer } from "./use-customer"
import { calculateMembershipStats, CustomerData } from "@/lib/shopify/membership-utils"
import type { CustomerResponse } from "@/lib/shopify/customer-account"

export type MembershipTier = "basic" | "premium" | "elite" | null

interface MembershipData {
  tier: MembershipTier
  isActive: boolean
  expiresAt?: string
  discountRate: number
}

// Transform CustomerResponse to CustomerData format expected by membership-utils
function transformCustomerToMembershipFormat(customer: CustomerResponse): CustomerData {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone,
    orders: customer.orders.edges.map(edge => ({
      name: `Order #${edge.node.orderNumber}`,
      processedAt: edge.node.processedAt,
      currentTotalPrice: {
        amount: edge.node.totalPriceV2.amount,
        currencyCode: edge.node.totalPriceV2.currencyCode
      },
      lineItems: edge.node.lineItems.edges.map(lineItem => ({
        quantity: lineItem.node.quantity,
        title: lineItem.node.title
      }))
    }))
  };
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
      // Transform customer data to the format expected by calculateMembershipStats
      const customerData = transformCustomerToMembershipFormat(customer)
      
      // Calculate membership tier based on customer data
      const membershipStats = calculateMembershipStats(customerData)
      
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
