"use client";

import * as m from "framer-motion/m";

interface CollectionHeaderProps {
    title: string;
    description: string;
}

export default function CollectionHeader({ title, description }: CollectionHeaderProps) {
    return (
        <m.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-atp-black mb-6">
                {title}
            </h2>
            <div className="w-24 h-1 bg-atp-gold mx-auto mb-6"></div>
            <p className="text-lg text-atp-charcoal max-w-2xl mx-auto">
                {description}
            </p>
        </m.div>
    );
}
