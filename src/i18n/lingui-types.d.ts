/**
 * TypeScript definitions for Lingui macros and runtime
 * Provides compile-time validation and IntelliSense support
 */

// Augment the global namespace for Lingui development tools
declare global {
  interface Window {
    __LINGUI_DEVELOPMENT__?: boolean
    __LINGUI_LOCALE__?: string
    __LINGUI_MESSAGES__?: Record<string, any>
  }
}

// Module augmentation for better macro support
declare module '@lingui/core/macro' {
  import type { MessageDescriptor } from '@lingui/core'
  
  // Enhanced t macro with overloads for better type inference
  export function t(template: TemplateStringsArray, ...args: any[]): string
  export function t(id: string): string
  export function t(descriptor: MessageDescriptor): string
  
  // Plural macro with proper typing
  export function plural(
    value: number, 
    options: {
      zero?: string
      one?: string
      two?: string
      few?: string
      many?: string
      other: string
      [key: string]: string | undefined
    }
  ): string
  
  // Select macro with proper typing
  export function select(
    value: string,
    options: {
      other: string
      [key: string]: string | undefined
    }
  ): string
  
  // SelectOrdinal macro
  export function selectOrdinal(
    value: number,
    options: {
      zero?: string
      one?: string
      two?: string
      few?: string
      many?: string
      other: string
      [key: string]: string | undefined
    }
  ): string
  
  // Message definition macros
  export function defineMessage(descriptor: MessageDescriptor): MessageDescriptor
  export function msg(template: TemplateStringsArray, ...args: any[]): MessageDescriptor
  export function msg(id: string): MessageDescriptor
  export function msg(descriptor: MessageDescriptor): MessageDescriptor
}

declare module '@lingui/react/macro' {
  import type { ComponentProps, ReactNode, ComponentType } from 'react'
  import type { MessageDescriptor } from '@lingui/core'
  
  // Enhanced Trans component props
  export interface TransProps {
    id?: string
    message?: string
    comment?: string
    context?: string
    children?: ReactNode
    values?: Record<string, any>
    components?: Record<string, ComponentType<any> | string>
    render?: (chunks: ReactNode[]) => ReactNode
  }
  
  // Trans component with proper typing
  export function Trans(props: TransProps): JSX.Element
  
  // Plural component props
  export interface PluralProps {
    value: number
    zero?: ReactNode
    one?: ReactNode
    two?: ReactNode
    few?: ReactNode
    many?: ReactNode
    other: ReactNode
    [key: string]: ReactNode | number | undefined
  }
  
  export function Plural(props: PluralProps): JSX.Element
  
  // Select component props
  export interface SelectProps {
    value: string
    other: ReactNode
    [key: string]: ReactNode | string | undefined
  }
  
  export function Select(props: SelectProps): JSX.Element
  
  // SelectOrdinal component props
  export interface SelectOrdinalProps {
    value: number
    zero?: ReactNode
    one?: ReactNode
    two?: ReactNode
    few?: ReactNode
    many?: ReactNode
    other: ReactNode
    [key: string]: ReactNode | number | undefined
  }
  
  export function SelectOrdinal(props: SelectOrdinalProps): JSX.Element
  
  // Enhanced useLingui hook with better typing
  export function useLingui(): {
    i18n: import('@lingui/core').I18n
    _: (id: string, values?: Record<string, any>) => string
    t: (id: string, values?: Record<string, any>) => string
  }
}

// Type definitions for message catalogs
declare module '*/messages.js' {
  const messages: Record<string, string>
  export { messages }
}

declare module '*/messages.po' {
  const messages: Record<string, string>
  export { messages }
}

// Augment JSX namespace for better Trans component support
declare namespace JSX {
  interface IntrinsicElements {
    // Allow Trans component to be used as JSX element
    Trans: any
  }
}

// Type-safe message ID validation (for development)
export type MessageId = string & { __brand: 'MessageId' }

// Utility type for creating type-safe message IDs
export function createMessageId<T extends string>(id: T): MessageId {
  return id as MessageId
}

// Type for message values with proper constraints
export type MessageValues = Record<string, string | number | ReactNode>

// Enhanced error types for better debugging
export interface LinguiCompileError extends Error {
  messageId?: string
  locale?: string
  source?: string
  line?: number
  column?: number
}

export interface LinguiRuntimeError extends Error {
  messageId: string
  locale: string
  values?: MessageValues
}

// Development mode utilities
export interface LinguiDevTools {
  extractMessages(): Promise<void>
  compileMessages(): Promise<void>
  validateMessages(): Promise<boolean>
  getStats(): {
    totalMessages: number
    translatedMessages: number
    missingMessages: string[]
  }
}

// Declare development tools on window in development mode
declare global {
  interface Window {
    __LINGUI_DEV_TOOLS__?: LinguiDevTools
  }
}

export {}