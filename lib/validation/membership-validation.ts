/**
 * Client-side validation for membership forms and operations
 * Provides comprehensive validation with detailed error messages
 */

import { MembershipError, MembershipErrorCode, MembershipErrorFactory } from '../errors/membership-errors';
import type { AtpMembership, MembershipSignupData, MembershipRenewalData } from '../types/membership';

export interface ValidationResult {
  isValid: boolean;
  errors: MembershipError[];
  warnings?: string[];
}

export interface MembershipSignupValidation {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  acceptTerms?: boolean;
  paymentMethod?: string;
}

export interface MembershipRenewalValidation {
  membershipId?: string;
  customerId?: string;
  paymentMethod?: string;
}

export class MembershipValidator {
  /**
   * Validate membership signup form data
   */
  static validateSignupForm(data: MembershipSignupValidation): ValidationResult {
    const errors: MembershipError[] = [];

    // Email validation
    if (!data.email) {
      errors.push(MembershipErrorFactory.validationError('email', data.email, 'valid email address'));
    } else if (!this.isValidEmail(data.email)) {
      errors.push(MembershipErrorFactory.validationError('email', data.email, 'valid email format'));
    }

    // Name validation
    if (!data.firstName || data.firstName.trim().length < 2) {
      errors.push(MembershipErrorFactory.validationError('firstName', data.firstName, 'minimum 2 characters'));
    }

    if (!data.lastName || data.lastName.trim().length < 2) {
      errors.push(MembershipErrorFactory.validationError('lastName', data.lastName, 'minimum 2 characters'));
    }

    // Phone validation (UAE format)
    if (!data.phone) {
      errors.push(MembershipErrorFactory.validationError('phone', data.phone, 'valid phone number'));
    } else if (!this.isValidUAEPhone(data.phone)) {
      errors.push(MembershipErrorFactory.validationError('phone', data.phone, 'valid UAE phone format'));
    }

    // Terms acceptance
    if (!data.acceptTerms) {
      errors.push(new MembershipError(
        'Terms and conditions must be accepted',
        MembershipErrorCode.REQUIRED_FIELD_MISSING,
        { field: 'acceptTerms' }
      ));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate membership renewal form data
   */
  static validateRenewalForm(data: MembershipRenewalValidation): ValidationResult {
    const errors: MembershipError[] = [];

    // Membership ID validation
    if (!data.membershipId) {
      errors.push(MembershipErrorFactory.validationError('membershipId', data.membershipId, 'valid membership ID'));
    }

    // Customer ID validation
    if (!data.customerId) {
      errors.push(MembershipErrorFactory.validationError('customerId', data.customerId, 'valid customer ID'));
    }

    // Payment method validation
    if (!data.paymentMethod) {
      errors.push(MembershipErrorFactory.validationError('paymentMethod', data.paymentMethod, 'valid payment method'));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate membership status for benefit application
   */
  static validateMembershipForBenefits(membership: AtpMembership | null): ValidationResult {
    const errors: MembershipError[] = [];

    if (!membership) {
      errors.push(MembershipErrorFactory.membershipNotFound());
      return { isValid: false, errors };
    }

    // Check if membership is active
    if (membership.status !== 'active') {
      if (membership.status === 'expired') {
        errors.push(MembershipErrorFactory.membershipExpired(membership.expirationDate));
      } else {
        errors.push(new MembershipError(
          `Membership is ${membership.status}`,
          MembershipErrorCode.MEMBERSHIP_CANCELLED,
          { context: { status: membership.status } }
        ));
      }
    }

    // Check expiration date
    const now = new Date();
    const expirationDate = new Date(membership.expirationDate);
    
    if (expirationDate <= now) {
      errors.push(MembershipErrorFactory.membershipExpired(membership.expirationDate));
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate discount application parameters
   */
  static validateDiscountApplication(
    originalPrice: number,
    discountPercentage: number,
    membership: AtpMembership | null
  ): ValidationResult {
    const errors: MembershipError[] = [];

    // Validate price
    if (typeof originalPrice !== 'number' || originalPrice < 0) {
      errors.push(MembershipErrorFactory.validationError('originalPrice', originalPrice, 'positive number'));
    }

    // Validate discount percentage
    if (typeof discountPercentage !== 'number' || discountPercentage < 0 || discountPercentage > 1) {
      errors.push(MembershipErrorFactory.validationError('discountPercentage', discountPercentage, 'number between 0 and 1'));
    }

    // Validate membership for discount eligibility
    const membershipValidation = this.validateMembershipForBenefits(membership);
    if (!membershipValidation.isValid) {
      errors.push(...membershipValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate UAE phone number format
   */
  private static isValidUAEPhone(phone: string): boolean {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // UAE phone patterns:
    // Mobile: +971 5X XXX XXXX (9 digits after country code)
    // Landline: +971 X XXX XXXX (8 digits after country code)
    const uaePatterns = [
      /^971[5][0-9]{8}$/, // Mobile with country code
      /^971[2-4,6-7,9][0-9]{7}$/, // Landline with country code
      /^05[0-9]{8}$/, // Mobile without country code
      /^0[2-4,6-7,9][0-9]{7}$/ // Landline without country code
    ];

    return uaePatterns.some(pattern => pattern.test(cleanPhone));
  }

  /**
   * Sanitize and format phone number for UAE
   */
  static formatUAEPhone(phone: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Add country code if missing
    if (cleanPhone.startsWith('05')) {
      return `971${cleanPhone.substring(1)}`;
    } else if (cleanPhone.startsWith('0')) {
      return `971${cleanPhone.substring(1)}`;
    } else if (!cleanPhone.startsWith('971')) {
      return `971${cleanPhone}`;
    }
    
    return cleanPhone;
  }

  /**
   * Validate form field in real-time
   */
  static validateField(fieldName: string, value: any, context?: any): ValidationResult {
    const errors: MembershipError[] = [];

    switch (fieldName) {
      case 'email':
        if (!value) {
          errors.push(MembershipErrorFactory.validationError('email', value, 'email address'));
        } else if (!this.isValidEmail(value)) {
          errors.push(MembershipErrorFactory.validationError('email', value, 'valid email format'));
        }
        break;

      case 'phone':
        if (!value) {
          errors.push(MembershipErrorFactory.validationError('phone', value, 'phone number'));
        } else if (!this.isValidUAEPhone(value)) {
          errors.push(MembershipErrorFactory.validationError('phone', value, 'valid UAE phone format'));
        }
        break;

      case 'firstName':
      case 'lastName':
        if (!value || value.trim().length < 2) {
          errors.push(MembershipErrorFactory.validationError(fieldName, value, 'minimum 2 characters'));
        }
        break;

      case 'acceptTerms':
        if (!value) {
          errors.push(new MembershipError(
            'Terms and conditions must be accepted',
            MembershipErrorCode.REQUIRED_FIELD_MISSING,
            { field: fieldName }
          ));
        }
        break;

      default:
        // Generic required field validation
        if (!value) {
          errors.push(new MembershipError(
            `${fieldName} is required`,
            MembershipErrorCode.REQUIRED_FIELD_MISSING,
            { field: fieldName }
          ));
        }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

/**
 * Custom validation hooks for React components
 */
export interface UseValidationOptions {
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  debounceMs?: number;
}

export interface ValidationState {
  errors: Record<string, MembershipError[]>;
  isValid: boolean;
  isValidating: boolean;
  touched: Record<string, boolean>;
}

/**
 * Validation utilities for form handling
 */
export class ValidationUtils {
  /**
   * Get error message for display in UI
   */
  static getDisplayMessage(error: MembershipError): string {
    return error.getUserMessage();
  }

  /**
   * Check if field has errors
   */
  static hasFieldError(validationState: ValidationState, fieldName: string): boolean {
    return validationState.errors[fieldName]?.length > 0;
  }

  /**
   * Get first error message for a field
   */
  static getFieldError(validationState: ValidationState, fieldName: string): string | null {
    const errors = validationState.errors[fieldName];
    return errors?.length > 0 ? this.getDisplayMessage(errors[0]) : null;
  }

  /**
   * Check if form is submittable
   */
  static canSubmit(validationState: ValidationState, requiredFields: string[]): boolean {
    if (!validationState.isValid) return false;
    
    // Check if all required fields are touched and valid
    return requiredFields.every(field => 
      validationState.touched[field] && !this.hasFieldError(validationState, field)
    );
  }
}