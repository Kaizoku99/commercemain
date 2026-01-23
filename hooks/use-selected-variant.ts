import { useProduct } from "@/components/product/product-context";
import type { Product, ProductVariant } from "@/lib/shopify/types";

export function useSelectedVariant(product: Product) {
    const { variants } = product;
    const { state } = useProduct();

    // Find the variant that matches the current selection state
    const selectedVariant = variants.find((variant: ProductVariant) =>
        variant.selectedOptions.every(
            (option) => option.value === state[option.name.toLowerCase()]
        )
    );

    // Fallback to first available variant if no selection matches
    const fallbackVariant = selectedVariant || variants.find(v => v.availableForSale) || variants[0];

    return {
        selectedVariant: fallbackVariant,
        selectedVariantId: fallbackVariant?.id,
        price: fallbackVariant?.price || product.priceRange.minVariantPrice,
        availableForSale: fallbackVariant?.availableForSale ?? product.availableForSale,
    };
}
