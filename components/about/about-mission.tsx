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
                    {/* Our Story (Replaces Mission) */}
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
                                {isRTL ? "قصتنا" : "Our Story"}
                            </h2>
                        </div>
                        <div className={`text-atp-charcoal leading-relaxed text-lg space-y-4 ${isRTL ? "font-arabic text-right" : ""
                                }`}>
                            {isRTL ? (
                                <>
                                    <p>
                                        تأسست ATP بهدف واضح: تقديم منتجات عناية وصحة تايلندية أصلية عالية الجودة إلى دولة الإمارات والمنطقة، دون أي تنازل عن الجودة أو المصداقية.
                                    </p>
                                    <p>
                                        لاحظنا فجوة حقيقية في السوق. كثير من المنتجات تُسوَّق على أنها طبيعية أو مميزة، لكن القليل منها فقط يتم إنتاجه في مختبرات عالية الجودة، معتمدة وموثوقة، وتحت معايير صارمة. من هنا جاءت فكرة ATP.
                                    </p>
                                    <p>
                                        جميع منتجاتنا مستوردة مباشرة من تايلند، ويتم تصنيعها في مختبرات معتمدة تلتزم بأعلى معايير السلامة، الجودة، والرقابة. نحن نحرص على اختيار منتجات قائمة على تركيبات مدروسة واختبارات واضحة، سواء في المكملات الغذائية، منتجات العناية الشخصية، أو حلول تنقية المياه والتربة.
                                    </p>
                                    <p className="font-medium">
                                        ATP لا تعتمد على الادعاءات أو التسويق المبالغ فيه.
                                        نحن نركز على الشفافية، الجودة الحقيقية، والنتائج التي يمكن الوثوق بها، ونقدّم فقط ما نؤمن به ونستخدمه بثقة.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p>
                                        ATP was founded with a clear purpose: to deliver authentic, high-quality Thai wellness products to the UAE and the region—without compromising on quality or credibility.
                                    </p>
                                    <p>
                                        We identified a real gap in the market. Many products are marketed as “natural” or “premium,” yet only a few are produced in high-quality, trusted, and certified laboratories under strict standards. This is where ATP began.
                                    </p>
                                    <p>
                                        All ATP products are sourced directly from Thailand and manufactured in reliable, accredited laboratories that comply with rigorous safety, quality, and regulatory requirements. Whether in food supplements, personal care, or advanced water and soil solutions, every product is selected based on formulation integrity, testing, and real-world effectiveness.
                                    </p>
                                    <p className="font-medium">
                                        ATP is not driven by trends or exaggerated claims.
                                        We focus on transparency, proven quality, and products we confidently stand behind and use ourselves.
                                    </p>
                                </>
                            )}
                        </div>
                    </m.div>

                    {/* Our Vision (Replaces Merit/Impact) */}
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
                                {isRTL ? "رؤيتنا المستقبلية" : "Our Vision"}
                            </h2>
                        </div>
                        <div className={`text-atp-charcoal leading-relaxed text-lg space-y-4 ${isRTL ? "font-arabic text-right" : ""
                                }`}>
                            {isRTL ? (
                                <>
                                    <p>
                                        نطمح في ATP إلى أن نكون علامة تجارية موثوقة ورائدة في مجال العناية والصحة التايلندية على مستوى دول مجلس التعاون الخليجي (GCC)، مع توسع مدروس ومستدام في أسواق المنطقة.
                                    </p>
                                    <p className="font-semibold">رؤيتنا تقوم على:</p>
                                    <ul className="space-y-2 list-disc list-inside">
                                        <li>التوسع في دول الخليج بمنتجات مختارة بعناية</li>
                                        <li>التعاون المستمر مع مختبرات وشركاء معتمدين فقط</li>
                                        <li>الالتزام التام بالأنظمة والمعايير المحلية والدولية</li>
                                        <li>بناء علامة طويلة المدى تعتمد على الجودة والثقة، لا على الوعود</li>
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <p>
                                        Our vision is to establish ATP as a trusted and leading Thai wellness brand across the GCC, with a structured and sustainable expansion across the region.
                                    </p>
                                    <p className="font-semibold">We aim to:</p>
                                    <ul className="space-y-2 list-disc list-inside">
                                        <li>Expand across GCC markets with carefully selected products</li>
                                        <li>Partner exclusively with certified laboratories and reliable manufacturers</li>
                                        <li>Fully comply with local and international regulations</li>
                                        <li>Build a long-term brand based on trust, consistency, and quality—not promises</li>
                                    </ul>
                                </>
                            )}
                        </div>
                    </m.div>
                </m.div>
            </div>
        </section>
    );
}
