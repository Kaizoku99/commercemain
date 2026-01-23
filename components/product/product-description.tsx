import { AddToCart } from "@/components/cart/add-to-cart";
import Price from "@/components/price";
import Prose from "@/components/prose";
import type { Product } from "@/lib/shopify/types";
import { VariantSelector } from "./variant-selector";
import { QuantitySelector, QuantityProvider } from "./quantity-selector";
import { useSelectedVariant } from "@/hooks/use-selected-variant";

export function ProductDescription({ product }: { product: Product }) {
  const { price } = useSelectedVariant(product);

  return (
    <QuantityProvider>
      <div className="mb-6 flex flex-col border-b pb-6 dark:border-neutral-700">
        <h1 className="mb-4 text-5xl font-medium">{product.title}</h1>
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <Price
              amount={price.amount}
              currencyCode={price.currencyCode}
              className="text-4xl font-bold text-gray-900 dark:text-white"
            />
            {product.priceRange.minVariantPrice.amount !==
              product.priceRange.maxVariantPrice.amount && (
              <>
                <span className="text-xl text-gray-500">-</span>
                <Price
                  amount={product.priceRange.minVariantPrice.amount}
                  currencyCode={product.priceRange.minVariantPrice.currencyCode}
                  className="text-4xl font-bold text-gray-900 dark:text-white"
                />
              </>
            )}
          </div>
        </div>
      </div>
      {/* Variant Selector (only show if there are actual variants with options) */}
      {product.options.length > 0 &&
        product.options.some((option) => option.values.length > 1) && (
          <div className="mb-6">
            <VariantSelector
              options={product.options}
              variants={product.variants}
            />
          </div>
        )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <QuantitySelector productId={product.id} />
      </div>

      {/* Add to Cart Button */}
      <div className="mb-8">
        <AddToCart product={product} />
      </div>

      {/* Product Description */}
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
    </QuantityProvider>
  );
}
