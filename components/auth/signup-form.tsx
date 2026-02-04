"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRTL } from "@/hooks/use-rtl"
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { cn } from "@/lib/utils"

const createSignupSchema = (t: any) => z.object({
  firstName: z.string().min(1, t('firstNameRequired') || "First name is required"),
  lastName: z.string().min(1, t('lastNameRequired') || "Last name is required"),
  email: z.string().email(t('invalidEmail') || "Invalid email address"),
  password: z.string().min(6, t('passwordMinLength') || "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: t('termsRequired') || "You must agree to the terms and privacy policy",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: t('passwordsDoNotMatch') || "Passwords do not match",
  path: ["confirmPassword"],
})

type SignupFormData = z.infer<ReturnType<typeof createSignupSchema>>

export function SignupForm() {
  const t = useTranslations('auth')
  const { isRTL } = useRTL()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const signupSchema = createSignupSchema(t)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  })

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null)

    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('registrationFailed'))
      }

      // Registration successful
      console.log('Registration successful:', result)
      setIsSuccess(true)

    } catch (error: any) {
      console.error('Registration error:', error)
      const errorMessage = error.message || t('registrationFailed')

      // Check if the error message indicates that an email was sent (Shopify behavior for existing unverified accounts)
      if (
        errorMessage.includes("We have sent an email") ||
        errorMessage.includes("verify your email") ||
        errorMessage.toLowerCase().includes("activation email")
      ) {
        setIsSuccess(true)
      } else {
        setServerError(errorMessage)
      }
    }
  }

  if (isSuccess) {
    return (
      <div className={isRTL ? "font-arabic" : ""}>
        <Card className="w-full max-w-md mx-auto atp-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold">{t('accountCreated')}</CardTitle>
            <CardDescription className="text-lg mt-2">
              {t('checkEmailForActivation')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {t('activationEmailSent')}
            </p>
            <Link href="/auth/login">
              <Button className="w-full atp-button-gold">
                {t('proceedToLogin')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={isRTL ? "font-arabic" : ""}>
      <Card className="w-full max-w-md mx-auto atp-card">
        <CardHeader className={`text-center ${isRTL ? "text-right" : ""}`}>
          <CardTitle className="text-2xl font-bold">{t('createAccount')}</CardTitle>
          <CardDescription>
            {t('createAccountDescription')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <Alert variant="destructive" className="animate-shake">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{serverError}</AlertDescription>
              </Alert>
            )}

            <div className={`grid grid-cols-2 gap-3 ${isRTL ? "grid-flow-col-dense" : ""}`}>
              <div className="space-y-2">
                <Label htmlFor="firstName" className={isRTL ? "text-right block" : ""}>
                  {t('firstName')}
                </Label>
                <Input
                  id="firstName"
                  placeholder={t('firstName')}
                  className={cn(isRTL ? "text-right" : "", errors.firstName && "border-red-500")}
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className={isRTL ? "text-right block" : ""}>
                  {t('lastName')}
                </Label>
                <Input
                  id="lastName"
                  placeholder={t('lastName')}
                  className={cn(isRTL ? "text-right" : "", errors.lastName && "border-red-500")}
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className={isRTL ? "text-right block" : ""}>
                {t('email')}
              </Label>
              <div className="relative">
                <Mail className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`} />
                <Input
                  id="email"
                  type="email"
                  placeholder={t('email')}
                  className={cn(isRTL ? "pr-10" : "pl-10", errors.email && "border-red-500")}
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={isRTL ? "text-right block" : ""}>
                {t('password')}
              </Label>
              <div className="relative">
                <Lock className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('password')}
                  className={cn(isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10", errors.password && "border-red-500")}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-3 text-muted-foreground hover:text-foreground ${isRTL ? "left-3" : "right-3"}`}
                  title={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className={isRTL ? "text-right block" : ""}>
                {t('confirmPassword')}
              </Label>
              <div className="relative">
                <Lock className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? "right-3" : "left-3"}`} />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t('confirmPassword')}
                  className={cn(isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10", errors.confirmPassword && "border-red-500")}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute top-3 text-muted-foreground hover:text-foreground ${isRTL ? "left-3" : "right-3"}`}
                  title={showConfirmPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <div className={`flex items-start space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse text-right" : ""}`}>
                <Controller
                  name="agreeToTerms"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="agreeToTerms"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="agreeToTerms" className="text-sm leading-relaxed">
                  {t('agreeToThe')}{" "}
                  <Link href="/terms" className="text-atp-gold hover:underline">
                    {t('termsOfService')}
                  </Link>{" "}
                  {t('and')}{" "}
                  <Link href="/privacy" className="text-atp-gold hover:underline">
                    {t('privacyPolicy')}
                  </Link>
                </Label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-sm text-red-500 mt-1">{errors.agreeToTerms.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full atp-button-gold" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('creatingAccount')}
                </>
              ) : (
                t('createAccount')
              )}
            </Button>

            <div className={`text-center text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {t('alreadyHaveAccount')}{" "}
              <Link href="/auth/login" className="text-atp-gold hover:underline font-medium">
                {t('loginHere')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
