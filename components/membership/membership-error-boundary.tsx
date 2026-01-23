'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { MembershipError, MembershipErrorCode } from '../../lib/errors/membership-errors';
import { Button } from '../ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class MembershipErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error for monitoring
    console.error('Membership Error Boundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to your error tracking service
    // like Sentry, LogRocket, or Bugsnag
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // For now, just log to console
    console.error('Error Report:', errorReport);
  };

  private handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
    }
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0
    });
  };

  private canRetry = (): boolean => {
    const { error, retryCount } = this.state;
    
    if (retryCount >= this.maxRetries) return false;
    
    // Check if error is retryable
    if (error instanceof MembershipError) {
      return error.shouldRetry();
    }
    
    // For non-membership errors, allow retry for network-related issues
    const retryableMessages = [
      'network',
      'fetch',
      'connection',
      'timeout',
      'unavailable'
    ];
    
    return retryableMessages.some(msg => 
      error?.message.toLowerCase().includes(msg)
    );
  };

  private getErrorMessage = (): string => {
    const { error } = this.state;
    
    if (error instanceof MembershipError) {
      return error.getUserMessage();
    }
    
    // Generic error messages for different error types
    if (error?.message.includes('ChunkLoadError')) {
      return 'Failed to load application resources. Please refresh the page.';
    }
    
    if (error?.message.includes('Network')) {
      return 'Network connection error. Please check your internet connection.';
    }
    
    return 'An unexpected error occurred. Please try again or contact support.';
  };

  private getErrorTitle = (): string => {
    const { error } = this.state;
    
    if (error instanceof MembershipError) {
      switch (error.code) {
        case MembershipErrorCode.MEMBERSHIP_NOT_FOUND:
          return 'Membership Not Found';
        case MembershipErrorCode.MEMBERSHIP_EXPIRED:
          return 'Membership Expired';
        case MembershipErrorCode.PAYMENT_FAILED:
          return 'Payment Error';
        case MembershipErrorCode.NETWORK_ERROR:
          return 'Connection Error';
        default:
          return 'Membership Error';
      }
    }
    
    return 'Something went wrong';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const canRetry = this.canRetry();
      const errorMessage = this.getErrorMessage();
      const errorTitle = this.getErrorTitle();

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                {errorTitle}
              </h2>
              <p className="text-gray-600">
                {errorMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {canRetry && (
                <Button
                  onClick={this.handleRetry}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again ({this.maxRetries - this.state.retryCount} left)
                </Button>
              )}
              
              <Button
                onClick={this.handleReset}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Reset
              </Button>
            </div>

            {this.props.showDetails && this.state.error && (
              <details className="text-left mt-6">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  {this.state.error instanceof MembershipError && (
                    <div className="mb-2">
                      <strong>Code:</strong> {this.state.error.code}
                    </div>
                  )}
                  <div>
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap mt-1">
                      {this.state.error.stack}
                    </pre>
                  </div>
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withMembershipErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <MembershipErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </MembershipErrorBoundary>
  );

  WrappedComponent.displayName = `withMembershipErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Specialized error boundary for membership forms
 */
export function MembershipFormErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <MembershipErrorBoundary
      fallback={
        <div className="p-6 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Form Error</h3>
              <p className="text-sm text-red-700 mt-1">
                There was an error with the membership form. Please refresh the page and try again.
              </p>
            </div>
          </div>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Membership form error:', error, errorInfo);
      }}
    >
      {children}
    </MembershipErrorBoundary>
  );
}

/**
 * Specialized error boundary for membership dashboard
 */
export function MembershipDashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <MembershipErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Dashboard Unavailable
          </h3>
          <p className="text-gray-600 mb-4">
            We're having trouble loading your membership dashboard. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      }
      onError={(error, errorInfo) => {
        console.error('Membership dashboard error:', error, errorInfo);
      }}
    >
      {children}
    </MembershipErrorBoundary>
  );
}