import { getShopPaymentSettingsQuery, getShopInfoQuery } from './queries/shop';
import { shopifyFetch } from './server';

export interface PaymentSettings {
    currencyCode: string;
    countryCode: string;
    enabledPresentmentCurrencies: string[];
    acceptedCardBrands: string[];
    supportedDigitalWallets: string[];
}

export interface ShopInfo {
    id: string;
    name: string;
    description: string;
    primaryDomain: {
        host: string;
        url: string;
    };
    currencyCode: string;
    paymentSettings: PaymentSettings;
}

export interface PaymentMethod {
    name: string;
    type: 'card' | 'digital_wallet' | 'local_payment';
    logo?: string;
    enabled: boolean;
}

// Map Shopify payment brands to payment method info using reliable CDN URLs
const PAYMENT_BRAND_MAP: Record<string, PaymentMethod> = {
    VISA: {
        name: 'Visa',
        type: 'card',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzE0MzQ4QyIvPgo8cGF0aCBkPSJNMTYuNzMgMTcuNEgxNC4yTDE2LjA3IDYuNkgxOC42TDE2LjczIDE3LjRaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMjQuMzggNy4wM0MyMy44NiA2LjggMjMuMDMgNi41NCAyMS44OSA2LjU0QzE5LjQ5IDYuNTQgMTcuNzUgNy44IDE3Ljc0IDkuNThDMTcuNzIgMTAuODQgMTkuMDMgMTEuNTIgMjAuMDEgMTEuOTNDMjEuMDEgMTIuMzUgMjEuMzUgMTIuNjMgMjEuMzUgMTMuMDFDMjEuMzQgMTMuNTggMjAuNjQgMTMuODQgMTkuOTggMTMuODRDMTguOTYgMTMuODQgMTguNDMgMTMuNTggMTcuNjcgMTMuMjJMMTcuMjMgMTMuMDFMMTYuNzYgMTUuNzlDMTcuNTcgMTYuMTkgMTkuMDYgMTYuNTUgMjAuNjEgMTYuNTdDMjMuMjMgMTYuNTcgMjQuOTMgMTUuMzMgMjQuOTUgMTMuNDlDMjQuOTYgMTIuNTYgMjQuMzggMTEuODQgMjMuMDUgMTEuMjJDMjIuMTkgMTAuODEgMjEuNjUgMTAuNTQgMjEuNjYgMTAuMTJDMjEuNjYgOS43NCAyMi4xMSA5LjM1IDIzLjA5IDkuMzVDMjMuODcgOS4zMyAyNC40NiA5LjUzIDI0Ljg5IDkuNzNMMjUuMTEgOS44M0wyNS41NiA3LjE4QzI1LjE1IDcuMDEgMjQuODEgNi44NiAyNC4zOCA3LjAzWiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTI5LjggMTEuNjlDMzAuMTMgMTAuODEgMzEuMjQgOC4wNyAzMS4yNCA4LjA3QzMxLjIyIDguMTMgMzEuNDQgNy41IDMxLjYgNy4wNEwzMS44MiA3LjkzQzMxLjgyIDcuOTMgMzIuNjYgMTEuMTMgMzIuODMgMTEuNjlIMjkuOFpNMzQuMzUgNi42SDMyLjQ4QzMxLjg1IDYuNiAzMS4zNyA2LjggMzEuMTEgNy40MkwyNy4zNCAxNy40SDI5Ljk2QzI5Ljk2IDE3LjQgMzAuNDYgMTYuMTEgMzAuNTcgMTUuODRIMzMuNzlDMzMuODcgMTYuMjEgMzQuMDQgMTcuNCAzNC4wNCAxNy40SDM2LjNMMzQuMzUgNi42WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTEzLjI5IDYuNkgxMC45QzEwLjI0IDYuNiA5Ljc4IDYuODMgOS41MyA3LjQ5TDUuOTQgMTcuNEg4LjU2TDkuMTQgMTUuODRIMTIuMzZMMTIuNTQgMTcuNEgxNC43NkwxMy4yOSA2LjZaTTEwLjAzIDEzLjY5TDExLjM3IDkuOTRMMTIuMDEgMTMuNjlIMTAuMDNaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K',
        enabled: true,
    },
    MASTERCARD: {
        name: 'Mastercard',
        type: 'card',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNTFBNSIvPgo8Y2lyY2xlIGN4PSIxNS41IiBjeT0iMTIiIHI9IjciIGZpbGw9IiNGRkZGRkYiLz4KPGNpcmNsZSBjeD0iMjQuNSIgY3k9IjEyIiByPSI3IiBmaWxsPSIjRkZGRkZGIi8+CjxwYXRoIGQ9Ik0xNS41IDVDMTguNTk4IDUgMjEuMjkyIDYuNzkgMjIuNzE3IDkuNUMyMS4yOTIgMTIuMjEgMTguNTk4IDE0IDE1LjUgMTRDMTIuNDAyIDE0IDkuNzA4IDEyLjIxIDguMjgzIDkuNUM5LjcwOCA2Ljc5IDEyLjQwMiA1IDE1LjUgNVoiIGZpbGw9IiNGRkY1RjAiLz4KPHBhdGggZD0iTTI0LjUgNUMyNy41OTggNSAzMC4yOTIgNi43OSAzMS43MTcgOS41QzMwLjI5MiAxMi4yMSAyNy41OTggMTQgMjQuNSAxNEMyMS40MDIgMTQgMTguNzA4IDEyLjIxIDE3LjI4MyA5LjVDMTguNzA4IDYuNzkgMjEuNDAyIDUgMjQuNSA1WiIgZmlsbD0iI0ZGNUYwMCIvPgo8L3N2Zz4K',
        enabled: true,
    },
    AMERICAN_EXPRESS: {
        name: 'American Express',
        type: 'card',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNjZCMiIvPgo8cGF0aCBkPSJNMTEuNSA5LjVIMTMuNUwxMi41IDcuNUwxMS41IDkuNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNiA5LjVIMTggTDE3IDcuNUwxNiA5LjVaIiBmaWxsPSJ3aGl0ZSIvPgo8dGV4dCB4PSI1IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjYiIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+QU1FWDwvdGV4dD4KPC9zdmc+',
        enabled: true,
    },
    DISCOVER: {
        name: 'Discover',
        type: 'card',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGNkMwMCIvPgo8dGV4dCB4PSI1IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjYiIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+RElTQ09WRVJMPC90ZXh0Pgo8L3N2Zz4=',
        enabled: true,
    },
    DINERS_CLUB: {
        name: 'Diners Club',
        type: 'card',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNjZCMiIvPgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjEyIiByPSI4IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+',
        enabled: true,
    },
    JCB: {
        name: 'JCB',
        type: 'card',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwNjZCMiIvPgo8dGV4dCB4PSIxMCIgeT0iMTYiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSI4IiBmaWxsPSJ3aGl0ZSIgZm9udC13ZWlnaHQ9ImJvbGQiPkpDQjwvdGV4dD4KPC9zdmc+',
        enabled: true,
    },
};

