import cartFragment from '../fragments/cart';

export const getCartQuery = /* GraphQL */ `
  query getCart($cartId: ID!, $language: LanguageCode, $country: CountryCode) @inContext(language: $language, country: $country) {
    cart(id: $cartId) {
      ...cart
    }
  }
  ${cartFragment}
`;
