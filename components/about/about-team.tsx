"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRTL } from "@/hooks/use-rtl";
import { Linkedin, Twitter, Mail } from "lucide-react";
import { 
  containerVariants, 
  cardVariants,
  transitions,
  easing 
} from "@/lib/animations/variants";

interface TeamMember {
  name: string;
  nameAr: string;
  role: string;
  roleAr: string;
  bio: string;
  bioAr: string;
  image?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Ahmad Al-Rashid",
    nameAr: "أحمد الراشد",
    role: "Founder & CEO",
    roleAr: "المؤسس والرئيس التنفيذي",
    bio: "Visionary leader with 20+ years in wellness industry, pioneering premium health solutions in the Middle East.",
    bioAr: "قائد ذو رؤية مع أكثر من 20 عامًا في صناعة العافية، رائد في حلول الصحة المتميزة في الشرق الأوسط.",
    socials: { linkedin: "#", email: "ceo@atpgroup.com" },
  },
  {
    name: "Dr. Nadia Patel",
    nameAr: "د. نادية باتيل",
    role: "Chief Wellness Officer",
    roleAr: "مديرة العافية الرئيسية",
    bio: "Board-certified nutritionist and wellness expert, curating our product selection with scientific rigor.",
    bioAr: "خبيرة تغذية وعافية معتمدة، تنظم اختيار منتجاتنا بدقة علمية.",
    socials: { linkedin: "#", twitter: "#" },
  },
  {
    name: "Marcus Weber",
    nameAr: "ماركوس ويبر",
    role: "Head of EMS Training",
    roleAr: "رئيس تدريب EMS",
    bio: "Former Olympic trainer from Germany, bringing world-class EMS methodology to our fitness programs.",
    bioAr: "مدرب أولمبي سابق من ألمانيا، يجلب منهجية EMS عالمية المستوى لبرامج اللياقة البدنية لدينا.",
    socials: { linkedin: "#" },
  },
  {
    name: "Fatima Al-Zahra",
    nameAr: "فاطمة الزهراء",
    role: "Regional Director UAE",
    roleAr: "المديرة الإقليمية للإمارات",
    bio: "Driving our UAE expansion with deep market expertise and commitment to customer excellence.",
    bioAr: "تقود توسعنا في الإمارات بخبرة سوقية عميقة والتزام بالتميز في خدمة العملاء.",
    socials: { linkedin: "#", email: "uae@atpgroup.com" },
  },
];

export function AboutTeam() {
  const t = useTranslations("common");
  const { isRTL } = useRTL();

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easing.smooth,
      },
    },
  };

  return (
    <section className="section-padding bg-atp-light-gray">
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
            className={`text-4xl md:text-5xl font-serif text-atp-black mb-4 ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {isRTL ? "فريقنا" : "Meet Our Team"}
          </h2>
          <p
            className={`text-lg text-atp-charcoal max-w-2xl mx-auto ${
              isRTL ? "font-arabic" : ""
            }`}
          >
            {isRTL
              ? "خبراء شغوفون ملتزمون برحلة عافيتك"
              : "Passionate experts dedicated to your wellness journey"}
          </p>
        </m.div>

        {/* Team Grid */}
        <m.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
        >
          {teamMembers.map((member, index) => (
            <m.div
              key={member.name}
              variants={itemVariants}
              className="group"
            >
              <m.div
                className="relative bg-atp-white rounded-2xl overflow-hidden shadow-lg border border-atp-light-gray h-full"
                whileHover={{ y: -8 }}
                transition={transitions.normal}
              >
                {/* Image Area with Gradient Overlay */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-atp-charcoal to-atp-black">
                  {/* Placeholder Pattern */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `radial-gradient(circle at 30% 30%, rgba(179,145,85,0.3) 0%, transparent 50%),
                                        radial-gradient(circle at 70% 70%, rgba(179,145,85,0.2) 0%, transparent 50%)`,
                    }}
                  />
                  
                  {/* Initials */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl font-serif text-atp-gold/30">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>

                  {/* Hover Overlay with Social Links */}
                  <m.div
                    className="absolute inset-0 bg-atp-black/80 flex items-center justify-center gap-4"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={transitions.fast}
                  >
                    {member.socials?.linkedin && (
                      <m.a
                        href={member.socials.linkedin}
                        className="w-10 h-10 rounded-full bg-atp-gold/20 flex items-center justify-center text-atp-gold hover:bg-atp-gold hover:text-atp-black transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </m.a>
                    )}
                    {member.socials?.twitter && (
                      <m.a
                        href={member.socials.twitter}
                        className="w-10 h-10 rounded-full bg-atp-gold/20 flex items-center justify-center text-atp-gold hover:bg-atp-gold hover:text-atp-black transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </m.a>
                    )}
                    {member.socials?.email && (
                      <m.a
                        href={`mailto:${member.socials.email}`}
                        className="w-10 h-10 rounded-full bg-atp-gold/20 flex items-center justify-center text-atp-gold hover:bg-atp-gold hover:text-atp-black transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </m.a>
                    )}
                  </m.div>
                </div>

                {/* Content */}
                <div className={`p-6 ${isRTL ? "text-right" : ""}`}>
                  <h3
                    className={`text-xl font-serif text-atp-black mb-1 ${
                      isRTL ? "font-arabic" : ""
                    }`}
                  >
                    {isRTL ? member.nameAr : member.name}
                  </h3>
                  <p className="text-atp-gold font-medium text-sm mb-3">
                    {isRTL ? member.roleAr : member.role}
                  </p>
                  
                  {/* Bio - appears on hover via group */}
                  <m.p
                    className={`text-sm text-atp-charcoal leading-relaxed ${
                      isRTL ? "font-arabic" : ""
                    }`}
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                  >
                    {isRTL ? member.bioAr : member.bio}
                  </m.p>
                </div>

                {/* Gold accent bar */}
                <m.div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-atp-gold"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={transitions.normal}
                  style={{ originX: isRTL ? 1 : 0 }}
                />
              </m.div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  );
}
