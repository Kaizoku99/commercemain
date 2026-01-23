'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Custom message to show when an error occurs */
  errorMessage?: string;
  /** Whether to show the retry button */
  showRetry?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <AlertTriangle className="w-12 h-12 text-amber-500 mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {this.props.errorMessage || 'Something went wrong'}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
          {this.props.showRetry !== false && (
            <Button
              onClick={this.handleRetry}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 text-left w-full max-w-md">
              <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 text-xs rounded overflow-auto">
                {this.state.error.toString()}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Cart-specific error boundary
 */
export class CartErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Cart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <p className="text-sm text-gray-600">
            Unable to load cart. Please refresh the page.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Refresh
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Product-specific error boundary
 */
export class ProductErrorBoundary extends Component<
  { children: ReactNode; productId?: string },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; productId?: string }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Product Error:', error, errorInfo, 'Product ID:', this.props.productId);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Unable to load product information.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
