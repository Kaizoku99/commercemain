import { AtpMembership, MembershipStats } from '../../lib/types/membership';

export const mockMembership: AtpMembership = {
  id: 'mem_test_123456',
  customerId: 'cust_test_789012',
  status: 'active',
  startDate: new Date().toISOString(),
  expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
  subscriptionId: 'sub_test_345678',
  paymentStatus: 'paid',
  benefits: {
    serviceDiscount: 0.15,
    freeDelivery: true,
    eligibleServices: ['massage', 'ems', 'yoga', 'supplements']
  }
};

export const mockExpiredMembership: AtpMembership = {
  id: 'mem_test_expired',
  customerId: 'cust_test_expired',
  status: 'expired',
  startDate: '2023-01-01T00:00:00Z',
  expirationDate: '2024-01-01T00:00:00Z',
  subscriptionId: 'sub_test_expired',
  paymentStatus: 'paid',
  benefits: {
    serviceDiscount: 0.15,
    freeDelivery: true,
    eligibleServices: ['massage', 'ems', 'yoga', 'supplements']
  }
};

export const mockCancelledMembership: AtpMembership = {
  id: 'mem_test_cancelled',
  customerId: 'cust_test_cancelled',
  status: 'cancelled',
  startDate: '2024-01-01T00:00:00Z',
  expirationDate: '2025-01-01T00:00:00Z',
  subscriptionId: 'sub_test_cancelled',
  paymentStatus: 'paid',
  benefits: {
    serviceDiscount: 0.15,
    freeDelivery: true,
    eligibleServices: ['massage', 'ems', 'yoga', 'supplements']
  }
};

export const mockMembershipStats: MembershipStats = {
  totalSavings: 450.75,
  servicesUsed: 12,
  ordersWithFreeDelivery: 8,
  memberSince: '2024-01-01T00:00:00Z'
};

export const mockCustomer = {
  id: 'gid://shopify/Customer/789012',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  phone: '+971501234567',
  acceptsMarketing: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
  metafields: {
    edges: [
      {
        node: {
          id: 'gid://shopify/Metafield/123456',
          namespace: 'atp',
          key: 'membership_status',
          value: 'active',
          type: 'single_line_text_field'
        }
      },
      {
        node: {
          id: 'gid://shopify/Metafield/123457',
          namespace: 'atp',
          key: 'membership_start_date',
          value: '2024-01-01T00:00:00Z',
          type: 'date_time'
        }
      },
      {
        node: {
          id: 'gid://shopify/Metafield/123458',
          namespace: 'atp',
          key: 'membership_expiration_date',
          value: '2025-01-01T00:00:00Z',
          type: 'date_time'
        }
      }
    ]
  }
};

export const mockProducts = [
  {
    id: 'product_massage',
    title: 'Home Massage Service',
    price: 200,
    type: 'service' as const,
    category: 'massage'
  },
  {
    id: 'product_ems',
    title: 'EMS Training Session',
    price: 150,
    type: 'service' as const,
    category: 'ems'
  },
  {
    id: 'product_yoga',
    title: 'Home Yoga Session',
    price: 100,
    type: 'service' as const,
    category: 'yoga'
  },
  {
    id: 'product_supplements',
    title: 'Vitamin C Supplement',
    price: 50,
    type: 'product' as const,
    category: 'supplements'
  }
];

export const mockCartItems = [
  {
    id: 'cart_item_1',
    productId: 'product_massage',
    title: 'Home Massage Service',
    price: 200,
    quantity: 1,
    type: 'service' as const
  },
  {
    id: 'cart_item_2',
    productId: 'product_supplements',
    title: 'Vitamin C Supplement',
    price: 50,
    quantity: 2,
    type: 'product' as const
  }
];

export const mockCheckoutData = {
  id: 'gid://shopify/Checkout/test_checkout_123',
  webUrl: 'https://test-store.myshopify.com/checkout/test_checkout_123',
  totalPrice: {
    amount: '99.00',
    currencyCode: 'AED'
  },
  lineItems: {
    edges: [
      {
        node: {
          id: 'gid://shopify/CheckoutLineItem/1',
          title: 'ATP Membership - Annual',
          quantity: 1,
          variant: {
            id: 'gid://shopify/ProductVariant/membership_annual',
            price: {
              amount: '99.00',
              currencyCode: 'AED'
            }
          }
        }
      }
    ]
  }
};

export const mockApiResponses = {
  customerCreate: {
    customerCreate: {
      customer: mockCustomer,
      customerUserErrors: []
    }
  },
  customerUpdate: {
    customerUpdate: {
      customer: mockCustomer,
      customerUserErrors: []
    }
  },
  checkoutCreate: {
    checkoutCreate: {
      checkout: mockCheckoutData,
      checkoutUserErrors: []
    }
  },
  metafieldsSet: {
    metafieldsSet: {
      metafields: [
        {
          id: 'gid://shopify/Metafield/123456',
          namespace: 'atp',
          key: 'membership_status',
          value: 'active'
        }
      ],
      userErrors: []
    }
  }
};

export const mockErrorResponses = {
  customerNotFound: {
    errors: [
      {
        message: 'Customer not found',
        extensions: {
          code: 'CUSTOMER_NOT_FOUND'
        }
      }
    ]
  },
  paymentFailed: {
    errors: [
      {
        message: 'Payment processing failed',
        extensions: {
          code: 'PAYMENT_FAILED'
        }
      }
    ]
  },
  membershipExpired: {
    errors: [
      {
        message: 'Membership has expired',
        extensions: {
          code: 'MEMBERSHIP_EXPIRED'
        }
      }
    ]
  }
};