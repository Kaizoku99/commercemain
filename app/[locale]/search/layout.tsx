import type React from "react"

import Collections from "@/components/layout/search/collections"
import FilterList from "@/components/layout/search/filter"
import Footer from "@/components/layout/footer"
import { sorting } from "@/lib/constants"
import ChildrenWrapper from "./children-wrapper"
import { Suspense } from "react"
import SearchLayoutClient from "./search-layout-client"

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <SearchLayoutClient sorting={sorting}>
      <Collections />
      <ChildrenWrapper>{children}</ChildrenWrapper>
      <Footer />
    </SearchLayoutClient>
  )
}
