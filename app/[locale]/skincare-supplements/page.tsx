"use client";

import { fetchCollectionProducts } from "@/components/cart/actions";
import { Grid } from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";

import { StructuredData } from "@/components/structured-data";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function SkincareSupplementsPage() {
  const params = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = useTranslations('collection');
  const tHero = useTranslations('hero');
  // Ensure locale always has a value (never undefined) to maintain stable dependency array size
  const locale = (params.locale as "en" | "ar") || "en";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("[v0] Fetching skincare supplements products...");
        
        // Parse locale for Shopify API
        const localeForApi = locale === 'ar' 
          ? { language: 'AR', country: 'AE' }
          : { language: 'EN', country: 'AE' };
          
        const result = await fetchCollectionProducts(
          "amazing-thai-products",
          undefined,
          undefined,
          localeForApi
        );
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch products");
        }
        const fetchedProducts = result.products;
        console.log("[v0] Fetched products:", fetchedProducts?.length || 0);
        setProducts(fetchedProducts || []);
      } catch (error) {
        console.error("[v0] Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [locale]);

  return (
    <>
      <StructuredData
        type="CollectionPage"
        data={{
          name: "Skincare & Supplements",
          description:
            "Premium skincare products and health supplements from Thailand",
          url: "https://atpgroupservices.com/skincare-supplements",
        }}
      />

      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-blue-50 to-teal-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/skincare-hero-banner.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-atp-black/70 via-atp-black/30 to-atp-black/50"></div>

        <motion.div
          className="relative z-10 container-premium text-center text-atp-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 tracking-tight drop-shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.2 }}
            >
              {tHero('beautyCare')} {locale === 'ar' ? 'و' : '&'}<br />
              <span className="text-atp-gold drop-shadow-lg">{tHero('naturalSupplements')}</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-atp-white/95 mb-10 max-w-3xl mx-auto leading-relaxed drop-shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              {tHero('premiumThaiWellness')}
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.6 }}
            >
              <button className="btn-atp-gold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all">{t('exploreCollection')}</button>
              <button className="btn-premium-outline text-atp-white border-atp-white hover:bg-atp-white hover:text-atp-black shadow-xl backdrop-blur-sm bg-atp-white/10">
                {t('learnMore')}
              </button>
            </motion.div>
          </motion.div>        <div className="absolute top-20 left-10 w-2 h-2 bg-atp-gold rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-3 h-3 bg-atp-gold/60 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-20 w-1 h-1 bg-atp-white/40 rounded-full animate-pulse delay-500"></div>
      </section>

      <section className="section-padding bg-atp-white">
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
                {loading ? "..." : t('productCount', { count: products?.length || 0 })}
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

      <section className="section-padding bg-atp-off-white">
        <div className="container-premium">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-atp-black mb-6">
              {t('ourPremiumCollection')}
            </h2>
            <div className="w-24 h-1 bg-atp-gold mx-auto mb-6"></div>
            <p className="text-lg text-atp-charcoal max-w-2xl mx-auto">
              {t('discoverCuratedSelection')}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-atp-gold"></div>
            </div>
          ) : (
            <Grid variant="luxury">
              <ProductGridItems products={products || []} locale={locale} />
            </Grid>
          )}
        </div>
      </section>
    </>
  );
}
