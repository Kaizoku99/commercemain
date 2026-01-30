// Advanced Shopify queries for enhanced functionality

export const getProductsWithFiltersQuery = `
  query getProducts(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $first: Int = 100
    $after: String
    $filters: [ProductFilter!]
  ) {
    products(
      sortKey: $sortKey, 
      reverse: $reverse, 
      query: $query, 
      first: $first,
      after: $after,
      filters: $filters
    ) {
      filters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
      edges {
        node {
          id
          handle
          availableForSale
          title
          description
          descriptionHtml
          vendor
          productType
          tags
          options {
            id
            name
            values
          }
          priceRange {
            maxVariantPrice {
              amount
              currencyCode
            }
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
                price {
                  amount
                  currencyCode
                }
                quantityAvailable
                sku
                weight
                weightUnit
              }
            }
          }
          featuredImage {
            id
            altText
            url
            width
            height
          }
          images(first: 20) {
            edges {
              node {
                id
                altText
                url
                width
                height
              }
            }
          }
          seo {
            description
            title
          }
          metafields(identifiers: [
            {namespace: "custom", key: "features"},
            {namespace: "custom", key: "specifications"},
            {namespace: "custom", key: "warranty"}
          ]) {
            key
            namespace
            value
            type
          }
          sellingPlanGroups(first: 10) {
            edges {
              node {
                name
                options {
                  name
                  values
                }
                sellingPlans(first: 10) {
                  edges {
                    node {
                      id
                      name
                      description
                      options {
                        name
                        value
                      }
                      priceAdjustments {
                        adjustmentValue {
                          ... on SellingPlanFixedAmountPriceAdjustment {
                            adjustmentAmount {
                              amount
                              currencyCode
                            }
                          }
                          ... on SellingPlanFixedPriceAdjustment {
                            price {
                              amount
                              currencyCode
                            }
                          }
                          ... on SellingPlanPercentagePriceAdjustment {
                            adjustmentPercentage
                          }
                        }
                        orderCount
                      }
                      recurringDeliveries
                    }
                  }
                }
              }
            }
          }
          updatedAt
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

export const predictiveSearchQuery = `
  query predictiveSearch($query: String!, $first: Int = 10, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    predictiveSearch(query: $query, first: $first) {
      queries {
        text
        styledText
      }
      products {
        id
        handle
        title
        vendor
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
      collections {
        id
        handle
        title
        image {
          url
          altText
        }
      }
      pages {
        id
        handle
        title
      }
    }
  }
`

export const getShopQuery = `
  query getShop {
    shop {
      id
      name
      description
      primaryDomain {
        url
        host
      }
      brand {
        logo {
          image {
            url
          }
        }
        squareLogo {
          image {
            url
          }
        }
        colors {
          primary {
            background
            foreground
          }
          secondary {
            background
            foreground
          }
        }
      }
      paymentSettings {
        acceptedCardBrands
        cardVaultUrl
        countryCode
        currencyCode
        enabledPresentmentCurrencies
        shopifyPaymentsAccountId
        supportedDigitalWallets
      }
      shipsToCountries
      refundPolicy {
        body
        handle
        id
        title
        url
      }
      privacyPolicy {
        body
        handle
        id
        title
        url
      }
      termsOfService {
        body
        handle
        id
        title
        url
      }
    }
  }
`

export const getAvailableShippingRatesQuery = `
  query getAvailableShippingRates($cartId: ID!) {
    cart(id: $cartId) {
      deliveryGroups(first: 10) {
        edges {
          node {
            id
            deliveryOptions {
              code
              description
              handle
              title
              estimatedCost {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`

export const applyDiscountCodeMutation = `
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

export const createCheckoutMutation = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        totalPriceV2 {
          amount
          currencyCode
        }
        subtotalPriceV2 {
          amount
          currencyCode
        }
        totalTaxV2 {
          amount
          currencyCode
        }
        lineItems(first: 250) {
          edges {
            node {
              id
              title
              quantity
              variant {
                id
                title
                priceV2 {
                  amount
                  currencyCode
                }
                product {
                  id
                  handle
                  title
                }
              }
            }
          }
        }
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`