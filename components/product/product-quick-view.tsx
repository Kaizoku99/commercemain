"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Eye, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Price from "@/components/price";
import { addToCartOptimistic } from "@/components/cart/actions";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface ProductQuickViewProps {
    product: Product;
    children: React.ReactNode;
}

export function ProductQuickView({ product, children }: ProductQuickViewProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const t = useTranslations("quickView");
    const params = useParams();
    const locale = (params?.locale as string) || "en";

    const selectedVariant = product.variants[selectedVariantIndex];

    const handleAddToCart = async () => {
        if (!selectedVariant?.id) return;

        setIsPending(true);
        try {
            const result = await addToCartOptimistic(selectedVariant.id, 1);
            if (result.success) {
                setIsOpen(false);
            }
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>

            <AnimatePresence>
                {isOpen && (
                    <Dialog.Portal forceMount>
                        <Dialog.Overlay asChild>
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                            />
                        </Dialog.Overlay>

                        <Dialog.Content asChild>
                            <m.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className={cn(
                                    "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
                                    "w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto",
                                    "bg-white dark:bg-atp-charcoal rounded-2xl shadow-xl",
                                    "focus:outline-none"
                                )}
                            >
                                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                    {/* Close Button */}
                                    <Dialog.Close asChild>
                                        <button
                                            className={cn(
                                                "absolute top-4 right-4 z-10",
                                                "w-8 h-8 flex items-center justify-center",
                                                "rounded-full bg-gray-100 dark:bg-gray-700",
                                                "hover:bg-gray-200 dark:hover:bg-gray-600",
                                                "transition-colors"
                                            )}
                                            aria-label={t("close")}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </Dialog.Close>

                                    {/* Product Image */}
                                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        {product.featuredImage ? (
                                            <Image
                                                src={product.featuredImage.url}
                                                alt={product.featuredImage.altText || product.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 95vw, 400px"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                {t("noImage")}
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex flex-col">
                                        <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {product.title}
                                        </Dialog.Title>

                                        {/* Price */}
                                        <div className="mb-4">
                                            <Price
                                                amount={selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount}
                                                currencyCode={selectedVariant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode}
                                                className="text-2xl font-bold text-atp-gold"
                                            />
                                        </div>

                                        {/* Variant Selector (simplified) */}
                                        {product.variants.length > 1 && (
                                            <div className="mb-4">
                                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                    {t("selectOption")}
                                                </label>
                                                <div className="flex flex-wrap gap-2">
                                                    {product.variants.map((variant, index) => (
                                                        <button
                                                            key={variant.id}
                                                            onClick={() => setSelectedVariantIndex(index)}
                                                            disabled={!variant.availableForSale}
                                                            className={cn(
                                                                "px-3 py-1.5 text-sm rounded-lg border transition-colors",
                                                                selectedVariantIndex === index
                                                                    ? "border-atp-gold bg-atp-gold/10 text-atp-gold"
                                                                    : "border-gray-300 dark:border-gray-600 hover:border-atp-gold",
                                                                !variant.availableForSale && "opacity-50 cursor-not-allowed line-through"
                                                            )}
                                                        >
                                                            {variant.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Description (truncated) */}
                                        {product.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                                                {product.description}
                                            </p>
                                        )}

                                        {/* Actions */}
                                        <div className="mt-auto flex flex-col gap-3">
                                            <Button
                                                onClick={handleAddToCart}
                                                disabled={isPending || !selectedVariant?.availableForSale}
                                                className="w-full bg-atp-gold hover:bg-atp-gold/90 text-atp-black font-semibold"
                                            >
                                                {isPending ? (
                                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                ) : (
                                                    <ShoppingCart className="w-4 h-4 mr-2" />
                                                )}
                                                {isPending ? t("adding") : t("addToCart")}
                                            </Button>

                                            <Link
                                                href={`/${locale}/product/${product.handle}`}
                                                className="w-full"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <Button variant="outline" className="w-full">
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    {t("viewDetails")}
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        </Dialog.Content>
                    </Dialog.Portal>
                )}
            </AnimatePresence>
        </Dialog.Root>
    );
}

export default ProductQuickView;
