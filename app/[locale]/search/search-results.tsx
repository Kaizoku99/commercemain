"use client";

import Grid from "@/components/grid";
import ProductGridItems from "@/components/layout/product-grid-items";
import { sorting } from "@/lib/constants";
import { m } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchResultsProps {
  products: any[];
  searchQuery: string;
  sortValue: string;
  locale: "en" | "ar";
}

export default function SearchResults({ 
  products, 
  searchQuery, 
  sortValue, 
  locale 
}: SearchResultsProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const resultsText = products.length > 1 ? "results" : "result";

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-atp-light-gray rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-atp-light-gray rounded w-1/2"></div>
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
    );
  }

  return (
    <div className="space-y-8">
      <m.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-atp-gold via-atp-gold to-atp-gold bg-clip-text">
          <h1 className="text-4xl md:text-5xl font-bold text-atp-black mb-2">
            Search Results
          </h1>
        </div>

        <div className="flex items-center justify-center gap-3 text-atp-charcoal">
          <Search className="w-5 h-5" />
          <p className="text-lg">
            {searchQuery ? (
              <>
                <span className="font-medium">{products.length}</span>{" "}
                {resultsText} found for{" "}
                <span className="font-semibold text-atp-black">
                  "{searchQuery}"
                </span>
              </>
            ) : (
              <>
                Showing <span className="font-medium">{products.length}</span>{" "}
                products
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-sm text-atp-charcoal">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            <span>
              Sort: {sorting.find((item) => item.slug === sortValue)?.title || "Best Selling"}
            </span>
          </div>
        </div>
      </m.div>

      {products.length > 0 ? (
        <m.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid variant="luxury">
            <ProductGridItems
              products={products}
              locale={locale}
            />
          </Grid>
        </m.div>
      ) : searchQuery ? (
        <m.div
          className="bg-atp-white rounded-lg shadow-sm border border-atp-light-gray p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Search className="w-16 h-16 text-atp-charcoal/40 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-atp-black mb-2">
            No products found
          </h3>
          <p className="text-atp-charcoal mb-6">
            Try adjusting your search terms or browse our collections
          </p>
          <button className="btn-premium">Browse Collections</button>
        </m.div>
      ) : null}
    </div>
  );
}
