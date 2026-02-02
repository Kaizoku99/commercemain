import type { Metadata } from "next"
import { getTranslations } from 'next-intl/server'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  const isArabic = locale === 'ar'
  
  const title = isArabic 
    ? 'اتصل بنا | مجموعة ATP للخدمات'
    : 'Contact Us | ATP Group Services'
  
  const description = isArabic
    ? 'تواصل مع مجموعة ATP للخدمات. نحن هنا للمساعدة في احتياجاتك للعناية بالبشرة والمكملات وتقنية المياه وتدريب EMS.'
    : "Get in touch with ATP Group Services. We're here to help with your skincare, supplements, water technology, and EMS training needs."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: isArabic ? 'ar_AE' : 'en_AE',
    },
    alternates: {
      canonical: `/${locale}/contact`,
      languages: {
        en: '/en/contact',
        ar: '/ar/contact',
      },
    },
  }
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact ATP Group Services</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <p className="mb-6">
            We're here to help! Whether you have questions about our products, 
            need technical support, or want to learn more about our services, 
            our team is ready to assist you.
          </p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">General Inquiries</h3>
              <p className="text-gray-600">info@atpgroupservices.ae</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Customer Support</h3>
              <p className="text-gray-600">support@atpgroupservices.ae</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Sales Team</h3>
              <p className="text-gray-600">sales@atpgroupservices.ae</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Phone</h3>
              <p className="text-gray-600">+971 56 958 6422</p>
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-6">Service Areas</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Skincare & Supplements</h3>
              <p className="text-gray-600">Expert consultation and product recommendations</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold">Water & Soil Technology</h3>
              <p className="text-gray-600">Technical support and implementation services</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold">EMS Training</h3>
              <p className="text-gray-600">Training schedules and certification programs</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-semibold">Membership Programs</h3>
              <p className="text-gray-600">Membership inquiries and benefits information</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Business Hours</h3>
            <p className="text-gray-600">
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 9:00 AM - 2:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-600">
          For urgent matters, please call our support line or send us an email. 
          We typically respond within 24 hours during business days.
        </p>
      </div>
    </div>
  )
}
