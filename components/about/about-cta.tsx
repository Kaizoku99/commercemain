"use client";

import * as m from "framer-motion/m";
import { useTranslations } from "next-intl";
import { useRTL } from "@/hooks/use-rtl";

export function AboutCTA() {
    const t = useTranslations("common");
    const { isRTL } = useRTL();

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" as const },
        },
    };

    return (
        <section className="section-padding bg-atp-light-gray">
            <div className="container-premium">
                <m.div
                    className="text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeInUp}
                >
                    <h2
                        className={`text-4xl md:text-5xl font-serif text-atp-black mb-8 ${isRTL ? "font-arabic" : ""
                            }`}
                    >
                        Ready to Transform Your Wellness Journey?
                    </h2>
                    <p
                        className={`text-xl text-atp-charcoal mb-8 max-w-2xl mx-auto ${isRTL ? "font-arabic" : ""
                            }`}
                    >
                        Discover how ATP Group Services can help you achieve your wellness
                        goals with our premium solutions and personalized care.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <m.a
                            href="/atp-membership"
                            className="btn-atp-gold text-lg px-8 py-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Explore ATP Membership
                        </m.a>
                        <m.a
                            href="/contact"
                            className="btn-premium-outline text-atp-black border-atp-black hover:bg-atp-black hover:text-atp-white text-lg px-8 py-4"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Contact Us Today
                        </m.a>
                    </div>
                </m.div>
            </div>
        </section>
    );
}
