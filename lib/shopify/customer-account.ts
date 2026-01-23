// Client-safe types and interfaces for Customer Account API
import { config } from '@/lib/config'

// Generic fetch function for customer account operations
export interface CustomerAccountFetchOptions {
  query: string
  variables?: any
  customerAccessToken?: string
}

export async function customerAccountFetch({
  query,
  variables,
  customerAccessToken
}: CustomerAccountFetchOptions) {
  const domain = config.shopify.domain
  const apiVersion = config.shopify.apiVersion
  const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': config.shopify.accessToken!,
  }

  // Add customer access token if provided
  if (customerAccessToken) {
    headers['X-Shopify-Customer-Token'] = customerAccessToken
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
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

  return {
    body: result.data,
    status: response.status,
    statusText: response.statusText
  }
}

// Customer Account API types
export interface CustomerCreateInput {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  acceptsMarketing?: boolean
}

export interface CustomerAccessTokenCreateInput {
  email: string
  password: string
}

export interface CustomerCreateResponse {
  customer?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone?: string
    acceptsMarketing: boolean
    createdAt: string
  }
  customerUserErrors: Array<{
    code: string
    field: string[]
    message: string
  }>
}

export interface CustomerAccessTokenResponse {
  customerAccessToken?: {
    accessToken: string
    expiresAt: string
  }
  customerUserErrors: Array<{
    code: string
    field: string[]
    message: string
  }>
}

export interface CustomerResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  acceptsMarketing: boolean
  defaultAddress?: {
    id: string
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    province: string
    country: string
    zip: string
    phone?: string
  }
  addresses: Array<{
    id: string
    firstName: string
    lastName: string
    company?: string
    address1: string
    address2?: string
    city: string
    province: string
    country: string
    zip: string
    phone?: string
  }>
  orders: {
    edges: Array<{
      node: {
        id: string
        orderNumber: number
        processedAt: string
        totalPriceV2: {
          amount: string
          currencyCode: string
        }
        lineItems: {
          edges: Array<{
            node: {
              title: string
              quantity: number
              variant?: {
                title: string
                image?: {
                  url: string
                  altText?: string
                }
              }
            }
          }>
        }
      }
    }>
  }
}