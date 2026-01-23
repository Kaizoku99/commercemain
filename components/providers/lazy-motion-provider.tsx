"use client";

import { LazyMotion, domMax } from "framer-motion";
import { ReactNode } from "react";

export function LazyMotionProvider({ children }: { children: ReactNode }) {
    // Using domMax for maximum compatibility with all framer-motion features used in the app
    return <LazyMotion features={domMax} strict>{children}</LazyMotion>;
}
