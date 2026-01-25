"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRTL } from "@/hooks/use-rtl";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { 
  containerVariants,
  fadeUpVariants,
  transitions,
  easing 
} from "@/lib/animations/variants";
import { Users, Package, Star, Calendar } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: number;
  suffix: string;
  suffixAr: string;
  label: string;
  labelAr: string;
  delay?: number;
}

const stats: Stat[] = [
  {
    icon: Users,
    value: 15000,
    suffix: "+",
    suffixAr: "+",
    label: "Clients Served",
    labelAr: "عميل تم خدمته",
    delay: 0,
  },
  {
    icon: Package,
    value: 50,
    suffix: "+",
    suffixAr: "+",
    label: "Premium Products",
    labelAr: "منتج متميز",
    delay: 0.1,
  },
  {
    icon: Star,
    value: 98,
    suffix: "%",
    suffixAr: "٪",
    label: "Customer Satisfaction",
    labelAr: "رضا العملاء",
    delay: 0.2,
  },
  {
    icon: Calendar,
    value: 14,
    suffix: "",
    suffixAr: "",
    label: "Years of Excellence",
    labelAr: "سنة من التميز",
    delay: 0.3,
  },
];

export function AboutStats() {
  const t = useTranslations("common");
  const { isRTL } = useRTL();

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easing.expoOut,
      },
    },
  };

  return (
    <section className="section-padding bg-atp-black relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(179,145,85,0.3) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(179,145,85,0.2) 0%, transparent 50%)`,
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(179,145,85,1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(179,145,85,1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container-premium relative z-10">
        {/* Section Header */}
        <m.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
        >
          <h2
            className={`text-4xl md:text-5xl font-serif text-atp-white mb-4 ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {isRTL ? "إنجازاتنا بالأرقام" : "Our Impact in Numbers"}
          </h2>
          <p
            className={`text-lg text-atp-off-white/80 max-w-2xl mx-auto ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {isRTL
              ? "أرقام تعكس التزامنا بالتميز ورضا العملاء"
              : "Numbers that reflect our commitment to excellence and customer satisfaction"}
          </p>
        </m.div>

        {/* Stats Grid */}
        <m.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <m.div
                key={stat.label}
                variants={itemVariants}
                className="text-center group"
              >
                <m.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={transitions.normal}
                >
                  {/* Icon */}
                  <m.div
                    className="w-16 h-16 mx-auto mb-6 rounded-full bg-atp-gold/10 flex items-center justify-center border border-atp-gold/20"
                    whileHover={{ 
                      backgroundColor: "rgba(179, 145, 85, 0.2)",
                      borderColor: "rgba(179, 145, 85, 0.4)",
                    }}
                    transition={transitions.fast}
                  >
                    <Icon className="w-8 h-8 text-atp-gold" />
                  </m.div>

                  {/* Number */}
                  <div className="mb-2">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={isRTL ? stat.suffixAr : stat.suffix}
                      duration={2.5}
                      locale={isRTL ? "ar-AE" : "en-US"}
                      delay={stat.delay}
                      className="text-5xl md:text-6xl font-serif text-atp-gold tracking-tight"
                    />
                  </div>

                  {/* Label */}
                  <p
                    className={`text-atp-off-white/80 text-sm md:text-base ${
                      isRTL ? "font-arabic" : ""
                    }`}
                  >
                    {isRTL ? stat.labelAr : stat.label}
                  </p>

                  {/* Decorative underline */}
                  <m.div
                    className="w-12 h-0.5 bg-atp-gold/40 mx-auto mt-4"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1, ease: easing.expoOut }}
                  />
                </m.div>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
