import { NextRequest, NextResponse } from 'next/server'
import { predictiveSearchQuery } from '@/lib/shopify/advanced-queries'
import { shopifyFetch } from '@/lib/shopify/server'

export async function POST(request: NextRequest) {
  try {
    const { query, locale } = await request.json()
    
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Parse locale for Shopify API
    const language = locale === 'ar' ? 'AR' : 'EN'
    const country = 'AE'

    // Fetch predictive search results from Shopify with locale context
    const response = await shopifyFetch({
      query: predictiveSearchQuery,
      variables: {
        query: query.trim(),
        first: 10,
        language,
        country
      }
    })

    return NextResponse.json({
      success: true,
      results: response.body.data.predictiveSearch
    })

  } catch (error) {
    console.error('Predictive search error:', error)
    
    return NextResponse.json(
      { error: 'Failed to perform predictive search' },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'