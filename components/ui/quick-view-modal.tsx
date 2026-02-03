'use client';

import { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { X, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { modalVariants, overlayVariants, transitions } from '@/lib/animations/variants';
import { useCart } from '@/components/cart/cart-context';
import type { Product, ProductVariant } from '@/lib/shopify/types';
import { getLocalizedProductTitle, getLocalizedProductHandle } from '@/lib/shopify/i18n-queries';

export interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Product quick view modal with cart integration
 * Uses Framer Motion AnimatePresence for smooth enter/exit
 */
export function QuickViewModal({
  product,
  isOpen,
  onClose,
  className,
}: QuickViewModalProps) {
  const t = useTranslations('quickViewModal');
  const locale = useLocale() as 'en' | 'ar';
  const shouldReduceMotion = useReducedMotion();
  const { addCartItem } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Detect RTL
  const [isRTL, setIsRTL] = useState(false);
  useEffect(() => {
    if (typeof document !== 'undefined') {
      setIsRTL(document.documentElement.dir === 'rtl');
    }
  }, []);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      const defaultVariant = product.variants?.find(v => v.availableForSale) || product.variants?.[0];
      setSelectedVariant(defaultVariant || null);
      setQuantity(1);
      setAddedSuccess(false);
      setCurrentImageIndex(0);
    }
  }, [product]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !selectedVariant) return;
    
    setIsAdding(true);
    try {
      await addCartItem(selectedVariant, product);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  }, [product, selectedVariant, addCartItem]);

  const formatPrice = useCallback((amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  }, []);

  const handleVariantChange = useCallback((optionName: string, value: string) => {
    if (!product) return;
    
    // Find variant matching the selected options
    const newVariant = product.variants?.find(variant => 
      variant.selectedOptions?.some(opt => 
        opt.name === optionName && opt.value === value
      )
    );
    
    if (newVariant) {
      setSelectedVariant(newVariant);
    }
  }, [product]);

  const images = product?.images || (product?.featuredImage ? [product.featuredImage] : []);

  // Get localized product title
  const localizedTitle = product ? getLocalizedProductTitle(product, locale) : '';

  if (!product) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay */}
          <m.div
            key="overlay"
            className="fixed inset-0 z-50 bg-atp-black/60 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <m.div
            key="modal"
            className={cn(
              'fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 z-50',
              'md:w-full md:max-w-4xl md:max-h-[85vh]',
              'md:-translate-x-1/2 md:-translate-y-1/2',
              'overflow-hidden rounded-2xl glass border border-white/10',
              'flex flex-col',
              className
            )}
            variants={shouldReduceMotion ? {} : modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={cn(
                'absolute top-4 z-10 p-2 rounded-full glass hover:bg-white/20 transition-colors',
                isRTL ? 'left-4' : 'right-4'
              )}
              aria-label={t('close')}
            >
              <X className="w-5 h-5 text-atp-white" />
            </button>

            <div className={cn(
              'flex flex-col md:flex-row h-full overflow-y-auto',
              isRTL && 'md:flex-row-reverse'
            )}>
              {/* Image gallery */}
              <div className="relative w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[400px] flex-shrink-0 bg-atp-charcoal/50">
                {images.length > 0 && (
                  <>
                    <Image
                      src={images[currentImageIndex]?.url || '/placeholder.svg'}
                      alt={images[currentImageIndex]?.altText || localizedTitle}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    {/* Image navigation */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex(i => i === 0 ? images.length - 1 : i - 1)}
                          className={cn(
                            'absolute top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-white/20 transition-colors',
                            isRTL ? 'right-2' : 'left-2'
                          )}
                        >
                          <ChevronLeft className="w-5 h-5 text-atp-white" />
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex(i => i === images.length - 1 ? 0 : i + 1)}
                          className={cn(
                            'absolute top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-white/20 transition-colors',
                            isRTL ? 'left-2' : 'right-2'
                          )}
                        >
                          <ChevronRight className="w-5 h-5 text-atp-white" />
                        </button>
                      </>
                    )}

                    {/* Thumbnails */}
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={cn(
                              'w-2 h-2 rounded-full transition-colors',
                              currentImageIndex === idx
                                ? 'bg-atp-gold'
                                : 'bg-white/40 hover:bg-white/60'
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Product info */}
              <div className="flex flex-col w-full md:w-1/2 p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-serif text-atp-white mb-4">
                  {localizedTitle}
                </h2>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-xl font-semibold text-atp-gold">
                    {selectedVariant?.price
                      ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
                      : formatPrice(
                          product.priceRange?.minVariantPrice?.amount || '0',
                          product.priceRange?.minVariantPrice?.currencyCode || 'AED'
                        )}
                  </span>
                </div>

                {/* Variant selection */}
                {product.options && product.options.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {product.options.map((option) => (
                      <div key={option.id}>
                        <label className="block text-sm font-medium text-atp-white/80 mb-2">
                          {t('selectOption', { option: option.name })}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {option.values.map((value) => {
                            const isSelected = selectedVariant?.selectedOptions?.some(
                              opt => opt.name === option.name && opt.value === value
                            );
                            return (
                              <button
                                key={value}
                                onClick={() => handleVariantChange(option.name, value)}
                                className={cn(
                                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors border',
                                  isSelected
                                    ? 'bg-atp-gold text-atp-black border-atp-gold'
                                    : 'glass text-atp-white border-white/20 hover:border-atp-gold/50'
                                )}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-atp-white/80 mb-2">
                    {t('quantity')}
                  </label>
                  <div className="inline-flex items-center glass rounded-lg border border-white/20">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 hover:bg-white/10 transition-colors rounded-l-lg"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4 text-atp-white" />
                    </button>
                    <span className="px-6 py-3 text-atp-white font-medium min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 hover:bg-white/10 transition-colors rounded-r-lg"
                    >
                      <Plus className="w-4 h-4 text-atp-white" />
                    </button>
                  </div>
                </div>

                {/* Add to cart */}
                <div className="mt-auto space-y-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || !selectedVariant?.availableForSale}
                    className={cn(
                      'w-full py-4 rounded-xl font-semibold text-lg transition-all',
                      'bg-atp-gold text-atp-black hover:shadow-gold-lg',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      addedSuccess && 'bg-emerald-500 text-white'
                    )}
                  >
                    {isAdding
                      ? t('adding')
                      : addedSuccess
                      ? t('addedToCart')
                      : t('addToCart')}
                  </button>

                  <Link
                    href={`/${locale}/product/${getLocalizedProductHandle(product, locale)}`}
                    className="block w-full py-3 text-center rounded-xl font-medium text-atp-white glass border border-white/20 hover:border-atp-gold/50 transition-colors"
                    onClick={onClose}
                  >
                    {t('viewFullDetails')}
                  </Link>
                </div>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default QuickViewModal;
