import 'server-only'

import { config } from '@/lib/config'

// Server-only GraphQL mutations and queries
const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
        createdAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `
  mutation customerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      deletedCustomerAccessTokenId
      userErrors {
        field
        message
      }
    }
  }
`

const CUSTOMER_QUERY = `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      acceptsMarketing
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        country
        zip
        phone
      }
      addresses(first: 10) {
        edges {
          node {
            id
            firstName
            lastName
            company
            address1
            address2
            city
            province
            country
            zip
            phone
          }
        }
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            processedAt
            totalPriceV2 {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    title
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const CUSTOMER_UPDATE_MUTATION = `
  mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
        phone
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

const CUSTOMER_PASSWORD_RESET_MUTATION = `
  mutation customerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`

// Storefront API endpoint for customer operations
const getStorefrontEndpoint = () => {
  const domain = config.shopify.domain
  const apiVersion = config.shopify.apiVersion
  return `https://${domain}/api/${apiVersion}/graphql.json`
}

// Make GraphQL request to Storefront API (server-only)
async function storefrontFetch<T>(query: string, variables?: any): Promise<T> {
  const endpoint = getStorefrontEndpoint()
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': config.shopify.accessToken!,
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
}

// Server-only functions
export async function createCustomerServer(input: any): Promise<any> {
  try {
    const data = await storefrontFetch<{ customerCreate: any }>(
      CUSTOMER_CREATE_MUTATION,
      { input }
    )
    
    return data.customerCreate
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

export async function createCustomerAccessTokenServer(input: any): Promise<any> {
  try {
    console.log('[CustomerAuth] Attempting to create access token for:', input.email)
    
    const data = await storefrontFetch<{ customerAccessTokenCreate: any }>(
      CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
      { input }
    )
    
    console.log('[CustomerAuth] Shopify response:', JSON.stringify(data.customerAccessTokenCreate, null, 2))
    
    // Check for specific error codes and provide helpful guidance
    const errors = data.customerAccessTokenCreate?.customerUserErrors || []
    if (errors.length > 0) {
      const errorCode = errors[0]?.code
      console.log('[CustomerAuth] Error code:', errorCode)
      
      if (errorCode === 'UNIDENTIFIED_CUSTOMER') {
        console.log('[CustomerAuth] UNIDENTIFIED_CUSTOMER - This can mean:')
        console.log('  1. Email/password combination is incorrect')
        console.log('  2. Account exists but was never activated with a password')
        console.log('  3. Store uses "New Customer Accounts" (OAuth) instead of "Legacy Customer Accounts"')
        console.log('  Check Shopify Admin → Settings → Customer accounts for configuration')
      }
    }
    
    return data.customerAccessTokenCreate
  } catch (error) {
    console.error('[CustomerAuth] Error creating customer access token:', error)
    throw error
  }
}

export async function deleteCustomerAccessTokenServer(customerAccessToken: string): Promise<boolean> {
  try {
    const data = await storefrontFetch<{ customerAccessTokenDelete: any }>(
      CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
      { customerAccessToken }
    )
    
    return !!data.customerAccessTokenDelete.deletedAccessToken
  } catch (error) {
    console.error('Error deleting customer access token:', error)
    throw error
  }
}

export async function getCustomerServer(customerAccessToken: string): Promise<any> {
  try {
    const data = await storefrontFetch<{ customer: any }>(
      CUSTOMER_QUERY,
      { customerAccessToken }
    )
    
    return data.customer
  } catch (error) {
    console.error('Error fetching customer:', error)
    throw error
  }
}

export async function updateCustomerServer(
  customerAccessToken: string,
  customer: any
): Promise<any> {
  try {
    const data = await storefrontFetch<{ customerUpdate: any }>(
      CUSTOMER_UPDATE_MUTATION,
      { customerAccessToken, customer }
    )
    
    return data.customerUpdate
  } catch (error) {
    console.error('Error updating customer:', error)
    throw error
  }
}

export async function recoverCustomerPasswordServer(email: string): Promise<boolean> {
  try {
    const data = await storefrontFetch<{ customerRecover: any }>(
      CUSTOMER_PASSWORD_RESET_MUTATION,
      { email }
    )
    
    return data.customerRecover.customerUserErrors.length === 0
  } catch (error) {
    console.error('Error recovering customer password:', error)
    throw error
  }
}