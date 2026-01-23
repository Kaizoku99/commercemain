/**
 * ATP Membership System Utility Types
 * 
 * Additional utility types and type guards for the membership system
 */

import { AtpMembership, MembershipStatus, PaymentStatus, MembershipError, MembershipErrorCode } from './membership';

// Type guards for membership validation
export const isMembershipActive = (membership: AtpMembership): boolean => {
  return membership.status === 'active' && 
         membership.paymentStatus === 'paid' && 
         new Date(membership.expirationDate) > new Date();
};

export const isMembershipExpired = (membership: AtpMembership): boolean => {
  return membership.status === 'expired' || 
         new Date(membership.expirationDate) <= new Date();
};

export const isMembershipExpiringSoon = (membership: AtpMembership, days: number = 30): boolean => {
  const expirationDate = new Date(membership.expirationDate);
  const warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + days);
  
  return expirationDate <= warningDate && expirationDate > new Date();
};

// Type predicates
export const isValidMembershipStatus = (status: string): status is MembershipStatus => {
  return ['active', 'expired', 'cancelled', 'pending'].includes(status);
};

export const isValidPaymentStatus = (status: string): status is PaymentStatus => {
  return ['paid', 'pending', 'failed', 'refunded'].includes(status);
};

export const isMembershipError = (error: any): error is MembershipError => {
  return error instanceof MembershipError || 
         (error && typeof error.code === 'string' && error.code in MembershipErrorCode);
};

// Utility types for API operations
export type MembershipOperationType = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'renew'
  | 'cancel'
  | 'validate';

export interface MembershipOperation {
  type: MembershipOperationType;
  membershipId?: string;
  customerId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Partial membership for updates
export type PartialMembership = Partial<Omit<AtpMembership, 'id' | 'customerId' | 'createdAt'>>;

// Membership query filters
export interface MembershipQueryFilters {
  status?: MembershipStatus[];
  paymentStatus?: PaymentStatus[];
  expiringBefore?: string;
  createdAfter?: string;
  createdBefore?: string;
  customerId?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: keyof AtpMembership;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Event types for membership lifecycle
export type MembershipEventType = 
  | 'membership.created'
  | 'membership.renewed'
  | 'membership.cancelled'
  | 'membership.expired'
  | 'membership.payment.succeeded'
  | 'membership.payment.failed'
  | 'membership.expiring.soon';

export interface MembershipEvent {
  type: MembershipEventType;
  membershipId: string;
  customerId: string;
  timestamp: string;
  data: Record<string, any>;
}