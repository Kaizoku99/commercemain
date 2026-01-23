import { NextRequest, NextResponse } from 'next/server'
import { createCustomerServer } from '@/lib/shopify/customer-account-server'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  acceptsMarketing: z.boolean().optional().default(false),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = registerSchema.parse(body)
    
    // Create customer using Shopify Customer Account API
    const result = await createCustomerServer(validatedData)
    
    // Check for errors
    if (result.customerUserErrors && result.customerUserErrors.length > 0) {
      const error = result.customerUserErrors[0]
      return NextResponse.json(
        { 
          error: error.message,
          code: error.code,
          field: error.field 
        },
        { status: 400 }
      )
    }
    
    // Success
    return NextResponse.json({
      success: true,
      customer: result.customer,
      message: 'Customer account created successfully'
    })
    
  } catch (error) {
    console.error('Customer registration error:', error)
    
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