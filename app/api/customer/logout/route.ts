import { NextRequest, NextResponse } from 'next/server'
import { deleteCustomerAccessTokenServer } from '@/lib/shopify/customer-account-server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const customerAccessToken = cookieStore.get('customerAccessToken')?.value
    
    if (customerAccessToken) {
      // Delete access token from Shopify
      try {
        await deleteCustomerAccessTokenServer(customerAccessToken)
      } catch (error) {
        console.error('Error deleting customer access token:', error)
        // Continue with logout even if Shopify call fails
      }
    }
    
    // Clear the cookie
    cookieStore.delete('customerAccessToken')
    
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    })
    
  } catch (error) {
    console.error('Customer logout error:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'