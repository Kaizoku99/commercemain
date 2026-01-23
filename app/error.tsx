"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Don't handle redirect errors - let them pass through
    if (error?.message === "NEXT_REDIRECT" || error?.digest?.includes("NEXT_REDIRECT")) {
      return
    }
    
    console.log("[v0] Error: Error boundary triggered")
    console.log("[v0] Error: Error object:", error)
    console.log("[v0] Error: Error message:", error?.message)
    console.log("[v0] Error: Error stack:", error?.stack)
    console.log("[v0] Error: Error digest:", error?.digest)
    console.log("[v0] Error: Reset function type:", typeof reset)
    console.log("[v0] Error: Reset function available:", typeof reset === "function")
  }, [error, reset])

  // Don't render error UI for redirect errors
  if (error?.message === "NEXT_REDIRECT" || error?.digest?.includes("NEXT_REDIRECT")) {
    return null
  }

  return (
    <div className="mx-auto my-4 flex max-w-xl flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 dark:border-neutral-800 dark:bg-black">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue, please try your action again.
      </p>
      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded text-sm">
        <p>
          <strong>Error:</strong> {error?.message}
        </p>
        {error?.digest && (
          <p>
            <strong>Digest:</strong> {error.digest}
          </p>
        )}
      </div>
      <button
        className="mx-auto mt-4 flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
        onClick={() => {
          console.log("[v0] Error: Reset button clicked")
          if (typeof reset === "function") {
            console.log("[v0] Error: Calling reset function")
            reset()
          } else {
            console.log("[v0] Error: Reset function not available, reloading page")
            // Fallback: reload the page if reset function is not available
            window.location.reload()
          }
        }}
      >
        Try Again
      </button>
    </div>
  )
}
