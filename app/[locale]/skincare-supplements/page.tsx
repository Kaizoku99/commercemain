"use client";

import { fetchCollectionProducts } from "@/components/cart/actions";
import { Grid } from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import CollectionHero from "@/components/collection/collection-hero";
import CollectionStats from "@/components/collection/collection-stats";
import { CollectionPageSkeleton } from "@/components/product/product-card-skeleton";
import { StructuredData } from "@/components/structured-data";
import { m, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { staggerSlow, fadeInUp, getAccessibleVariants, defaultViewport } from "@/lib/animations";

export default function SkincareSupplementsPage() {
  const params = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  
  const t = useTranslations('collection');
  const tHero = useTranslations('hero');
  // Ensure locale always has a value (never undefined) to maintain stable dependency array size
  const locale = (params.locale as "en" | "ar") || "en";
  const isRTL = locale === 'ar';

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

  // Prepare stats data
  const stats = [
    { 
      value: products?.length || 0, 
      suffix: "+", 
      label: t('premiumProducts') 
    },
    { 
      value: 100, 
      suffix: "%", 
      label: t('naturalIngredients') 
    },
    { 
      value: 98, 
      suffix: "%", 
      label: t('customerSatisfaction') || "Satisfaction" 
    },
    { 
      value: 10, 
      suffix: "K+", 
      label: t('happyCustomers') || "Happy Customers" 
    },
  ];

  // Hero image configuration with art direction
  const heroImage = {
    src: "/skincare-hero-banner.jpg",
    alt: isRTL 
      ? "العناية بالبشرة والمكملات الغذائية الفاخرة" 
      : "Premium Skincare & Supplements",
    mobileSrc: "/skincare-hero-banner.jpg",
  };

  if (loading) {
    return (
      <>
        <StructuredData
          type="CollectionPage"
          data={{
            name: "Skincare & Supplements",
            description: "Premium skincare products and health supplements from Thailand",
            url: "https://atpgroupservices.com/skincare-supplements",
          }}
        />
        <CollectionPageSkeleton isRTL={isRTL} />
      </>
    );
  }

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

      {/* Collection Hero */}
      <CollectionHero
        title={isRTL ? "العناية بالبشرة والمكملات" : "Skincare & Supplements"}
        subtitle={isRTL ? "منتجات تايلاندية أصلية" : "Authentic Thai Products"}
        description={
          isRTL
            ? "اكتشف مجموعتنا الفاخرة من منتجات العناية بالبشرة والمكملات الغذائية الطبيعية"
            : "Discover our premium collection of natural skincare products and health supplements from Thailand"
        }
        image={heroImage}
        isRTL={isRTL}
      />

      {/* Stats Section */}
      <CollectionStats stats={stats} isRTL={isRTL} />

      {/* Products Section */}
      <section className="bg-atp-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerSlow}
            className="text-center mb-12 md:mb-16"
          >
            <m.h2 
              className="font-display text-heading md:text-display text-atp-black mb-4"
              variants={getAccessibleVariants(fadeInUp, shouldReduceMotion)}
            >
              {t('ourPremiumCollection')}
            </m.h2>
            <m.div 
              className="w-24 h-1 bg-atp-gold mx-auto mb-4"
              variants={getAccessibleVariants(fadeInUp, shouldReduceMotion)}
            />
            <m.p 
              className="text-body-lg text-atp-charcoal max-w-2xl mx-auto"
              variants={getAccessibleVariants(fadeInUp, shouldReduceMotion)}
            >
              {t('discoverCuratedSelection')}
            </m.p>
          </m.div>

          {/* Products Grid - Mobile-first single column */}
          {products.length === 0 ? (
            <p className="py-12 text-lg text-center text-atp-charcoal">
              {t('noProductsFound')}
            </p>
          ) : (
            <Grid variant="collection" mobileColumns={1} isRTL={isRTL}>
              <ProductGridItems products={products || []} locale={locale} />
            </Grid>
          )}
        </div>
      </section>
    </>
  );
}
