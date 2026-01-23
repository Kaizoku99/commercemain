import { describe, it, expect, beforeEach } from 'vitest';
import { performance } from 'perf_hooks';
import { AtpMembershipService } from '../../lib/services/atp-membership-service';
import { mockMembership, mockExpiredMembership } from '../__mocks__/membership-data';

describe('Discount Calculation Performance Tests', () => {
  let membershipService: AtpMembershipService;

  beforeEach(() => {
    membershipService = new AtpMembershipService();
  });

  it('should calculate service discount within performance threshold', async () => {
    const iterations = 10000;
    const prices = [100, 250, 500, 1000, 2500];
    
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const price = prices[i % prices.length];
      const result = membershipService.calculateServiceDiscount(price, mockMembership);
      // Access the result to ensure it's actually calculated
      const _ = result.finalPrice;
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / iterations;
    
    // Should complete 10,000 calculations in under 100ms (0.01ms per calculation)
    expect(totalTime).toBeLessThan(100);
    expect(averageTime).toBeLessThan(0.01);
    
    console.log(`Discount calculation performance:
      Total time: ${totalTime.toFixed(2)}ms
      Average time per calculation: ${averageTime.toFixed(4)}ms
      Operations per second: ${(1000 / averageTime).toFixed(0)}`);
  });

  it('should handle bulk discount calculations efficiently', async () => {
    const cartItems = Array.from({ length: 100 }, (_, i) => ({
      id: `item_${i}`,
      price: Math.random() * 1000 + 50,
      type: 'service'
    }));
    
    const startTime = performance.now();
    
    const discountedItems = cartItems.map(item => {
      const discountResult = membershipService.calculateServiceDiscount(item.price, mockMembership);
      return {
        ...item,
        discountedPrice: discountResult.finalPrice,
        savings: discountResult.savings
      };
    });
    
    const endTime = performance.now();
    const processingTime = endTime - startTime;
    
    // Should process 100 items in under 10ms
    expect(processingTime).toBeLessThan(10);
    expect(discountedItems).toHaveLength(100);
    
    // Verify all calculations are correct
    discountedItems.forEach((item, index) => {
      const expectedDiscount = cartItems[index].price * 0.85; // 15% discount
      expect(item.discountedPrice).toBeCloseTo(expectedDiscount, 2);
    });
  });

  it('should validate membership status efficiently', async () => {
    const memberships = [
      mockMembership,
      mockExpiredMembership,
      { ...mockMembership, status: 'cancelled' as const },
      { ...mockMembership, expirationDate: new Date(Date.now() + 86400000).toISOString() }
    ];
    
    const iterations = 5000;
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      const membership = memberships[i % memberships.length];
      membershipService.validateMembership(membership);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Should validate 5,000 memberships in under 50ms
    expect(totalTime).toBeLessThan(50);
    
    console.log(`Membership validation performance:
      Total time: ${totalTime.toFixed(2)}ms
      Validations per second: ${(iterations / (totalTime / 1000)).toFixed(0)}`);
  });

  it('should handle concurrent discount calculations', async () => {
    const concurrentOperations = 50;
    const operationsPerThread = 100;
    
    const startTime = performance.now();
    
    const promises = Array.from({ length: concurrentOperations }, async () => {
      const results = [];
      for (let i = 0; i < operationsPerThread; i++) {
        const price = Math.random() * 1000 + 50;
        const discountResult = membershipService.calculateServiceDiscount(price, mockMembership);
        results.push(discountResult.savings);
      }
      return results;
    });
    
    const allResults = await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Should handle 5,000 concurrent operations in under 200ms
    expect(totalTime).toBeLessThan(200);
    expect(allResults).toHaveLength(concurrentOperations);
    
    // Verify all results are valid
    allResults.forEach(results => {
      expect(results).toHaveLength(operationsPerThread);
      results.forEach(savings => {
        expect(savings).toBeGreaterThan(0);
      });
    });
  });

  it('should optimize memory usage during calculations', async () => {
    const initialMemory = process.memoryUsage();
    
    // Perform intensive calculations
    for (let i = 0; i < 50000; i++) {
      const price = Math.random() * 1000;
      const result = membershipService.calculateServiceDiscount(price, mockMembership);
      // Access the result to ensure it's actually calculated
      const _ = result.finalPrice;
      
      // Force garbage collection every 10,000 operations
      if (i % 10000 === 0 && global.gc) {
        global.gc();
      }
    }
    
    const finalMemory = process.memoryUsage();
    const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
    
    // Memory increase should be minimal (less than 10MB)
    expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    
    console.log(`Memory usage:
      Initial: ${(initialMemory.heapUsed / 1024 / 1024).toFixed(2)}MB
      Final: ${(finalMemory.heapUsed / 1024 / 1024).toFixed(2)}MB
      Increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB`);
  });

  it('should handle edge cases efficiently', async () => {
    const edgeCases = [
      { price: 0, membership: mockMembership },
      { price: 0.01, membership: mockMembership },
      { price: 999999.99, membership: mockMembership },
      { price: 100, membership: mockExpiredMembership },
      { price: 100, membership: { ...mockMembership, status: 'cancelled' as const } }
    ];
    
    const iterations = 1000;
    const startTime = performance.now();
    
    for (let i = 0; i < iterations; i++) {
      edgeCases.forEach(({ price, membership }) => {
        membershipService.calculateServiceDiscount(price, membership);
      });
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    
    // Should handle edge cases efficiently
    expect(totalTime).toBeLessThan(100);
    
    console.log(`Edge case handling performance: ${totalTime.toFixed(2)}ms`);
  });
});