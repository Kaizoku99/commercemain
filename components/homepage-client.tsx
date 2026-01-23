"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/shopify/types";
import Price from "@/components/price";
import { DirhamSymbol } from "@/components/icons/dirham-symbol";
import { getLocalizedProductHandle } from "@/lib/shopify/i18n-queries";

interface HomepageClientProps {
  carouselProducts: Product[];
  featuredProducts: Product[];
}

export function HomepageClient({
  carouselProducts,
  featuredProducts,
  locale = "en",
}: HomepageClientProps & { locale?: "en" | "ar" }) {
  console.log("[v0] HomePage: Component starting to render");

  const t = useTranslations('homepage');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      title: t('heroSlide1Title'),
      image: "/hero-atp-products.png",
      cta: t('heroSlide1Cta'),
      link: "/atp-membership",
    },
    {
      title: t('heroSlide2Title'),
      image: "/hero-skincare-products.png",
      cta: t('heroSlide2Cta'),
      link: "/skincare-supplements",
    },
    {
      title: t('heroSlide3Title'),
      image: "/hero-water-tech.png",
      cta: t('heroSlide3Cta'),
      link: "/water-soil-technology",
    },
  ];

  const categoryCards = [
    {
      name: t('categoryAtpMembership'),
      image: "/premium-membership-card.png",
      link: "/atp-membership",
    },
    {
      name: t('categorySkincare'),
      image: "/anti-aging-serum.png",
      link: "/skincare-supplements",
    },
    {
      name: t('categorySupplements'),
      image: "/vitamin-c-supplement.png",
      link: "/skincare-supplements",
    },
    {
      name: t('categoryWaterTech'),
      image: "/hero-water-tech.png",
      link: "/water-soil-technology",
    },
    {
      name: t('categorySoilSolutions'),
      image: "/hero-water-tech.png",
      link: "/water-soil-technology",
    },
    {
      name: t('categoryWellness'),
      image: "/acne-treatment-products.png",
      link: "/atp-membership",
    },
  ];

  const premiumProducts = [
    {
      name: t('premiumProduct1Name'),
      image: "/premium-membership-card.png",
      rating: 5.0,
      price: t('premiumProduct1Price'),
      link: "/atp-membership",
    },
    {
      name: t('premiumProduct2Name'),
      image: "/anti-aging-serum.png",
      rating: 4.9,
      price: t('premiumProduct2Price'),
      link: "/skincare-supplements",
    },
    {
      name: t('premiumProduct3Name'),
      image: "/hero-water-tech.png",
      rating: 4.8,
      price: t('premiumProduct3Price'),
      link: "/water-soil-technology",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroSlides[currentSlide].image}
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
            {heroSlides[currentSlide].title}
          </h1>
          <Link href={heroSlides[currentSlide].link}>
            <Button
              size="lg"
              className="bg-atp-gold text-atp-black hover:bg-atp-gold/90"
            >
              {heroSlides[currentSlide].cta}
            </Button>
          </Link>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === 0 ? heroSlides.length - 1 : prev - 1
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={() =>
            setCurrentSlide((prev) =>
              prev === heroSlides.length - 1 ? 0 : prev + 1
            )
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        {/* Dots indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('categoriesTitle')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoryCards.map((category, index) => (
              <Link
                key={index}
                href={category.link}
                className="group block text-center transition-transform hover:scale-105"
              >
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('featuredProductsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.featuredImage?.url || "/placeholder.svg"}
                    alt={product.featuredImage?.altText || product.title}
                    fill
                    className="object-cover"
                  />
                  <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < 4 ? "text-yellow-400" : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-1 text-sm text-gray-600">4.5</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    {product.variants[0]?.price?.amount ? (
                      <Price
                        amount={product.variants[0].price.amount}
                        currencyCode={product.variants[0].price.currencyCode}
                        className="text-lg font-bold text-gray-900"
                      />
                    ) : (
                      <p className="text-lg font-bold text-gray-900">
                        {t('priceNotAvailable')}
                      </p>
                    )}
                  </div>
                  <Link href={`/${locale}/product/${getLocalizedProductHandle(product, locale)}`}>
                    <Button className="w-full bg-atp-gold text-atp-black hover:bg-atp-gold/90">
                      {t('viewDetails')}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            {t('premiumCollectionsTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {premiumProducts.map((product, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
              >
                <div className="relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-atp-gold text-atp-black px-3 py-1 rounded-full text-sm font-semibold">
                      {t('premium')}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4 ? "text-yellow-400" : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">4.5</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    {product.price}
                  </p>
                  <Link href={product.link}>
                    <Button className="w-full bg-atp-gold text-atp-black hover:bg-atp-gold/90">
                      {t('exploreCollection')}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gift Sets Promotional Banner Section */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden bg-gradient-to-r from-gray-900 via-black to-gray-800">
        {/* Background Pattern - mimicking luxury gift boxes */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-8 left-16 w-24 h-32 bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg transform rotate-12 shadow-2xl"></div>
          <div className="absolute bottom-12 left-32 w-20 h-28 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg transform -rotate-6 shadow-2xl"></div>
          <div className="absolute top-16 right-20 w-28 h-36 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg transform rotate-8 shadow-2xl"></div>
          <div className="absolute bottom-8 right-40 w-22 h-30 bg-gradient-to-br from-gray-600 to-black rounded-lg transform -rotate-12 shadow-2xl"></div>
          <div className="absolute top-20 left-1/2 w-16 h-20 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-full transform rotate-45 shadow-2xl"></div>
          <div className="absolute bottom-16 left-1/3 w-18 h-24 bg-gradient-to-br from-gray-800 to-black rounded-lg transform rotate-24 shadow-2xl"></div>
        </div>

        {/* Decorative Elements - representing premium products */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-12 left-24 w-8 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
          <div className="absolute bottom-20 right-28 w-6 h-10 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
          <div className="absolute top-32 right-16 w-10 h-14 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full shadow-lg"></div>
        </div>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Banner Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight">
            {t('giftSetsTitle')}
          </h2>
        </div>
      </section>

      {/* Footer Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('freeShippingTitle')}
              </h3>
              <p className="text-gray-600 flex items-center gap-1 justify-center">
                {t('freeShippingDescription')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('customerSupportTitle')}
              </h3>
              <p className="text-gray-600">
                {t('customerSupportDescription')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('securePaymentTitle')}
              </h3>
              <p className="text-gray-600">
                {t('securePaymentDescription')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
