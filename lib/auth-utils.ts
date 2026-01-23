/**
 * Authentication utilities for debugging and error handling
 */

export interface AuthStatus {
    isAuthenticated: boolean
    hasToken: boolean
    tokenValid: boolean
    error?: string
}

/**
 * Check authentication status without making API calls
 */
export function checkAuthStatus(): AuthStatus {
    try {
        // Check if we're in a browser environment
        if (typeof window === 'undefined') {
            return {
                isAuthenticated: false,
                hasToken: false,
                tokenValid: false,
                error: 'Server-side environment'
            }
        }

        // Check for customer access token cookie
        const cookies = document.cookie.split(';')
        const customerTokenCookie = cookies.find(cookie =>
            cookie.trim().startsWith('customerAccessToken=')
        )

        const hasToken = !!customerTokenCookie
        const tokenValue = customerTokenCookie?.split('=')[1]

        return {
            isAuthenticated: hasToken && !!tokenValue,
            hasToken,
            tokenValid: hasToken && !!tokenValue,
        }
    } catch (error) {
        return {
            isAuthenticated: false,
            hasToken: false,
            tokenValid: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }
    }
}

/**
 * Log authentication status for debugging
 */
export function logAuthStatus(context: string = 'Unknown') {
    const status = checkAuthStatus()
    console.log(`[Auth Debug] ${context}:`, {
        isAuthenticated: status.isAuthenticated,
        hasToken: status.hasToken,
        tokenValid: status.tokenValid,
        error: status.error
    })
    return status
}

/**
 * Handle authentication errors gracefully
 */
export function handleAuthError(error: any, context: string = 'Unknown'): string {
    if (error?.status === 401) {
        return 'Not authenticated - please log in'
    }

    if (error?.status === 403) {
        return 'Access denied - insufficient permissions'
    }

    if (error?.status === 404) {
        return 'Resource not found'
    }

    console.error(`[Auth Error] ${context}:`, error)
    return 'Authentication error occurred'
}
