import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// Mock data for demonstration - replace with actual database
const mockReviews = [
    {
        id: '1',
        productId: 'product-1',
        rating: 5,
        title: 'Excellent product!',
        content: 'This product exceeded my expectations. Great quality and fast shipping.',
        author: {
            name: 'Ahmed Al-Rashid',
            avatar: null,
            verified: true
        },
        createdAt: '2024-01-15T10:30:00Z',
        helpful: 12,
        notHelpful: 1,
        verified_purchase: true
    },
    {
        id: '2',
        productId: 'product-1',
        rating: 4,
        title: 'Good value for money',
        content: 'Solid product with good build quality. Delivery was quick and packaging was secure.',
        author: {
            name: 'Sarah Johnson',
            avatar: null,
            verified: false
        },
        createdAt: '2024-01-10T14:20:00Z',
        helpful: 8,
        notHelpful: 0,
        verified_purchase: true
    },
    {
        id: '3',
        productId: 'product-1',
        rating: 3,
        title: 'Average product',
        content: 'The product is okay but nothing special. Could be better for the price.',
        author: {
            name: 'Mohammed Hassan',
            avatar: null,
            verified: true
        },
        createdAt: '2024-01-05T09:15:00Z',
        helpful: 3,
        notHelpful: 2,
        verified_purchase: false
    }
]

const querySchema = z.object({
    sort: z.enum(['newest', 'oldest', 'highest', 'lowest', 'helpful']).optional().default('newest'),
    filter: z.enum(['all', '5', '4', '3', '2', '1']).optional().default('all'),
})

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ productId: string }> }
) {
    try {
        const { productId } = await params
        const { searchParams } = new URL(request.url)

        const { sort, filter } = querySchema.parse({
            sort: searchParams.get('sort'),
            filter: searchParams.get('filter'),
        })

        // Filter reviews by product ID
        let reviews = mockReviews.filter(review => review.productId === productId)

        // Apply rating filter
        if (filter !== 'all') {
            const filterRating = parseInt(filter)
            reviews = reviews.filter(review => review.rating === filterRating)
        }

        // Apply sorting
        switch (sort) {
            case 'newest':
                reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
            case 'oldest':
                reviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                break
            case 'highest':
                reviews.sort((a, b) => b.rating - a.rating)
                break
            case 'lowest':
                reviews.sort((a, b) => a.rating - b.rating)
                break
            case 'helpful':
                reviews.sort((a, b) => b.helpful - a.helpful)
                break
        }

        // Calculate summary statistics
        const totalReviews = reviews.length
        const averageRating = totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
            : 0

        const ratingDistribution = {
            5: reviews.filter(r => r.rating === 5).length,
            4: reviews.filter(r => r.rating === 4).length,
            3: reviews.filter(r => r.rating === 3).length,
            2: reviews.filter(r => r.rating === 2).length,
            1: reviews.filter(r => r.rating === 1).length,
        }

        const summary = {
            averageRating,
            totalReviews,
            ratingDistribution
        }

        return NextResponse.json({
            reviews,
            summary
        })

    } catch (error) {
        console.error('Get reviews error:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    error: 'Invalid query parameters',
                    details: error.errors
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { error: 'Failed to fetch reviews' },
            { status: 500 }
        )
    }
}

export const dynamic = 'force-dynamic'
