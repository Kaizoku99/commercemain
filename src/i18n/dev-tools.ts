/**
 * Development tools for Lingui TypeScript integration
 * Provides utilities for message validation, extraction, and type generation
 */

import type { 
  Locale, 
  MessageCatalog, 
  LinguiDevTools,
  I18nPerformanceMetrics 
} from './types'
import { locales, defaultLocale } from './types'

/**
 * Development mode check
 */
const isDevelopment = process.env.NODE_ENV === 'development'

/**
 * Performance monitoring for i18n operations
 */
class I18nPerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  
  /**
   * Start timing an operation
   * @param operation - The operation name
   * @returns Timer function to end timing
   */
  startTiming(operation: string): () => number {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime
      
      if (!this.metrics.has(operation)) {
        this.metrics.set(operation, [])
      }
      
      this.metrics.get(operation)!.push(duration)
      return duration
    }
  }
  
  /**
   * Get performance metrics for an operation
   * @param operation - The operation name
   * @returns Performance statistics
   */
  getMetrics(operation: string): {
    count: number
    average: number
    min: number
    max: number
    total: number
  } | null {
    const times = this.metrics.get(operation)
    
    if (!times || times.length === 0) {
      return null
    }
    
    return {
      count: times.length,
      average: times.reduce((a, b) => a + b, 0) / times.length,
      min: Math.min(...times),
      max: Math.max(...times),
      total: times.reduce((a, b) => a + b, 0)
    }
  }
  
  /**
   * Get all performance metrics
   * @returns All performance statistics
   */
  getAllMetrics(): Record<string, ReturnType<typeof this.getMetrics>> {
    const result: Record<string, ReturnType<typeof this.getMetrics>> = {}
    
    for (const [operation] of Array.from(this.metrics.keys()).map(key => [key] as const)) {
      result[operation] = this.getMetrics(operation)
    }
    
    return result
  }
  
  /**
   * Clear all metrics
   */
  clear(): void {
    this.metrics.clear()
  }
}

// Global performance monitor instance
export const performanceMonitor = new I18nPerformanceMonitor()

/**
 * Message validation utilities
 */
export class MessageValidator {
  /**
   * Validate ICU message format syntax
   * @param message - The message to validate
   * @returns Validation result
   */
  static validateICUFormat(message: string): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    // Check for balanced braces
    let braceDepth = 0
    let inQuotes = false
    
    for (let i = 0; i < message.length; i++) {
      const char = message[i]
      const prevChar = i > 0 ? message[i - 1] : ''
      
      if (char === "'" && prevChar !== '\\') {
        inQuotes = !inQuotes
      } else if (!inQuotes) {
        if (char === '{') {
          braceDepth++
        } else if (char === '}') {
          braceDepth--
          if (braceDepth < 0) {
            errors.push(`Unmatched closing brace at position ${i}`)
            break
          }
        }
      }
    }
    
    if (braceDepth > 0) {
      errors.push(`${braceDepth} unmatched opening brace(s)`)
    }
    
    // Check for valid ICU patterns
    const icuPatterns = [
      /\{\s*\w+\s*,\s*plural\s*,.*?\}/g,
      /\{\s*\w+\s*,\s*select\s*,.*?\}/g,
      /\{\s*\w+\s*,\s*selectordinal\s*,.*?\}/g,
      /\{\s*\w+\s*\}/g
    ]
    
