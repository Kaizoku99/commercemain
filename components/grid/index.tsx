"use client";

import type React from "react";
import clsx from "clsx";
import { m, HTMLMotionProps } from "framer-motion";

function Grid(
  props: HTMLMotionProps<"ul"> & { variant?: "default" | "luxury" }
) {
  const { variant = "luxury", ...restProps } = props;

  return (
    <m.ul
      {...restProps}
      className={clsx(
        "grid gap-6",
        {
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4":
            variant === "luxury",
          "grid-flow-row gap-4": variant === "default",
        },
        props.className
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, staggerChildren: 0.1 }}
    >
      {props.children}
    </m.ul>
  );
}

function GridItem(props: HTMLMotionProps<"li"> & { index?: number }) {
  const { index = 0, ...restProps } = props;

  return (
    <m.li
      {...restProps}
      className={clsx(
        "group relative overflow-hidden transition-all duration-500 ease-out",
        "hover:scale-[1.02] hover:shadow-2xl hover:shadow-atp-black/10",
        props.className
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
    >
      {props.children}
    </m.li>
  );
}

Grid.Item = GridItem;

export { Grid };
export default Grid;
