import { revalidate } from "@/lib/shopify/server"
import type { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest): Promise<NextResponse> {
  return revalidate(req)
}
