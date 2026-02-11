import { NextRequest, NextResponse } from 'next/server'
import { isLoggedIn } from '@/lib/shopify/customer-account-oauth'
import { AtpMembershipService } from '@/lib/services/atp-membership-service'

export async function GET(request: NextRequest) {
  try {
    const loggedIn = await isLoggedIn()

    if (!loggedIn) {
      return NextResponse.json({
        isMember: false,
        tier: null,
        discountRate: 0,
        membership: null,
      })
    }

    const customerId = request.nextUrl.searchParams.get('customerId')
    if (!customerId) {
      return NextResponse.json(
        {
          isMember: false,
          tier: null,
          discountRate: 0,
          membership: null,
          error: 'customerId is required',
        },
        { status: 400 }
      )
    }

    const membershipService = AtpMembershipService.getInstance()
    const membershipResult = await membershipService.getMembership(customerId)

    if (!membershipResult.success) {
      return NextResponse.json(
        {
          isMember: false,
          tier: null,
          discountRate: 0,
          membership: null,
          error: membershipResult.error?.message || 'Failed to load membership',
        },
        { status: 500 }
      )
    }

    const membership = membershipResult.data
    const validation = membershipService.validateMembership(membership)
    const isActiveMember = !!membership && validation.isActive

    return NextResponse.json({
      isMember: isActiveMember,
      tier: isActiveMember ? 'atp' : null,
      discountRate: isActiveMember ? membership.benefits.serviceDiscount : 0,
      membership,
    })
  } catch (error) {
    console.error('[Membership/Status] Failed to load membership status:', error)
    return NextResponse.json(
      {
        isMember: false,
        tier: null,
        discountRate: 0,
        membership: null,
        error: 'Failed to load membership status',
      },
      { status: 500 }
    )
  }
}

export const dynamic = 'force-dynamic'
