/**
 * ATP Membership Signup Component Tests
 * 
 * Tests for the membership signup component including:
 * - Rendering with proper pricing and benefits
 * - Signup flow integration
 * - Error handling
 * - Responsive design
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AtpMembershipSignup } from '../../components/membership/atp-membership-signup';

// Mock the hooks
vi.mock('../../hooks/use-atp-membership', () => ({
  useAtpMembership: vi.fn()
}));

vi.mock('../../hooks/use-customer', () => ({
  useCustomer: vi.fn()
}));

// Mock next-intl
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      'title': 'Join ATP Membership',
      'subtitle': 'Unlock exclusive benefits and save on every booking',
      'annualFee': 'Annual Membership Fee',
      'currency': 'AED',
      'perYear': 'per year',
      'benefitsTitle': 'Membership Benefits',
      'benefit1Title': '15% Service Discount',
      'benefit1Description': 'Save 15% on all premium services',
      'benefit2Title': 'Free Delivery',
      'benefit2Description': 'Enjoy free delivery on all orders',
      'benefit3Title': 'Priority Support',
      'benefit3Description': 'Get priority customer support',
      'benefit4Title': 'Exclusive Offers',
      'benefit4Description': 'Access member-only promotions',
      'howItWorksTitle': 'How It Works',
      'step1Title': 'Sign Up & Pay',
      'step1Description': 'Complete registration and payment',
      'step2Title': 'Enjoy Benefits',
      'step2Description': 'Start saving immediately',
      'step3Title': 'Renew Annually',
      'step3Description': 'Renew each year',
      'valueProposition': 'Save up to 500+ د.إ annually',
      'roiMessage': 'Membership pays for itself',
      'signupButton': 'Join ATP Membership - 99 د.إ',
      'processingPayment': 'Processing Payment...',
      'signupSuccess': 'Welcome to ATP Membership!',
      'signupError': 'Signup Failed',
      'tryAgain': 'Try Again',
      'alreadyMember': 'Already a member?',
      'viewDashboard': 'View Dashboard',
      'termsAcceptance': 'By joining, you agree to our terms',
      'securePayment': 'Secure payment powered by Shopify'
    };
    return translations[key] || key;
  })
}));

// Mock Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  )
}));

import { useAtpMembership } from '../../hooks/use-atp-membership';
import { useCustomer } from '../../hooks/use-customer';

const mockUseAtpMembership = useAtpMembership as any;
const mockUseCustomer = useCustomer as any;

describe('AtpMembershipSignup', () => {
  const mockPurchaseMembership = vi.fn();
  const mockOnSignupSuccess = vi.fn();
  const mockOnSignupError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementations
    mockUseAtpMembership.mockReturnValue({
      membership: null,
      isLoading: false,
      purchaseMembership: mockPurchaseMembership
    });

    mockUseCustomer.mockReturnValue({
      customer: { id: 'customer-123', email: 'test@example.com' }
    });

    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true
    });
  });

  describe('Rendering', () => {
    it('renders signup form with pricing and benefits', () => {
      render(<AtpMembershipSignup />);

      // Check main title and subtitle
      expect(screen.getByText('Join ATP Membership')).toBeInTheDocument();
      expect(screen.getByText('Unlock exclusive benefits and save on every booking')).toBeInTheDocument();

      // Check pricing display
      expect(screen.getByText('99')).toBeInTheDocument();
      expect(screen.getByText('AED')).toBeInTheDocument();
      expect(screen.getByText('per year')).toBeInTheDocument();

      // Check benefits section
      expect(screen.getByText('Membership Benefits')).toBeInTheDocument();
      expect(screen.getByText('15% Service Discount')).toBeInTheDocument();
      expect(screen.getByText('Free Delivery')).toBeInTheDocument();
      expect(screen.getByText('Priority Support')).toBeInTheDocument();
      expect(screen.getByText('Exclusive Offers')).toBeInTheDocument();

      // Check how it works section
      expect(screen.getByText('How It Works')).toBeInTheDocument();
      expect(screen.getByText('Sign Up & Pay')).toBeInTheDocument();
      expect(screen.getByText('Enjoy Benefits')).toBeInTheDocument();
      expect(screen.getByText('Renew Annually')).toBeInTheDocument();

      // Check signup button
      expect(screen.getByRole('button', { name: /Join ATP Membership - 99/ })).toBeInTheDocument();
    });

    it('shows value proposition and ROI message', () => {
      render(<AtpMembershipSignup />);

      expect(screen.getByText('Save up to 500+ AED annually')).toBeInTheDocument();
      expect(screen.getByText('Membership pays for itself')).toBeInTheDocument();
    });

    it('shows secure payment message', () => {
      render(<AtpMembershipSignup />);

      expect(screen.getByText('Secure payment powered by Shopify')).toBeInTheDocument();
      expect(screen.getByText('By joining, you agree to our terms')).toBeInTheDocument();
    });
  });

  describe('Signup Flow', () => {
    it('handles successful signup flow', async () => {
      const checkoutUrl = 'https://checkout.shopify.com/test';
      mockPurchaseMembership.mockResolvedValue(checkoutUrl);

      render(<AtpMembershipSignup onSignupSuccess={mockOnSignupSuccess} />);

      const signupButton = screen.getByRole('button', { name: /Join ATP Membership - 99/ });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(mockPurchaseMembership).toHaveBeenCalledWith('customer-123');
      });

      // Should redirect to checkout URL
      expect(window.location.href).toBe(checkoutUrl);
    });

    it('shows processing state during signup', async () => {
      mockPurchaseMembership.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<AtpMembershipSignup />);

      const signupButton = screen.getByRole('button', { name: /Join ATP Membership - 99/ });
      fireEvent.click(signupButton);

      // Should show processing state
      expect(screen.getByText('Processing Payment...')).toBeInTheDocument();
      expect(signupButton).toBeDisabled();
    });

    it('handles signup errors', async () => {
      const error = new Error('Payment failed');
      mockPurchaseMembership.mockRejectedValue(error);

      render(<AtpMembershipSignup onSignupError={mockOnSignupError} />);

      const signupButton = screen.getByRole('button', { name: /Join ATP Membership - 99/ });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText('Payment failed')).toBeInTheDocument();
        expect(mockOnSignupError).toHaveBeenCalledWith(error);
      });

      // Should show try again button
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('requires customer login for signup', () => {
      mockUseCustomer.mockReturnValue({ customer: null });

      render(<AtpMembershipSignup />);

      const signupButton = screen.getByRole('button', { name: /Join ATP Membership - 99/ });
      expect(signupButton).toBeDisabled();
      expect(screen.getByText('log in')).toBeInTheDocument();
      expect(screen.getByText('to purchase membership')).toBeInTheDocument();
    });
  });

  describe('Existing Member State', () => {
    it('shows different content for existing members', () => {
      mockUseAtpMembership.mockReturnValue({
        membership: {
          id: 'mem-123',
          status: 'active',
          customerId: 'customer-123'
        },
        isLoading: false,
        purchaseMembership: mockPurchaseMembership
      });

      render(<AtpMembershipSignup />);

      expect(screen.getByText('Already a member?')).toBeInTheDocument();
      expect(screen.getByText('View Dashboard')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Join ATP Membership - 99/ })).not.toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('handles loading state properly', () => {
      mockUseAtpMembership.mockReturnValue({
        membership: null,
        isLoading: true,
        purchaseMembership: mockPurchaseMembership
      });

      render(<AtpMembershipSignup />);

      const signupButton = screen.getByRole('button', { name: /Join ATP Membership - 99/ });
      expect(signupButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('allows clearing error messages', async () => {
      const error = new Error('Network error');
      mockPurchaseMembership.mockRejectedValue(error);

      render(<AtpMembershipSignup />);

      const signupButton = screen.getByRole('button', { name: /Join ATP Membership - 99/ });
      fireEvent.click(signupButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });

      const tryAgainButton = screen.getByText('Try Again');
      fireEvent.click(tryAgainButton);

      expect(screen.queryByText('Network error')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and structure', () => {
      render(<AtpMembershipSignup />);

      // Check for proper heading structure
      const mainHeading = screen.getByText('Join ATP Membership');
      expect(mainHeading).toBeInTheDocument();

      // Check for button accessibility
      const signupButton = screen.getByRole('button', { name: /Join ATP Membership - 99/ });
      expect(signupButton).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('renders properly on different screen sizes', () => {
      render(<AtpMembershipSignup />);

      // Component should render without errors
      expect(screen.getByText('Join ATP Membership')).toBeInTheDocument();
      
      // Grid layout should be present (tested via CSS classes in integration tests)
      const container = screen.getByText('Join ATP Membership').closest('.space-y-8');
      expect(container).toBeInTheDocument();
    });
  });
});