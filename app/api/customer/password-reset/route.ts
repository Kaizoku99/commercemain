import { NextResponse } from 'next/server'

/**
 * DEPRECATED: This endpoint is for Legacy Customer Accounts (password-based).
 * 
 * This Shopify store uses "New Customer Accounts" (OAuth-based, passwordless).
 * 
 * With the new OAuth flow:
 * - There are NO PASSWORDS to reset
 * - Users receive a one-time code via email each time they sign in
 * - This is more secure and eliminates forgotten password issues
 * 
 * If a user needs to access their account, they should:
 * 1. Go to /auth/login
 * 2. Click "Continue with Email"
 * 3. Enter their email address
 * 4. Receive and enter the one-time code
 */
export async function POST() {
  return NextResponse.json(
    { 
      error: 'Password reset is not applicable',
      message: 'This store uses passwordless authentication. There is no password to reset.',
      redirect: '/auth/login',
      help: 'To access your account, visit /auth/login and enter your email. You will receive a secure one-time code - no password needed!'
    },
    { status: 410 } // 410 Gone
  )
}

export const dynamic = 'force-dynamic'
