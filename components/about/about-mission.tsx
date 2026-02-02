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
