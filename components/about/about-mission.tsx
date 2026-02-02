"use client";

import * as m from "framer-motion/m";
import { BookOpen, Eye, Target, CheckCircle } from "lucide-react";
import { useRTL } from "@/hooks/use-rtl";
import { transitions, easing } from "@/lib/animations/variants";

export function AboutMission() {
    const { isRTL } = useRTL();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.5, ease: easing.smooth },
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
        <section className="section-padding bg-atp-off-white">
            <div className="container-premium">
                <m.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                    {/* Our Story Card */}
                    <m.div variants={itemVariants} className="group lg:col-span-2">
                        <m.div
                            className="relative bg-gradient-to-br from-atp-white to-atp-off-white p-8 md:p-10 rounded-2xl shadow-lg border border-atp-light-gray h-full"
                            whileHover={{
                                y: -6,
                                boxShadow: "0 20px 40px rgba(179, 145, 85, 0.15)",
                            }}
                            transition={transitions.normal}
                        >
                            {/* Icon */}
                            <m.div
                                className={`w-16 h-16 rounded-full bg-atp-black flex items-center justify-center mb-6 ${
                                    isRTL ? "mr-0 ml-auto" : ""
                                }`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={transitions.springBouncy}
                            >
                                <BookOpen className="w-8 h-8 text-atp-gold" />
                            </m.div>

                            {/* Title */}
                            <h2
                                className={`text-3xl md:text-4xl font-serif text-atp-black mb-6 ${
                                    isRTL ? "font-arabic text-right" : ""
                                }`}
                            >
                                {currentContent.ourStory.title}
                            </h2>

                            {/* Paragraphs */}
                            <div className={`space-y-4 ${isRTL ? "text-right" : ""}`}>
                                {currentContent.ourStory.paragraphs.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className={`text-atp-charcoal leading-relaxed text-lg ${
                                            isRTL ? "font-arabic" : ""
                                        }`}
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Decorative Corner */}
                            <div
                                className={`absolute top-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    isRTL ? "left-0 rounded-tl-2xl" : "right-0 rounded-tr-2xl"
                                }`}
                                style={{
                                    background: `linear-gradient(${
                                        isRTL ? "135deg" : "225deg"
                                    }, rgba(179,145,85,0.2) 0%, transparent 60%)`,
                                }}
                            />
                        </m.div>
                    </m.div>

                    {/* Our Vision Card */}
                    <m.div variants={itemVariants} className="group lg:col-span-2">
                        <m.div
                            className="relative bg-gradient-to-br from-atp-white to-atp-off-white p-8 md:p-10 rounded-2xl shadow-lg border border-atp-light-gray h-full"
                            whileHover={{
                                y: -6,
                                boxShadow: "0 20px 40px rgba(179, 145, 85, 0.15)",
                            }}
                            transition={transitions.normal}
                        >
                            {/* Icon */}
                            <m.div
                                className={`w-16 h-16 rounded-full bg-atp-black flex items-center justify-center mb-6 ${
                                    isRTL ? "mr-0 ml-auto" : ""
                                }`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={transitions.springBouncy}
                            >
                                <Eye className="w-8 h-8 text-atp-gold" />
                            </m.div>

                            {/* Title */}
                            <h2
                                className={`text-3xl md:text-4xl font-serif text-atp-black mb-6 ${
                                    isRTL ? "font-arabic text-right" : ""
                                }`}
                            >
                                {currentContent.ourVision.title}
                            </h2>

                            {/* Content */}
                            <div className={`space-y-6 ${isRTL ? "text-right" : ""}`}>
                                <p
                                    className={`text-atp-charcoal leading-relaxed text-lg ${
                                        isRTL ? "font-arabic" : ""
                                    }`}
                                >
                                    {currentContent.ourVision.intro}
                                </p>

                                <p
                                    className={`text-atp-black font-semibold text-lg ${
                                        isRTL ? "font-arabic" : ""
                                    }`}
                                >
                                    {currentContent.ourVision.subtitle}
                                </p>

                                <ul className="space-y-3">
                                    {currentContent.ourVision.points.map((point, index) => (
                                        <li
                                            key={index}
                                            className={`flex items-start gap-3 ${
                                                isRTL ? "flex-row-reverse" : ""
                                            }`}
                                        >
                                            <CheckCircle
                                                className={`w-5 h-5 text-atp-gold flex-shrink-0 mt-1`}
                                            />
                                            <span
                                                className={`text-atp-charcoal text-lg leading-relaxed ${
                                                    isRTL ? "font-arabic" : ""
                                                }`}
                                            >
                                                {point}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Decorative Corner */}
                            <div
                                className={`absolute top-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                    isRTL ? "left-0 rounded-tl-2xl" : "right-0 rounded-tr-2xl"
                                }`}
                                style={{
                                    background: `linear-gradient(${
                                        isRTL ? "135deg" : "225deg"
                                    }, rgba(179,145,85,0.2) 0%, transparent 60%)`,
                                }}
                            />
                        </m.div>
                    </m.div>
                </m.div>
            </div>
        </section>
    );
}
