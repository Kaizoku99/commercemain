'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Don't handle redirect errors - let them pass through
    if (error?.message === 'NEXT_REDIRECT' || error?.digest?.includes('NEXT_REDIRECT')) {
      return
    }
    
    // Log the error to an error reporting service
    console.error('[ATP Error Boundary]', error)
  }, [error])

  // Don't render error UI for redirect errors
  if (error?.message === 'NEXT_REDIRECT' || error?.digest?.includes('NEXT_REDIRECT')) {
    return null
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        {/* Error icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>
        
        {/* Title */}
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Something Went Wrong
        </h1>
        
        {/* Description */}
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          We apologize for the inconvenience. An unexpected error occurred while processing your request.
        </p>
        
        {/* Error details (development only or with digest) */}
        {(process.env.NODE_ENV === 'development' || error?.digest) && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left dark:border-red-800 dark:bg-red-900/20">
            <p className="text-sm text-red-800 dark:text-red-300">
              <span className="font-semibold">Error:</span> {error?.message || 'Unknown error'}
            </p>
            {error?.digest && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                <span className="font-semibold">Reference:</span> {error.digest}
              </p>
            )}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-atp-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atp-gold focus-visible:ring-offset-2 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            aria-label="Try again"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atp-gold focus-visible:ring-offset-2 dark:border-neutral-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
            aria-label="Go to homepage"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            Go Home
          </Link>
        </div>
        
        {/* Help text */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-500">
          If the problem persists, please{' '}
          <Link 
            href="/contact" 
            className="text-atp-gold underline underline-offset-2 hover:text-atp-gold/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-atp-gold"
          >
            contact our support team
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
