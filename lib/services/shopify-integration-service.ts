/**
 * Shopify Integration Service for ATP Membership System
 * 
 * Handles integration with Shopify Customer API for membership data storage
 * and Shopify Storefront API for cart discount application.
 * 
 * Requirements: 2.3, 4.3, 5.1, 8.1
 */

// Note: This service can be used in both server and client contexts

import { config } from '../config'
import { 
  AtpMembership, 
  MembershipError, 
  MembershipErrorCode,
  MembershipResult,
  MembershipStats
} from '../types/membership'

// Shopify Admin API types for customer metafields
interface ShopifyCustomerMetafield {
  id?: string
  namespace: string
  key: string
  value: string
  type: string
  description?: string
}

interface ShopifyCustomer {
  id: string
  email: string
  firstName?: string
  lastName?: string
  metafields?: ShopifyCustomerMetafield[]
}

// Shopify Storefront API types for cart operations
interface ShopifyCartDiscountCode {
  code: string
  applicable: boolean
}

interface ShopifyCartDiscountAllocation {
  discountedAmount: {
    amount: string
    currencyCode: string
  }
}

// GraphQL queries and mutations
const CUSTOMER_METAFIELDS_QUERY = `
  query getCustomerMetafields($customerId: ID!) {
    customer(id: $customerId) {
      id
      email
      firstName
      lastName
      metafields(first: 50, namespace: "atp_membership") {
        id
        namespace
        key
        value
        type
        description
      }
    }
  }
`

const UPDATE_CUSTOMER_METAFIELDS_MUTATION = `
  mutation updateCustomerMetafields($input: CustomerInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        metafields(first: 50, namespace: "atp_membership") {
          edges {
            node {
              id
              namespace
              key
              value
              type
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_DISCOUNT_CODES_UPDATE_MUTATION = `
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!]) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes {
          code
          applicable
        }
        discountAllocations {
          discountedAmount {
            amount
            currencyCode
          }
        }
        cost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_ATTRIBUTES_UPDATE_MUTATION = `
  mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        id
        attributes {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`

export class ShopifyIntegrationService {
  private readonly adminApiEndpoint: string
  private readonly storefrontApiEndpoint: string
  private readonly adminAccessToken: string
  private readonly storefrontAccessToken: string

  constructor() {
    const domain = config.shopify.domain
    const apiVersion = config.shopify.apiVersion
    
    this.adminApiEndpoint = `https://${domain}/admin/api/${apiVersion}/graphql.json`
    this.storefrontApiEndpoint = `https://${domain}/api/${apiVersion}/graphql.json`
    this.adminAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || ''
    this.storefrontAccessToken = config.shopify.accessToken
    
    if (!this.adminAccessToken) {
      console.warn('[ShopifyIntegrationService] Admin access token not configured. Some features may not work.')
    }
  }

  /**
   * Make GraphQL request to Shopify Admin API
   */
  private async adminApiFetch<T>(query: string, variables?: any): Promise<T> {
    if (!this.adminAccessToken) {
      throw new MembershipError(
        'Shopify Admin API access token not configured',
        MembershipErrorCode.SHOPIFY_API_ERROR
      )
    }

    try {
      const response = await fetch(this.adminApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.adminAccessToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL error')
      }

      return result.data
    } catch (error) {
      console.error('[ShopifyIntegrationService] Admin API error:', error)
      throw new MembershipError(
        `Shopify Admin API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MembershipErrorCode.SHOPIFY_API_ERROR,
        error
      )
    }
  }

  /**
   * Make GraphQL request to Shopify Storefront API
   */
  private async storefrontApiFetch<T>(query: string, variables?: any): Promise<T> {
    try {
      const response = await fetch(this.storefrontApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': this.storefrontAccessToken,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL error')
      }

      return result.data
    } catch (error) {
      console.error('[ShopifyIntegrationService] Storefront API error:', error)
      throw new MembershipError(
        `Shopify Storefront API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        MembershipErrorCode.SHOPIFY_API_ERROR,
        error
      )
    }
  }

