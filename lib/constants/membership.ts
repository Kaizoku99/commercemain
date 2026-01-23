/**
 * ATP Membership System Constants
 * 
 * Configuration constants for the ATP Group Services Membership system
 */

import { EligibleService } from '../types/membership';

// Membership pricing and benefits
export const MEMBERSHIP_CONFIG = {
  ANNUAL_FEE: 99, // AED
  SERVICE_DISCOUNT_PERCENTAGE: 0.15, // 15%
  FREE_DELIVERY: true,
  STANDARD_DELIVERY_COST: 25, // AED - standard delivery cost that members save
  MEMBERSHIP_DURATION_MONTHS: 12,
  RENEWAL_REMINDER_DAYS: 30,
  EXPIRATION_WARNING_DAYS: 7,
} as const;

// Eligible services for membership discounts
export const ELIGIBLE_SERVICES = [
  EligibleService.HOME_MASSAGE_SPA,
  EligibleService.EMS_TRAINING,
  EligibleService.HOME_YOGA,
  EligibleService.COSMETICS_SUPPLEMENTS,
] as const;

// Service display names mapping
export const SERVICE_DISPLAY_NAMES = {
  [EligibleService.HOME_MASSAGE_SPA]: 'Home Massage & Spa Services',
  [EligibleService.EMS_TRAINING]: 'EMS Training',
  [EligibleService.HOME_YOGA]: 'Home Yoga Sessions',
  [EligibleService.COSMETICS_SUPPLEMENTS]: 'Cosmetics & Healthy Food Supplements',
} as const;

// Shopify metafield keys for membership data
export const SHOPIFY_METAFIELD_KEYS = {
  MEMBERSHIP_STATUS: 'atp.membership.status',
  MEMBERSHIP_START_DATE: 'atp.membership.start_date',
  MEMBERSHIP_EXPIRATION_DATE: 'atp.membership.expiration_date',
  MEMBERSHIP_SUBSCRIPTION_ID: 'atp.membership.subscription_id',
  MEMBERSHIP_TOTAL_SAVINGS: 'atp.membership.total_savings',
  MEMBERSHIP_SERVICES_USED: 'atp.membership.services_used',
  MEMBERSHIP_ORDERS_WITH_FREE_DELIVERY: 'atp.membership.orders_with_free_delivery',
  MEMBERSHIP_PAYMENT_STATUS: 'atp.membership.payment_status',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  MEMBERSHIP_DATA: 'atp_membership_data',
  MEMBERSHIP_CACHE_TIMESTAMP: 'atp_membership_cache_timestamp',
  MEMBERSHIP_STATS: 'atp_membership_stats',
} as const;

// Cache configuration
export const CACHE_CONFIG = {
  MEMBERSHIP_TTL: 5 * 60 * 1000, // 5 minutes in milliseconds
  STATS_TTL: 15 * 60 * 1000, // 15 minutes in milliseconds
} as const;

// API endpoints (relative paths)
export const API_ENDPOINTS = {
  MEMBERSHIP: '/api/membership',
  MEMBERSHIP_STATS: '/api/membership/stats',
  MEMBERSHIP_RENEW: '/api/membership/renew',
  MEMBERSHIP_CANCEL: '/api/membership/cancel',
  MEMBERSHIP_VALIDATE: '/api/membership/validate',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  MEMBERSHIP_NOT_FOUND: 'Membership not found for this customer',
  MEMBERSHIP_EXPIRED: 'Your membership has expired. Please renew to continue enjoying benefits',
  PAYMENT_FAILED: 'Payment processing failed. Please try again or use a different payment method',
  INVALID_CUSTOMER: 'Invalid customer information provided',
  NETWORK_ERROR: 'Network error occurred. Please check your connection and try again',
  VALIDATION_ERROR: 'Invalid data provided. Please check your information and try again',
  DISCOUNT_APPLICATION_FAILED: 'Failed to apply membership discount. Please try again',
  RENEWAL_FAILED: 'Membership renewal failed. Please try again or contact support',
  CANCELLATION_FAILED: 'Membership cancellation failed. Please contact support for assistance',
} as const;