import { NextRequest, NextResponse } from 'next/server'
import { getCustomerServer, updateCustomerServer } from '@/lib/shopify/customer-account-server'
import { cookies } from 'next/headers'
import { z } from 'zod'

// Validation schema for profile updates
const updateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  acceptsMarketing: z.boolean().optional(),
})

// Get customer profile
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const customerAccessToken = cookieStore.get('customerAccessToken')?.value

    if (!customerAccessToken) {
      // This is expected behavior for unauthenticated users
      // No need to log this as an error
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Get customer data from Shopify
    const customer = await getCustomerServer(customerAccessToken)

    if (!customer) {
      console.error('Customer not found for valid token')
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      customer
    })

  } catch (error) {
    console.error('Get customer profile error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Update customer profile
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const customerAccessToken = cookieStore.get('customerAccessToken')?.value

    if (!customerAccessToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Validate input
    const validatedData = updateProfileSchema.parse(body)

    // Update customer using Shopify Customer Account API
    const result = await updateCustomerServer(customerAccessToken, validatedData)

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

    return NextResponse.json({
      success: true,
      customer: result.customer,
      message: 'Profile updated successfully'
    })

  } catch (error) {
    console.error('Update customer profile error:', error)

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