"use client";

import { AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { m, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface UrgencySignalsProps {
    /**
     * Total quantity available for the selected variant
     * Pass null/undefined if unknown
     */
    quantityAvailable?: number | null;
    /**
     * Threshold below which to show "low stock" warning
     */
    lowStockThreshold?: number;
    className?: string;
}

export function UrgencySignals({
    quantityAvailable,
    lowStockThreshold = 5,
    className,
}: UrgencySignalsProps) {
    const t = useTranslations("product");

    // If quantity is unknown or zero, don't show
    if (quantityAvailable === undefined || quantityAvailable === null) {
        return null;
    }

    // Out of stock
    if (quantityAvailable === 0) {
        return (
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg",
                    "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800",
                    className
                )}
            >
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-700 dark:text-red-400">
                    {t("outOfStock")}
                </span>
            </m.div>
        );
    }

    // Low stock warning
    if (quantityAvailable <= lowStockThreshold) {
        return (
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg",
                    "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800",
                    className
                )}
            >
                <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
                <span className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {t("lowStock", { count: quantityAvailable })}
                </span>
            </m.div>
        );
    }

    // High demand indicator (for items with moderate stock between 6-20)
    if (quantityAvailable <= 20) {
        return (
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg",
                    "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800",
                    className
                )}
            >
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                    {t("inStock")}
                </span>
            </m.div>
        );
    }

    // Plenty in stock, no urgency needed
    return null;
}

export default UrgencySignals;
