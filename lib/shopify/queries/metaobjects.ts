/**
 * Metaobjects Queries
 * 
 * These queries retrieve dynamic content from Shopify Metaobjects,
 * useful for ATP membership tiers, custom banners, FAQs, etc.
 */

export const getMetaobjectQuery = /* GraphQL */ `
  query getMetaobject($handle: String!, $type: String!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    metaobject(handle: { handle: $handle, type: $type }) {
      id
      handle
      type
      fields {
        key
        value
        type
        reference {
          ... on MediaImage {
            id
            image {
              url
              altText
              width
              height
            }
          }
          ... on Product {
            id
            handle
            title
          }
          ... on Collection {
            id
            handle
            title
          }
        }
        references(first: 10) {
          edges {
            node {
              ... on MediaImage {
                id
                image {
                  url
                  altText
                }
              }
              ... on Product {
                id
                handle
                title
              }
            }
          }
        }
      }
    }
  }
`;

export const getMetaobjectsQuery = /* GraphQL */ `
  query getMetaobjects($type: String!, $first: Int = 10, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    metaobjects(type: $type, first: $first) {
      edges {
        node {
          id
          handle
          type
          fields {
            key
            value
            type
          }
        }
      }
    }
  }
`;

export const getATPMembershipTiersQuery = /* GraphQL */ `
  query getATPMembershipTiers($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    metaobjects(type: "atp_membership_tier", first: 10) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            type
          }
          # Expected fields:
          # - name: Tier name (Bronze, Silver, Gold)
          # - discount_percentage: Discount amount
          # - free_delivery: Boolean
          # - priority_support: Boolean
          # - exclusive_access: Boolean
          # - annual_fee: Price
          # - description: Text
          # - description_ar: Arabic description
          # - benefits: List of benefits
          # - icon: Image reference
        }
      }
    }
  }
`;

export const getHomepageBannersQuery = /* GraphQL */ `
  query getHomepageBanners($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    metaobjects(type: "homepage_banner", first: 10) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            type
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                }
              }
              ... on Collection {
                id
                handle
                title
              }
            }
          }
          # Expected fields:
          # - title: Banner title
          # - title_ar: Arabic title
          # - description: Banner text
          # - description_ar: Arabic text
          # - image: Image reference
          # - link: URL or collection reference
          # - cta_text: Call to action button text
          # - cta_text_ar: Arabic CTA
          # - active: Boolean
          # - position: Number for ordering
        }
      }
    }
  }
`;

export const getFAQsQuery = /* GraphQL */ `
  query getFAQs($language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    metaobjects(type: "faq", first: 50) {
      edges {
        node {
          id
          handle
          fields {
            key
            value
            type
          }
          # Expected fields:
          # - question: Question text
          # - question_ar: Arabic question
          # - answer: Answer text
          # - answer_ar: Arabic answer
          # - category: FAQ category
          # - position: Number for ordering
          # - featured: Boolean
        }
      }
    }
  }
`;