  /**
   * Convert ATP membership to Shopify metafields format
   */
  private membershipToMetafields(membership: AtpMembership): ShopifyCustomerMetafield[] {
    return [
      {
        namespace: 'atp_membership',
        key: 'status',
        value: membership.status,
        type: 'single_line_text_field',
        description: 'ATP membership status'
      },
      {
        namespace: 'atp_membership',
        key: 'start_date',
        value: membership.startDate,
        type: 'date_time',
        description: 'ATP membership start date'
      },
      {
        namespace: 'atp_membership',
        key: 'expiration_date',
        value: membership.expirationDate,
        type: 'date_time',
        description: 'ATP membership expiration date'
      },
      {
        namespace: 'atp_membership',
        key: 'subscription_id',
        value: membership.subscriptionId || '',
        type: 'single_line_text_field',
        description: 'ATP membership subscription ID'
      },
      {
        namespace: 'atp_membership',
        key: 'payment_status',
        value: membership.paymentStatus,
        type: 'single_line_text_field',
        description: 'ATP membership payment status'
      },
      {
        namespace: 'atp_membership',
        key: 'benefits',
        value: JSON.stringify(membership.benefits),
        type: 'json',
        description: 'ATP membership benefits configuration'
      },
      {
        namespace: 'atp_membership',
        key: 'created_at',
        value: membership.createdAt,
        type: 'date_time',
        description: 'ATP membership creation date'
      },
      {
        namespace: 'atp_membership',
        key: 'updated_at',
        value: membership.updatedAt,
        type: 'date_time',
        description: 'ATP membership last update date'
      }
    ]
  }

  /**
   * Convert Shopify metafields to ATP membership
   */
  private metafieldsToMembership(customerId: string, metafields: ShopifyCustomerMetafield[]): AtpMembership | null {
    const metafieldMap = new Map<string, string>()
    
    metafields.forEach(field => {
      if (field.namespace === 'atp_membership') {
        metafieldMap.set(field.key, field.value)
      }
    })

    // Check if we have the minimum required fields
    if (!metafieldMap.has('status') || !metafieldMap.has('start_date') || !metafieldMap.has('expiration_date')) {
      return null
    }

    try {
      const benefits = metafieldMap.has('benefits') 
        ? JSON.parse(metafieldMap.get('benefits')!)
        : {
            serviceDiscount: 0.15,
            freeDelivery: true,
            eligibleServices: ['home-massage-spa', 'ems-training', 'home-yoga', 'cosmetics-supplements'],
            annualFee: 99
          }

      return {
        id: `atp_${customerId}`,
        customerId,
        status: metafieldMap.get('status') as any,
        startDate: metafieldMap.get('start_date')!,
        expirationDate: metafieldMap.get('expiration_date')!,
        subscriptionId: metafieldMap.get('subscription_id') || undefined,
        paymentStatus: metafieldMap.get('payment_status') as any || 'paid',
        benefits,
        createdAt: metafieldMap.get('created_at') || new Date().toISOString(),
        updatedAt: metafieldMap.get('updated_at') || new Date().toISOString()
      }
    } catch (error) {
      console.error('[ShopifyIntegrationService] Error parsing membership metafields:', error)
      return null
    }
  }

  /**
   * Update customer membership data in Shopify metafields (alias for lifecycle service)
   */
  async updateCustomerMembership(customerId: string, membership: AtpMembership): Promise<void> {
    const result = await this.updateCustomerMetafields(customerId, membership);
    if (!result.success) {
      throw new Error(result.error || 'Failed to update customer membership');
    }
  }

