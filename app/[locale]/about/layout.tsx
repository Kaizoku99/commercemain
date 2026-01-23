import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

interface AboutLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'common' })

  const isArabic = locale === 'ar'
  
  const title = isArabic 
    ? 'عن مجموعة ATP للخدمات | حلول العافية المتميزة'
    : 'About ATP Group Services | Premium Wellness Solutions'
  
  const description = isArabic
    ? 'اكتشف مهمتنا في تقديم حلول العافية المبتكرة التي تغذي العقل والجسم والروح من خلال تجارب متميزة وتقنية متطورة.'
    : 'Discover our mission to deliver innovative wellness solutions that nurture the mind, body, and spirit through premium experiences and cutting-edge technology.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isArabic ? 'ar_AE' : 'en_AE',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        ar: '/ar/about',
      },
    },
  }
}

export default function AboutLayout({ children }: AboutLayoutProps) {
  return <>{children}</>
}
