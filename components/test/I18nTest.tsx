'use client'

import { useLingui } from '@lingui/react'
import { t } from '@lingui/core/macro'
import { I18nReady } from '@/src/i18n/I18nReady'

export function I18nTest() {
  const { _, i18n } = useLingui()

  return (
    <I18nReady>
      <div className="p-4 border rounded">
        <h3 className="font-bold">I18n Test Component</h3>
        <p>Translation test: {_(t`My Cart`)}</p>
        <p>Locale: {i18n?.locale || 'unknown'}</p>
        <p>Messages loaded: {Object.keys(i18n?.messages || {}).length}</p>
      </div>
    </I18nReady>
  )
}