  /**
   * Store membership data in Shopify Customer metafields
   * Requirement: 2.3 - Store membership data in Shopify Customer API
   */
  async updateCustomerMetafields(customerId: string, membership: AtpMembership): Promise<MembershipResult<void>> {
    try {
      const metafields = this.membershipToMetafields(membership)
      
      const input = {
        id: customerId,
        metafields: metafields.map(field => ({
          namespace: field.namespace,
          key: field.key,
          value: field.value,
          type: field.type
        }))
      }

      await this.adminApiFetch(UPDATE_CUSTOMER_METAFIELDS_MUTATION, { input })

      return { success: true, data: undefined }
    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            `Failed to update customer metafields: ${error instanceof Error ? error.message : 'Unknown error'}`,
            MembershipErrorCode.SHOPIFY_API_ERROR,
            error
          )

      return { success: false, error: membershipError }
    }
  }

  /**
   * Retrieve membership data from Shopify Customer metafields
   * Requirement: 2.3 - Retrieve membership data from Shopify Customer API
   */
  async getCustomerMembership(customerId: string): Promise<MembershipResult<AtpMembership | null>> {
    try {
      const data = await this.adminApiFetch<{ customer: ShopifyCustomer }>(
        CUSTOMER_METAFIELDS_QUERY,
        { customerId }
      )

      if (!data.customer) {
        return { success: true, data: null }
      }

      const metafields = data.customer.metafields || []
      const membership = this.metafieldsToMembership(customerId, metafields)

      return { success: true, data: membership }
    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            `Failed to get customer membership: ${error instanceof Error ? error.message : 'Unknown error'}`,
            MembershipErrorCode.SHOPIFY_API_ERROR,
            error
          )

      return { success: false, error: membershipError }
    }
  }

  /**
   * Apply membership discount to cart using Shopify Storefront API
   * Requirement: 4.3, 5.1 - Apply member discounts and free delivery
   */
  async applyMembershipDiscount(cartId: string, membership: AtpMembership): Promise<MembershipResult<void>> {
    try {
      // Check if membership is active
      if (membership.status !== 'active') {
        throw new MembershipError(
          'Cannot apply discount: membership is not active',
          MembershipErrorCode.MEMBERSHIP_EXPIRED
        )
      }

      // Check if membership is expired
      const now = new Date()
      const expirationDate = new Date(membership.expirationDate)
      if (now > expirationDate) {
        throw new MembershipError(
          'Cannot apply discount: membership has expired',
          MembershipErrorCode.MEMBERSHIP_EXPIRED
        )
      }

      // Apply membership attributes to cart for discount logic
      const attributes = [
        {
          key: 'atp_membership_status',
          value: membership.status
        },
        {
          key: 'atp_membership_discount',
          value: membership.benefits.serviceDiscount.toString()
        },
        {
          key: 'atp_membership_free_delivery',
          value: membership.benefits.freeDelivery.toString()
        },
        {
          key: 'atp_membership_id',
          value: membership.id
        }
      ]

      await this.storefrontApiFetch(CART_ATTRIBUTES_UPDATE_MUTATION, {
        cartId,
        attributes
      })

      return { success: true, data: undefined }
    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            `Failed to apply membership discount: ${error instanceof Error ? error.message : 'Unknown error'}`,
            MembershipErrorCode.DISCOUNT_APPLICATION_FAILED,
            error
          )

      return { success: false, error: membershipError }
    }
  }

  /**
   * Remove membership discount from cart
   * Requirement: 8.1 - Handle membership expiration
   */
  async removeMembershipDiscount(cartId: string): Promise<MembershipResult<void>> {
    try {
      // Remove membership attributes from cart
      const attributes = [
        {
          key: 'atp_membership_status',
          value: ''
        },
        {
          key: 'atp_membership_discount',
          value: ''
        },
        {
          key: 'atp_membership_free_delivery',
          value: ''
        },
        {
          key: 'atp_membership_id',
          value: ''
        }
      ]

      await this.storefrontApiFetch(CART_ATTRIBUTES_UPDATE_MUTATION, {
        cartId,
        attributes
      })

      return { success: true, data: undefined }
    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            `Failed to remove membership discount: ${error instanceof Error ? error.message : 'Unknown error'}`,
            MembershipErrorCode.DISCOUNT_APPLICATION_FAILED,
            error
          )

      return { success: false, error: membershipError }
    }
  }

  /**
   * Validate membership status in real-time
   * Requirement: 8.1 - Real-time membership validation
   */
  async validateMembershipStatus(customerId: string): Promise<MembershipResult<boolean>> {
    try {
      const membershipResult = await this.getCustomerMembership(customerId)
      
      if (!membershipResult.success) {
        return membershipResult as MembershipResult<boolean>
      }

      const membership = membershipResult.data
      if (!membership) {
        return { success: true, data: false }
      }

      // Check if membership is active and not expired
      const now = new Date()
      const expirationDate = new Date(membership.expirationDate)
      const isValid = membership.status === 'active' && now <= expirationDate

      return { success: true, data: isValid }
    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            `Failed to validate membership status: ${error instanceof Error ? error.message : 'Unknown error'}`,
            MembershipErrorCode.SHOPIFY_API_ERROR,
            error
          )

      return { success: false, error: membershipError }
    }
  }

  /**
   * Calculate service discount for eligible services
   * Requirement: 4.3 - Apply 15% discount on premium services
   */
  calculateServiceDiscount(price: number, membership: AtpMembership, serviceType: string): number {
    // Check if membership is active
    if (membership.status !== 'active') {
      return 0
    }

    // Check if membership is expired
    const now = new Date()
    const expirationDate = new Date(membership.expirationDate)
    if (now > expirationDate) {
      return 0
    }

    // Check if service is eligible for discount
    if (!membership.benefits.eligibleServices.includes(serviceType)) {
      return 0
    }

    return price * membership.benefits.serviceDiscount
  }

  /**
   * Check if customer is eligible for free delivery
   * Requirement: 5.1 - Free delivery for active members
   */
  isEligibleForFreeDelivery(membership: AtpMembership): boolean {
    // Check if membership is active
    if (membership.status !== 'active') {
      return false
    }

    // Check if membership is expired
    const now = new Date()
    const expirationDate = new Date(membership.expirationDate)
    if (now > expirationDate) {
      return false
    }

    return membership.benefits.freeDelivery
  }

  /**
   * Get membership statistics from metafields
   * Requirement: Analytics and reporting
   */
  async getMembershipStats(customerId: string): Promise<MembershipResult<MembershipStats | null>> {
    try {
      const membershipResult = await this.getCustomerMembership(customerId)
      
      if (!membershipResult.success) {
        return membershipResult as MembershipResult<MembershipStats | null>
      }

      const membership = membershipResult.data
      if (!membership) {
        return { success: true, data: null }
      }

      // For now, return basic stats. In a full implementation, this would
      // aggregate data from order history and usage tracking
      const stats: MembershipStats = {
        totalSavings: 0, // Would be calculated from order history
        servicesUsed: 0, // Would be calculated from service bookings
        ordersWithFreeDelivery: 0, // Would be calculated from order history
        memberSince: membership.startDate,
        averageOrderValue: 0, // Would be calculated from order history
        totalOrders: 0 // Would be calculated from order history
      }

      return { success: true, data: stats }
    } catch (error) {
      const membershipError = error instanceof MembershipError 
        ? error 
        : new MembershipError(
            `Failed to get membership stats: ${error instanceof Error ? error.message : 'Unknown error'}`,
            MembershipErrorCode.SHOPIFY_API_ERROR,
            error
          )

      return { success: false, error: membershipError }
    }
  }

  /**
   * Get all customers with membership metafields for admin purposes
   */
  async getCustomersWithMemberships(): Promise<any[]> {
    try {
      const query = `
        query getCustomersWithMemberships($first: Int!) {
          customers(first: $first, query: "metafield_key:atp.membership.status") {
            edges {
              node {
                id
                email
                firstName
                lastName
                createdAt
                metafields(first: 20, namespace: "atp") {
                  edges {
                    node {
                      key
                      value
                      type
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = { first: 250 }; // Shopify limit
      const response = await this.graphqlClient.request(query, variables);
      
      return response.customers.edges.map((edge: any) => edge.node);
    } catch (error) {
      console.error('Error getting customers with memberships:', error);
      throw new MembershipError(
        'Failed to get customers with memberships',
        MembershipErrorCode.SHOPIFY_API_ERROR,
        error
      );
    }
  }

  /**
   * Parse membership data from customer object
   */
  parseMembershipFromCustomer(customer: any): AtpMembership | null {
    try {
      const metafields = customer.metafields?.edges || [];
      const metafieldMap = new Map();
      
      metafields.forEach((edge: any) => {
        metafieldMap.set(edge.node.key, edge.node.value);
      });

      const status = metafieldMap.get('membership.status');
      if (!status) {
        return null;
      }

      return {
        id: metafieldMap.get('membership.id') || `mem_${customer.id}`,
        customerId: customer.id,
        status: status as MembershipStatus,
        startDate: metafieldMap.get('membership.start_date') || customer.createdAt,
        expirationDate: metafieldMap.get('membership.expiration_date') || new Date().toISOString(),
        subscriptionId: metafieldMap.get('membership.subscription_id'),
        paymentStatus: (metafieldMap.get('membership.payment_status') || 'paid') as PaymentStatus,
        benefits: {
          serviceDiscount: 0.15,
          freeDelivery: true,
          eligibleServices: ['home-massage-spa', 'ems-training', 'home-yoga', 'cosmetics-supplements'],
          annualFee: 99
        },
        createdAt: customer.createdAt,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing membership from customer:', error);
      return null;
    }
  }

  /**
   * Get membership by ID
   */
  async getMembershipById(membershipId: string): Promise<AtpMembership | null> {
    try {
      // Extract customer ID from membership ID or search by metafield
      const query = `
        query getMembershipById($query: String!) {
          customers(first: 1, query: $query) {
            edges {
              node {
                id
                email
                firstName
                lastName
                createdAt
                metafields(first: 20, namespace: "atp") {
                  edges {
                    node {
                      key
                      value
                      type
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const variables = { query: `metafield_value:${membershipId}` };
      const response = await this.graphqlClient.request(query, variables);
      
      if (response.customers.edges.length === 0) {
        return null;
      }

      const customer = response.customers.edges[0].node;
      return this.parseMembershipFromCustomer(customer);
    } catch (error) {
      console.error('Error getting membership by ID:', error);
      throw new MembershipError(
        'Failed to get membership by ID',
        MembershipErrorCode.SHOPIFY_API_ERROR,
        error
      );
    }
  }

  /**
   * Get customer information for admin purposes
   */
  async getCustomerInfo(customerId: string): Promise<any> {
    try {
      const customer = await this.getCustomer(customerId);
      if (!customer) {
        throw new MembershipError(
          'Customer not found',
          MembershipErrorCode.INVALID_CUSTOMER
        );
      }

      return {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        ordersCount: customer.numberOfOrders || 0,
        totalSpent: customer.totalSpent || '0.00'
      };
    } catch (error) {
      console.error('Error getting customer info:', error);
      throw new MembershipError(
        'Failed to get customer information',
        MembershipErrorCode.SHOPIFY_API_ERROR,
        error
      );
    }
  }

  /**
   * Update customer membership data
   */
  async updateCustomerMembership(customerId: string, membership: AtpMembership): Promise<void> {
    try {
      const metafields = [
        {
          key: 'membership.id',
          value: membership.id,
          type: 'single_line_text_field'
        },
        {
          key: 'membership.status',
          value: membership.status,
          type: 'single_line_text_field'
        },
        {
          key: 'membership.start_date',
          value: membership.startDate,
          type: 'date_time'
        },
        {
          key: 'membership.expiration_date',
          value: membership.expirationDate,
          type: 'date_time'
        },
        {
          key: 'membership.payment_status',
          value: membership.paymentStatus,
          type: 'single_line_text_field'
        }
      ];

      if (membership.subscriptionId) {
        metafields.push({
          key: 'membership.subscription_id',
          value: membership.subscriptionId,
          type: 'single_line_text_field'
        });
      }

      await this.updateCustomerMetafields(customerId, metafields);
    } catch (error) {
      console.error('Error updating customer membership:', error);
      throw new MembershipError(
        'Failed to update customer membership',
        MembershipErrorCode.SHOPIFY_API_ERROR,
        error
      );
    }
  }
}

// Export singleton instance
export const shopifyIntegrationService = new ShopifyIntegrationService()