/**
 * UAE Cultural Configuration for Membership Features
 * 
 * Provides cultural considerations and localization for the UAE market
 * Requirements: 1.1, 1.2, 1.3, 1.4
 */

import { type Locale } from '@/lib/i18n/config';

export interface UAECulturalConfig {
  locale: Locale;
  businessHours: {
    weekdays: string;
    weekend: string;
    ramadan?: string;
  };
  paymentPreferences: {
    preferred: string[];
    accepted: string[];
    notes: Record<string, string>;
  };
  communicationStyle: {
    formality: 'formal' | 'casual';
    honorifics: boolean;
    directness: 'direct' | 'indirect';
  };
  dateTimeFormat: {
    calendar: 'gregorian' | 'hijri';
    weekStart: 'sunday' | 'monday';
    timeFormat: '12h' | '24h';
  };
  currencyDisplay: {
    position: 'before' | 'after';
    separator: string;
    decimals: number;
  };
  colorPreferences: {
    primary: string[];
    avoid: string[];
    cultural: Record<string, string>;
  };
  membershipTerminology: {
    membership: string;
    benefits: string;
    premium: string;
    exclusive: string;
  };
}

const uaeCulturalConfigs: Record<Locale, UAECulturalConfig> = {
  en: {
    locale: 'en',
    businessHours: {
      weekdays: 'Sunday - Thursday: 9:00 AM - 6:00 PM',
      weekend: 'Friday - Saturday: Closed',
      ramadan: 'Sunday - Thursday: 10:00 AM - 4:00 PM',
    },
    paymentPreferences: {
      preferred: ['credit_card', 'debit_card', 'apple_pay', 'google_pay'],
      accepted: ['visa', 'mastercard', 'amex', 'digital_wallets'],
      notes: {
        credit_card: 'Most preferred payment method',
        digital_wallets: 'Growing popularity among younger demographics',
        cash: 'Less common for online transactions',
      },
    },
    communicationStyle: {
      formality: 'formal',
      honorifics: true,
      directness: 'indirect',
    },
    dateTimeFormat: {
      calendar: 'gregorian',
      weekStart: 'sunday',
      timeFormat: '12h',
    },
    currencyDisplay: {
      position: 'before',
      separator: ',',
      decimals: 2,
    },
    colorPreferences: {
      primary: ['gold', 'navy', 'white', 'black'],
      avoid: ['bright_pink', 'neon_colors'],
      cultural: {
        gold: 'Luxury and premium quality',
        green: 'Islamic significance, prosperity',
        white: 'Purity and cleanliness',
        navy: 'Trust and professionalism',
      },
    },
    membershipTerminology: {
      membership: 'Membership',
      benefits: 'Benefits',
      premium: 'Premium',
      exclusive: 'Exclusive',
    },
  },
  ar: {
    locale: 'ar',
    businessHours: {
      weekdays: 'الأحد - الخميس: 9:00 صباحاً - 6:00 مساءً',
      weekend: 'الجمعة - السبت: مغلق',
      ramadan: 'الأحد - الخميس: 10:00 صباحاً - 4:00 مساءً',
    },
    paymentPreferences: {
      preferred: ['credit_card', 'debit_card', 'apple_pay', 'google_pay'],
      accepted: ['visa', 'mastercard', 'amex', 'digital_wallets'],
      notes: {
        credit_card: 'طريقة الدفع المفضلة',
        digital_wallets: 'شعبية متزايدة بين الشباب',
        cash: 'أقل شيوعاً للمعاملات الإلكترونية',
      },
    },
    communicationStyle: {
      formality: 'formal',
      honorifics: true,
      directness: 'indirect',
    },
    dateTimeFormat: {
      calendar: 'gregorian',
      weekStart: 'sunday',
      timeFormat: '12h',
    },
    currencyDisplay: {
      position: 'after',
      separator: '،',
      decimals: 2,
    },
    colorPreferences: {
      primary: ['gold', 'navy', 'white', 'black'],
      avoid: ['bright_pink', 'neon_colors'],
      cultural: {
        gold: 'الفخامة والجودة العالية',
        green: 'الأهمية الإسلامية والازدهار',
        white: 'النقاء والنظافة',
        navy: 'الثقة والمهنية',
      },
    },
    membershipTerminology: {
      membership: 'العضوية',
      benefits: 'المزايا',
      premium: 'المتميز',
      exclusive: 'الحصري',
    },
  },
};

