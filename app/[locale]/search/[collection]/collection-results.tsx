"use client";

import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CollectionResultsProps {
  products: any[];
  collection: any;
  locale: "en" | "ar";
}

export default function CollectionResults({ 
  products, 
  collection, 
  locale 
}: CollectionResultsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('collection');
  const tProduct = useTranslations('product');
  
  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-12">
        <section className="bg-atp-white py-12">
          <div className="container-premium">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="h-12 bg-atp-light-gray rounded animate-pulse"></div>
                <div className="h-4 bg-atp-light-gray rounded w-24 mx-auto animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-atp-light-gray rounded animate-pulse"></div>
                <div className="h-4 bg-atp-light-gray rounded w-24 mx-auto animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-atp-light-gray rounded animate-pulse"></div>
                <div className="h-4 bg-atp-light-gray rounded w-24 mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-atp-off-white py-16">
          <div className="container-premium">
            <div className="text-center mb-16">
              <div className="h-12 bg-atp-light-gray rounded w-96 mx-auto mb-6 animate-pulse"></div>
              <div className="h-1 bg-atp-light-gray rounded w-24 mx-auto mb-6 animate-pulse"></div>
              <div className="h-6 bg-atp-light-gray rounded w-96 mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-atp-white rounded-lg shadow-sm border border-atp-light-gray p-4 animate-pulse"
                >
                  <div className="aspect-square bg-atp-light-gray rounded-md mb-4"></div>
                  <div className="h-4 bg-atp-light-gray rounded mb-2"></div>
                  <div className="h-4 bg-atp-light-gray rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Feature Highlights Section */}
      <section className="bg-atp-white py-12">
        <div className="container-premium">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-atp-black">
                {t('productCount', { count: products.length })}
              </h3>
              <p className="text-atp-charcoal uppercase tracking-wide text-sm">
                {t('premiumProducts')}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-atp-black">100%</h3>
              <p className="text-atp-charcoal uppercase tracking-wide text-sm">
                {t('naturalIngredients')}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl font-bold text-atp-gold">ATP</h3>
              <p className="text-atp-charcoal uppercase tracking-wide text-sm">
                {t('certifiedQuality')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Premium Collection Section */}
      <section className="bg-atp-off-white py-20">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-atp-black mb-6">
              {collection?.title || t('ourPremiumCollection')}
            </h2>
            <div className="w-24 h-1 bg-atp-gold mx-auto mb-6"></div>
            <p className="text-lg text-atp-charcoal max-w-2xl mx-auto">
              {collection?.description || t('discoverCuratedSelection')}
            </p>
          </motion.div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <p className="py-3 text-lg text-center">{t('noProductsFound')}</p>
          ) : (
            <Grid variant="luxury">
              <ProductGridItems
                products={products}
                locale={locale}
              />
            </Grid>
          )}
        </div>
      </section>
    </div>
  );
}
