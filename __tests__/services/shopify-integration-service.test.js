/**
 * Integration tests for ShopifyIntegrationService
 * 
 * Tests the integration with Shopify Customer API for membership data
 * and Shopify Storefront API for cart discount application.
 * 
 * Requirements: 2.3, 4.3, 5.1, 8.1
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock server-only module first - this is critical for Next.js server components
vi.mock('server-only', () => ({}))

// Mock environment variables
vi.mock('../../lib/config', () => ({
  config: {
    shopify: {
      domain: 'test-store.myshopify.com',
      accessToken: 'test-storefront-token',
      apiVersion: '2026-01'
    }
  }
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Now import the service after mocks are set up
import { ShopifyIntegrationService } from '../../lib/services/shopify-integration-service'
import {
  MembershipErrorCode
} from '../../lib/types/membership'

describe('ShopifyIntegrationService', () => {
  let service
  let mockMembership

  beforeEach(() => {
    // Set up environment
    process.env.SHOPIFY_ADMIN_ACCESS_TOKEN = 'test-admin-token'
    
    service = new ShopifyIntegrationService()
    mockMembership = {
      id: 'atp_test_customer_123',
      customerId: 'gid://shopify/Customer/123',
      status: 'active',
      startDate: '2024-01-01T00:00:00Z',
      expirationDate: '2025-01-01T00:00:00Z',
      subscriptionId: 'sub_123456789',
      paymentStatus: 'paid',
      benefits: {
        serviceDiscount: 0.15,
        freeDelivery: true,
        eligibleServices: ['home-massage-spa', 'ems-training', 'home-yoga', 'cosmetics-supplements'],
        annualFee: 99
      },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
    
    vi.clearAllMocks()
  })

  describe('calculateServiceDiscount', () => {
    it('should calculate correct discount for eligible services', () => {
      const discount = service.calculateServiceDiscount(100, mockMembership, 'home-massage-spa')
      expect(discount).toBe(15) // 15% of 100
    })

    it('should return 0 for non-eligible services', () => {
      const discount = service.calculateServiceDiscount(100, mockMembership, 'non-eligible-service')
      expect(discount).toBe(0)
    })

    it('should return 0 for inactive membership', () => {
      const inactiveMembership = { ...mockMembership, status: 'expired' }
      const discount = service.calculateServiceDiscount(100, inactiveMembership, 'home-massage-spa')
      expect(discount).toBe(0)
    })

    it('should return 0 for expired membership', () => {
      const expiredMembership = { 
        ...mockMembership, 
        expirationDate: '2023-01-01T00:00:00Z' 
      }
      const discount = service.calculateServiceDiscount(100, expiredMembership, 'home-massage-spa')
      expect(discount).toBe(0)
    })
  })

  describe('isEligibleForFreeDelivery', () => {
    it('should return true for active membership with free delivery benefit', () => {
      const isEligible = service.isEligibleForFreeDelivery(mockMembership)
      expect(isEligible).toBe(true)
    })

    it('should return false for inactive membership', () => {
      const inactiveMembership = { ...mockMembership, status: 'expired' }
      const isEligible = service.isEligibleForFreeDelivery(inactiveMembership)
      expect(isEligible).toBe(false)
    })

    it('should return false for expired membership', () => {
      const expiredMembership = { 
        ...mockMembership, 
        expirationDate: '2023-01-01T00:00:00Z' 
      }
      const isEligible = service.isEligibleForFreeDelivery(expiredMembership)
      expect(isEligible).toBe(false)
    })

    it('should return false when free delivery benefit is disabled', () => {
      const membershipWithoutFreeDelivery = {
        ...mockMembership,
        benefits: { ...mockMembership.benefits, freeDelivery: false }
      }
      const isEligible = service.isEligibleForFreeDelivery(membershipWithoutFreeDelivery)
      expect(isEligible).toBe(false)
    })
  })

  describe('updateCustomerMetafields', () => {
    it('should successfully store membership data in customer metafields', async () => {
      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customerUpdate: {
              customer: {
                id: 'gid://shopify/Customer/123',
                metafields: []
              },
              userErrors: []
            }
          }
        })
      })

      const result = await service.updateCustomerMetafields(
        'gid://shopify/Customer/123',
        mockMembership
      )

      expect(result.success).toBe(true)
      expect(mockFetch).toHaveBeenCalledWith(
        'https://test-store.myshopify.com/admin/api/2024-01/graphql.json',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': 'test-admin-token'
          }
        })
      )
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500
      })

      const result = await service.updateCustomerMetafields(
        'gid://shopify/Customer/123',
        mockMembership
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(MembershipErrorCode.SHOPIFY_API_ERROR)
    })
  })

  describe('getCustomerMembership', () => {
    it('should successfully retrieve membership data from customer metafields', async () => {
      // Mock successful API response with metafields
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customer: {
              id: 'gid://shopify/Customer/123',
              email: 'test@example.com',
              metafields: [
                {
                  namespace: 'atp_membership',
                  key: 'status',
                  value: 'active',
                  type: 'single_line_text_field'
                },
                {
                  namespace: 'atp_membership',
                  key: 'start_date',
                  value: '2024-01-01T00:00:00Z',
                  type: 'date_time'
                },
                {
                  namespace: 'atp_membership',
                  key: 'expiration_date',
                  value: '2025-01-01T00:00:00Z',
                  type: 'date_time'
                }
              ]
            }
          }
        })
      })

      const result = await service.getCustomerMembership('gid://shopify/Customer/123')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(
        expect.objectContaining({
          customerId: 'gid://shopify/Customer/123',
          status: 'active',
          startDate: '2024-01-01T00:00:00Z',
          expirationDate: '2025-01-01T00:00:00Z'
        })
      )
    })

    it('should return null when customer has no membership metafields', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customer: {
              id: 'gid://shopify/Customer/123',
              email: 'test@example.com',
              metafields: []
            }
          }
        })
      })

      const result = await service.getCustomerMembership('gid://shopify/Customer/123')

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })
  })

  describe('applyMembershipDiscount', () => {
    it('should successfully apply membership discount to cart', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            cartAttributesUpdate: {
              cart: {
                id: 'gid://shopify/Cart/123',
                attributes: [
                  { key: 'atp_membership_status', value: 'active' },
                  { key: 'atp_membership_discount', value: '0.15' }
                ]
              },
              userErrors: []
            }
          }
        })
      })

      const result = await service.applyMembershipDiscount(
        'gid://shopify/Cart/123',
        mockMembership
      )

      expect(result.success).toBe(true)
    })

    it('should reject discount application for inactive membership', async () => {
      const inactiveMembership = { ...mockMembership, status: 'expired' }

      const result = await service.applyMembershipDiscount(
        'gid://shopify/Cart/123',
        inactiveMembership
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(MembershipErrorCode.MEMBERSHIP_EXPIRED)
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('should reject discount application for expired membership', async () => {
      const expiredMembership = { 
        ...mockMembership, 
        expirationDate: '2023-01-01T00:00:00Z' // Past date
      }

      const result = await service.applyMembershipDiscount(
        'gid://shopify/Cart/123',
        expiredMembership
      )

      expect(result.success).toBe(false)
      expect(result.error?.code).toBe(MembershipErrorCode.MEMBERSHIP_EXPIRED)
      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('removeMembershipDiscount', () => {
    it('should successfully remove membership discount from cart', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            cartAttributesUpdate: {
              cart: {
                id: 'gid://shopify/Cart/123',
                attributes: []
              },
              userErrors: []
            }
          }
        })
      })

      const result = await service.removeMembershipDiscount('gid://shopify/Cart/123')

      expect(result.success).toBe(true)

      // Verify cart attributes are cleared
      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.variables.attributes).toEqual([
        { key: 'atp_membership_status', value: '' },
        { key: 'atp_membership_discount', value: '' },
        { key: 'atp_membership_free_delivery', value: '' },
        { key: 'atp_membership_id', value: '' }
      ])
    })
  })

  describe('validateMembershipStatus', () => {
    it('should return true for active, non-expired membership', async () => {
      // Mock getCustomerMembership call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customer: {
              id: 'gid://shopify/Customer/123',
              metafields: [
                {
                  namespace: 'atp_membership',
                  key: 'status',
                  value: 'active'
                },
                {
                  namespace: 'atp_membership',
                  key: 'start_date',
                  value: '2024-01-01T00:00:00Z'
                },
                {
                  namespace: 'atp_membership',
                  key: 'expiration_date',
                  value: '2025-01-01T00:00:00Z'
                }
              ]
            }
          }
        })
      })

      const result = await service.validateMembershipStatus('gid://shopify/Customer/123')

      expect(result.success).toBe(true)
      expect(result.data).toBe(true)
    })

    it('should return false for expired membership', async () => {
      // Mock getCustomerMembership call with expired membership
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customer: {
              id: 'gid://shopify/Customer/123',
              metafields: [
                {
                  namespace: 'atp_membership',
                  key: 'status',
                  value: 'active'
                },
                {
                  namespace: 'atp_membership',
                  key: 'expiration_date',
                  value: '2023-01-01T00:00:00Z' // Past date
                }
              ]
            }
          }
        })
      })

      const result = await service.validateMembershipStatus('gid://shopify/Customer/123')

      expect(result.success).toBe(true)
      expect(result.data).toBe(false)
    })

    it('should return false when no membership exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customer: {
              id: 'gid://shopify/Customer/123',
              metafields: []
            }
          }
        })
      })

      const result = await service.validateMembershipStatus('gid://shopify/Customer/123')

      expect(result.success).toBe(true)
      expect(result.data).toBe(false)
    })
  })

  describe('getMembershipStats', () => {
    it('should return basic membership stats', async () => {
      // Mock getCustomerMembership call
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customer: {
              id: 'gid://shopify/Customer/123',
              metafields: [
                {
                  namespace: 'atp_membership',
                  key: 'status',
                  value: 'active'
                },
                {
                  namespace: 'atp_membership',
                  key: 'start_date',
                  value: '2024-01-01T00:00:00Z'
                },
                {
                  namespace: 'atp_membership',
                  key: 'expiration_date',
                  value: '2025-01-01T00:00:00Z'
                }
              ]
            }
          }
        })
      })

      const result = await service.getMembershipStats('gid://shopify/Customer/123')

      expect(result.success).toBe(true)
      expect(result.data).toEqual(
        expect.objectContaining({
          memberSince: '2024-01-01T00:00:00Z',
          totalSavings: 0,
          servicesUsed: 0,
          ordersWithFreeDelivery: 0,
          averageOrderValue: 0,
          totalOrders: 0
        })
      )
    })

    it('should return null when no membership exists', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            customer: {
              id: 'gid://shopify/Customer/123',
              metafields: []
            }
          }
        })
      })

      const result = await service.getMembershipStats('gid://shopify/Customer/123')

      expect(result.success).toBe(true)
      expect(result.data).toBeNull()
    })
  })
})