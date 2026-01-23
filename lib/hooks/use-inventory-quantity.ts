/**
 * Hook: useInventoryQuantity
 * 
 * Fetches real-time inventory quantity from Shopify Admin API
 * for a given product variant ID.
 */

"use client";

import { useState, useEffect } from "react";

interface InventoryData {
    variantId: string;
    title?: string;
    availableForSale: boolean;
    totalAvailable: number | null;
    locations?: Array<{ name: string; available: number }>;
    error?: string;
}

interface UseInventoryQuantityReturn {
    quantity: number | null;
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export function useInventoryQuantity(variantId: string | null | undefined): UseInventoryQuantityReturn {
    const [quantity, setQuantity] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    useEffect(() => {
        if (!variantId) {
            setQuantity(null);
            setError(null);
            return;
        }

        const fetchInventory = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // Extract the numeric ID from the GID if needed
                const numericId = variantId.includes("gid://shopify/")
                    ? variantId.split("/").pop()
                    : variantId;

                const response = await fetch(`/api/inventory?variantId=${numericId}`);
                const data: InventoryData = await response.json();

                if (data.error && !data.totalAvailable) {
                    // Only treat as error if we also don't have fallback data
                    setError(data.error);
                    setQuantity(null);
                } else {
                    setQuantity(data.totalAvailable);
                    setError(null);
                }
            } catch (err) {
                console.error("[useInventoryQuantity] Error:", err);
                setError(err instanceof Error ? err.message : "Failed to fetch inventory");
                setQuantity(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInventory();
    }, [variantId, refetchTrigger]);

    const refetch = () => {
        setRefetchTrigger((prev) => prev + 1);
    };

    return { quantity, isLoading, error, refetch };
}

export default useInventoryQuantity;
