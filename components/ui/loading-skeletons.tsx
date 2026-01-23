'use client';

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Product Card Skeleton for loading states
 */
export function ProductCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg" />
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mt-2" />
      </div>
    </div>
  );
}

/**
 * Product Grid Skeleton - displays multiple product card skeletons
 */
export function ProductGridSkeleton({ 
  count = 4,
  className 
}: { count?: number; className?: string }) {
  return (
    <div className={cn(
      "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6",
      className
    )}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Hero Section Skeleton
 */
export function HeroSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="relative min-h-[60vh] bg-gray-200 dark:bg-gray-800 rounded-lg">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-full w-32 mt-8" />
        </div>
      </div>
    </div>
  );
}

/**
 * Navbar Dropdown Skeleton
 */
export function NavbarDropdownSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse p-6", className)}>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-700 rounded-xl mb-3" />
            <div className="h-3 bg-gray-700 rounded w-20 mb-2" />
            <div className="h-3 bg-gray-700 rounded w-14" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Cart Item Skeleton
 */
export function CartItemSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse flex gap-4 p-4", className)}>
      <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mt-2" />
      </div>
    </div>
  );
}

/**
 * Service Card Skeleton
 */
export function ServiceCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-6">
        <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full mb-4" />
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-1" />
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3" />
      </div>
    </div>
  );
}

/**
 * Text Line Skeleton
 */
export function TextSkeleton({ 
  lines = 1,
  className 
}: { lines?: number; className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded"
          style={{ width: `${Math.max(40, 100 - (i * 20))}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Avatar Skeleton
 */
export function AvatarSkeleton({ 
  size = "md",
  className 
}: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn(
      "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-full",
      sizes[size],
      className
    )} />
  );
}

/**
 * Button Skeleton
 */
export function ButtonSkeleton({ 
  size = "md",
  className 
}: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = {
    sm: "h-8 w-20",
    md: "h-10 w-24",
    lg: "h-12 w-32",
  };

  return (
    <div className={cn(
      "animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md",
      sizes[size],
      className
    )} />
  );
}

/**
 * Form Field Skeleton
 */
export function FormFieldSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-2", className)}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
    </div>
  );
}

/**
 * Page Loading Skeleton - Full page loading state
 */
export function PageLoadingSkeleton() {
  return (
    <div className="animate-pulse min-h-screen">
      {/* Header skeleton */}
      <div className="h-16 bg-gray-200 dark:bg-gray-800 mb-8" />
      
      {/* Hero skeleton */}
      <div className="container mx-auto px-4 mb-12">
        <HeroSkeleton />
      </div>
      
      {/* Content skeleton */}
      <div className="container mx-auto px-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6" />
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  );
}
