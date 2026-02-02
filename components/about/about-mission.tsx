"use client";

import * as m from "framer-motion/m";
import { BookOpen, Eye } from "lucide-react";
import { useLocale } from "next-intl";

export function AboutMission() {
    const locale = useLocale();
    const isRTL = locale === "ar";

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

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    const content = {
        en: {
            ourStory: {
                title: "Our Story",
                paragraphs: [
                    "ATP was founded with a clear purpose: to deliver authentic, high-quality Thai wellness products to the UAE and the region—without compromising on quality or credibility.",
                    "We identified a real gap in the market. Many products are marketed as \"natural\" or \"premium,\" yet only a few are produced in high-quality, trusted, and certified laboratories under strict standards. This is where ATP began.",
                    "All ATP products are sourced directly from Thailand and manufactured in reliable, accredited laboratories that comply with rigorous safety, quality, and regulatory requirements. Whether in food supplements, personal care, or advanced water and soil solutions, every product is selected based on formulation integrity, testing, and real-world effectiveness.",
                    "ATP is not driven by trends or exaggerated claims. We focus on transparency, proven quality, and products we confidently stand behind and use ourselves.",
                ],
            },
            ourVision: {
                title: "Our Vision",
                intro: "Our vision is to establish ATP as a trusted and leading Thai wellness brand across the GCC, with a structured and sustainable expansion across the region.",
                subtitle: "We aim to:",
                points: [
                    "Expand across GCC markets with carefully selected products",
                    "Partner exclusively with certified laboratories and reliable manufacturers",
                    "Fully comply with local and international regulations",
                    "Build a long-term brand based on trust, consistency, and quality—not promises",
                ],
            },
        },
        ar: {
            ourStory: {
                title: "قصتنا",
                paragraphs: [
                    "تأسست ATP بهدف واضح: تقديم منتجات عناية وصحة تايلندية أصلية عالية الجودة إلى دولة الإمارات والمنطقة، دون أي تنازل عن الجودة أو المصداقية.",
                    "لاحظنا فجوة حقيقية في السوق. كثير من المنتجات تُسوَّق على أنها طبيعية أو مميزة، لكن القليل منها فقط يتم إنتاجه في مختبرات عالية الجودة، معتمدة وموثوقة، وتحت معايير صارمة. من هنا جاءت فكرة ATP.",
                    "جميع منتجاتنا مستوردة مباشرة من تايلند، ويتم تصنيعها في مختبرات معتمدة تلتزم بأعلى معايير السلامة، الجودة، والرقابة. نحن نحرص على اختيار منتجات قائمة على تركيبات مدروسة واختبارات واضحة، سواء في المكملات الغذائية، منتجات العناية الشخصية، أو حلول تنقية المياه والتربة.",
                    "ATP لا تعتمد على الادعاءات أو التسويق المبالغ فيه. نحن نركز على الشفافية، الجودة الحقيقية، والنتائج التي يمكن الوثوق بها، ونقدّم فقط ما نؤمن به ونستخدمه بثقة.",
                ],
            },
            ourVision: {
                title: "رؤيتنا المستقبلية",
                intro: "نطمح في ATP إلى أن نكون علامة تجارية موثوقة ورائدة في مجال العناية والصحة التايلندية على مستوى دول مجلس التعاون الخليجي (GCC)، مع توسع مدروس ومستدام في أسواق المنطقة.",
                subtitle: "رؤيتنا تقوم على:",
                points: [
                    "التوسع في دول الخليج بمنتجات مختارة بعناية",
                    "التعاون المستمر مع مختبرات وشركاء معتمدين فقط",
                    "الالتزام التام بالأنظمة والمعايير المحلية والدولية",
                    "بناء علامة طويلة المدى تعتمد على الجودة والثقة، لا على الوعود",
                ],
            },
        },
    };

    const currentContent = isRTL ? content.ar : content.en;

    return (
        <section className="py-20 bg-atp-white" dir={isRTL ? "rtl" : "ltr"}>
            <div className="max-w-6xl mx-auto px-6">
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="space-y-20"
                >
                    {/* Our Story Section */}
                    <m.div variants={fadeInUp} className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-atp-gold rounded-full flex items-center justify-center">
                                <BookOpen className="w-7 h-7 text-atp-black" />
                            </div>
                            <h2 className={`text-4xl font-serif text-atp-black ${isRTL ? "font-arabic" : ""}`}>
                                {currentContent.ourStory.title}
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {currentContent.ourStory.paragraphs.map((paragraph, index) => (
                                <p
                                    key={index}
                                    className={`text-atp-charcoal leading-relaxed text-lg ${isRTL ? "font-arabic text-right" : ""}`}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </m.div>

                    {/* Divider */}
                    <div className="w-24 h-1 bg-atp-gold mx-auto" />

                    {/* Our Vision Section */}
                    <m.div variants={fadeInUp} className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-atp-gold rounded-full flex items-center justify-center">
                                <Eye className="w-7 h-7 text-atp-black" />
                            </div>
                            <h2 className={`text-4xl font-serif text-atp-black ${isRTL ? "font-arabic" : ""}`}>
                                {currentContent.ourVision.title}
                            </h2>
                        </div>
                        <p className={`text-atp-charcoal leading-relaxed text-lg ${isRTL ? "font-arabic text-right" : ""}`}>
                            {currentContent.ourVision.intro}
                        </p>
                        <p className={`text-atp-black font-semibold text-lg ${isRTL ? "font-arabic text-right" : ""}`}>
                            {currentContent.ourVision.subtitle}
                        </p>
                        <ul className={`space-y-4 ${isRTL ? "pr-0" : "pl-0"}`}>
                            {currentContent.ourVision.points.map((point, index) => (
                                <li
                                    key={index}
                                    className={`flex items-start gap-3 text-atp-charcoal text-lg ${isRTL ? "font-arabic text-right flex-row-reverse" : ""}`}
                                >
                                    <span className="text-atp-gold mt-1">•</span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </m.div>

                </m.div>
            </div>
        </section>
    );
}
