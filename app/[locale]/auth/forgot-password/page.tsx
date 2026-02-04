import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<ForgotPasswordFormSkeleton />}>
          <ForgotPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}

function ForgotPasswordFormSkeleton() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </CardContent>
    </Card>
  )
}
