'use client';

import { useState, useCallback, useEffect } from 'react';
import { MembershipError, MembershipErrorCode } from '../lib/errors/membership-errors';
import { membershipFallbackService } from '../lib/services/membership-fallback-service';
import { ValidationResult, MembershipValidator } from '../lib/validation/membership-validation';

export interface ErrorHandlingState {
  errors: MembershipError[];
  isLoading: boolean;
  hasError: boolean;
  retryCount: number;
  isOffline: boolean;
}

export interface ErrorHandlingActions {
  addError: (error: MembershipError) => void;
  clearErrors: () => void;
  clearError: (index: number) => void;
  retry: () => void;
  handleAsyncError: <T>(operation: () => Promise<T>) => Promise<T | null>;
  validateField: (fieldName: string, value: any) => ValidationResult;
  setLoading: (loading: boolean) => void;
}

export interface UseMembershipErrorHandlingOptions {
  maxRetries?: number;
  enableFallback?: boolean;
  enableOfflineDetection?: boolean;
  onError?: (error: MembershipError) => void;
  onRetry?: () => void;
}

export function useMembershipErrorHandling(
  options: UseMembershipErrorHandlingOptions = {}
): ErrorHandlingState & ErrorHandlingActions {
  const {
    maxRetries = 3,
    enableFallback = true,
    enableOfflineDetection = true,
    onError,
    onRetry
  } = options;

  const [state, setState] = useState<ErrorHandlingState>({
    errors: [],
    isLoading: false,
    hasError: false,
    retryCount: 0,
    isOffline: false
  });

  // Monitor network status
  useEffect(() => {
    if (!enableOfflineDetection || typeof window === 'undefined') return;

    const updateOnlineStatus = () => {
      setState(prev => ({ ...prev, isOffline: !navigator.onLine }));
    };

    updateOnlineStatus();
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [enableOfflineDetection]);

  const addError = useCallback((error: MembershipError) => {
    setState(prev => ({
      ...prev,
      errors: [...prev.errors, error],
      hasError: true
    }));
    
    onError?.(error);
    
    // Log error for debugging
    console.error('Membership error:', error.toJSON());
  }, [onError]);

  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: [],
      hasError: false,
      retryCount: 0
    }));
  }, []);

  const clearError = useCallback((index: number) => {
    setState(prev => {
      const newErrors = prev.errors.filter((_, i) => i !== index);
      return {
        ...prev,
        errors: newErrors,
        hasError: newErrors.length > 0
      };
    });
  }, []);

  const retry = useCallback(() => {
    if (state.retryCount >= maxRetries) {
      addError(new MembershipError(
        'Maximum retry attempts exceeded',
        MembershipErrorCode.INTERNAL_ERROR,
        { context: { maxRetries, currentRetries: state.retryCount } }
      ));
      return;
    }

    setState(prev => ({
      ...prev,
      retryCount: prev.retryCount + 1,
      errors: [],
      hasError: false
    }));

    onRetry?.();
  }, [state.retryCount, maxRetries, addError, onRetry]);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const handleAsyncError = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T | null> => {
    setLoading(true);
    
    try {
      if (enableFallback) {
        return await membershipFallbackService.executeWithFallback(
          operation,
          undefined,
          'membership operation'
        );
      } else {
        return await operation();
      }
    } catch (error) {
      let membershipError: MembershipError;
      
      if (error instanceof MembershipError) {
        membershipError = error;
      } else {
        membershipError = new MembershipError(
          error instanceof Error ? error.message : 'Unknown error occurred',
          MembershipErrorCode.UNKNOWN_ERROR,
          { context: { originalError: error } }
        );
      }
      
      addError(membershipError);
      return null;
    } finally {
      setLoading(false);
    }
  }, [enableFallback, addError, setLoading]);

  const validateField = useCallback((fieldName: string, value: any): ValidationResult => {
    try {
      return MembershipValidator.validateField(fieldName, value);
    } catch (error) {
      const validationError = new MembershipError(
        `Validation error for field: ${fieldName}`,
        MembershipErrorCode.VALIDATION_FAILED,
        { field: fieldName, value }
      );
      
      return {
        isValid: false,
        errors: [validationError]
      };
    }
  }, []);

  return {
    ...state,
    addError,
    clearErrors,
    clearError,
    retry,
    handleAsyncError,
    validateField,
    setLoading
  };
}

/**
 * Hook for form-specific error handling
 */
export function useMembershipFormErrorHandling() {
  const errorHandling = useMembershipErrorHandling({
    maxRetries: 2,
    enableFallback: false // Forms typically don't need fallback
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, MembershipError[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateAndSetFieldError = useCallback((fieldName: string, value: any) => {
    const result = errorHandling.validateField(fieldName, value);
    
    setFieldErrors(prev => ({
      ...prev,
      [fieldName]: result.errors
    }));

    return result.isValid;
  }, [errorHandling]);

  const markFieldTouched = useCallback((fieldName: string) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
  }, []);

  const getFieldError = useCallback((fieldName: string): string | null => {
    const errors = fieldErrors[fieldName];
    return errors?.length > 0 ? errors[0].getUserMessage() : null;
  }, [fieldErrors]);

  const hasFieldError = useCallback((fieldName: string): boolean => {
    return fieldErrors[fieldName]?.length > 0;
  }, [fieldErrors]);

  const isFieldTouched = useCallback((fieldName: string): boolean => {
    return touched[fieldName] || false;
  }, [touched]);

  const clearFieldError = useCallback((fieldName: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFieldErrors({});
    setTouched({});
    errorHandling.clearErrors();
  }, [errorHandling]);

  return {
    ...errorHandling,
    fieldErrors,
    touched,
    validateAndSetFieldError,
    markFieldTouched,
    getFieldError,
    hasFieldError,
    isFieldTouched,
    clearFieldError,
    resetForm
  };
}

/**
 * Hook for API operation error handling with automatic retry
 */
export function useMembershipApiErrorHandling() {
  return useMembershipErrorHandling({
    maxRetries: 3,
    enableFallback: true,
    enableOfflineDetection: true,
    onError: (error) => {
      // Log API errors for monitoring
      if (error.code === MembershipErrorCode.SHOPIFY_API_ERROR) {
        console.error('Shopify API Error:', error.toJSON());
      }
    }
  });
}

/**
 * Hook for dashboard-specific error handling
 */
export function useMembershipDashboardErrorHandling() {
  return useMembershipErrorHandling({
    maxRetries: 2,
    enableFallback: true,
    enableOfflineDetection: true,
    onError: (error) => {
      // Handle dashboard-specific errors
      if (error.code === MembershipErrorCode.MEMBERSHIP_NOT_FOUND) {
        // Could redirect to signup page
        console.warn('No membership found for dashboard');
      }
    }
  });
}