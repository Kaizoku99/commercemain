import { NextResponse } from 'next/server'

/**
 * DEPRECATED: This endpoint is for Legacy Customer Accounts (password-based).
 * 
 * This Shopify store uses "New Customer Accounts" (OAuth-based, passwordless).
 * 
 * With the new OAuth flow:
 * - There is no separate registration process
 * - Users sign up and sign in using the same flow
 * - Enter email → receive one-time code → enter code
 * - Account is automatically created on first login
 * 
 * Redirect users to /auth/login or /signup (both use the same OAuth flow).
 */
export async function POST() {
  return NextResponse.json(
    { 
      error: 'This registration endpoint is deprecated',
      message: 'This store uses passwordless authentication. Account creation happens automatically during the sign-in process.',
      redirect: '/signup',
      help: 'Visit /signup to create an account. Enter your email address and you will receive a secure one-time code.'
    },
    { status: 410 } // 410 Gone
  )
}

export const dynamic = 'force-dynamic'