const DIGITAL_WALLET_MAP: Record<string, PaymentMethod> = {
    APPLE_PAY: {
        name: 'Apple Pay',
        type: 'digital_wallet',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwMDAwMCIvPgo8cGF0aCBkPSJNMTUuNSA5QzE2IDguNSAxNi41IDggMTcgOEMxNy41IDggMTggOC41IDE4IDlDMTggOS41IDE3LjUgMTAgMTcgMTBDMTYuNSAxMCAxNiA5LjUgMTUuNSA5WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE3IDEwQzE3LjUgMTAgMTggMTAuNSAxOCAxMUMxOCAxMS41IDE3LjUgMTIgMTcgMTJDMTYuNSAxMiAxNiAxMS41IDE2IDExQzE2IDEwLjUgMTYuNSAxMCAxNyAxMFoiIGZpbGw9IndoaXRlIi8+Cjx0ZXh0IHg9IjQiIHk9IjE4IiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iNSIgZmlsbD0id2hpdGUiIGZvbnQtd2VpZ2h0PSJib2xkIj5BcHBsZSBQYXk8L3RleHQ+Cjwvc3ZnPg==',
        enabled: true,
    },
    GOOGLE_PAY: {
        name: 'Google Pay',
        type: 'digital_wallet',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNMTUgOUMxNS41IDguNSAxNiA4IDE2LjUgOEMxNyA4IDE3LjUgOC41IDE3LjUgOUMxNy41IDkuNSAxNyAxMCAxNi41IDEwQzE2IDEwIDE1LjUgOS41IDE1IDlaIiBmaWxsPSIjNDI4NUY0Ii8+CjxwYXRoIGQ9Ik0xNi41IDEwQzE3IDEwIDE3LjUgMTAuNSAxNy41IDExQzE3LjUgMTEuNSAxNyAxMiAxNi41IDEyQzE2IDEyIDE1LjUgMTEuNSAxNS41IDExQzE1LjUgMTAuNSAxNiAxMCAxNi41IDEwWiIgZmlsbD0iIzM0QTg1MyIvPgo8cGF0aCBkPSJNMTYuNSAxMkMxNyAxMiAxNy41IDEyLjUgMTcuNSAxM0MxNy41IDEzLjUgMTcgMTQgMTYuNSAxNEMxNiAxNCAxNS41IDEzLjUgMTUuNSAxM0MxNS41IDEyLjUgMTYgMTIgMTYuNSAxMloiIGZpbGw9IiNGQkJDMDQiLz4KPHN2Zz4K',
        enabled: true,
    },
    PAYPAL: {
        name: 'PayPal',
        type: 'digital_wallet',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwMzA4NyIvPgo8dGV4dCB4PSI4IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjciIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+UGF5UGFsPC90ZXh0Pgo8L3N2Zz4K',
        enabled: true,
    },
    SHOP_PAY: {
        name: 'Shop Pay',
        type: 'digital_wallet',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzU4NDNBQiIvPgo8dGV4dCB4PSI3IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjYiIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+U2hvcCBQYXk8L3RleHQ+Cjwvc3ZnPg==',
        enabled: true,
    },
};

