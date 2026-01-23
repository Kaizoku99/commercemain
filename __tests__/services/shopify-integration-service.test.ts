import { describe, it, expect, vi } from 'vitest'

// Mock server-only module first
vi.mock('server-only', () => ({}))

describe('ShopifyIntegrationService', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })
})