/**
 * UAE Cultural Service
 */
export class UAECulturalService {
  public config: UAECulturalConfig;

  constructor(locale: Locale = 'en') {
    this.config = uaeCulturalConfigs[locale] || uaeCulturalConfigs.en;
  }

  /**
   * Get business hours based on current period
   */
  getBusinessHours(period: 'normal' | 'ramadan' = 'normal'): string {
    if (period === 'ramadan' && this.config.businessHours.ramadan) {
      return this.config.businessHours.ramadan;
    }
    return this.config.businessHours.weekdays;
  }

  /**
   * Get culturally appropriate greeting
   */
  getGreeting(timeOfDay: 'morning' | 'afternoon' | 'evening'): string {
    if (this.config.locale === 'ar') {
      switch (timeOfDay) {
        case 'morning':
          return 'صباح الخير';
        case 'afternoon':
          return 'مساء الخير';
        case 'evening':
          return 'مساء الخير';
        default:
          return 'السلام عليكم';
      }
    } else {
      switch (timeOfDay) {
        case 'morning':
          return 'Good morning';
        case 'afternoon':
          return 'Good afternoon';
        case 'evening':
          return 'Good evening';
        default:
          return 'Welcome';
      }
    }
  }

  /**
   * Get payment method preferences
   */
  getPaymentPreferences(): {
    preferred: string[];
    descriptions: Record<string, string>;
  } {
    return {
      preferred: this.config.paymentPreferences.preferred,
      descriptions: this.config.paymentPreferences.notes,
    };
  }

  /**
   * Get culturally appropriate membership messaging
   */
  getMembershipMessaging(): {
    valueProposition: string;
    exclusivityMessage: string;
    trustIndicators: string[];
  } {
    if (this.config.locale === 'ar') {
      return {
        valueProposition: 'انضم إلى نخبة العملاء المميزين واستمتع بخدمات حصرية عالية الجودة',
        exclusivityMessage: 'عضوية محدودة للعملاء المميزين فقط',
        trustIndicators: [
          'خدمة عملاء مخصصة 24/7',
          'ضمان الجودة العالية',
          'سرية تامة وأمان في المعاملات',
          'فريق متخصص من الخبراء',
        ],
      };
    } else {
      return {
        valueProposition: 'Join an exclusive community of discerning clients and enjoy premium services',
        exclusivityMessage: 'Limited membership for distinguished clients only',
        trustIndicators: [
          '24/7 dedicated customer service',
          'Premium quality guarantee',
          'Complete privacy and transaction security',
          'Expert professional team',
        ],
      };
    }
  }

  /**
   * Get culturally appropriate color scheme
   */
  getColorScheme(): {
    primary: string;
    secondary: string;
    accent: string;
    meanings: Record<string, string>;
  } {
    return {
      primary: '#d4af37', // Gold
      secondary: '#1a1a1a', // Navy/Black
      accent: '#ffffff', // White
      meanings: this.config.colorPreferences.cultural,
    };
  }

  /**
   * Get date formatting preferences
   */
  getDateFormat(): {
    format: string;
    example: string;
    weekStart: string;
  } {
    if (this.config.locale === 'ar') {
      return {
        format: 'DD/MM/YYYY',
        example: '٢٥/١٢/٢٠٢٤',
        weekStart: 'sunday',
      };
    } else {
      return {
        format: 'DD/MM/YYYY',
        example: '25/12/2024',
        weekStart: 'sunday',
      };
    }
  }

