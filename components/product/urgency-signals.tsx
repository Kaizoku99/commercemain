"use client";

import { AlertTriangle, Clock, TrendingUp, Package } from "lucide-react";
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
    /**
     * Threshold for moderate stock (show "Only X left")
     */
    moderateStockThreshold?: number;
    className?: string;
}

export function UrgencySignals({
    quantityAvailable,
    lowStockThreshold = 5,
    moderateStockThreshold = 20,
    className,
}: UrgencySignalsProps) {
    const t = useTranslations("product");

    // If quantity is unknown, show a neutral in-stock badge
    if (quantityAvailable === undefined || quantityAvailable === null) {
        return (
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl",
                    "bg-green-500/10 border border-green-500/20 backdrop-blur-sm",
                    className
                )}
            >
                <Package className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-green-400">
                    {t("inStock")}
                </span>
            </m.div>
        );
    }

    // Out of stock
    if (quantityAvailable === 0) {
        return (
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl",
                    "bg-red-500/10 border border-red-500/20 backdrop-blur-sm",
                    className
                )}
            >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="text-sm font-medium text-red-400">
                    {t("outOfStock")}
                </span>
            </m.div>
        );
    }

    // Low stock warning (1-5) - urgent, pulsing animation
    if (quantityAvailable <= lowStockThreshold) {
        return (
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl",
                    "bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm",
                    className
                )}
            >
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-sm font-medium text-amber-400">
                    {t("lowStock", { count: quantityAvailable })}
                </span>
            </m.div>
        );
    }

    // Moderate stock (6-20) - show "Only X left" with selling fast indicator
    if (quantityAvailable <= moderateStockThreshold) {
        return (
            <m.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl",
                    "bg-[#d4af37]/10 border border-[#d4af37]/20 backdrop-blur-sm",
                    className
                )}
            >
                <TrendingUp className="w-4 h-4 text-[#d4af37]" />
                <span className="text-sm font-medium text-[#d4af37]">
                    {t("onlyXLeft", { count: quantityAvailable })}
                </span>
                <span className="text-xs text-neutral-400">
                    — {t("sellingFast")}
                </span>
            </m.div>
        );
    }

    // High stock (>20) - show green "In Stock" with count
    return (
        <m.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl",
                "bg-green-500/10 border border-green-500/20 backdrop-blur-sm",
                className
            )}
        >
            <Package className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">
                {t("inStock")}
            </span>
        </m.div>
    );
}

export default UrgencySignals;
