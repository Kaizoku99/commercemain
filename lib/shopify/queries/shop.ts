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
