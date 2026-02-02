"use client"

import * as React from "react"
import { Direction } from "radix-ui"

type DirectionProviderProps = {
  children: React.ReactNode
} & (
  | { dir: "ltr" | "rtl"; direction?: never }
  | { direction: "ltr" | "rtl"; dir?: never }
)

function DirectionProvider({
  dir,
  direction,
  children,
}: DirectionProviderProps) {
  return (
    <Direction.DirectionProvider dir={direction ?? dir}>
      {children}
    </Direction.DirectionProvider>
  )
}

const useDirection = Direction.useDirection

export { DirectionProvider, useDirection }
