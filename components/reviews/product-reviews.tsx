'use client'

import { useState, useEffect } from 'react'
import { Star, ThumbsUp, ThumbsDown, Flag, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { useCustomer } from '@/hooks/use-customer'
import { cn } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'

interface Review {
  id: string
  rating: number
  title: string
  content: string
  author: {
    name: string
    avatar?: string
    verified: boolean
  }
  createdAt: string
  helpful: number
  notHelpful: number
  userVote?: 'helpful' | 'not-helpful'
  images?: string[]
  verified_purchase: boolean
}

interface ReviewSummary {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

interface ProductReviewsProps {
  productId: string
  productTitle: string
  className?: string
}

export function ProductReviews({ productId, productTitle, className }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [summary, setSummary] = useState<ReviewSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWriteReview, setShowWriteReview] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest')
  const [filterBy, setFilterBy] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all')

  const { customer } = useCustomer()
  const t = useTranslations('reviews')
  const locale = useLocale()

  useEffect(() => {
    fetchReviews()
  }, [productId, sortBy, filterBy])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reviews/product/${productId}?sort=${sortBy}&filter=${filterBy}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setSummary(data.summary)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVote = async (reviewId: string, vote: 'helpful' | 'not-helpful') => {
    try {
      const response = await fetch(`/api/reviews/vote/${reviewId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vote }),
      })

      if (response.ok) {
        // Update the review in state
        setReviews(prev => prev.map(review => {
          if (review.id === reviewId) {
            const updatedReview = { ...review }

            // Remove previous vote if exists
            if (review.userVote === 'helpful') {
              updatedReview.helpful -= 1
            } else if (review.userVote === 'not-helpful') {
              updatedReview.notHelpful -= 1
            }

            // Add new vote
            if (vote === 'helpful') {
              updatedReview.helpful += 1
            } else {
              updatedReview.notHelpful += 1
            }

            updatedReview.userVote = vote
            return updatedReview
          }
          return review
        }))
      }
    } catch (error) {
      console.error('Error voting on review:', error)
    }
  }

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    }

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              sizeClasses[size],
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            )}
          />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale === 'ar' ? 'ar-AE' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('customerReviews')}</h2>
        {customer && (
          <Button
            onClick={() => setShowWriteReview(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {t('writeReview')}
          </Button>
        )}
      </div>

      {/* Review Summary */}
      {summary && (
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {summary.averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(summary.averageRating), 'lg')}
                <div className="text-sm text-gray-600 mt-2">
                  {t('basedOnReviews', { count: summary.totalReviews })}
                </div>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = summary.ratingDistribution[rating as keyof typeof summary.ratingDistribution]
                  const percentage = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0

                  return (
                    <div key={rating} className="flex items-center gap-2 text-sm">
                      <span className="w-8">{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="w-8 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Sorting */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="sort">{t('sortBy')}</Label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="newest">{t('newest')}</option>
            <option value="oldest">{t('oldest')}</option>
            <option value="highest">{t('highestRating')}</option>
            <option value="lowest">{t('lowestRating')}</option>
            <option value="helpful">{t('mostHelpful')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Label htmlFor="filter">{t('filter')}</Label>
          <select
            id="filter"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as any)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">{t('allReviews')}</option>
            <option value="5">{t('stars', { count: 5 })}</option>
            <option value="4">{t('stars', { count: 4 })}</option>
            <option value="3">{t('stars', { count: 3 })}</option>
            <option value="2">{t('stars', { count: 2 })}</option>
            <option value="1">{t('star', { count: 1 })}</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-gray-500">
                {t('noReviews')}
              </div>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={review.author.avatar} />
                        <AvatarFallback>
                          <User className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.author.name}</span>
                          {review.author.verified && (
                            <Badge variant="secondary" className="text-xs">
                              {t('verified')}
                            </Badge>
                          )}
                          {review.verified_purchase && (
                            <Badge variant="outline" className="text-xs">
                              {t('verifiedPurchase')}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {renderStars(review.rating, 'sm')}
                          <span className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Review Content */}
                  <div>
                    {review.title && (
                      <h4 className="font-medium mb-2">{review.title}</h4>
                    )}
                    <p className="text-gray-700 leading-relaxed">{review.content}</p>
                  </div>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Review Actions */}
                  <div className="flex items-center gap-4 pt-2 border-t">
                    <span className="text-sm text-gray-600">{t('wasHelpful')}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={review.userVote === 'helpful' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleVote(review.id, 'helpful')}
                        className="flex items-center gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {review.helpful}
                      </Button>
                      <Button
                        variant={review.userVote === 'not-helpful' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleVote(review.id, 'not-helpful')}
                        className="flex items-center gap-1"
                      >
                        <ThumbsDown className="w-3 h-3" />
                        {review.notHelpful}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <WriteReviewModal
          productId={productId}
          productTitle={productTitle}
          onClose={() => setShowWriteReview(false)}
          onSubmit={() => {
            setShowWriteReview(false)
            fetchReviews()
          }}
        />
      )}
    </div>
  )
}

interface WriteReviewModalProps {
  productId: string
  productTitle: string
  onClose: () => void
  onSubmit: () => void
}

function WriteReviewModal({ productId, productTitle, onClose, onSubmit }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (!content.trim()) {
      setError('Please write a review')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim(),
          content: content.trim(),
        }),
      })

      if (response.ok) {
        onSubmit()
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to submit review')
      }
    } catch (error) {
      setError('Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
          <p className="text-sm text-gray-600">{productTitle}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Rating */}
            <div>
              <Label>Rating *</Label>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                  >
                    <Star
                      className={cn(
                        'w-6 h-6',
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title">Title (optional)</Label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarize your review"
                className="w-full mt-1 px-3 py-2 border rounded-md"
                maxLength={100}
              />
            </div>

            {/* Content */}
            <div>
              <Label htmlFor="content">Review *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts about this product"
                className="mt-1"
                rows={4}
                maxLength={1000}
                required
              />
              <div className="text-xs text-gray-500 mt-1">
                {content.length}/1000 characters
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}