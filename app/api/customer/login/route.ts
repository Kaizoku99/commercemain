import { NextRequest, NextResponse } from 'next/server'
import { createCustomerAccessTokenServer } from '@/lib/shopify/customer-account-server'
import { z } from 'zod'
import { cookies } from 'next/headers'

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = loginSchema.parse(body)
    
    // Create customer access token using Shopify Customer Account API
    const result = await createCustomerAccessTokenServer(validatedData)
    
    // Check for errors
    if (result.customerUserErrors && result.customerUserErrors.length > 0) {
      const error = result.customerUserErrors[0]
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          field: error.field 
        },
        { status: 401 }
      )
    }
    
    if (!result.customerAccessToken) {
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 401 }
      )
    }
    
    // Set secure cookie with access token
    const cookieStore = await cookies()
    cookieStore.set('customerAccessToken', result.customerAccessToken.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    
    // Success
    return NextResponse.json({
      success: true,
      accessToken: result.customerAccessToken.accessToken,
      expiresAt: result.customerAccessToken.expiresAt,
      message: 'Login successful'
    })
    
  } catch (error) {
    console.error('Customer login error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation error',
          details: error.errors 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'