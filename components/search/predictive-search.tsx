"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useCurrentLocale } from "@/src/i18n";

interface PredictiveSearchResult {
  queries: Array<{
    text: string;
    styledText: string;
  }>;
  products: Array<{
    id: string;
    handle: string;
    title: string;
    vendor: string;
    featuredImage: {
      url: string;
      altText: string;
    };
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    compareAtPriceRange?: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
  }>;
  collections: Array<{
    id: string;
    handle: string;
    title: string;
    image?: {
      url: string;
      altText: string;
    };
  }>;
  pages: Array<{
    id: string;
    handle: string;
    title: string;
  }>;
}

interface PredictiveSearchProps {
  className?: string;
  placeholder?: string;
  onSelect?: () => void;
}

export function PredictiveSearch({
  className,
  placeholder = "Search products...",
  onSelect,
}: PredictiveSearchProps) {
  const { locale } = useCurrentLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PredictiveSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch predictive search results
  const fetchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults(null);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/search/predictive", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery, locale }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Predictive search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect to trigger search
  useEffect(() => {
    fetchResults(debouncedQuery);
  }, [debouncedQuery, fetchResults]);

  // Handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || !results) return;

      const totalItems =
        (results.queries?.length || 0) +
        (results.products?.length || 0) +
        (results.collections?.length || 0) +
        (results.pages?.length || 0);

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalItems);
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev <= 0 ? totalItems - 1 : prev - 1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleItemSelect(selectedIndex);
          } else {
            handleSearch();
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [isOpen, results, selectedIndex]
  );

  const handleItemSelect = useCallback(
    (index: number) => {
      if (!results) return;

      let currentIndex = 0;

      // Check queries
      if (results.queries && index < results.queries.length) {
        const selectedQuery = results.queries[index];
        setQuery(selectedQuery.text);
        router.push(
          `/${locale}/search?q=${encodeURIComponent(selectedQuery.text)}`
        );
        setIsOpen(false);
        onSelect?.();
        return;
      }
      currentIndex += results.queries?.length || 0;

      // Check products
      if (results.products && index < currentIndex + results.products.length) {
        const productIndex = index - currentIndex;
        const selectedProduct = results.products[productIndex];
        router.push(`/${locale}/product/${selectedProduct.handle}`);
        setIsOpen(false);
        onSelect?.();
        return;
      }
      currentIndex += results.products?.length || 0;

      // Check collections
      if (
        results.collections &&
        index < currentIndex + results.collections.length
      ) {
        const collectionIndex = index - currentIndex;
        const selectedCollection = results.collections[collectionIndex];
        router.push(`/${locale}/search/${selectedCollection.handle}`);
        setIsOpen(false);
        onSelect?.();
        return;
      }
      currentIndex += results.collections?.length || 0;

      // Check pages
      if (results.pages && index < currentIndex + results.pages.length) {
        const pageIndex = index - currentIndex;
        const selectedPage = results.pages[pageIndex];
        router.push(`/${locale}/${selectedPage.handle}`);
        setIsOpen(false);
        onSelect?.();
        return;
      }
    },
    [results, router, onSelect]
  );

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      router.push(`/${locale}/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
      onSelect?.();
    }
  }, [query, router, onSelect]);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results && query.trim()) {
              setIsOpen(true);
            }
          }}
          className="pl-10 pr-4"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* Query Suggestions */}
            {results.queries && results.queries.length > 0 && (
              <div className="border-b border-gray-100 p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                  Suggestions
                </div>
                {results.queries.map((queryItem, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full text-left px-2 py-2 text-sm rounded hover:bg-gray-50 flex items-center gap-2",
                      selectedIndex === index && "bg-blue-50"
                    )}
                    onClick={() => handleItemSelect(index)}
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                    <span
                      dangerouslySetInnerHTML={{ __html: queryItem.styledText }}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Products */}
            {results.products && results.products.length > 0 && (
              <div className="border-b border-gray-100 p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                  Products
                </div>
                {results.products.slice(0, 4).map((product, index) => {
                  const globalIndex = (results.queries?.length || 0) + index;
                  return (
                    <Link
                      key={product.id}
                      href={`/${locale}/product/${product.handle}`}
                      className={cn(
                        "block px-2 py-2 rounded hover:bg-gray-50",
                        selectedIndex === globalIndex && "bg-blue-50"
                      )}
                      onClick={() => {
                        setIsOpen(false);
                        onSelect?.();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.vendor}
                          </div>
                          <div className="text-sm font-medium text-blue-600">
                            {formatPrice(
                              product.priceRange.minVariantPrice.amount,
                              product.priceRange.minVariantPrice.currencyCode
                            )}
                            {product.compareAtPriceRange && (
                              <span className="ml-2 text-xs text-gray-400 line-through">
                                {formatPrice(
                                  product.compareAtPriceRange.minVariantPrice
                                    .amount,
                                  product.compareAtPriceRange.minVariantPrice
                                    .currencyCode
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Collections */}
            {results.collections && results.collections.length > 0 && (
              <div className="border-b border-gray-100 p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                  Collections
                </div>
                {results.collections.slice(0, 3).map((collection, index) => {
                  const globalIndex =
                    (results.queries?.length || 0) +
                    (results.products?.length || 0) +
                    index;
                  return (
                    <Link
                      key={collection.id}
                      href={`/search/${collection.handle}`}
                      className={cn(
                        "block px-2 py-2 rounded hover:bg-gray-50",
                        selectedIndex === globalIndex && "bg-blue-50"
                      )}
                      onClick={() => {
                        setIsOpen(false);
                        onSelect?.();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        {collection.image && (
                          <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded">
                            <Image
                              src={collection.image.url}
                              alt={collection.image.altText || collection.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">
                          {collection.title}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Collection
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pages */}
            {results.pages && results.pages.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 px-2">
                  Pages
                </div>
                {results.pages.slice(0, 2).map((page, index) => {
                  const globalIndex =
                    (results.queries?.length || 0) +
                    (results.products?.length || 0) +
                    (results.collections?.length || 0) +
                    index;
                  return (
                    <Link
                      key={page.id}
                      href={`/${page.handle}`}
                      className={cn(
                        "block px-2 py-2 rounded hover:bg-gray-50",
                        selectedIndex === globalIndex && "bg-blue-50"
                      )}
                      onClick={() => {
                        setIsOpen(false);
                        onSelect?.();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-gray-900">
                          {page.title}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Page
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!isLoading &&
              !results.queries?.length &&
              !results.products?.length &&
              !results.collections?.length &&
              !results.pages?.length && (
                <div className="p-4 text-center text-gray-500">
                  <div className="text-sm">No results found for "{query}"</div>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleSearch}
                    className="mt-2"
                  >
                    Search anyway
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
