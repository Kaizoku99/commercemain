// Updated for Shopify Storefront API 2026-01
export const getShopPaymentSettingsQuery = `
  query getShopPaymentSettings @inContext(country: AE) {
    shop {
      name
      description
      paymentSettings {
        currencyCode
        countryCode
        enabledPresentmentCurrencies
        acceptedCardBrands
        supportedDigitalWallets
      }
    }
  }
`

export const getShopInfoQuery = `
  query getShopInfo @inContext(country: AE) {
    shop {
      id
      name
      description
      primaryDomain {
        host
        url
      }
      currencyCode
      paymentSettings {
        currencyCode
        countryCode
        enabledPresentmentCurrencies
        acceptedCardBrands
        supportedDigitalWallets
      }
    }
  }
`

// Policy query for fetching shop policies from Shopify
export const getShopPolicyQuery = `
  query getShopPolicy(
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        body
        handle
        id
        title
        url
      }
      shippingPolicy @include(if: $shippingPolicy) {
        body
        handle
        id
        title
        url
      }
      termsOfService @include(if: $termsOfService) {
        body
        handle
        id
        title
        url
      }
      refundPolicy @include(if: $refundPolicy) {
        body
        handle
        id
        title
        url
      }
    }
  }
`
