import { NextResponse } from 'next/server'

/**
 * DEPRECATED: This endpoint is for Legacy Customer Accounts (password-based).
 * 
 * This Shopify store uses "New Customer Accounts" (OAuth-based, passwordless).
 * Logout is now handled through:
 * - /api/auth/logout - Clears tokens and redirects to Shopify's logout endpoint
 * 
 * The OAuth logout properly invalidates both local tokens and the Shopify session.
 */
export async function POST() {
  return NextResponse.json(
    { 
      error: 'This logout endpoint is deprecated',
      message: 'Please use the new logout endpoint at /api/auth/logout',
      redirect: '/api/auth/logout'
    },
    { status: 410 } // 410 Gone
  )
}

export const dynamic = 'force-dynamic'
