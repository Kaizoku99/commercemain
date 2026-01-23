// Simple, reliable payment method configuration
// Using Simple Icons CDN for high-quality brand logos

export interface PaymentMethodConfig {
    name: string;
    type: 'card' | 'digital_wallet' | 'local_payment';
    logo: string;
    enabled: boolean;
    region?: 'all' | 'en' | 'ar'; // Optional: restrict to specific locale
}

// Map from Shopify Payment Enum to our Config Name/Logo
const BRAND_MAPPING: Record<string, Partial<PaymentMethodConfig>> = {
    'VISA': { name: 'Visa', logo: 'https://cdn.simpleicons.org/visa', type: 'card' },
    'MASTERCARD': { name: 'Mastercard', logo: 'https://cdn.simpleicons.org/mastercard', type: 'card' },
    'AMERICAN_EXPRESS': { name: 'American Express', logo: 'https://cdn.simpleicons.org/americanexpress', type: 'card' },
    'DINERS_CLUB': { name: 'Diners Club', logo: 'https://cdn.simpleicons.org/dinersclub', type: 'card' },
    'DISCOVER': { name: 'Discover', logo: 'https://cdn.simpleicons.org/discover', type: 'card' },
    'JCB': { name: 'JCB', logo: 'https://cdn.simpleicons.org/jcb', type: 'card' },
    'UNIONPAY': { name: 'UnionPay', logo: 'https://cdn.simpleicons.org/unionpay', type: 'card' },
    'MAESTRO': { name: 'Maestro', logo: 'https://cdn.simpleicons.org/maestro', type: 'card' },
    // Wallets
    'APPLE_PAY': { name: 'Apple Pay', logo: 'https://cdn.simpleicons.org/applepay', type: 'digital_wallet' },
    'GOOGLE_PAY': { name: 'Google Pay', logo: 'https://cdn.simpleicons.org/googlepay', type: 'digital_wallet' },
    'PAYPAL': { name: 'PayPal', logo: 'https://cdn.simpleicons.org/paypal', type: 'digital_wallet' },
    'SHOPIFY_PAY': { name: 'Shop Pay', logo: 'https://cdn.simpleicons.org/shopify', type: 'digital_wallet' },
};

// Original static list (kept for fallback)
export const STORE_PAYMENT_METHODS: PaymentMethodConfig[] = [
    // Mada - Saudi payment network (for Arabic locale)
    {
        name: 'Mada',
        type: 'card',
        logo: 'https://cdn.simpleicons.org/mada',
        enabled: true,
        region: 'ar',
    },
    // Mastercard - Official brand colors
    {
        name: 'Mastercard',
        type: 'card',
        logo: 'https://cdn.simpleicons.org/mastercard',
        enabled: true,
        region: 'all',
    },
    // American Express - Blue
    {
        name: 'American Express',
        type: 'card',
        logo: 'https://cdn.simpleicons.org/americanexpress',
        enabled: true,
        region: 'all',
    },
    // Apple Pay - White for dark backgrounds
    {
        name: 'Apple Pay',
        type: 'digital_wallet',
        logo: 'https://cdn.simpleicons.org/applepay',
        enabled: true,
        region: 'all',
    },
    // Visa - Blue
    {
        name: 'Visa',
        type: 'card',
        logo: 'https://cdn.simpleicons.org/visa',
        enabled: true,
        region: 'all',
    },
    // Tabby - Teal/mint green
    {
        name: 'Tabby',
        type: 'local_payment',
        logo: 'https://cdn.simpleicons.org/tabby',
        enabled: true,
        region: 'all',
    },
    // Tamara - Green
    {
        name: 'Tamara',
        type: 'local_payment',
        logo: 'https://cdn.simpleicons.org/tamara',
        enabled: true,
        region: 'all',
    },
    // Diners Club (English only)
    {
        name: 'Diners Club',
        type: 'card',
        logo: 'https://cdn.simpleicons.org/dinersclub',
        enabled: true,
        region: 'en',
    },
    // Discover (English only)
    {
        name: 'Discover',
        type: 'card',
        logo: 'https://cdn.simpleicons.org/discover',
        enabled: true,
        region: 'en',
    },
    // Google Pay (English only)
    {
        name: 'Google Pay',
        type: 'digital_wallet',
        logo: 'https://cdn.simpleicons.org/googlepay',
        enabled: true,
        region: 'en',
    },
    // JCB (English only)
    {
        name: 'JCB',
        type: 'card',
        logo: 'https://cdn.simpleicons.org/jcb',
        enabled: true,
        region: 'en',
    },
];

// Helper function to get payment methods by locale
export function getPaymentMethodsByLocale(locale: string): PaymentMethodConfig[] {
    return STORE_PAYMENT_METHODS.filter(method => {
        if (!method.region || method.region === 'all') return true;
        return method.region === locale;
    });
}

export function mapShopifyPaymentToConfig(
    brandOrWallet: string,
    type: 'card' | 'digital_wallet'
): PaymentMethodConfig | null {
    const mapping = BRAND_MAPPING[brandOrWallet.toUpperCase()];
    if (!mapping) return null;

    return {
        name: mapping.name!,
        logo: mapping.logo!,
        type: type,
        enabled: true,
        region: 'all', // Default to all, logic can be refined
        ...mapping
    } as PaymentMethodConfig;
}
