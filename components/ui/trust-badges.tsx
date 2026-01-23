"use client";

import { Shield, Truck, Undo, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface TrustBadgesProps {
    className?: string;
    variant?: "horizontal" | "vertical";
}

const badges = [
    {
        icon: Shield,
        labelKey: "securePayment",
        descriptionKey: "securePaymentDesc",
    },
    {
        icon: Truck,
        labelKey: "freeShipping",
        descriptionKey: "freeShippingDesc",
    },
    {
        icon: Undo,
        labelKey: "easyReturns",
        descriptionKey: "easyReturnsDesc",
    },
] as const;

export function TrustBadges({ className, variant = "horizontal" }: TrustBadgesProps) {
    const t = useTranslations("trustBadges");

    return (
        <div
            className={cn(
                "flex gap-4 py-4",
                variant === "horizontal" ? "flex-row flex-wrap justify-center" : "flex-col",
                className
            )}
        >
            {badges.map((badge) => (
                <div
                    key={badge.labelKey}
                    className={cn(
                        "flex items-center gap-2 text-sm",
                        variant === "horizontal" ? "flex-col text-center" : "flex-row"
                    )}
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-atp-gold/10">
                        <badge.icon className="w-5 h-5 text-atp-gold" />
                    </div>
                    <div className={variant === "horizontal" ? "text-center" : ""}>
                        <p className="font-medium text-gray-900 dark:text-white">
                            {t(badge.labelKey)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t(badge.descriptionKey)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TrustBadges;
