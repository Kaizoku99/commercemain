import cartFragment from '../fragments/cart';

/**
 * Cart Mutations with Warnings Support
 * 
 * Updated for Shopify Storefront API 2024-10+
 * All cart mutations now include:
 * - userErrors: Mutation failures
 * - warnings: Automatic changes made (e.g., out of stock items)
 * 
 * @see https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/cart-warnings
 */

export const addToCartMutation = /* GraphQL */ `
  mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;

export const createCartMutation = /* GraphQL */ `
  mutation createCart($lineItems: [CartLineInput!], $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartCreate(input: { lines: $lineItems }) {
      cart {
        ...cart
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;

export const editCartItemsMutation = /* GraphQL */ `
  mutation editCartItems($cartId: ID!, $lines: [CartLineUpdateInput!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...cart
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;

export const removeFromCartMutation = /* GraphQL */ `
  mutation removeFromCart($cartId: ID!, $lineIds: [ID!]!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...cart
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;

export const updateCartBuyerIdentityMutation = /* GraphQL */ `
  mutation updateCartBuyerIdentity(
    $cartId: ID!
    $buyerIdentity: CartBuyerIdentityInput!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
      cart {
        ...cart
        buyerIdentity {
          email
          phone
          countryCode
          customer {
            id
            email
            displayName
          }
          deliveryAddressPreferences {
            ... on MailingAddress {
              address1
              address2
              city
              provinceCode
              countryCodeV2
              zip
            }
          }
        }
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;

/**
 * Discount Code Mutations
 * Added for complete cart functionality
 */
export const updateCartDiscountCodesMutation = /* GraphQL */ `
  mutation updateCartDiscountCodes(
    $cartId: ID!
    $discountCodes: [String!]!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        ...cart
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;

/**
 * Cart Note Update Mutation
 */
export const updateCartNoteMutation = /* GraphQL */ `
  mutation updateCartNote(
    $cartId: ID!
    $note: String!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    cartNoteUpdate(cartId: $cartId, note: $note) {
      cart {
        ...cart
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;

/**
 * Cart Attributes Update Mutation
 */
export const updateCartAttributesMutation = /* GraphQL */ `
  mutation updateCartAttributes(
    $cartId: ID!
    $attributes: [AttributeInput!]!
    $language: LanguageCode
    $country: CountryCode
  ) @inContext(language: $language, country: $country) {
    cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        ...cart
      }
      userErrors {
        code
        field
        message
      }
      warnings {
        code
        target
        message
      }
    }
  }
  ${cartFragment}
`;
