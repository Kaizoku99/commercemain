import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MembershipLifecycleService } from '../../lib/services/membership-lifecycle-service';
import { AtpMembershipService } from '../../lib/services/atp-membership-service';
import { ShopifyIntegrationService } from '../../lib/services/shopify-integration-service';
import { MembershipNotificationService } from '../../lib/services/membership-notification-service';
import { AtpMembership } from '../../lib/types/membership';

// Mock the dependencies
vi.mock('../../lib/services/atp-membership-service');
vi.mock('../../lib/services/shopify-integration-service');
vi.mock('../../lib/services/membership-notification-service');

describe('MembershipLifecycleService', () => {
  let lifecycleService: MembershipLifecycleService;
  let mockMembershipService: vi.Mocked<AtpMembershipService>;
  let mockShopifyService: vi.Mocked<ShopifyIntegrationService>;
  let mockNotificationService: vi.Mocked<MembershipNotificationService>;

  const mockMembership: AtpMembership = {
    id: 'mem_123',
    customerId: 'cust_456',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    expirationDate: '2025-01-01T00:00:00Z',
    paymentStatus: 'paid',
    benefits: {
      serviceDiscount: 0.15,
      freeDelivery: true,
      eligibleServices: ['massage', 'ems', 'yoga', 'supplements']
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Create service instance
    lifecycleService = new MembershipLifecycleService();
    
    // Get mocked instances
    mockMembershipService = vi.mocked(AtpMembershipService.prototype);
    mockShopifyService = vi.mocked(ShopifyIntegrationService.prototype);
    mockNotificationService = vi.mocked(MembershipNotificationService.prototype);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('handlePaymentStatusUpdate', () => {
    it('should handle successful payment and extend membership', async () => {
      // Setup
      mockMembershipService.getMembership.mockResolvedValue(mockMembership);
      mockShopifyService.updateCustomerMembership.mockResolvedValue();
      mockNotificationService.sendRenewalConfirmation.mockResolvedValue();

      // Execute
      await lifecycleService.handlePaymentStatusUpdate('mem_123', 'paid');

      // Verify
      expect(mockMembershipService.getMembership).toHaveBeenCalledWith('mem_123');
      expect(mockShopifyService.updateCustomerMembership).toHaveBeenCalledWith(
        'cust_456',
        expect.objectContaining({
          status: 'active',
          paymentStatus: 'paid'
        })
      );
      expect(mockNotificationService.sendRenewalConfirmation).toHaveBeenCalled();
    });

    it('should handle failed payment and send notification', async () => {
      // Setup
      mockMembershipService.getMembership.mockResolvedValue(mockMembership);
      mockShopifyService.updateCustomerMembership.mockResolvedValue();
      mockNotificationService.sendPaymentFailureNotification.mockResolvedValue();

      // Execute
      await lifecycleService.handlePaymentStatusUpdate('mem_123', 'failed');

      // Verify
      expect(mockMembershipService.getMembership).toHaveBeenCalledWith('mem_123');
      expect(mockShopifyService.updateCustomerMembership).toHaveBeenCalledWith(
        'cust_456',
        expect.objectContaining({
          paymentStatus: 'failed'
        })
      );
      expect(mockNotificationService.sendPaymentFailureNotification).toHaveBeenCalled();
    });

    it('should throw error if membership not found', async () => {
      // Setup
      mockMembershipService.getMembership.mockResolvedValue(null);

      // Execute & Verify
      await expect(
        lifecycleService.handlePaymentStatusUpdate('mem_123', 'paid')
      ).rejects.toThrow('Membership not found: mem_123');
    });
  });

  describe('processExpiredMemberships', () => {
    it('should process expired memberships successfully', async () => {
      // Setup - mock the private method by testing the public interface
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Execute
      await lifecycleService.processExpiredMemberships();

      // Verify - should complete without errors
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Error processing expired memberships')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('processExpirationReminders', () => {
    it('should process expiration reminders successfully', async () => {
      // Setup
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Execute
      await lifecycleService.processExpirationReminders();

      // Verify - should complete without errors
      expect(consoleSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('Error processing expiration reminders')
      );

      consoleSpy.mockRestore();
    });
  });
});