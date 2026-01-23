"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { m } from "framer-motion";
import type { Product } from "@/lib/shopify/types";
import { type Locale } from "@/lib/i18n/config";
import { DirhamSymbol } from "@/components/icons/dirham-symbol";
import Price from "@/components/price";
import { getLocalizedProductHandle } from "@/lib/shopify/i18n-queries";

interface NewArrivalsCarouselProps {
  products: Product[];
  carouselProducts: Product[];
  locale: Locale;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5 },
  },
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7 },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7 },
  },
};

export function NewArrivalsCarousel({
  products,
  carouselProducts,
  locale,
}: NewArrivalsCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const categoryCards = [
    {
      name: locale === "ar" ? "عضوية ATP" : "ATP Membership",
      image: "/premium-membership-card.png",
      link: `/${locale}/atp-membership`,
      isATP: true, // Added ATP flag for gold styling
    },
    {
      name: locale === "ar" ? "العناية بالبشرة" : "Skincare",
      image: "/anti-aging-serum.png",
      link: `/${locale}/skincare-supplements`,
      isATP: false,
    },
    {
      name: locale === "ar" ? "المكملات الغذائية" : "Supplements",
      image: "/vitamin-c-supplement.png",
      link: `/${locale}/skincare-supplements`,
      isATP: false,
    },
    {
      name: locale === "ar" ? "تكنولوجيا المياه" : "Water Tech",
      image: "/alkamag-water-purifier.png",
      link: `/${locale}/water-soil-technology`,
      isATP: false,
    },
    {
      name: locale === "ar" ? "حلول التربة" : "Soil Solutions",
      image: "/alkamag-water-purifier.png",
      link: `/${locale}/water-soil-technology`,
      isATP: false,
    },
    {
      name: locale === "ar" ? "العافية" : "Wellness",
      image: "/acne-treatment-products.png",
      link: `/${locale}/atp-membership`,
      isATP: false,
    },
  ];

  const premiumProducts = [
    {
      name:
        locale === "ar"
          ? "باقة العافية النخبة + العضوية المتميزة"
          : "Elite Wellness + Premium Membership Bundle",
      image: "/premium-membership-card.png",
      rating: 5.0,
      price:
        locale === "ar" ? (
          <span className="flex items-center gap-1">
            من <DirhamSymbol size={14} /> 399.00
          </span>
        ) : (
          <span className="flex items-center gap-1">
            From <DirhamSymbol size={14} /> 399.00
          </span>
        ),
      link: `/${locale}/atp-membership`,
      isATP: true, // Added ATP flag for gold styling
    },
    {
      name:
        locale === "ar"
          ? "مجموعة العناية بالبشرة المتقدمة + المكملات"
          : "Advanced Skincare + Supplement Combo",
      image: "/anti-aging-serum.png",
      rating: 4.9,
      price:
        locale === "ar" ? (
          <span className="flex items-center gap-1">
            <DirhamSymbol size={14} /> 299.00
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <DirhamSymbol size={14} /> 299.00
          </span>
        ),
      link: `/${locale}/skincare-supplements`,
      isATP: false,
    },
    {
      name:
        locale === "ar"
          ? "باقة تكنولوجيا المياه والتربة"
          : "Water & Soil Technology Package",
      image: "/hero-water-tech.png",
      rating: 4.8,
      price:
        locale === "ar" ? (
          <span className="flex items-center gap-1">
            <DirhamSymbol size={14} /> 599.00
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <DirhamSymbol size={14} /> 599.00
          </span>
        ),
      link: `/${locale}/water-soil-technology`,
      isATP: false,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(products.length, 3));
    }, 4000);
    return () => clearInterval(timer);
  }, [products.length]);

  if (!products?.length) return null;

  const carouselProductsToShow = products.slice(0, 3);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-atp-black">
        <div className="absolute inset-0">
          <Image
            src="/images/chatimage.png"
            alt="Hero background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-atp-black/80 via-atp-black/60 to-atp-black/80" />
        </div>

        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 container-premium grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full px-4 sm:px-6 lg:px-8">
          <m.div
            className="space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <m.h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif italic text-atp-white leading-tight tracking-tight ${locale === "ar" ? "text-right font-arabic" : ""
                }`}
              variants={slideInLeft}
            >
              {locale === "ar" ? "منتجاتنا الجديدة" : "New Arrivals"}
            </m.h1>
            <m.p
              className={`text-base sm:text-lg md:text-xl lg:text-2xl text-atp-off-white leading-relaxed max-w-lg font-light tracking-wide ${locale === "ar" ? "text-right font-arabic" : ""
                }`}
              variants={slideInLeft}
            >
              {locale === "ar"
                ? "اكتشف العطور الجديدة المثالية لكل مناسبة!"
                : "Discover new scents perfect for any occasion!"}
            </m.p>
            <m.div variants={slideInLeft}>
              <Link href={`/${locale}/collections/new-arrivals`}>
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-atp-gold text-atp-black border-atp-gold font-semibold tracking-wider text-sm px-8 py-3 shadow-lg hover:bg-transparent hover:text-atp-gold hover:border-atp-gold transition-all duration-300"
                >
                  {locale === "ar" ? "تسوق الآن" : "SHOP NOW"}
                </Button>
              </Link>
            </m.div>
          </m.div>

          <m.div
            className="relative h-full flex items-center justify-center"
            initial="hidden"
            animate="visible"
            variants={slideInRight}
          >
            <div className="relative w-full max-w-lg">
              {carouselProductsToShow.map((product, index) => (
                <div
                  key={product.handle}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                    ? "opacity-100 transform translate-x-0 scale-100"
                    : index < currentSlide
                      ? "opacity-0 transform -translate-x-full scale-95"
                      : "opacity-0 transform translate-x-full scale-95"
                    }`}
                >
                  <div className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-6 h-full px-4 sm:px-0">
                    <div className="relative w-32 h-48 sm:w-40 sm:h-60 md:w-52 md:h-80 flex-shrink-0">
                      <Image
                        src={
                          product.featuredImage?.url ||
                          "/placeholder.svg?height=320&width=208&query=luxury perfume bottle" ||
                          "/placeholder.svg"
                        }
                        alt={product.title}
                        fill
                        className="object-contain filter drop-shadow-2xl"
                        sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 208px"
                      />
                    </div>

                    {product.images && product.images.length > 1 && (
                      <div className="relative w-28 h-40 sm:w-32 sm:h-48 md:w-44 md:h-72 opacity-90 flex-shrink-0 hidden sm:block">
                        <Image
                          src={
                            product.images[1]?.url ||
                            "/placeholder.svg?height=288&width=176&query=luxury perfume bottle" ||
                            "/placeholder.svg"
                          }
                          alt={`${product.title} variant`}
                          fill
                          className="object-contain filter drop-shadow-xl"
                          sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 176px"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </m.div>
        </div>

        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 sm:left-auto sm:right-8 sm:transform-none flex space-x-3">
          {carouselProductsToShow.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                ? "bg-atp-white scale-125"
                : "bg-atp-white/40 hover:bg-atp-white/60"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <m.section
        className="section-padding bg-atp-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="container-premium">
          <m.h2
            className={`text-4xl md:text-5xl font-serif text-center mb-16 text-atp-black tracking-tight ${locale === "ar" ? "font-arabic" : ""
              }`}
            variants={fadeInUp}
          >
            {locale === "ar" ? "استكشف فئاتنا" : "Explore Our Categories"}
          </m.h2>
          <m.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 lg:gap-8"
            variants={staggerContainer}
          >
            {categoryCards.map((category, index) => (
              <m.div key={index} variants={scaleIn}>
                <Link
                  href={category.link}
                  className="group block text-center transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`relative aspect-square mb-4 overflow-hidden rounded-lg shadow-lg transition-all duration-300 ${category.isATP ? "ring-2 ring-atp-gold" : ""
                      }`}
                  >
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {category.isATP && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-atp-gold text-atp-black px-2 py-1 rounded text-xs font-bold">
                          ATP
                        </span>
                      </div>
                    )}
                  </div>
                  <h3
                    className={`font-semibold text-lg ${category.isATP ? "text-atp-gold" : "text-atp-black"
                      }`}
                  >
                    {category.name}
                  </h3>
                </Link>
              </m.div>
            ))}
          </m.div>
        </div>
      </m.section>

      <m.section
        className="section-padding bg-atp-light-gray"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
      >
        <div className="container-premium">
          <m.h2
            className={`text-4xl md:text-5xl font-serif text-center mb-16 text-atp-black tracking-tight ${locale === "ar" ? "font-arabic" : ""
              }`}
            variants={fadeInUp}
          >
            {locale === "ar" ? "المنتجات المميزة" : "Featured Products"}
          </m.h2>
          <m.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            variants={staggerContainer}
          >
            {products.slice(0, 8).map((product, index) => (
              <m.div
                key={index}
                className="card-premium rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-white border border-gray-100"
                variants={scaleIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.featuredImage?.url || "/placeholder.svg"}
                    alt={product.featuredImage?.altText || product.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-3 right-3 p-2 rounded-full transition-colors shadow-md bg-white/90 hover:bg-white">
                    <Heart className="w-4 h-4 text-atp-black" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold mb-3 text-lg text-atp-black">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < 4 ? "text-atp-gold" : "text-atp-light-gray"
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-sm text-atp-charcoal">
                        4.5
                      </span>
                    </div>
                  </div>
                  <div className="text-xl font-bold mb-4 text-atp-black">
                    {product.variants[0]?.price?.amount ? (
                      <Price
                        amount={product.variants[0].price.amount}
                        currencyCode="AED"
                        className="text-xl font-bold"
                      />
                    ) : (
                      <span>Price not available</span>
                    )}
                  </div>
                  <Link href={`/${locale}/product/${getLocalizedProductHandle(product, locale as 'en' | 'ar')}`}>
                    <Button className="btn-premium w-full">
                      {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                    </Button>
                  </Link>
                </div>
              </m.div>
            ))}
          </m.div>
        </div>
      </m.section>
    </>
  );
}
