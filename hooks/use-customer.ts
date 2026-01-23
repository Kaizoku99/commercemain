'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { CustomerResponse } from '@/lib/shopify/customer-account'
import { logAuthStatus, handleAuthError } from '@/lib/auth-utils'

interface UseCustomerReturn {
  customer: CustomerResponse | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (data: RegisterData) => Promise<boolean>
  updateProfile: (data: Partial<RegisterData>) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
  refreshCustomer: () => Promise<void>
}

interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  acceptsMarketing?: boolean
}

export function useCustomer(): UseCustomerReturn {
  const [customer, setCustomer] = useState<CustomerResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch customer profile
  const fetchCustomer = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Log auth status for debugging
      logAuthStatus('useCustomer.fetchCustomer')

      const response = await fetch('/api/customer/profile')

      if (response.status === 401) {
        // Not authenticated - this is expected behavior, not an error
        setCustomer(null)
        return
      }

      if (!response.ok) {
        const errorMessage = handleAuthError({ status: response.status }, 'fetchCustomer')
        throw new Error(errorMessage)
      }

      const result = await response.json()
      setCustomer(result.customer)

    } catch (err) {
      console.error('Error fetching customer:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setCustomer(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch('/api/customer/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Login failed')
        return false
      }

      // Fetch customer profile after successful login
      await fetchCustomer()
      return true

    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : 'Login failed')
      return false
    }
  }, [fetchCustomer])

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setError(null)

      await fetch('/api/customer/logout', {
        method: 'POST',
      })

      setCustomer(null)

    } catch (err) {
      console.error('Logout error:', err)
      setError(err instanceof Error ? err.message : 'Logout failed')
    }
  }, [])

  // Register
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Registration failed')
        return false
      }

      return true

    } catch (err) {
      console.error('Registration error:', err)
      setError(err instanceof Error ? err.message : 'Registration failed')
      return false
    }
  }, [])

  // Update profile
  const updateProfile = useCallback(async (data: Partial<RegisterData>): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch('/api/customer/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Profile update failed')
        return false
      }

      setCustomer(result.customer)
      return true

    } catch (err) {
      console.error('Profile update error:', err)
      setError(err instanceof Error ? err.message : 'Profile update failed')
      return false
    }
  }, [])

  // Reset password
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      setError(null)

      const response = await fetch('/api/customer/password-reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Password reset failed')
        return false
      }

      return true

    } catch (err) {
      console.error('Password reset error:', err)
      setError(err instanceof Error ? err.message : 'Password reset failed')
      return false
    }
  }, [])

  // Refresh customer data
  const refreshCustomer = useCallback(async (): Promise<void> => {
    await fetchCustomer()
  }, [fetchCustomer])

  // Load customer on mount
  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  return {
    customer,
    isLoading,
    error,
    login,
    logout,
    register,
    updateProfile,
    resetPassword,
    refreshCustomer,
  }
}