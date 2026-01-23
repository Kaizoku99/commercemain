"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { AnimatePresence, m } from "framer-motion";
import { fetchCollectionProducts } from "@/components/cart/actions";
import { createLogger } from "@/lib/logger";
import { getLocalizedProductHandle } from "@/lib/shopify/i18n-queries";
import { DirhamSymbol } from "@/components/icons/dirham-symbol";
import type { Product } from "@/lib/shopify/types";

// Helper for collection mapping (moved from index.tsx)
const collectionMapping = {
    "atp-membership": "atp-membership",
    "skincare-supplements": "amazing-thai-products",
    "water-soil-technology": "water-soil-technology-solutions",
    "ems-training": "ems",
};

// Helper for mock data (moved from index.tsx)
const getMockProductsForCollection = (menuHandle: string): Product[] => {
    // ... Copied mock data logic ...
    // For brevity in this extraction, assumes the same logic is needed. 
    // I will include the full mock data dictionary here to ensure functionality.
    const mockData: Record<string, Product[]> = {
        "skincare-supplements": [
            {
                id: "mock-1",
                handle: "smone-brightening-cream",
                title: "S'MONE Brightening Cream – Advanced Radiance Formula",
                description: "Advanced brightening cream for radiant skin",
                descriptionHtml: "<p>Advanced brightening cream for radiant skin</p>",
                featuredImage: {
                    url: "/anti-aging-serum.png",
                    altText: "S'MONE Brightening Cream",
                    width: 400,
                    height: 400,
                },
                priceRange: {
                    minVariantPrice: { amount: "170.0", currencyCode: "AED" },
                    maxVariantPrice: { amount: "170.0", currencyCode: "AED" },
                },
                availableForSale: true,
                tags: [],
                variants: [],
                images: [],
                options: [],
                seo: { title: "", description: "" },
                updatedAt: new Date().toISOString(),
            },
            {
                id: "mock-2",
                handle: "dna-hya-facial-cleanser",
                title: "DNA HYA Facial Cleanser – With Salmon DNA & Hyaluronic Acid",
                description: "Advanced facial cleanser with DNA technology",
                descriptionHtml: "<p>Advanced facial cleanser with DNA technology</p>",
                featuredImage: {
                    url: "/acne-treatment-products.png",
                    altText: "DNA HYA Facial Cleanser",
                    width: 400,
                    height: 400,
                },
                priceRange: {
                    minVariantPrice: { amount: "120.0", currencyCode: "AED" },
                    maxVariantPrice: { amount: "120.0", currencyCode: "AED" },
                },
                availableForSale: true,
                tags: [],
                variants: [],
                images: [],
                options: [],
                seo: { title: "", description: "" },
                updatedAt: new Date().toISOString(),
            },
        ],
        "water-soil-technology": [
            {
                id: "mock-3",
                handle: "water-purification-system",
                title: "Advanced Water Purification System",
                description: "Professional water treatment solution",
                descriptionHtml: "<p>Professional water treatment solution</p>",
                featuredImage: {
                    url: "/hero-water-tech.png",
                    altText: "Water Purification System",
                    width: 400,
                    height: 400,
                },
                priceRange: {
                    minVariantPrice: { amount: "2500.0", currencyCode: "AED" },
                    maxVariantPrice: { amount: "2500.0", currencyCode: "AED" },
                },
                availableForSale: true,
                tags: [],
                variants: [],
                images: [],
                options: [],
                seo: { title: "", description: "" },
                updatedAt: new Date().toISOString(),
            },
        ],
        "ems-training": [
            {
                id: "mock-4",
                handle: "ems-training-package",
                title: "Professional EMS Training Package",
                description: "Complete EMS training certification program",
                descriptionHtml: "<p>Complete EMS training certification program</p>",
                featuredImage: {
                    url: "/corporate-business-plan.png",
                    altText: "EMS Training Package",
                    width: 400,
                    height: 400,
                },
                priceRange: {
                    minVariantPrice: { amount: "1500.0", currencyCode: "AED" },
                    maxVariantPrice: { amount: "1500.0", currencyCode: "AED" },
                },
                availableForSale: true,
                tags: [],
                variants: [],
                images: [],
                options: [],
                seo: { title: "", description: "" },
                updatedAt: new Date().toISOString(),
            },
        ],
    };

    return mockData[menuHandle] || [];
};

interface NavbarLinksProps {
    locale: string;
}

