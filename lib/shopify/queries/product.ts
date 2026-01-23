import productFragment from '../fragments/product';

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts($sortKey: ProductSortKeys, $reverse: Boolean, $query: String, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    products(sortKey: $sortKey, reverse: $reverse, query: $query, first: 100) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;
