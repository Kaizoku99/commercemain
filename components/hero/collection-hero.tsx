"use client"

import { m, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Star } from "lucide-react"

interface CollectionHeroProps {
  title: string
  description: string
  backgroundImage: string
  productCount?: number
  rating?: number
  primaryAction?: {
    label: string
    href: string
  }
  features?: string[]
}

export default function CollectionHero({
  title,
  description,
  backgroundImage,
  productCount,
  rating,
  primaryAction,
  features,
}: CollectionHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-screen flex items-center overflow-hidden">
      <m.div className="absolute inset-0 z-0" style={{ y }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-atp-black/90 via-atp-black/60 to-transparent" />
      </m.div>

      <div className="absolute inset-0 z-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <m.div
            key={i}
            className="absolute w-1 h-1 bg-atp-gold/30 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      <m.div className="relative z-20 container-premium" style={{ opacity }}>
        <div className="max-w-4xl">
          <m.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-3 bg-atp-gold/20 backdrop-blur-sm text-atp-gold px-6 py-3 rounded-full">
              {productCount && <span className="text-sm font-semibold">{productCount}+ Products</span>}
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{rating}</span>
                </div>
              )}
            </div>
          </m.div>

          <m.h1
            className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold text-atp-white mb-8 leading-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {title.split(" ").map((word, index) => (
              <m.span
                key={index}
                className="inline-block"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.6 + index * 0.1,
                  ease: "easeOut",
                }}
              >
                {word}&nbsp;
              </m.span>
            ))}
          </m.h1>

          <m.p
            className="text-xl md:text-2xl text-atp-white/90 mb-12 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            {description}
          </m.p>

          {features && (
            <m.div
              className="mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <div className="flex flex-wrap gap-4">
                {features.map((feature, index) => (
                  <m.div
                    key={index}
                    className="bg-atp-white/10 backdrop-blur-sm text-atp-white px-4 py-2 rounded-full text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                  >
                    {feature}
                  </m.div>
                ))}
              </div>
            </m.div>
          )}

          {primaryAction && (
            <m.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.6 }}
            >
              <m.a
                href={primaryAction.href}
                className="inline-flex items-center gap-3 bg-atp-gold text-atp-black px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
              >
                {primaryAction.label}
                <m.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}>
                  <ArrowRight className="w-5 h-5" />
                </m.div>
              </m.a>
            </m.div>
          )}
        </div>
      </m.div>
    </section>
  )
}
