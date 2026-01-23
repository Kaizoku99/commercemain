"use client"

import type { SortFilterItem } from "@/lib/constants"
import { Suspense } from "react"
import { m } from "framer-motion"
import FilterItemDropdown from "./dropdown"
import { FilterItem } from "./item"

export type ListItem = SortFilterItem | PathFilterItem
export type PathFilterItem = { title: string; path: string }

function FilterItemList({ list }: { list: ListItem[] }) {
  return (
    <div className="space-y-2">
      {list.map((item: ListItem, i) => (
        <m.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
        >
          <FilterItem item={item} />
        </m.div>
      ))}
    </div>
  )
}

export default function FilterList({ list, title }: { list: ListItem[]; title?: string }) {
  return (
    <nav>
      <div className="hidden md:block">
        <Suspense
          fallback={
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-atp-light-gray rounded-md animate-pulse" />
              ))}
            </div>
          }
        >
          <FilterItemList list={list} />
        </Suspense>
      </div>

      <div className="md:hidden">
        <Suspense fallback={<div className="h-10 bg-atp-light-gray rounded-md animate-pulse" />}>
          <FilterItemDropdown list={list} />
        </Suspense>
      </div>
    </nav>
  )
}
