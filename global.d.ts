// Global type definitions for Lingui i18n
import type { I18n } from '@lingui/core'
import type { ComponentType, ReactNode } from 'react'

declare global {
  // Lingui macro types for compile-time validation
  namespace JSX {
    interface IntrinsicElements {
      // Allow Trans component to accept any props for macro transformation
      Trans: any
      // Tamara widget custom element
      "tamara-widget": {
        id?: string;
        type?: string;
        amount?: string;
        config?: string;
        "inline-type"?: string;
        children?: ReactNode;
      };
    }
  }
}

// Module declarations for Lingui macros
declare module '@lingui/core/macro' {
  export function t(template: TemplateStringsArray, ...args: any[]): string
  export function t(id: string): string
  export function t(descriptor: { id?: string; message?: string; comment?: string }): string
  export function plural(value: number, options: { [key: string]: string }): string
  export function selectOrdinal(value: number, options: { [key: string]: string }): string
  export function select(value: string, options: { [key: string]: string }): string
  export function defineMessage(descriptor: { id?: string; message?: string; comment?: string }): { id: string }
  export function msg(template: TemplateStringsArray, ...args: any[]): { id: string }
  export function msg(id: string): { id: string }
  export function msg(descriptor: { id?: string; message?: string; comment?: string }): { id: string }
}

declare module '@lingui/react/macro' {
  import type { ComponentProps, ReactNode } from 'react'
  
  export interface TransProps {
    id?: string
    message?: string
    comment?: string
    children?: ReactNode
    values?: Record<string, any>
    components?: Record<string, ComponentType<any> | string>
    render?: (chunks: ReactNode[]) => ReactNode
  }
  
  export function Trans(props: TransProps): JSX.Element
  export function Plural(props: {
    value: number
    one?: ReactNode
    other?: ReactNode
    zero?: ReactNode
    two?: ReactNode
    few?: ReactNode
    many?: ReactNode
    [key: string]: ReactNode | number | undefined
  }): JSX.Element
  export function SelectOrdinal(props: {
    value: number
    one?: ReactNode
    other?: ReactNode
    zero?: ReactNode
    two?: ReactNode
    few?: ReactNode
    many?: ReactNode
    [key: string]: ReactNode | number | undefined
  }): JSX.Element
  export function Select(props: {
    value: string
    other?: ReactNode
    [key: string]: ReactNode | string | undefined
  }): JSX.Element
  
  // Hook for accessing i18n instance with proper typing
  export function useLingui(): {
    i18n: I18n
    _: (id: string, values?: Record<string, any>) => string
    t: (id: string, values?: Record<string, any>) => string
  }
}

// Type definitions for compiled message catalogs
declare module '*/messages.js' {
  const messages: Record<string, string>
  export { messages }
}

declare module '*/messages.po' {
  const messages: Record<string, string>
  export { messages }
}

// Extend Window interface for development tools
declare global {
  interface Window {
    __LINGUI_DEVELOPMENT__?: boolean
    __LINGUI_DEV_TOOLS__?: import('./src/i18n/types').LinguiDevTools
  }
}