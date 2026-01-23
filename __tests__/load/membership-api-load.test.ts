import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { performance } from 'perf_hooks';
import { AtpMembershipService } from '../../lib/services/atp-membership-service';
import { ShopifyIntegrationService } from '../../lib/services/shopify-integration-service';
import { mockMembership, mockCustomer } from '../__mocks__/membership-data';

// Mock Shopify API responses for load testing
const mockShopifyResponses = {
  customers: {
    success: {
      customer: mockCustomer,
      metafields: {
        edges: [
          {
            node: {
              key: 'atp_membership_status',
              value: 'active',
              namespace: 'atp'
            }
          }
        ]
      }
    },
    error: {
      errors: [{ message: 'Customer not found' }]
    }
  },
  checkout: {
    success: {
      checkoutCreate: {
        checkout: {
          id: 'gid://shopify/Checkout/test-checkout-id',
          webUrl: 'https://test-store.myshopify.com/checkout/test-checkout-id'
        }
      }
    }
  }
};

describe('Membership API Load Tests', () => {
  let membershipService: AtpMembershipService;
  let shopifyService: ShopifyIntegrationService;
  let originalFetch: typeof global.fetch;

  beforeEach(() => {
    membershipService = new AtpMembershipService();
    shopifyService = new ShopifyIntegrationService();
    
    // Mock fetch for load testing
    originalFetch = global.fetch;
    global.fetch = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('Membership Creation Load Tests', () => {
    it('should handle concurrent membership creation requests', async () => {
      const concurrentRequests = 100;
      const mockFetch = global.fetch as any;
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockShopifyResponses.customers.success
      });

      const startTime = performance.now();
      
      const promises = Array.from({ length: concurrentRequests }, (_, i) => 
        membershipService.createMembership(`customer_${i}`)
      );

      const results = await Promise.allSettled(promises);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      const successfulRequests = results.filter(r => r.status === 'fulfilled').length;
      const requestsPerSecond = (successfulRequests / (totalTime / 1000));

      // Should handle at least 50 requests per second
      expect(requestsPerSecond).toBeGreaterThan(50);
      expect(successfulRequests).toBeGreaterThan(concurrentRequests * 0.95); // 95% success rate
      
      console.log(`Membership Creation Load Test:
        Concurrent requests: ${concurrentRequests}
        Successful requests: ${successfulRequests}
        Total time: ${totalTime.toFixed(2)}ms
        Requests per second: ${requestsPerSecond.toFixed(2)}`);
    });

    it('should handle sustained load over time', async () => {
      const requestsPerBatch = 20;
      const batches = 10;
      const batchDelay = 100; // ms between batches
      
      const mockFetch = global.fetch as any;
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockShopifyResponses.customers.success
      });

      const startTime = performance.now();
      const results = [];

      for (let batch = 0; batch < batches; batch++) {
        const batchPromises = Array.from({ length: requestsPerBatch }, (_, i) => 
          membershipService.createMembership(`customer_${batch}_${i}`)
        );

        const batchResults = await Promise.allSettled(batchPromises);
        results.push(...batchResults);

        if (batch < batches - 1) {
          await new Promise(resolve => setTimeout(resolve, batchDelay));
        }
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const successfulRequests = results.filter(r => r.status === 'fulfilled').length;
      const totalRequests = requestsPerBatch * batches;

      expect(successfulRequests).toBeGreaterThan(totalRequests * 0.95);
      expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds

      console.log(`Sustained Load Test:
        Total requests: ${totalRequests}
        Successful requests: ${successfulRequests}
        Total time: ${totalTime.toFixed(2)}ms
        Average batch time: ${(totalTime / batches).toFixed(2)}ms`);
    });
  });

  describe('Membership Retrieval Load Tests', () => {
    it('should handle high-frequency membership lookups', async () => {
      const lookupRequests = 1000;
      const mockFetch = global.fetch as any;
      
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => mockShopifyResponses.customers.success
      });

      const startTime = performance.now();
      
      const promises = Array.from({ length: lookupRequests }, (_, i) => 
        membershipService.getMembership(`customer_${i % 100}`) // Simulate cache hits
      );

      const results = await Promise.allSettled(promises);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      const successfulRequests = results.filter(r => r.status === 'fulfilled').length;
      const lookupsPerSecond = (successfulRequests / (totalTime / 1000));

      // Should handle at least 200 lookups per second
      expect(lookupsPerSecond).toBeGreaterThan(200);
      expect(successfulRequests).toBeGreaterThan(lookupRequests * 0.98);

      console.log(`Membership Lookup Load Test:
        Lookup requests: ${lookupRequests}
        Successful lookups: ${successfulRequests}
        Total time: ${totalTime.toFixed(2)}ms
        Lookups per second: ${lookupsPerSecond.toFixed(2)}`);
    });
  });

  describe('Discount Calculation Load Tests', () => {
    it('should handle massive discount calculations', async () => {
      const calculations = 100000;
      const prices = Array.from({ length: 1000 }, () => Math.random() * 1000 + 50);
      
      const startTime = performance.now();
      
      const results = [];
      for (let i = 0; i < calculations; i++) {
        const price = prices[i % prices.length];
        const discount = membershipService.calculateServiceDiscount(price, mockMembership);
        results.push(discount);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const calculationsPerSecond = (calculations / (totalTime / 1000));

      // Should handle at least 100,000 calculations per second
      expect(calculationsPerSecond).toBeGreaterThan(100000);
      expect(results).toHaveLength(calculations);

      console.log(`Discount Calculation Load Test:
        Calculations: ${calculations}
        Total time: ${totalTime.toFixed(2)}ms
        Calculations per second: ${calculationsPerSecond.toFixed(0)}`);
    });
  });

  describe('API Error Handling Under Load', () => {
    it('should handle API failures gracefully under load', async () => {
      const requests = 100;
      const failureRate = 0.2; // 20% failure rate
      
      const mockFetch = global.fetch as any;
      mockFetch.mockImplementation(() => {
        if (Math.random() < failureRate) {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: async () => mockShopifyResponses.customers.error
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => mockShopifyResponses.customers.success
        });
      });

      const startTime = performance.now();
      
      const promises = Array.from({ length: requests }, (_, i) => 
        membershipService.getMembership(`customer_${i}`)
      );

      const results = await Promise.allSettled(promises);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      const successfulRequests = results.filter(r => r.status === 'fulfilled').length;
      const failedRequests = results.filter(r => r.status === 'rejected').length;

      // Should handle failures gracefully
      expect(successfulRequests).toBeGreaterThan(requests * (1 - failureRate) * 0.9);
      expect(failedRequests).toBeLessThan(requests * failureRate * 1.1);
      expect(totalTime).toBeLessThan(10000); // Should not hang

      console.log(`Error Handling Load Test:
        Total requests: ${requests}
        Successful: ${successfulRequests}
        Failed: ${failedRequests}
        Expected failure rate: ${(failureRate * 100).toFixed(1)}%
        Actual failure rate: ${((failedRequests / requests) * 100).toFixed(1)}%`);
    });
  });

  describe('Memory Usage Under Load', () => {
    it('should maintain stable memory usage', async () => {
      const iterations = 10000;
      const initialMemory = process.memoryUsage();
      
      // Perform intensive operations
      for (let i = 0; i < iterations; i++) {
        const membership = { ...mockMembership, id: `mem_${i}` };
        membershipService.calculateServiceDiscount(Math.random() * 1000, membership);
        membershipService.isEligibleForDiscount(membership);
        
        // Force garbage collection periodically
        if (i % 1000 === 0 && global.gc) {
          global.gc();
        }
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      const memoryIncreasePercent = (memoryIncrease / initialMemory.heapUsed) * 100;

      // Memory increase should be reasonable (less than 50% increase)
      expect(memoryIncreasePercent).toBeLessThan(50);

      console.log(`Memory Usage Test:
        Initial memory: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB
        Final memory: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB
        Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB (${memoryIncreasePercent.toFixed(1)}%)`);
    });
  });

  describe('Database Connection Pool Load', () => {
    it('should handle connection pool exhaustion gracefully', async () => {
      const concurrentConnections = 50;
      const mockFetch = global.fetch as any;
      
      // Simulate slow database responses
      mockFetch.mockImplementation(() => 
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              ok: true,
              json: async () => mockShopifyResponses.customers.success
            });
          }, Math.random() * 100 + 50); // 50-150ms delay
        })
      );

      const startTime = performance.now();
      
      const promises = Array.from({ length: concurrentConnections }, (_, i) => 
        membershipService.getMembership(`customer_${i}`)
      );

      const results = await Promise.allSettled(promises);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      const successfulRequests = results.filter(r => r.status === 'fulfilled').length;

      // Should handle connection pool pressure
      expect(successfulRequests).toBeGreaterThan(concurrentConnections * 0.9);
      expect(totalTime).toBeLessThan(5000); // Should not timeout

      console.log(`Connection Pool Load Test:
        Concurrent connections: ${concurrentConnections}
        Successful requests: ${successfulRequests}
        Total time: ${totalTime.toFixed(2)}ms`);
    });
  });
});