export function NavbarLinks({ locale }: NavbarLinksProps) {
    const t = useTranslations('navbar');
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
    const [menuProducts, setMenuProducts] = useState<Record<string, Product[]>>({});
    const [loadingProducts, setLoadingProducts] = useState<Record<string, boolean>>({});
    const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);

    const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const isHoveringDropdown = useRef(false);

    const navLogger = useMemo(() => createLogger('[NavbarLinks]'), []);

    const atpMembershipText = t('atpMembership');
    const skincareSupplementsText = t('skincareSupplements');
    const waterSoilTechText = t('waterSoilTechnology');
    const emsTrainingText = t('emsTraining');
    const aboutUsText = t('aboutUs');
    const contactUsText = t('contactUs');

    // Define menu items
    const topRowMenu = useMemo(
        () => [
            {
                title: atpMembershipText,
                path: `/${locale}/atp-membership`,
                handle: "atp-membership",
            },
            {
                title: skincareSupplementsText,
                path: `/${locale}/skincare-supplements`,
                handle: "skincare-supplements",
            },
            {
                title: waterSoilTechText,
                path: `/${locale}/water-soil-technology`,
                handle: "water-soil-technology",
            },
        ],
        [locale, atpMembershipText, skincareSupplementsText, waterSoilTechText]
    );

    const bottomRowMenu = useMemo(
        () => [
            {
                title: emsTrainingText,
                path: `/${locale}/ems`,
                handle: "ems-training",
            },
            {
                title: aboutUsText,
                path: `/${locale}/about`,
                handle: "about",
            },
            {
                title: contactUsText,
                path: `/${locale}/contact`,
                handle: "contact",
            },
        ],
        [locale, emsTrainingText, aboutUsText, contactUsText]
    );

    const fetchMenuProducts = useCallback(async (menuHandle: string) => {
        const collectionHandle = collectionMapping[menuHandle as keyof typeof collectionMapping];
        if (!collectionHandle || menuProducts[menuHandle] || loadingProducts[menuHandle]) {
            return;
        }

        navLogger.log(`Attempting to fetch products for menu: ${menuHandle}`);
        setLoadingProducts((prev) => ({ ...prev, [menuHandle]: true }));

        try {
            const result = await fetchCollectionProducts(collectionHandle, "BEST_SELLING", false);
            if (!result.success) throw new Error(result.error || "Failed to fetch products");

            const products = result.products;
            const limitedProducts = products.slice(0, 6);
            setMenuProducts((prev) => ({ ...prev, [menuHandle]: limitedProducts }));
        } catch (error) {
            navLogger.error(`Failed to fetch products for ${menuHandle}:`, error);
            const mockProducts = getMockProductsForCollection(menuHandle);
            setMenuProducts((prev) => ({ ...prev, [menuHandle]: mockProducts }));
        } finally {
            setLoadingProducts((prev) => ({ ...prev, [menuHandle]: false }));
        }
    }, [menuProducts, loadingProducts, navLogger]);

    const handleMenuEnter = useCallback((menuHandle: string) => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        setHoveredMenu(menuHandle);
    }, [hoverTimeout]);

    const handleMenuLeave = useCallback((menuHandle: string) => {
        if (!isHoveringDropdown.current) {
            const timeout = setTimeout(() => {
                setHoveredMenu(null);
            }, 500);
            setHoverTimeout(timeout);
        }
    }, []);

    const handleDropdownEnter = useCallback(() => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
        }
        isHoveringDropdown.current = true;
    }, [hoverTimeout]);

    const handleDropdownLeave = useCallback(() => {
        isHoveringDropdown.current = false;
        const timeout = setTimeout(() => {
            setHoveredMenu(null);
        }, 300);
        setHoverTimeout(timeout);
    }, []);

    useEffect(() => {
        if (hoveredMenu && collectionMapping[hoveredMenu as keyof typeof collectionMapping]) {
            fetchMenuProducts(hoveredMenu);
        }
    }, [hoveredMenu, fetchMenuProducts]);

    useEffect(() => {
        return () => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
        };
    }, [hoverTimeout]);

    return (
        <div className="flex flex-col items-center flex-1 mx-8">
            {/* Top row navigation */}
            <div className="flex items-center gap-10 mb-3">
                {topRowMenu.map((item) => (
                    <div
                        key={item.path}
                        ref={(el) => { if (el) menuRefs.current[item.handle] = el; }}
                        className="relative"
                        onMouseEnter={() => handleMenuEnter(item.handle)}
                        onMouseLeave={() => handleMenuLeave(item.handle)}
                    >
                        <Link
                            href={item.path}
                            className="text-white hover:text-yellow-400 transition-all duration-300 text-sm font-medium tracking-wide uppercase relative group"
                        >
                            {item.title}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Bottom row navigation */}
            <div className="flex items-center gap-10">
                {bottomRowMenu.map((item) => (
                    <div
                        key={item.path}
                        ref={(el) => { if (el) menuRefs.current[item.handle] = el; }}
                        className="relative"
                        onMouseEnter={() => handleMenuEnter(item.handle)}
                        onMouseLeave={() => handleMenuLeave(item.handle)}
                    >
                        <Link
                            href={item.path}
                            className="text-white hover:text-yellow-400 transition-all duration-300 text-sm font-medium tracking-wide uppercase relative group"
                        >
                            {item.title}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Improved dropdown with better hover management */}
            <AnimatePresence>
                {hoveredMenu &&
                    (menuProducts[hoveredMenu] || loadingProducts[hoveredMenu]) && (
                        <m.div
                            key={hoveredMenu}
                            ref={dropdownRef}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full left-0 w-full bg-gradient-to-b from-black via-gray-950 to-black border-t border-yellow-400/30 shadow-2xl z-50 backdrop-blur-sm"
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleDropdownLeave}
                            style={{
                                marginTop: "-2px",
                                paddingTop: "2px",
                            }}
                        >
                            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
                                <div className="text-center mb-10">
                                    <h3 className="text-2xl font-serif text-yellow-400 tracking-widest uppercase mb-2">
                                        {topRowMenu.find((item) => item.handle === hoveredMenu)?.title ||
                                            bottomRowMenu.find((item) => item.handle === hoveredMenu)?.title}
                                    </h3>
                                    <div className="w-24 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto"></div>
                                </div>

                                {loadingProducts[hoveredMenu] ? (
                                    <div className="flex justify-center items-center py-16">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                        {menuProducts[hoveredMenu]?.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/${locale}/product/${getLocalizedProductHandle(product, locale as 'en' | 'ar')}`}
                                                className="group flex flex-col items-center text-center hover:bg-gradient-to-b hover:from-gray-900/50 hover:to-gray-800/30 p-6 rounded-2xl transition-all duration-700 border border-transparent hover:border-yellow-400/40 hover:shadow-2xl hover:shadow-yellow-400/10 transform hover:-translate-y-2"
                                            >
                                                <div className="relative w-28 h-28 mb-4 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 ring-1 ring-gray-700 group-hover:ring-yellow-400/50 transition-all duration-500">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
                                                    <Image
                                                        src={product.featuredImage?.url || "/placeholder.svg"}
                                                        alt={product.featuredImage?.altText || product.title}
                                                        width={112}
                                                        height={112}
                                                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 filter group-hover:brightness-110"
                                                    />
                                                    <div className="absolute inset-0 bg-yellow-400/0 group-hover:bg-yellow-400/5 transition-all duration-500"></div>

                                                    {hoveredMenu === "atp-membership" && (
                                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                                                            ATP
                                                        </div>
                                                    )}
                                                </div>

                                                <span className="text-xs text-gray-300 group-hover:text-yellow-400 transition-colors duration-500 font-medium tracking-wider uppercase leading-relaxed line-clamp-2">
                                                    {product.title}
                                                </span>

                                                <div className="mt-2 text-yellow-400 font-semibold text-sm flex items-center gap-1">
                                                    <DirhamSymbol className="w-3 h-3 text-yellow-400" />
                                                    <span>
                                                        {new Intl.NumberFormat("en-AE", {
                                                            minimumFractionDigits: 0,
                                                            maximumFractionDigits: 2,
                                                        }).format(parseFloat(product.priceRange.minVariantPrice.amount))}
                                                    </span>
                                                </div>

                                                <div className="w-0 h-px bg-yellow-400 group-hover:w-12 transition-all duration-500 mt-3"></div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-12 pt-8 border-t border-gray-800/50">
                                    <div className="text-center">
                                        <Link
                                            href={(() => {
                                                const topItem = topRowMenu.find((item) => item.handle === hoveredMenu);
                                                const bottomItem = bottomRowMenu.find((item) => item.handle === hoveredMenu);
                                                return topItem ? topItem.path : bottomItem ? bottomItem.path : `/${locale}`;
                                            })()}
                                            className="inline-flex items-center text-sm text-gray-400 hover:text-yellow-400 transition-colors duration-300 tracking-wide uppercase font-medium group"
                                        >
                                            {t('viewAllProducts')}
                                            <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </m.div>
                    )}
            </AnimatePresence>
        </div>
    );
}
