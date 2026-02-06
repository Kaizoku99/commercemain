import { NextResponse } from 'next/server'

/**
 * DEPRECATED: This endpoint is for Legacy Customer Accounts (password-based).
 * 
 * This Shopify store uses "New Customer Accounts" (OAuth-based, passwordless).
 * Authentication is now handled through:
 * - /api/auth/login - Initiates OAuth flow
 * - /api/auth/callback - Handles OAuth callback
 * - /api/auth/logout - Handles logout
 * - /api/auth/status - Returns authentication status
 * 
 * Users should use the "Continue with Email" button which initiates
 * a passwordless authentication flow via Shopify's OAuth.
 */
export async function POST() {
  return NextResponse.json(
    { 
      error: 'This login endpoint is deprecated',
      message: 'This store uses passwordless authentication. Please use the "Continue with Email" button on the login page.',
      redirect: '/auth/login',
      help: 'Visit /auth/login to sign in with your email address. You will receive a secure one-time code.'
    },
    { status: 410 } // 410 Gone
  )
}

export const dynamic = 'force-dynamic'