// Add local payment methods that are commonly available in UAE/MENA region
const LOCAL_PAYMENT_METHODS: PaymentMethod[] = [
    {
        name: 'Tabby',
        type: 'local_payment',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzNFQ0Y4RSIvPgo8dGV4dCB4PSI5IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjgiIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+dGFiYnk8L3RleHQ+Cjwvc3ZnPg==',
        enabled: true,
    },
    {
        name: 'Tamara',
        type: 'local_payment',
        logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0MCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI0IiByeD0iNCIgZmlsbD0iIzAwQzc0QSIvPgo8dGV4dCB4PSI3IiB5PSIxNiIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjciIGZpbGw9IndoaXRlIiBmb250LXdlaWdodD0iYm9sZCI+dGFtYXJhPC90ZXh0Pgo8L3N2Zz4K',
        enabled: true,
    },
];

export async function getShopPaymentSettings(): Promise<PaymentSettings | null> {
    try {
        const { body } = await shopifyFetch<{ shop: { paymentSettings: PaymentSettings } }>({
            query: getShopPaymentSettingsQuery,
        });

        if (!body?.shop?.paymentSettings) {
            console.warn('No payment settings returned from Shopify API');
            return null;
        }

        console.log('Shopify payment settings:', body.shop.paymentSettings);
        return body.shop.paymentSettings;
    } catch (error) {
        console.error('Error fetching payment settings:', error);
        return null;
    }
}

export async function getShopInfo(): Promise<ShopInfo | null> {
    try {
        const { body } = await shopifyFetch<{ shop: ShopInfo }>({
            query: getShopInfoQuery,
        });

        if (!body?.shop) {
            return null;
        }

        return body.shop;
    } catch (error) {
        console.error('Error fetching shop info:', error);
        return null;
    }
}

export async function getAvailablePaymentMethods(): Promise<PaymentMethod[]> {
    try {
        const paymentSettings = await getShopPaymentSettings();

        if (!paymentSettings) {
            // Fallback to match your store's exact 6 supported payment methods
            return [
                PAYMENT_BRAND_MAP.VISA!,
                PAYMENT_BRAND_MAP.MASTERCARD!,
                PAYMENT_BRAND_MAP.AMERICAN_EXPRESS!,
                DIGITAL_WALLET_MAP.APPLE_PAY!,
                LOCAL_PAYMENT_METHODS[0]!, // Tabby
                LOCAL_PAYMENT_METHODS[1]!, // Tamara
            ];
        }

        const availableMethods: PaymentMethod[] = [];

        // Add card brands
        paymentSettings.acceptedCardBrands.forEach(brand => {
            const method = PAYMENT_BRAND_MAP[brand];
            if (method) {
                availableMethods.push(method);
            }
        });

        // Add digital wallets
        paymentSettings.supportedDigitalWallets.forEach(wallet => {
            const method = DIGITAL_WALLET_MAP[wallet];
            if (method) {
                availableMethods.push(method);
            }
        });

        // Always add local payment methods for MENA region
        availableMethods.push(...LOCAL_PAYMENT_METHODS);

        return availableMethods;
    } catch (error) {
        console.error('Error getting payment methods:', error);

        // Return fallback payment methods
        return [
            PAYMENT_BRAND_MAP.VISA!,
            PAYMENT_BRAND_MAP.MASTERCARD!,
            PAYMENT_BRAND_MAP.AMERICAN_EXPRESS!,
            DIGITAL_WALLET_MAP.APPLE_PAY!,
            ...LOCAL_PAYMENT_METHODS,
        ];
    }
}

// Helper function to get payment method icons for specific brands
export function getPaymentMethodIcon(brand: string): string | null {
    const method = PAYMENT_BRAND_MAP[brand] || DIGITAL_WALLET_MAP[brand];
    return method?.logo || null;
}

// Helper function to format payment method name
export function formatPaymentMethodName(brand: string): string {
    const method = PAYMENT_BRAND_MAP[brand] || DIGITAL_WALLET_MAP[brand];
    return method?.name || brand.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}
