import { NextRequest, NextResponse } from 'next/server'
import {
  getOAuthState,
  clearOAuthState,
  exchangeCodeForTokens,
  storeTokens,
  getConfig,
} from '@/lib/shopify/customer-account-oauth'

export async function GET(request: NextRequest) {
  try {
    const config = getConfig()
    const { searchParams } = new URL(request.url)

    // Get the authorization code and state from query params
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('[Auth/Callback] Received callback, code:', !!code, 'state:', !!state, 'error:', error)

    // Check for OAuth errors from Shopify
    if (error) {
      console.error('[Auth/Callback] OAuth error:', error, errorDescription)
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`, config.siteUrl)
      )
    }

    // Validate that we received a code
    if (!code) {
      console.error('[Auth/Callback] Missing authorization code')
      return NextResponse.redirect(
        new URL('/auth/login?error=missing_code', config.siteUrl)
      )
    }

    // Get stored OAuth state
    const storedState = await getOAuthState()

    if (!storedState.codeVerifier) {
      console.error('[Auth/Callback] Missing code verifier in session')
      return NextResponse.redirect(
        new URL('/auth/login?error=session_expired', config.siteUrl)
      )
    }

    // Validate state to prevent CSRF attacks
    // Note: State might be base64 encoded with returnTo data
    let returnTo = '/account'
    
    if (state) {
      try {
        // Try to decode state as JSON (contains returnTo)
        const stateData = JSON.parse(Buffer.from(state, 'base64url').toString())
        if (stateData.returnTo) {
          returnTo = stateData.returnTo
        }
        // Validate CSRF token if included
        if (stateData.csrf && stateData.csrf !== storedState.state) {
          console.error('[Auth/Callback] State mismatch - possible CSRF attack')
          return NextResponse.redirect(
            new URL('/auth/login?error=invalid_state', config.siteUrl)
          )
        }
      } catch {
        // State is not JSON, compare directly
        if (state !== storedState.state) {
          console.error('[Auth/Callback] State mismatch - possible CSRF attack')
          return NextResponse.redirect(
            new URL('/auth/login?error=invalid_state', config.siteUrl)
          )
        }
      }
    }

    console.log('[Auth/Callback] Exchanging code for tokens')

    // Exchange the authorization code for tokens
    const tokens = await exchangeCodeForTokens(code, storedState.codeVerifier)

    console.log('[Auth/Callback] Token exchange successful')

    // Store tokens in cookies
    await storeTokens(tokens)

    // Clear OAuth state cookies
    await clearOAuthState()

    console.log('[Auth/Callback] Login complete, redirecting to:', returnTo)

    // Redirect to the account page or original destination
    return NextResponse.redirect(new URL(returnTo, config.siteUrl))
  } catch (error) {
    console.error('[Auth/Callback] Error handling callback:', error)
    
    const config = getConfig()
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.redirect(
      new URL(`/auth/login?error=${encodeURIComponent(errorMessage)}`, config.siteUrl)
    )
  }
}

export const dynamic = 'force-dynamic'
