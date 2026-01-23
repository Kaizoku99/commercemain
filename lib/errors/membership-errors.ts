/**
 * Comprehensive error handling for ATP Membership System
 * Provides specific error codes and detailed error information
 */

export enum MembershipErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_CUSTOMER = 'INVALID_CUSTOMER',
  CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',
  
  // Membership Status
  MEMBERSHIP_NOT_FOUND = 'MEMBERSHIP_NOT_FOUND',
  MEMBERSHIP_EXPIRED = 'MEMBERSHIP_EXPIRED',
  MEMBERSHIP_ALREADY_EXISTS = 'MEMBERSHIP_ALREADY_EXISTS',
  MEMBERSHIP_CANCELLED = 'MEMBERSHIP_CANCELLED',
  
  // Payment & Billing
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REQUIRED = 'PAYMENT_REQUIRED',
  INVALID_PAYMENT_METHOD = 'INVALID_PAYMENT_METHOD',
  SUBSCRIPTION_FAILED = 'SUBSCRIPTION_FAILED',
  
  // API & Integration
  SHOPIFY_API_ERROR = 'SHOPIFY_API_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  
  // Discount & Benefits
  DISCOUNT_APPLICATION_FAILED = 'DISCOUNT_APPLICATION_FAILED',
  INVALID_DISCOUNT_CODE = 'INVALID_DISCOUNT_CODE',
  BENEFIT_NOT_AVAILABLE = 'BENEFIT_NOT_AVAILABLE',
  
  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  REQUIRED_FIELD_MISSING = 'REQUIRED_FIELD_MISSING',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface MembershipErrorDetails {
  field?: string;
  value?: any;
  expected?: any;
  context?: Record<string, any>;
  timestamp?: string;
  requestId?: string;
}

export class MembershipError extends Error {
  public readonly code: MembershipErrorCode;
  public readonly details: MembershipErrorDetails;
  public readonly isRetryable: boolean;
  public readonly statusCode: number;

  constructor(
    message: string,
    code: MembershipErrorCode,
    details: MembershipErrorDetails = {},
    isRetryable: boolean = false,
    statusCode: number = 400
  ) {
    super(message);
    this.name = 'MembershipError';
    this.code = code;
    this.details = {
      ...details,
      timestamp: new Date().toISOString(),
      requestId: details.requestId || this.generateRequestId()
    };
    this.isRetryable = isRetryable;
    this.statusCode = statusCode;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MembershipError);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Convert error to JSON for logging and API responses
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      isRetryable: this.isRetryable,
      statusCode: this.statusCode,
      stack: this.stack
    };
  }

  /**
   * Get user-friendly error message
   */
  getUserMessage(): string {
    switch (this.code) {
      case MembershipErrorCode.MEMBERSHIP_NOT_FOUND:
        return 'No active membership found. Please purchase a membership to access benefits.';
      case MembershipErrorCode.MEMBERSHIP_EXPIRED:
        return 'Your membership has expired. Please renew to continue enjoying benefits.';
      case MembershipErrorCode.PAYMENT_FAILED:
        return 'Payment processing failed. Please check your payment method and try again.';
      case MembershipErrorCode.NETWORK_ERROR:
        return 'Connection error. Please check your internet connection and try again.';
      case MembershipErrorCode.SERVICE_UNAVAILABLE:
        return 'Service temporarily unavailable. Please try again later.';
      case MembershipErrorCode.DISCOUNT_APPLICATION_FAILED:
        return 'Unable to apply membership discount. Please contact support if this continues.';
      case MembershipErrorCode.VALIDATION_FAILED:
        return 'Please check your information and try again.';
      default:
        return 'An unexpected error occurred. Please try again or contact support.';
    }
  }

  /**
   * Check if error should trigger a retry
   */
  shouldRetry(): boolean {
    return this.isRetryable && [
      MembershipErrorCode.NETWORK_ERROR,
      MembershipErrorCode.SERVICE_UNAVAILABLE,
      MembershipErrorCode.RATE_LIMIT_EXCEEDED
    ].includes(this.code);
  }
}

/**
 * Factory functions for common membership errors
 */
export class MembershipErrorFactory {
  static membershipNotFound(customerId?: string): MembershipError {
    return new MembershipError(
      'Membership not found',
      MembershipErrorCode.MEMBERSHIP_NOT_FOUND,
      { context: { customerId } },
      false,
      404
    );
  }

  static membershipExpired(expirationDate?: string): MembershipError {
    return new MembershipError(
      'Membership has expired',
      MembershipErrorCode.MEMBERSHIP_EXPIRED,
      { context: { expirationDate } },
      false,
      403
    );
  }

  static paymentFailed(reason?: string): MembershipError {
    return new MembershipError(
      'Payment processing failed',
      MembershipErrorCode.PAYMENT_FAILED,
      { context: { reason } },
      true,
      402
    );
  }

  static shopifyApiError(originalError: Error): MembershipError {
    return new MembershipError(
      'Shopify API error',
      MembershipErrorCode.SHOPIFY_API_ERROR,
      { context: { originalMessage: originalError.message } },
      true,
      503
    );
  }

  static networkError(originalError?: Error): MembershipError {
    return new MembershipError(
      'Network connection error',
      MembershipErrorCode.NETWORK_ERROR,
      { context: { originalMessage: originalError?.message } },
      true,
      503
    );
  }

  static validationError(field: string, value: any, expected?: any): MembershipError {
    return new MembershipError(
      `Validation failed for field: ${field}`,
      MembershipErrorCode.VALIDATION_FAILED,
      { field, value, expected },
      false,
      400
    );
  }

  static discountApplicationFailed(reason?: string): MembershipError {
    return new MembershipError(
      'Failed to apply membership discount',
      MembershipErrorCode.DISCOUNT_APPLICATION_FAILED,
      { context: { reason } },
      true,
      500
    );
  }
}