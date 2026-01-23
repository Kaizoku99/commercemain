/**
 * ATP Membership System Types and Interfaces
 * 
 * Core TypeScript interfaces for the ATP Group Services Membership system
 * that provides 99 د.إ annual membership with 15% service discounts and free delivery.
 */

// Core membership interface
export interface AtpMembership {
  id: string;
  customerId: string;
  status: MembershipStatus;
  startDate: string;
  expirationDate: string;
  subscriptionId?: string;
  paymentStatus: PaymentStatus;
  benefits: MembershipBenefits;
  createdAt: string;
  updatedAt: string;
}

// Membership status enumeration
export type MembershipStatus = 'active' | 'expired' | 'cancelled' | 'pending';

// Payment status enumeration
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

// Membership benefits interface
export interface MembershipBenefits {
  serviceDiscount: number; // 15% = 0.15
  freeDelivery: boolean;
  eligibleServices: string[];
  annualFee: number; // 99 AED
}

// Membership statistics interface
export interface MembershipStats {
  totalSavings: number;
  servicesUsed: number;
  ordersWithFreeDelivery: number;
  memberSince: string;
  lastServiceDate?: string;
  averageOrderValue: number;
  totalOrders: number;
}

// Membership creation payload
export interface CreateMembershipPayload {
  customerId: string;
  paymentMethodId?: string;
  subscriptionId?: string;
}

// Membership renewal payload
export interface RenewMembershipPayload {
  membershipId: string;
  paymentMethodId?: string;
  extendFromCurrentExpiration?: boolean;
}

// Membership update payload
export interface UpdateMembershipPayload {
  status?: MembershipStatus;
  paymentStatus?: PaymentStatus;
  expirationDate?: string;
  subscriptionId?: string;
}

// Error handling types and enums
export enum MembershipErrorCode {
  MEMBERSHIP_NOT_FOUND = 'MEMBERSHIP_NOT_FOUND',
  MEMBERSHIP_EXPIRED = 'MEMBERSHIP_EXPIRED',
  MEMBERSHIP_ALREADY_EXISTS = 'MEMBERSHIP_ALREADY_EXISTS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  INVALID_CUSTOMER = 'INVALID_CUSTOMER',
  INVALID_MEMBERSHIP_DATA = 'INVALID_MEMBERSHIP_DATA',
  SHOPIFY_API_ERROR = 'SHOPIFY_API_ERROR',
  DISCOUNT_APPLICATION_FAILED = 'DISCOUNT_APPLICATION_FAILED',
  RENEWAL_FAILED = 'RENEWAL_FAILED',
  CANCELLATION_FAILED = 'CANCELLATION_FAILED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

export class MembershipError extends Error {
  constructor(
    message: string,
    public code: MembershipErrorCode,
    public details?: any,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'MembershipError';
  }
}

// Error response interface
export interface MembershipErrorResponse {
  error: {
    code: MembershipErrorCode;
    message: string;
    details?: any;
  };
  timestamp: string;
  requestId?: string;
}

// API response wrapper types
export interface MembershipApiResponse<T> {
  data?: T;
  error?: MembershipErrorResponse['error'];
  success: boolean;
  timestamp: string;
}

// Service operation result type
export type MembershipResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: MembershipError;
};

// Discount calculation types
export interface DiscountCalculation {
  originalPrice: number;
  discountAmount: number;
  discountPercentage: number;
  finalPrice: number;
  savings: number;
}

export interface ServiceDiscountInfo {
  serviceId: string;
  serviceName: string;
  isEligible: boolean;
  discountPercentage: number;
  originalPrice: number;
  discountedPrice: number;
}

// Eligible services enumeration
export enum EligibleService {
  HOME_MASSAGE_SPA = 'home-massage-spa',
  EMS_TRAINING = 'ems-training',
  HOME_YOGA = 'home-yoga',
  COSMETICS_SUPPLEMENTS = 'cosmetics-supplements'
}

// Membership validation result
export interface MembershipValidation {
  isValid: boolean;
  isActive: boolean;
  isExpired: boolean;
  daysUntilExpiration: number;
  requiresRenewal: boolean;
  errors: string[];
}

// Membership notification types
export interface MembershipNotification {
  type: 'renewal_reminder' | 'expiration_warning' | 'expired' | 'renewed' | 'cancelled';
  membershipId: string;
  customerId: string;
  message: string;
  actionRequired: boolean;
  expirationDate?: string;
  renewalUrl?: string;
}

// Analytics and reporting types
export interface MembershipAnalytics {
  totalMemberships: number;
  activeMemberships: number;
  expiredMemberships: number;
  cancelledMemberships: number;
  newMembershipsThisMonth: number;
  renewalRate: number;
  totalRevenue: number;
  monthlyRevenue: number;
  averageRevenuePerMember: number;
  expiringThisMonth: number;
  totalMembers: number;
  activeMembers: number;
  expiredMembers: number;
  cancelledMembers: number;
  averageLifetimeValue: number;
  churnRate: number;
  memberSavings: number;
}

export interface MembershipReportData {
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  analytics: MembershipAnalytics;
  topServices: Array<{
    serviceId: string;
    serviceName: string;
    usageCount: number;
    totalSavings: number;
  }>;
}