import { describe, it, expect } from 'vitest';
import { 
  MembershipError, 
  MembershipErrorCode, 
  MembershipErrorFactory 
} from '../../lib/errors/membership-errors';

describe('MembershipError', () => {
  it('should create error with basic properties', () => {
    const error = new MembershipError(
      'Test error',
      MembershipErrorCode.MEMBERSHIP_NOT_FOUND
    );

    expect(error.message).toBe('Test error');
    expect(error.code).toBe(MembershipErrorCode.MEMBERSHIP_NOT_FOUND);
    expect(error.name).toBe('MembershipError');
    expect(error.isRetryable).toBe(false);
    expect(error.statusCode).toBe(400);
  });

  it('should create error with details', () => {
    const details = { field: 'email', value: 'invalid' };
    const error = new MembershipError(
      'Validation failed',
      MembershipErrorCode.VALIDATION_FAILED,
      details
    );

    expect(error.details.field).toBe('email');
    expect(error.details.value).toBe('invalid');
    expect(error.details.timestamp).toBeDefined();
    expect(error.details.requestId).toBeDefined();
  });

  it('should determine retry eligibility correctly', () => {
    const retryableError = new MembershipError(
      'Network error',
      MembershipErrorCode.NETWORK_ERROR,
      {},
      true
    );

    const nonRetryableError = new MembershipError(
      'Validation error',
      MembershipErrorCode.VALIDATION_FAILED
    );

    expect(retryableError.shouldRetry()).toBe(true);
    expect(nonRetryableError.shouldRetry()).toBe(false);
  });

  it('should provide user-friendly messages', () => {
    const membershipNotFound = new MembershipError(
      'Not found',
      MembershipErrorCode.MEMBERSHIP_NOT_FOUND
    );

    const paymentFailed = new MembershipError(
      'Payment failed',
      MembershipErrorCode.PAYMENT_FAILED
    );

    expect(membershipNotFound.getUserMessage()).toContain('No active membership found');
    expect(paymentFailed.getUserMessage()).toContain('Payment processing failed');
  });

  it('should serialize to JSON correctly', () => {
    const error = new MembershipError(
      'Test error',
      MembershipErrorCode.INTERNAL_ERROR,
      { field: 'test' }
    );

    const json = error.toJSON();

    expect(json.name).toBe('MembershipError');
    expect(json.message).toBe('Test error');
    expect(json.code).toBe(MembershipErrorCode.INTERNAL_ERROR);
    expect(json.details.field).toBe('test');
    expect(json.isRetryable).toBe(false);
    expect(json.statusCode).toBe(400);
  });
});

describe('MembershipErrorFactory', () => {
  it('should create membership not found error', () => {
    const error = MembershipErrorFactory.membershipNotFound('customer123');

    expect(error.code).toBe(MembershipErrorCode.MEMBERSHIP_NOT_FOUND);
    expect(error.statusCode).toBe(404);
    expect(error.details.context?.customerId).toBe('customer123');
  });

  it('should create membership expired error', () => {
    const expirationDate = '2024-01-01';
    const error = MembershipErrorFactory.membershipExpired(expirationDate);

    expect(error.code).toBe(MembershipErrorCode.MEMBERSHIP_EXPIRED);
    expect(error.statusCode).toBe(403);
    expect(error.details.context?.expirationDate).toBe(expirationDate);
  });
});
 