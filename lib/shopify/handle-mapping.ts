/**
 * Handle mapping for products between English and Arabic
 * This maps English handles to their corresponding Arabic handles in Shopify
 */

export const HANDLE_MAPPING: Record<string, { ar: string; en: string }> = {
    'dna-hya-facial-cleanser': {
        en: 'dna-hya-facial-cleanser',
        ar: 'غسول-الوجه-dna-hya'
    },
    // Add more product handle mappings here as needed
    // Format: 'english-handle': { en: 'english-handle', ar: 'arabic-handle' }
}

/**
 * Get the localized handle for a product
 * @param baseHandle - The base handle (usually English)
 * @param locale - The target locale ('en' or 'ar')
 * @returns The localized handle
 */
export function getLocalizedHandle(baseHandle: string, locale: 'en' | 'ar'): string {
    const mapping = HANDLE_MAPPING[baseHandle]
    if (mapping && mapping[locale]) {
        return mapping[locale]
    }

    // Fallback to original handle if no mapping exists
    return baseHandle
}

/**
 * Get the base (English) handle from any localized handle
 * @param localizedHandle - The localized handle
 * @returns The base English handle
 */
export function getBaseHandle(localizedHandle: string): string {
    // First check if it's already a base handle
    if (HANDLE_MAPPING[localizedHandle]) {
        return localizedHandle
    }

    // Search through mappings to find the base handle
    for (const [baseHandle, mapping] of Object.entries(HANDLE_MAPPING)) {
        if (mapping.ar === localizedHandle || mapping.en === localizedHandle) {
            return baseHandle
        }
    }

    // Fallback to original handle if no mapping found
    return localizedHandle
}

/**
 * Check if a handle has localized versions available
 * @param handle - The handle to check
 * @returns Whether localized versions exist
 */
export function hasLocalizedHandles(handle: string): boolean {
    const baseHandle = getBaseHandle(handle)
    return !!HANDLE_MAPPING[baseHandle]
}
