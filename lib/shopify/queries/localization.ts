/**
 * Localization Queries
 * 
 * These queries retrieve available countries, currencies, and languages
 * supported by the Shopify store for internationalization.
 */

export const getAvailableCountriesQuery = /* GraphQL */ `
  query getAvailableCountries($language: LanguageCode) @inContext(language: $language) {
    localization {
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
        unitSystem
      }
    }
  }
`;

export const getAvailableLanguagesQuery = /* GraphQL */ `
  query getAvailableLanguages {
    localization {
      availableLanguages {
        isoCode
        name
        endonymName
      }
    }
  }
`;

export const getLocalizationQuery = /* GraphQL */ `
  query getLocalization($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    localization {
      country {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
        unitSystem
      }
      language {
        isoCode
        name
        endonymName
      }
      market {
        id
        handle
      }
      availableCountries {
        isoCode
        name
        currency {
          isoCode
          name
          symbol
        }
      }
      availableLanguages {
        isoCode
        name
        endonymName
      }
    }
  }
`;
