export const getMenuQuery = /* GraphQL */ `
  fragment MenuItemFields on MenuItem {
    id
    title
    url
    type
    tags
    resourceId
    resource {
      __typename
      ... on Collection {
        handle
        title
      }
      ... on Product {
        handle
        title
      }
      ... on Page {
        handle
        title
      }
      ... on Article {
        handle
        title
      }
      ... on Blog {
        handle
        title
      }
      ... on ShopPolicy {
        handle
        title
      }
      ... on Metaobject {
        handle
        type
      }
    }
  }

  query getMenu($handle: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    menu(handle: $handle) {
      handle
      title
      items {
        ...MenuItemFields
        items {
          ...MenuItemFields
          items {
            ...MenuItemFields
          }
        }
      }
    }
  }
`;
