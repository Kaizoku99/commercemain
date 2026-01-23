"use client"

import { m, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ChevronDown } from "lucide-react"

interface LuxuryHeroProps {
  title: string
  subtitle?: string
  description: string
  backgroundImage?: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
  stats?: Array<{
    value: string
    label: string
  }>
  variant?: "default" | "centered" | "split"
}

export default function LuxuryHero({
  title,
  subtitle,
  description,
  backgroundImage,
  primaryAction,
  secondaryAction,
  stats,
  variant = "default",
}: LuxuryHeroProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <m.div className="absolute inset-0 z-0" style={{ y }}>
        {backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-atp-black via-atp-charcoal to-atp-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-atp-black/90 via-atp-black/50 to-atp-black/30" />
      </m.div>

      <div className="absolute inset-0 z-10">
        <m.div
          className="absolute top-20 left-10 w-2 h-2 bg-atp-gold rounded-full"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <m.div
          className="absolute bottom-32 right-16 w-3 h-3 bg-atp-gold/60 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <m.div
          className="absolute top-1/2 left-20 w-1 h-1 bg-atp-white/40 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <m.div className="relative z-20 container-premium text-center text-atp-white" style={{ opacity }}>
        {subtitle && (
          <m.div
            className="mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block bg-atp-gold/20 text-atp-gold px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
              {subtitle}
            </span>
          </m.div>
        )}

        <m.h1
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 tracking-tight leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {title.split(" ").map((word, index) => (
            <m.span
              key={index}
              className={index % 2 === 1 ? "text-atp-gold" : ""}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              {word}{" "}
            </m.span>
          ))}
        </m.h1>

        <m.p
          className="text-xl md:text-2xl text-atp-white/90 mb-12 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {description}
        </m.p>

        <m.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          {primaryAction && (
            <m.a
              href={primaryAction.href}
              className="btn-atp-gold text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {primaryAction.label}
            </m.a>
          )}
          {secondaryAction && (
            <m.a
              href={secondaryAction.href}
              className="btn-premium-outline text-atp-white border-atp-white hover:bg-atp-white hover:text-atp-black text-lg px-8 py-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {secondaryAction.label}
            </m.a>
          )}
        </m.div>

        {stats && (
          <m.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {stats.map((stat, index) => (
              <m.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-atp-gold mb-2">{stat.value}</div>
                <div className="text-atp-white/80 uppercase tracking-wide text-sm">{stat.label}</div>
              </m.div>
            ))}
          </m.div>
        )}
      </m.div>

      <m.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6 }}
      >
        <m.div
          className="flex flex-col items-center text-atp-white/60 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        >
          <span className="text-sm uppercase tracking-wider mb-2">Scroll</span>
          <ChevronDown className="w-6 h-6" />
        </m.div>
      </m.div>
    </section>
  )
}
