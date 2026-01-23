/**
 * ATP Membership System Types - Main Export
 * 
 * Central export file for all membership-related types and interfaces
 */

// Core membership types
export type {
  AtpMembership,
  MembershipStatus,
  PaymentStatus,
  MembershipBenefits,
  MembershipStats,
  CreateMembershipPayload,
  RenewMembershipPayload,
  UpdateMembershipPayload,
  DiscountCalculation,
  ServiceDiscountInfo,
  MembershipValidation,
  MembershipNotification,
  MembershipAnalytics,
  MembershipReportData,
  MembershipApiResponse,
  MembershipResult,
  MembershipErrorResponse
} from './membership';

// Error handling
export {
  MembershipError,
  MembershipErrorCode
} from './membership';

// Enums
export {
  EligibleService
} from './membership';

// Utility types and type guards
export type {
  MembershipOperationType,
  MembershipOperation,
  PartialMembership,
  MembershipQueryFilters,
  PaginationParams,
  PaginatedResponse,
  MembershipEventType,
  MembershipEvent
} from './membership-utils';

export {
  isMembershipActive,
  isMembershipExpired,
  isMembershipExpiringSoon,
  isValidMembershipStatus,
  isValidPaymentStatus,
  isMembershipError
} from './membership-utils';

// Constants
export {
  MEMBERSHIP_CONFIG,
  ELIGIBLE_SERVICES,
  SERVICE_DISPLAY_NAMES,
  SHOPIFY_METAFIELD_KEYS,
  STORAGE_KEYS,
  CACHE_CONFIG,
  API_ENDPOINTS,
  ERROR_MESSAGES
} from '../constants/membership';