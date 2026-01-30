/**
 * Stub type declarations for @lingui packages
 * The project has moved to next-intl but legacy lingui files remain
 * These stubs prevent TypeScript errors without requiring actual lingui installation
 */

declare module '@lingui/core' {
  export interface MessageDescriptor {
    id?: string;
    comment?: string;
    message?: string;
    context?: string;
  }

  export interface I18n {
    locale: string;
    locales: string[];
    messages: Record<string, string>;
    load(locale: string, messages: Record<string, string>): void;
    loadAndActivate(options: { locale: string; messages: Record<string, string> }): void;
    activate(locale: string): void;
    _: (id: string | MessageDescriptor, values?: Record<string, unknown>) => string;
    t: (id: string | MessageDescriptor, values?: Record<string, unknown>) => string;
  }

  export function setupI18n(options?: {
    locale?: string;
    locales?: string[];
    messages?: Record<string, Record<string, string>>;
  }): I18n;

  export const i18n: I18n;
}

declare module '@lingui/core/macro' {
  import type { MessageDescriptor } from '@lingui/core';

  export function t(template: TemplateStringsArray, ...args: unknown[]): string;
  export function t(id: string): string;
  export function t(descriptor: MessageDescriptor): string;

  export function plural(
    value: number,
    options: {
      zero?: string;
      one?: string;
      two?: string;
      few?: string;
      many?: string;
      other: string;
      [key: string]: string | undefined;
    }
  ): string;

  export function select(
    value: string,
    options: {
      other: string;
      [key: string]: string | undefined;
    }
  ): string;

  export function selectOrdinal(
    value: number,
    options: {
      zero?: string;
      one?: string;
      two?: string;
      few?: string;
      many?: string;
      other: string;
      [key: string]: string | undefined;
    }
  ): string;

  export function defineMessage(descriptor: MessageDescriptor): MessageDescriptor;
  export function msg(template: TemplateStringsArray, ...args: unknown[]): MessageDescriptor;
  export function msg(id: string): MessageDescriptor;
  export function msg(descriptor: MessageDescriptor): MessageDescriptor;
}

declare module '@lingui/react' {
  import type { ReactNode, ComponentType, FC } from 'react';
  import type { I18n, MessageDescriptor } from '@lingui/core';

  export interface I18nProviderProps {
    i18n: I18n;
    children?: ReactNode;
  }

  export const I18nProvider: FC<I18nProviderProps>;

  export interface TransProps {
    id?: string;
    message?: string;
    comment?: string;
    context?: string;
    children?: ReactNode;
    values?: Record<string, unknown>;
    components?: Record<string, ComponentType<unknown> | string>;
    render?: (chunks: ReactNode[]) => ReactNode;
  }

  export const Trans: FC<TransProps>;

  export interface UseLinguiResult {
    i18n: I18n;
    _: (id: string | MessageDescriptor, values?: Record<string, unknown>) => string;
  }

  export function useLingui(): UseLinguiResult;
}

declare module '@lingui/react/macro' {
  import type { ReactNode, ComponentType, FC } from 'react';
  import type { I18n, MessageDescriptor } from '@lingui/core';

  export interface TransProps {
    id?: string;
    message?: string;
    comment?: string;
    context?: string;
    children?: ReactNode;
    values?: Record<string, unknown>;
    components?: Record<string, ComponentType<unknown> | string>;
    render?: (chunks: ReactNode[]) => ReactNode;
  }

  export const Trans: FC<TransProps>;

  export interface PluralProps {
    value: number;
    zero?: ReactNode;
    one?: ReactNode;
    two?: ReactNode;
    few?: ReactNode;
    many?: ReactNode;
    other: ReactNode;
    [key: string]: ReactNode | number | undefined;
  }

  export const Plural: FC<PluralProps>;

  export interface SelectProps {
    value: string;
    other: ReactNode;
    [key: string]: ReactNode | string | undefined;
  }

  export const Select: FC<SelectProps>;

  export interface SelectOrdinalProps {
    value: number;
    zero?: ReactNode;
    one?: ReactNode;
    two?: ReactNode;
    few?: ReactNode;
    many?: ReactNode;
    other: ReactNode;
    [key: string]: ReactNode | number | undefined;
  }

  export const SelectOrdinal: FC<SelectOrdinalProps>;

  export interface UseLinguiResult {
    i18n: I18n;
    _: (id: string | MessageDescriptor, values?: Record<string, unknown>) => string;
    t: (template: TemplateStringsArray | string, ...args: unknown[]) => string;
  }

  export function useLingui(): UseLinguiResult;
}

declare module '@lingui/react/server' {
  import type { I18n } from '@lingui/core';

  export function setI18n(i18n: I18n): void;
  export function getI18n(): I18n | undefined;
}

declare module '@lingui/cli' {
  export interface LinguiConfig {
    sourceLocale?: string;
    locales?: string[];
    catalogs?: Array<{
      path?: string;
      include?: string[];
      exclude?: string[];
    }>;
    format?: unknown;
    orderBy?: string;
  }

  export function defineConfig(config: LinguiConfig): LinguiConfig;
}

declare module '@lingui/format-po' {
  export function formatter(options?: Record<string, unknown>): unknown;
}
