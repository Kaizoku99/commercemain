'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useCustomer } from '@/hooks/use-customer'
import { Loader2, Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

// Zod schema for form validation
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const { resetPassword } = useCustomer()
  const t = useTranslations('auth')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null)

    try {
      const success = await resetPassword(data.email)

      if (success) {
        setIsSuccess(true)
      } else {
        // For security reasons, we still show success even if email doesn't exist
        // This prevents email enumeration attacks
        setIsSuccess(true)
      }
    } catch {
      setServerError(t('unexpectedError'))
    }
  }

  // Success state
  if (isSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle>{t('resetLinkSent')}</CardTitle>
          <CardDescription>
            {t('resetLinkSentDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            {t('checkSpamFolder')}
          </p>
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('backToLogin')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('forgotPasswordTitle')}</CardTitle>
        <CardDescription>
          {t('forgotPasswordDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {serverError && (
            <Alert variant="destructive" className="animate-shake">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isSubmitting}
                placeholder={t('emailPlaceholder')}
                aria-invalid={errors.email ? 'true' : 'false'}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={cn(
                  'pl-10',
                  errors.email && touchedFields.email && 'border-red-500 focus-visible:ring-red-500 animate-shake'
                )}
              />
            </div>
            {errors.email && touchedFields.email && (
              <p id="email-error" className="text-sm text-red-500 mt-1" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('sendingResetLink')}
              </>
            ) : (
              t('sendResetLink')
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-blue-600 hover:underline inline-flex items-center"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              {t('backToLogin')}
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
