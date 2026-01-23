"use client"

import { m } from "framer-motion"
import type { ReactNode } from "react"

interface StaggerContainerProps {
  children: ReactNode
  staggerDelay?: number
  className?: string
}

export default function StaggerContainer({ children, staggerDelay = 0.1, className = "" }: StaggerContainerProps) {
  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <m.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </m.div>
  )
}
