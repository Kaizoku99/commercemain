"use client";

import { useScroll, useTransform } from "framer-motion";
import * as m from "framer-motion/m";
import { CheckCircle, Award, Shield, Target } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRTL } from "@/hooks/use-rtl";

export function AboutMission() {
    const t = useTranslations("common");
    const { isRTL } = useRTL();

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
            },
        },
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5, ease: "easeOut" as const },
        },
    };

    return (
        <section className="section-padding bg-atp-white">
            <div className="container-premium">
                <m.div
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {/* Our Mission */}
                    <m.div
                        className="bg-gradient-to-br from-atp-white to-atp-off-white p-8 rounded-2xl shadow-xl border border-atp-light-gray"
                        variants={scaleIn}
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-atp-gold rounded-full flex items-center justify-center mr-4">
                                <Target className="w-6 h-6 text-atp-black" />
                            </div>
                            <h2
                                className={`text-3xl font-serif text-atp-black ${isRTL ? "font-arabic" : ""
                                    }`}
                            >
                                Our Mission
                            </h2>
                        </div>
                        <p
                            className={`text-atp-charcoal leading-relaxed text-lg ${isRTL ? "font-arabic text-right" : ""
                                }`}
                        >
                            At ATP Group Services, our mission is to deliver innovative
                            wellness solutions that nurture the mind, body, and spirit. We
                            strive to make holistic health accessible through personalized,
                            premium experiences—from revitalizing home spa treatments to
                            cutting-edge EMS fitness training and ethically sourced wellness
                            products.
                        </p>
                    </m.div>

                    {/* Our Merit */}
                    <m.div
                        className="bg-gradient-to-br from-atp-white to-atp-off-white p-8 rounded-2xl shadow-xl border border-atp-light-gray"
                        variants={scaleIn}
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-atp-gold rounded-full flex items-center justify-center mr-4">
                                <Award className="w-6 h-6 text-atp-black" />
                            </div>
                            <h2
                                className={`text-3xl font-serif text-atp-black ${isRTL ? "font-arabic" : ""
                                    }`}
                            >
                                Our Merit
                            </h2>
                        </div>
                        <p
                            className={`text-atp-charcoal leading-relaxed text-lg ${isRTL ? "font-arabic text-right" : ""
                                }`}
                        >
                            What sets us apart is our unwavering commitment to excellence. We
                            combine German-engineered EMS technology for transformative
                            fitness, Thailand's finest natural cosmetics and supplements, and
                            the expertise of certified wellness professionals. Our curated
                            services are designed for modern lifestyles, blending
                            science-backed results with the warmth of personalized care.
                        </p>
                    </m.div>

                    {/* Our Promise */}
                    <m.div
                        className="bg-gradient-to-br from-atp-white to-atp-off-white p-8 rounded-2xl shadow-xl border border-atp-light-gray"
                        variants={scaleIn}
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-atp-gold rounded-full flex items-center justify-center mr-4">
                                <Shield className="w-6 h-6 text-atp-black" />
                            </div>
                            <h2
                                className={`text-3xl font-serif text-atp-black ${isRTL ? "font-arabic" : ""
                                    }`}
                            >
                                Our Promise
                            </h2>
                        </div>
                        <div className={`space-y-6 ${isRTL ? "text-right" : ""}`}>
                            <p
                                className={`text-atp-charcoal leading-relaxed text-lg ${isRTL ? "font-arabic" : ""
                                    }`}
                            >
                                We pledge to be your trusted partner in wellness, delivering
                                results you can feel and trust. From the moment you engage with
                                us, we guarantee professionalism, discretion, and tailored care.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-atp-gold mt-1 mr-3 flex-shrink-0" />
                                    <p className={`text-atp-charcoal ${isRTL ? "font-arabic" : ""}`}>
                                        <strong>Quality Assurance:</strong> Rigorously tested
                                        products and state-of-the-art equipment.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-atp-gold mt-1 mr-3 flex-shrink-0" />
                                    <p className={`text-atp-charcoal ${isRTL ? "font-arabic" : ""}`}>
                                        <strong>Personalized Journeys:</strong> Customized plans to
                                        meet your unique wellness goals.
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="w-5 h-5 text-atp-gold mt-1 mr-3 flex-shrink-0" />
                                    <p className={`text-atp-charcoal ${isRTL ? "font-arabic" : ""}`}>
                                        <strong>Transparency:</strong> Honest guidance and ethically
                                        sourced ingredients.
                                    </p>
                                </div>
                            </div>
                            <p
                                className={`text-atp-charcoal font-medium italic ${isRTL ? "font-arabic" : ""
                                    }`}
                            >
                                Your satisfaction and well-being are at the heart of everything
                                we do.
                            </p>
                        </div>
                    </m.div>

                    {/* Our Impact */}
                    <m.div
                        className="bg-gradient-to-br from-atp-white to-atp-off-white p-8 rounded-2xl shadow-xl border border-atp-light-gray"
                        variants={scaleIn}
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-atp-gold rounded-full flex items-center justify-center mr-4">
                                <Target className="w-6 h-6 text-atp-black" />
                            </div>
                            <h2
                                className={`text-3xl font-serif text-atp-black ${isRTL ? "font-arabic" : ""
                                    }`}
                            >
                                Our Impact
                            </h2>
                        </div>
                        <p
                            className={`text-atp-charcoal leading-relaxed text-lg mb-6 ${isRTL ? "font-arabic text-right" : ""
                                }`}
                        >
                            We measure success by the positive change we create. Through our
                            services, thousands have reclaimed their energy, reduced stress,
                            and embraced healthier habits. Our EMS training programs have
                            helped clients achieve fitness milestones, while our spa therapies
                            and supplements have enhanced recovery and mental clarity.
                        </p>
                        <p
                            className={`text-atp-charcoal leading-relaxed text-lg ${isRTL ? "font-arabic text-right" : ""
                                }`}
                        >
                            Beyond individuals, we champion sustainable practices and
                            community well-being, partnering with eco-conscious suppliers and
                            promoting holistic health education. Together, we're building a
                            world where wellness is not a luxury—it's a way of life.
                        </p>
                    </m.div>
                </m.div>
            </div>
        </section>
    );
}
