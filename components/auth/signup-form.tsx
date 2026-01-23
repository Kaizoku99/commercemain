"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useRTL } from "@/hooks/use-rtl"
import { Eye, EyeOff, Mail, Lock, Crown } from "lucide-react"
import Link from "next/link"
import { useTranslations } from 'next-intl'

export function SignupForm() {
  const t = useTranslations('auth')
  const { isRTL } = useRTL()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    joinMembership: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/customer/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || t('registrationFailed'))
      }

      // Registration successful
      console.log('Registration successful:', result)
      
      // Redirect to login or show success message
      window.location.href = '/auth/login?registered=true'
      
    } catch (error) {
      console.error('Registration error:', error)
      // Handle error (show error message to user)
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className={`grid grid-cols-2 gap-3 ${isRTL ? "grid-flow-col-dense" : ""}`}>
              <div className="space-y-2">
                <Label htmlFor="firstName" className={isRTL ? "text-right block" : ""}>
                  {t('firstName')}
                </Label>
                <Input
                  id="firstName"
                  placeholder={t('firstName')}
                  className={isRTL ? "text-right" : ""}
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className={isRTL ? "text-right block" : ""}>
                  {t('lastName')}
                </Label>
                <Input
                  id="lastName"
                  placeholder={t('lastName')}
                  className={isRTL ? "text-right" : ""}
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                />
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
                  className={isRTL ? "pr-10" : "pl-10"}
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
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
                  className={isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10"}
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  required
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
                  className={isRTL ? "pr-10 pl-10 text-right" : "pl-10 pr-10"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  required
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
            </div>

            {/* ATP Membership Option */}
            <div className="p-4 bg-atp-gold/10 border border-atp-gold/20 rounded-lg">
              <div
                className={`flex items-start space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse text-right" : ""}`}
              >
                <Checkbox
                  id="joinMembership"
                  checked={formData.joinMembership}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, joinMembership: checked as boolean }))
                  }
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="joinMembership"
                    className={`flex items-center gap-2 font-medium ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Crown className="w-4 h-4 text-atp-gold" />
                    {t('joinMembership')}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {t('membershipTrialOffer')}
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Agreement */}
            <div className={`flex items-start space-x-3 ${isRTL ? "flex-row-reverse space-x-reverse text-right" : ""}`}>
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: checked as boolean }))}
                required
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

            <Button type="submit" className="w-full atp-button-gold" disabled={isLoading || !formData.agreeToTerms}>
              {isLoading ? t('creatingAccount') : t('createAccount')}
            </Button>

            <div className={`text-center text-sm text-muted-foreground ${isRTL ? "text-right" : ""}`}>
              {t('alreadyHaveAccount')}{" "}
              <Link href="/login" className="text-atp-gold hover:underline font-medium">
                {t('loginHere')}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