  /**
   * Get communication style preferences
   */
  getCommunicationStyle(): {
    tone: string;
    formality: string;
    honorifics: boolean;
    examples: {
      formal: string;
      casual: string;
    };
  } {
    if (this.config.locale === 'ar') {
      return {
        tone: 'respectful',
        formality: 'formal',
        honorifics: true,
        examples: {
          formal: 'نتشرف بخدمتكم ونقدر ثقتكم بنا',
          casual: 'نسعد بخدمتك',
        },
      };
    } else {
      return {
        tone: 'professional',
        formality: 'formal',
        honorifics: true,
        examples: {
          formal: 'We are honored to serve you and appreciate your trust',
          casual: 'We are happy to serve you',
        },
      };
    }
  }

  /**
   * Get membership tier naming conventions
   */
  getMembershipTierNames(): Record<string, string> {
    if (this.config.locale === 'ar') {
      return {
        basic: 'الأساسية',
        premium: 'المتميزة',
        elite: 'النخبة',
        vip: 'كبار الشخصيات',
        platinum: 'البلاتينية',
        diamond: 'الماسية',
      };
    } else {
      return {
        basic: 'Essential',
        premium: 'Premium',
        elite: 'Elite',
        vip: 'VIP',
        platinum: 'Platinum',
        diamond: 'Diamond',
      };
    }
  }

  /**
   * Get culturally appropriate success messages
   */
  getSuccessMessages(): {
    membershipActivated: string;
    paymentSuccess: string;
    benefitsUnlocked: string;
  } {
    if (this.config.locale === 'ar') {
      return {
        membershipActivated: 'تم تفعيل عضويتكم بنجاح! مرحباً بكم في عائلة ATP المميزة',
        paymentSuccess: 'تم الدفع بنجاح. شكراً لثقتكم بنا',
        benefitsUnlocked: 'تم فتح جميع المزايا الحصرية لكم',
      };
    } else {
      return {
        membershipActivated: 'Your membership has been successfully activated! Welcome to the ATP family',
        paymentSuccess: 'Payment completed successfully. Thank you for your trust',
        benefitsUnlocked: 'All exclusive benefits have been unlocked for you',
      };
    }
  }

  /**
   * Check if current time is during business hours
   */
  isBusinessHours(): boolean {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday
    const hour = now.getHours();

    // Weekend check (Friday = 5, Saturday = 6)
    if (day === 5 || day === 6) {
      return false;
    }

    // Business hours: 9 AM to 6 PM
    return hour >= 9 && hour < 18;
  }

  /**
   * Get appropriate contact method based on time
   */
  getContactMethod(): {
    primary: string;
    message: string;
    available: boolean;
  } {
    const isBusinessTime = this.isBusinessHours();
    
    if (this.config.locale === 'ar') {
      return {
        primary: isBusinessTime ? 'phone' : 'email',
        message: isBusinessTime 
          ? 'فريق خدمة العملاء متاح الآن للمساعدة'
          : 'سنرد على استفساركم في أقرب وقت خلال ساعات العمل',
        available: isBusinessTime,
      };
    } else {
      return {
        primary: isBusinessTime ? 'phone' : 'email',
        message: isBusinessTime 
          ? 'Our customer service team is available now to assist you'
          : 'We will respond to your inquiry during business hours',
        available: isBusinessTime,
      };
    }
  }
}

/**
 * Hook for using UAE cultural configuration
 */
export function useUAECultural(locale?: Locale) {
  const service = new UAECulturalService(locale);
  
  return {
    getBusinessHours: (period?: 'normal' | 'ramadan') => service.getBusinessHours(period),
    getGreeting: (timeOfDay: 'morning' | 'afternoon' | 'evening') => service.getGreeting(timeOfDay),
    getPaymentPreferences: () => service.getPaymentPreferences(),
    getMembershipMessaging: () => service.getMembershipMessaging(),
    getColorScheme: () => service.getColorScheme(),
    getDateFormat: () => service.getDateFormat(),
    getCommunicationStyle: () => service.getCommunicationStyle(),
    getMembershipTierNames: () => service.getMembershipTierNames(),
    getSuccessMessages: () => service.getSuccessMessages(),
    isBusinessHours: () => service.isBusinessHours(),
    getContactMethod: () => service.getContactMethod(),
    config: service.config,
  };
}