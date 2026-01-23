# ATP Membership Error Handling System

This directory contains comprehensive error handling for the ATP Membership system, providing robust error management, validation, and graceful degradation capabilities.

## Components

### 1. MembershipError Class (`membership-errors.ts`)
- **Purpose**: Centralized error handling with specific error codes
- **Features**:
  - Specific error codes for different failure scenarios
  - User-friendly error messages
  - Retry logic determination
  - Detailed error context and logging
  - Request ID tracking for debugging

### 2. Validation System (`../validation/membership-validation.ts`)
- **Purpose**: Client-side validation for membership forms and operations
- **Features**:
  - Form validation for signup and renewal
  - Real-time field validation
  - UAE-specific phone number validation
  - Membership status validation for benefits

### 3. Error Boundary Components (`../../components/membership/membership-error-boundary.tsx`)
- **Purpose**: React error boundaries for membership features
- **Features**:
  - Automatic error catching and recovery
  - Retry mechanisms with limits
  - Specialized boundaries for forms and dashboards
  - Technical details for development

### 4. Fallback Service (`../services/membership-fallback-service.ts`)
- **Purpose**: Graceful degradation when APIs are unavailable
- **Features**:
  - Local storage caching
  - Offline mode support
  - Automatic retry with exponential backoff
  - Fallback discount calculations

### 5. Error Handling Hooks (`../../hooks/use-membership-error-handling.ts`)
- **Purpose**: React hooks for error state management
- **Features**:
  - Form-specific error handling
  - API operation error handling
  - Network status monitoring
  - Field-level validation

### 6. Error Display Components (`../../components/membership/membership-error-display.tsx`)
- **Purpose**: Consistent error UI components
- **Features**:
  - Error message display with retry options
  - Network status indicators
  - Loading and error states
  - Field-level error display

## Usage Examples

### Basic Error Handling in Components

```tsx
import { useMembershipFormErrorHandling } from '../../hooks/use-membership-error-handling';
import { MembershipErrorDisplay } from './membership-error-display';

function MyComponent() {
  const errorHandling = useMembershipFormErrorHandling();

  const handleSubmit = async (data) => {
    const result = await errorHandling.handleAsyncError(async () => {
      return await submitMembershipForm(data);
    });

    if (!result) {
      // Error handled automatically, display errors
      console.log('Errors:', errorHandling.errors);
    }
  };

  return (
    <div>
      {errorHandling.hasError && (
        <MembershipErrorDisplay
          error={errorHandling.errors[0]}
          onRetry={errorHandling.retry}
          onDismiss={() => errorHandling.clearError(0)}
        />
      )}
      {/* Your form content */}
    </div>
  );
}
```

### Error Boundaries

```tsx
import { MembershipFormErrorBoundary } from './membership-error-boundary';

function App() {
  return (
    <MembershipFormErrorBoundary>
      <MembershipSignupForm />
    </MembershipFormErrorBoundary>
  );
}
```

### Service Integration

```tsx
import { membershipFallbackService } from '../services/membership-fallback-service';
import { MembershipErrorFactory } from '../errors/membership-errors';

class MyService {
  async getMembership(customerId: string) {
    return await membershipFallbackService.executeWithFallback(
      async () => {
        // Primary operation
        return await this.shopifyService.getMembership(customerId);
      },
      async () => {
        // Fallback operation
        return membershipFallbackService.getFallbackMembership(customerId);
      },
      'getMembership'
    );
  }
}
```

### Form Validation

```tsx
import { MembershipValidator } from '../validation/membership-validation';
import { FieldErrorDisplay } from './membership-error-display';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const result = MembershipValidator.validateField('email', value);
    setEmailError(result.isValid ? null : result.errors[0].getUserMessage());
  };

  return (
    <div>
      <input 
        value={email} 
        onChange={(e) => handleEmailChange(e.target.value)}
      />
      <FieldErrorDisplay error={emailError} />
    </div>
  );
}
```

## Error Codes Reference

### Authentication & Authorization
- `UNAUTHORIZED`: User not logged in
- `INVALID_CUSTOMER`: Invalid customer ID
- `CUSTOMER_NOT_FOUND`: Customer not found

### Membership Status
- `MEMBERSHIP_NOT_FOUND`: No membership found
- `MEMBERSHIP_EXPIRED`: Membership has expired
- `MEMBERSHIP_ALREADY_EXISTS`: Customer already has membership
- `MEMBERSHIP_CANCELLED`: Membership was cancelled

### Payment & Billing
- `PAYMENT_FAILED`: Payment processing failed
- `PAYMENT_REQUIRED`: Payment required for operation
- `INVALID_PAYMENT_METHOD`: Invalid payment method
- `SUBSCRIPTION_FAILED`: Subscription creation failed

### API & Integration
- `SHOPIFY_API_ERROR`: Shopify API error
- `NETWORK_ERROR`: Network connection error
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

### Validation
- `INVALID_INPUT`: Invalid input data
- `VALIDATION_FAILED`: Validation failed
- `REQUIRED_FIELD_MISSING`: Required field missing

## Best Practices

### 1. Always Use Error Boundaries
Wrap membership components with appropriate error boundaries:
- `MembershipFormErrorBoundary` for forms
- `MembershipDashboardErrorBoundary` for dashboards
- `MembershipErrorBoundary` for general components

### 2. Implement Graceful Degradation
Use the fallback service for critical operations:
- Cache membership data locally
- Provide offline functionality
- Show appropriate fallback UI

### 3. Validate Early and Often
- Validate on form field changes
- Validate before API calls
- Provide immediate feedback to users

### 4. Handle Network Issues
- Monitor network status
- Provide retry mechanisms
- Cache data for offline use

### 5. Log Errors Appropriately
- Use structured error logging
- Include request IDs for tracking
- Log user actions for debugging

### 6. Provide Clear User Feedback
- Use user-friendly error messages
- Show retry options when appropriate
- Indicate when operations are retryable

## Integration with Requirements

This error handling system addresses the following requirements:

- **Requirement 2.4**: Robust error handling for membership operations
- **Requirement 4.4**: Graceful handling of API failures during discount application
- **Requirement 5.4**: Error handling for delivery benefit calculations
- **Requirement 6.5**: Comprehensive error handling for renewal operations

## Testing

The error handling system includes comprehensive test coverage for:
- Error boundary behavior
- Fallback service operations
- Validation logic
- Error display components
- Hook functionality

Run tests with:
```bash
npm test -- --testPathPattern=error
```

## Monitoring and Debugging

### Error Tracking
All errors include:
- Unique request IDs
- Timestamp information
- User context
- Stack traces (in development)

### Performance Impact
The error handling system is designed to be lightweight:
- Lazy loading of error components
- Efficient caching mechanisms
- Minimal performance overhead

### Debugging Tools
- Error boundary details in development mode
- Console logging with structured data
- Network status monitoring
- Retry attempt tracking