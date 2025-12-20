import { type NextRequest, NextResponse } from "next/server"
import { getPYQs } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const company = searchParams.get("company") || undefined
    const category = searchParams.get("category") || undefined
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const pyqs = await getPYQs(company, category, limit)
    return NextResponse.json(pyqs)
  } catch (error) {
    console.error("Error fetching PYQs:", error)
    return NextResponse.json({ error: "Failed to fetch PYQs" }, { status: 500 })
  }
}
