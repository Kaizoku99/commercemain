"use client";

/**
 * PageTransitionProvider
 * 
 * Wraps route content with AnimatePresence and PageTransition
 * to enable smooth page transitions in Next.js App Router.
 */

import { type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/ui/page-transition";

interface PageTransitionProviderProps {
  children: ReactNode;
  className?: string;
  variant?: "fade" | "slideUp" | "slideLeft" | "scale" | "blur";
}

export function PageTransitionProvider({
  children,
  className,
  variant = "slideUp",
}: PageTransitionProviderProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={pathname} variant={variant} className={className}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
