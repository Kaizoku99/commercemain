import { NextRequest, NextResponse } from 'next/server'
import { recoverCustomerPasswordServer } from '@/lib/shopify/customer-account-server'
import { z } from 'zod'

// Validation schema
const passwordResetSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = passwordResetSchema.parse(body)
    
    // Send password reset email using Shopify Customer Account API
    const success = await recoverCustomerPasswordServer(validatedData.email)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send password reset email' },
        { status: 400 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Password reset email sent successfully'
    })
    
  } catch (error) {
    console.error('Password reset error:', error)
    
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