'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomerOAuth } from '@/hooks/use-customer-oauth'
import { Mail, ArrowLeft, ShieldCheck, Info } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useRTL } from '@/hooks/use-rtl'

export function ForgotPasswordFormOAuth() {
  const t = useTranslations('auth')
  const { isRTL } = useRTL()
  const { login } = useCustomerOAuth()

  const handleSignIn = () => {
    login('/account')
  }

  return (
    <div className={isRTL ? "font-arabic" : ""}>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-atp-gold/10 flex items-center justify-center">
            <ShieldCheck className="h-8 w-8 text-atp-gold" />
          </div>
          <CardTitle className="text-2xl">
            {t('noPasswordNeeded') || 'No Password Needed'}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {t('passwordlessExplanation') || 'Your account uses secure, passwordless authentication'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Info box */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className={`flex gap-3 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                  {t('howAuthWorks') || 'How authentication works'}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {t('passwordlessDescription') || 
                    'Instead of remembering a password, you\'ll receive a secure one-time code to your email each time you sign in. This is more secure and eliminates the risk of forgotten passwords.'}
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              {t('passwordlessBenefits') || 'Benefits of passwordless login:'}
            </p>
            <ul className={`space-y-2 text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              <li className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('benefit1') || 'No passwords to remember or forget'}</span>
              </li>
              <li className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('benefit2') || 'More secure than traditional passwords'}</span>
              </li>
              <li className={`flex items-start gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{t('benefit3') || 'Quick and easy sign-in with email verification'}</span>
              </li>
            </ul>
          </div>

          {/* CTA Button */}
          <Button 
            type="button"
            onClick={handleSignIn}
            className="w-full atp-button-gold h-12"
          >
            <Mail className="mr-2 h-5 w-5" />
            {t('signInWithEmail') || 'Sign In with Email'}
          </Button>

          {/* Back to login */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center transition-colors"
            >
              <ArrowLeft className={`h-3 w-3 ${isRTL ? "ml-1 rotate-180" : "mr-1"}`} />
              {t('backToLogin') || 'Back to Login'}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
