/**
 * Store Availability Queries
 * 
 * These queries check product availability at physical store locations
 * for in-store pickup options in UAE.
 */

export const getStoreAvailabilityQuery = /* GraphQL */ `
  query getStoreAvailability($productId: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    product(id: $productId) {
      id
      handle
      title
      variants(first: 250) {
        edges {
          node {
            id
            title
            storeAvailability(first: 10) {
              edges {
                node {
                  available
                  location {
                    id
                    name
                    address {
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
              }
            }
          }
        }
      }
    }
  }
`;

export const getVariantStoreAvailabilityQuery = /* GraphQL */ `
  query getVariantStoreAvailability($variantId: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    productVariant(id: $variantId) {
      id
      title
      storeAvailability(first: 10) {
        edges {
          node {
            available
            location {
              id
              name
              address {
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
        }
      }
    }
  }
`;

export const getStoreLocationsQuery = /* GraphQL */ `
  query getStoreLocations($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    locations(first: 50) {
      edges {
        node {
          id
          name
          isActive
          address {
            address1
            address2
            city
            province
            country
            zip
            phone
          }
          # Store metafields for hours, services, etc.
          metafield(namespace: "custom", key: "store_hours") {
            value
          }
          storeHours: metafield(namespace: "custom", key: "opening_hours") {
            value
            type
          }
          storeServices: metafield(namespace: "custom", key: "services") {
            value
            type
          }
        }
      }
    }
  }
`;
