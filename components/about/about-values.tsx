"use client";

import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useRTL } from "@/hooks/use-rtl";
import {
  Award,
  Heart,
  Lightbulb,
  Leaf,
  Users,
  Shield
} from "lucide-react";
import {
  transitions,
  easing
} from "@/lib/animations/variants";
import type { LucideIcon } from "lucide-react";

interface Value {
  icon: LucideIcon;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
}

const values: Value[] = [
  {
    icon: Award,
    title: "Quality First",
    titleAr: "الجودة أولًا",
    description: "We offer only products that meet strict sourcing, formulation, and manufacturing standards.",
    descriptionAr: "لا نقدّم أي منتج إلا بعد التأكد من مصدره، تركيبه، ومعايير تصنيعه.",
  },
  {
    icon: Lightbulb,
    title: "Transparency",
    titleAr: "الشفافية",
    description: "Clear information, honest communication, and no misleading claims—ever.",
    descriptionAr: "نلتزم بالوضوح في المعلومات، المكونات، والمصدر—بدون مبالغة أو ادعاءات غير واقعية.",
  },
  {
    icon: Users,
    title: "Trust",
    titleAr: "الثقة",
    description: "We build lasting relationships with our customers through credibility and consistency.",
    descriptionAr: "نبني علاقتنا مع عملائنا على المصداقية والاستمرارية، وليس على البيع السريع.",
  },
  {
    icon: Shield,
    title: "Responsibility",
    titleAr: "المسؤولية",
    description: "Wellness is a responsibility. We ensure our products are safe, reliable, and suitable for everyday use.",
    descriptionAr: "نؤمن بأن الصحة والعناية مسؤولية، ونحرص على تقديم حلول آمنة ومناسبة للاستخدام اليومي.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    titleAr: "الاستدامة",
    description: "We support long-term wellbeing through responsible sourcing and thoughtful product selection.",
    descriptionAr: "نختار منتجات وحلول تدعم نمط حياة صحي ومستدام على المدى الطويل.",
  },
];

export function AboutValues() {
  const t = useTranslations("common");
  const { isRTL } = useRTL();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easing.bounce,
      },
    },
  };

  return (
    <section className="section-padding bg-atp-white">
      <div className="container-premium">
        {/* Section Header */}
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: easing.smooth }}
        >
          <h2
            className={`text-4xl md:text-5xl font-serif text-atp-black mb-4 ${isRTL ? "font-arabic" : ""
              }`}
          >
            {isRTL ? "قيمنا" : "Our Values"}
          </h2>
          <p
            className={`text-lg text-atp-charcoal max-w-2xl mx-auto ${isRTL ? "font-arabic" : ""
              }`}
          >
            {isRTL
              ? "المبادئ التي توجه كل قرار نتخذه"
              : "The principles that guide every decision we make"}
          </p>
        </m.div>

        {/* Values Grid */}
        <m.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <m.div
                key={value.title}
                variants={itemVariants}
                className="group"
              >
                <m.div
                  className="relative bg-gradient-to-br from-atp-white to-atp-off-white p-8 rounded-2xl shadow-lg border border-atp-light-gray h-full"
                  whileHover={{
                    y: -6,
                    boxShadow: "0 20px 40px rgba(179, 145, 85, 0.15)",
                  }}
                  transition={transitions.normal}
                >
                  {/* Icon */}
                  <m.div
                    className={`w-16 h-16 rounded-full bg-atp-black flex items-center justify-center mb-6 ${isRTL ? "mr-0 ml-auto" : ""
                      }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={transitions.springBouncy}
                  >
                    <Icon className="w-8 h-8 text-atp-gold" />
                  </m.div>

                  {/* Title */}
                  <h3
                    className={`text-2xl font-serif text-atp-black mb-3 ${isRTL ? "font-arabic text-right" : ""
                      }`}
                  >
                    {isRTL ? value.titleAr : value.title}
                  </h3>

                  {/* Description */}
                  <p
                    className={`text-atp-charcoal leading-relaxed ${isRTL ? "font-arabic text-right" : ""
                      }`}
                  >
                    {isRTL ? value.descriptionAr : value.description}
                  </p>

                  {/* Decorative Corner */}
                  <div
                    className={`absolute top-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isRTL ? "left-0 rounded-tl-2xl" : "right-0 rounded-tr-2xl"
                      }`}
                    style={{
                      background: `linear-gradient(${isRTL ? "135deg" : "225deg"}, rgba(179,145,85,0.2) 0%, transparent 60%)`,
                    }}
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
