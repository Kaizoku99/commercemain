/**
 * Type-safe utilities for message handling and validation
 * Provides compile-time and runtime validation for translations
 */

import type { MessageDescriptor } from '@lingui/core'
import type { 
  Locale, 
  MessageId, 
  MessageValues, 
  TranslationError,
  MessageCatalog 
} from './types'
import { i18n, getCurrentLocale } from './index'

/**
 * Type-safe message descriptor creation
 * @param id - The message ID
 * @param message - Optional default message
 * @param comment - Optional comment for translators
 * @returns Typed message descriptor
 */
export function createMessage(
  id: string,
  message?: string,
  comment?: string
): MessageDescriptor {
  return {
    id,
    message,
    comment
  }
}

/**
 * Type-safe translation function with validation
 * @param messageId - The message ID to translate
 * @param values - Optional interpolation values
 * @param locale - Optional specific locale (defaults to current)
 * @returns Translated string
 * @throws {TranslationError} When translation fails
 */
export function safeTranslate(
  messageId: string,
  values?: MessageValues,
  locale?: Locale
): string {
  try {
    const targetLocale = locale || getCurrentLocale()
    
    // Validate message exists in catalog
    if (!hasMessage(messageId, targetLocale)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Message "${messageId}" not found in locale "${targetLocale}"`)
      }
    }
    
    // Use current i18n instance or create temporary one for specific locale
    if (locale && locale !== getCurrentLocale()) {
      // For different locale, we'd need to create a temporary instance
      // For now, just use current instance and log warning
      console.warn(`Translation requested for different locale "${locale}", using current locale`)
    }
    
    return i18n._(messageId, values)
  } catch (error) {
    const errorMessage = `Translation failed for message "${messageId}"`
    console.error(errorMessage, error)
    
    if (process.env.NODE_ENV === 'development') {
      throw new Error(`${errorMessage}: ${error}`)
    }
    
    return messageId // Fallback to message ID
  }
}

/**
 * Checks if a message exists in the current catalog
 * @param messageId - The message ID to check
 * @param locale - Optional specific locale (defaults to current)
 * @returns True if message exists
 */
export function hasMessage(messageId: string, locale?: Locale): boolean {
  const targetLocale = locale || getCurrentLocale()
  const messages = i18n.messages[targetLocale]
  
  return messages && messageId in messages
}

/**
 * Gets all available message IDs for a locale
 * @param locale - Optional specific locale (defaults to current)
 * @returns Array of message IDs
 */
export function getMessageIds(locale?: Locale): string[] {
  const targetLocale = locale || getCurrentLocale()
  const messages = i18n.messages[targetLocale]
  
  return messages ? Object.keys(messages) : []
}

/**
 * Validates message interpolation values
 * @param messageId - The message ID
 * @param values - The values to validate
 * @returns Validation result
 */
export function validateMessageValues(
  messageId: string,
  values?: MessageValues
): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!values) {
    return { valid: true, errors }
  }
  
  // Get the message template to check for required variables
  const message = i18n.messages[getCurrentLocale()]?.[messageId]
  
  if (!message) {
    errors.push(`Message "${messageId}" not found`)
    return { valid: false, errors }
  }
  
  // Simple validation for ICU message format variables
  const variablePattern = /\{(\w+)\}/g
  const requiredVariables = new Set<string>()
  let match
  
  while ((match = variablePattern.exec(message)) !== null) {
    requiredVariables.add(match[1])
  }
  
  // Check if all required variables are provided
  for (const variable of Array.from(requiredVariables)) {
    if (!(variable in values)) {
      errors.push(`Missing required variable: ${variable}`)
    }
  }
  
  // Check for unexpected variables
  for (const key of Object.keys(values)) {
    if (!requiredVariables.has(key)) {
      errors.push(`Unexpected variable: ${key}`)
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Type-safe plural message creation
 * @param value - The numeric value for pluralization
 * @param options - Plural form options
 * @returns Plural message descriptor
 */
export function createPluralMessage(
  value: number,
  options: {
    zero?: string
    one?: string
    two?: string
    few?: string
    many?: string
    other: string
  }
): MessageDescriptor {
  // Convert to ICU plural format
  const pluralForms = Object.entries(options)
    .map(([key, value]) => `${key} {${value}}`)
    .join(' ')
  
  return {
    id: `plural_${Date.now()}`, // Generate unique ID
    message: `{value, plural, ${pluralForms}}`
  }
}

/**
 * Type-safe select message creation
 * @param value - The value for selection
 * @param options - Selection options
 * @returns Select message descriptor
 */
export function createSelectMessage(
  value: string,
  options: {
    other: string
    [key: string]: string
  }
): MessageDescriptor {
  const selectForms = Object.entries(options)
    .map(([key, value]) => `${key} {${value}}`)
    .join(' ')
  
  return {
    id: `select_${Date.now()}`, // Generate unique ID
    message: `{value, select, ${selectForms}}`
  }
}

/**
 * Development utility to extract all message IDs from components
 * Only available in development mode
 */
export function extractMessageIds(): string[] {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('extractMessageIds is only available in development mode')
    return []
  }
  
  const allIds = new Set<string>()
  
  // Collect IDs from all loaded locales
  Object.values(i18n.messages).forEach(catalog => {
    Object.keys(catalog).forEach(id => allIds.add(id))
  })
  
  return Array.from(allIds).sort()
}

/**
 * Development utility to find missing translations
 * Only available in development mode
 */
export function findMissingTranslations(): Record<Locale, string[]> {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('findMissingTranslations is only available in development mode')
    return {} as Record<Locale, string[]>
  }
  
  const allIds = extractMessageIds()
  const missing: Record<string, string[]> = {}
  
  // Check each locale for missing translations
  Object.keys(i18n.messages).forEach(locale => {
    const catalog = i18n.messages[locale]
    const missingInLocale = allIds.filter(id => !(id in catalog))
    
    if (missingInLocale.length > 0) {
      missing[locale] = missingInLocale
    }
  })
  
  return missing as Record<Locale, string[]>
}

/**
 * Development utility to validate all messages in a catalog
 * Only available in development mode
 */
export function validateMessageCatalog(catalog: MessageCatalog): {
  valid: boolean
  errors: Array<{ messageId: string; error: string }>
} {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('validateMessageCatalog is only available in development mode')
    return { valid: true, errors: [] }
  }
  
  const errors: Array<{ messageId: string; error: string }> = []
  
  Object.entries(catalog).forEach(([messageId, message]) => {
    // Basic validation rules
    if (!message || typeof message !== 'string') {
      errors.push({ messageId, error: 'Message is empty or not a string' })
      return
    }
    
    // Check for unmatched braces in ICU format
    const openBraces = (message.match(/\{/g) || []).length
    const closeBraces = (message.match(/\}/g) || []).length
    
    if (openBraces !== closeBraces) {
      errors.push({ messageId, error: 'Unmatched braces in ICU format' })
    }
    
    // Check for common ICU format issues
    if (message.includes('{') && !message.match(/\{\w+[,}]/)) {
      errors.push({ messageId, error: 'Invalid ICU format syntax' })
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}