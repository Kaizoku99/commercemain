"use client";

import { AlertTriangle, Clock } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface UrgencySignalsProps {
    /**
     * Total quantity available for the selected variant
     * Pass null/undefined if unknown
     */
    quantityAvailable?: number | null;
    /**
     * Threshold below which to show "low stock" warning (default: 5)
     * Signal only shows when stock is LESS THAN this threshold
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

    // If quantity is unknown or >= threshold, don't show anything
    if (quantityAvailable === undefined || quantityAvailable === null) {
        return null;
    }

    // Stock is >= threshold, don't show urgency signal
    if (quantityAvailable >= lowStockThreshold) {
        return null;
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

    // Low stock warning (1 to threshold-1) - urgent, pulsing animation
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

export default UrgencySignals;