    const braceContent = message.match(/\{[^}]+\}/g) || []
    
    for (const content of Array.from(braceContent)) {
      const isValid = icuPatterns.some(pattern => {
        pattern.lastIndex = 0 // Reset regex
        return pattern.test(content)
      })
      
      if (!isValid) {
        errors.push(`Invalid ICU format: ${content}`)
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
  
  /**
   * Extract variable names from ICU message
   * @param message - The message to analyze
   * @returns Array of variable names
   */
  static extractVariables(message: string): string[] {
    const variables = new Set<string>()
    
    // First, extract top-level ICU variables (not nested in plural/select forms)
    const icuPattern = /\{\s*(\w+)(?:\s*,\s*(plural|select|selectordinal)\s*,.*?)?\s*\}/g
    let match
    
    while ((match = icuPattern.exec(message)) !== null) {
      variables.add(match[1])
    }
    
    // Also extract simple variables like {name}
    const simplePattern = /\{\s*(\w+)\s*\}/g
    const tempMessage = message.replace(icuPattern, '') // Remove ICU patterns first
    
    while ((match = simplePattern.exec(tempMessage)) !== null) {
      variables.add(match[1])
    }
    
    return Array.from(variables).sort()
  }
  
  /**
   * Validate message catalog consistency
   * @param catalogs - Object mapping locales to message catalogs
   * @returns Validation result
   */
  static validateCatalogConsistency(
    catalogs: Record<Locale, MessageCatalog>
  ): {
    valid: boolean
    errors: string[]
    warnings: string[]
  } {
    const errors: string[] = []
    const warnings: string[] = []
    
    // Get all message IDs from all catalogs
    const allMessageIds = new Set<string>()
    Object.values(catalogs).forEach(catalog => {
      Object.keys(catalog).forEach(id => allMessageIds.add(id))
    })
    
    // Check each locale for missing messages
    for (const locale of Array.from(locales)) {
      const catalog = catalogs[locale]
      
      if (!catalog) {
        errors.push(`Missing catalog for locale: ${locale}`)
        continue
      }
      
      for (const messageId of Array.from(allMessageIds)) {
        if (!(messageId in catalog)) {
          warnings.push(`Missing translation for "${messageId}" in locale "${locale}"`)
        }
      }
    }
    
    // Validate message format consistency
    for (const messageId of Array.from(allMessageIds)) {
      const messages = locales
        .map(locale => catalogs[locale]?.[messageId])
        .filter(Boolean)
      
      if (messages.length > 1) {
        const variables = messages.map(msg => 
          MessageValidator.extractVariables(msg).sort()
        )
        
        // Check if all translations use the same variables
        const firstVariables = variables[0]
        const inconsistent = variables.some(vars => 
          vars.length !== firstVariables.length ||
          vars.some((v, i) => v !== firstVariables[i])
        )
        
        if (inconsistent) {
          warnings.push(
            `Inconsistent variables in message "${messageId}": ${
              variables.map(v => `[${v.join(', ')}]`).join(' vs ')
            }`
          )
        }
      }
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    }
  }
}

/**
 * TypeScript integration utilities
 */
export class TypeScriptIntegration {
  /**
   * Generate TypeScript definitions for message IDs
   * @param catalog - The message catalog
   * @returns TypeScript definition string
   */
  static generateMessageIdTypes(catalog: MessageCatalog): string {
    const messageIds = Object.keys(catalog).sort()
    
    const typeDefinition = `
// Auto-generated message ID types
export type MessageId = 
${messageIds.map(id => `  | '${id}'`).join('\n')}

// Type-safe message ID validation
export function isValidMessageId(id: string): id is MessageId {
  return [
${messageIds.map(id => `    '${id}'`).join(',\n')}
  ].includes(id as MessageId)
}

// Message ID constants for better refactoring support
export const MESSAGE_IDS = {
${messageIds.map(id => `  ${id.toUpperCase().replace(/[.-]/g, '_')}: '${id}' as const`).join(',\n')}
} as const
`
    
    return typeDefinition
  }
  
  /**
   * Generate TypeScript definitions for message values
   * @param catalog - The message catalog
   * @returns TypeScript definition string
   */
  static generateMessageValueTypes(catalog: MessageCatalog): string {
    const messageTypes: string[] = []
    
    Object.entries(catalog).forEach(([messageId, message]) => {
      const variables = MessageValidator.extractVariables(message)
      
      if (variables.length > 0) {
        const valueType = variables
          .map(variable => `${variable}: string | number`)
          .join('; ')
        
        messageTypes.push(`  '${messageId}': { ${valueType} }`)
      } else {
        messageTypes.push(`  '${messageId}': never`)
      }
    })
    
    return `
// Auto-generated message value types
export interface MessageValues {
${messageTypes.join('\n')}
}

// Type-safe translation function
export function t<K extends keyof MessageValues>(
  messageId: K,
  ...args: MessageValues[K] extends never ? [] : [MessageValues[K]]
): string
`
  }
}

/**
 * Development tools implementation
 */
class LinguiDevToolsImpl implements LinguiDevTools {
  async extractMessages(): Promise<void> {
    if (!isDevelopment) {
      console.warn('Message extraction is only available in development mode')
      return
    }
    
    try {
      const { execSync } = await import('child_process')
      execSync('npm run lingui:extract', { stdio: 'inherit' })
      console.log('✅ Messages extracted successfully')
    } catch (error) {
      console.error('❌ Failed to extract messages:', error)
      throw error
    }
  }
  
  async compileMessages(): Promise<void> {
    if (!isDevelopment) {
      console.warn('Message compilation is only available in development mode')
      return
    }
    
    try {
      const { execSync } = await import('child_process')
      execSync('npm run lingui:compile', { stdio: 'inherit' })
      console.log('✅ Messages compiled successfully')
    } catch (error) {
      console.error('❌ Failed to compile messages:', error)
      throw error
    }
  }
  
  async validateMessages(): Promise<boolean> {
    if (!isDevelopment) {
      console.warn('Message validation is only available in development mode')
      return true
    }
    
    try {
      // Load all message catalogs
      const catalogs: Record<Locale, MessageCatalog> = {} as any
      
      for (const locale of Array.from(locales)) {
        try {
          const { messages } = await import(`../locales/${locale}/messages.js`)
          catalogs[locale] = messages
        } catch (error) {
          console.warn(`Could not load messages for locale ${locale}:`, error)
        }
      }
      
      // Validate consistency
      const validation = MessageValidator.validateCatalogConsistency(catalogs)
      
      if (validation.errors.length > 0) {
        console.error('❌ Message validation errors:')
        validation.errors.forEach(error => console.error(`  - ${error}`))
      }
      
      if (validation.warnings.length > 0) {
        console.warn('⚠️ Message validation warnings:')
        validation.warnings.forEach(warning => console.warn(`  - ${warning}`))
      }
      
      if (validation.valid) {
        console.log('✅ All messages are valid')
      }
      
      return validation.valid
    } catch (error) {
      console.error('❌ Failed to validate messages:', error)
      return false
    }
  }
  
  getStats(): {
    totalMessages: number
    translatedMessages: number
    missingMessages: string[]
  } {
    // This would need access to the actual i18n instance
    // For now, return placeholder data
    return {
      totalMessages: 0,
      translatedMessages: 0,
      missingMessages: []
    }
  }
}

// Export development tools instance
export const devTools = new LinguiDevToolsImpl()

// Attach to window in development mode
if (isDevelopment && typeof window !== 'undefined') {
  window.__LINGUI_DEV_TOOLS__ = devTools
  window.__LINGUI_DEVELOPMENT__ = true
  
  // Add performance monitoring
  console.log('🔧 Lingui development tools loaded')
  console.log('Access via window.__LINGUI_DEV_TOOLS__')
}