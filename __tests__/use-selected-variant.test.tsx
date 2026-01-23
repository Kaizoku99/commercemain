import { renderHook } from '@testing-library/react';
import { useSelectedVariant } from '@/hooks/use-selected-variant';
import { ProductProvider } from '@/components/product/product-context';
import type { Product, ProductVariant } from '@/lib/shopify/types';

// Mock product data
const mockProduct: Product = {
    id: 'test-product',
    handle: 'test-product',
    title: 'Test Product',
    description: 'Test description',
    descriptionHtml: '<p>Test description</p>',
    availableForSale: true,
    priceRange: {
        minVariantPrice: { amount: '10.00', currencyCode: 'AED' },
        maxVariantPrice: { amount: '20.00', currencyCode: 'AED' },
    },
    variants: [
        {
            id: 'variant-1',
            title: 'Small',
            availableForSale: true,
            selectedOptions: [{ name: 'Size', value: 'Small' }],
            price: { amount: '10.00', currencyCode: 'AED' },
        },
        {
            id: 'variant-2',
            title: 'Large',
            availableForSale: true,
            selectedOptions: [{ name: 'Size', value: 'Large' }],
            price: { amount: '20.00', currencyCode: 'AED' },
        },
    ],
    options: [
        {
            id: 'option-1',
            name: 'Size',
            values: ['Small', 'Large'],
        },
    ],
    images: [],
    tags: [],
    seo: { title: '', description: '' },
    createdAt: '',
    updatedAt: '',
};

describe('useSelectedVariant', () => {
    it('should return the first variant when no selection is made', () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ProductProvider>{children}</ProductProvider>
        );

        const { result } = renderHook(() => useSelectedVariant(mockProduct), { wrapper });

        expect(result.current.selectedVariant?.id).toBe('variant-1');
        expect(result.current.price.amount).toBe('10.00');
    });

    it('should return the correct variant when a selection is made', () => {
        // Mock URL search params to simulate a selection
        const mockSearchParams = new URLSearchParams('size=Large');
        Object.defineProperty(window, 'location', {
            value: { search: '?size=Large' },
            writable: true,
        });

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ProductProvider>{children}</ProductProvider>
        );

        const { result } = renderHook(() => useSelectedVariant(mockProduct), { wrapper });

        expect(result.current.selectedVariant?.id).toBe('variant-2');
        expect(result.current.price.amount).toBe('20.00');
    });

    it('should handle single variant products correctly', () => {
        const singleVariantProduct: Product = {
            ...mockProduct,
            variants: [mockProduct.variants[0]],
            options: [],
        };

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <ProductProvider>{children}</ProductProvider>
        );

        const { result } = renderHook(() => useSelectedVariant(singleVariantProduct), { wrapper });

        expect(result.current.selectedVariant?.id).toBe('variant-1');
        expect(result.current.price.amount).toBe('10.00');
    });
});
