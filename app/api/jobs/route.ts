import { type NextRequest, NextResponse } from "next/server"
import { getJobs, createJob } from "@/lib/database"

export async function GET() {
  try {
    const jobs = await getJobs()
    return NextResponse.json(jobs)
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const job = await createJob(body)
    return NextResponse.json({ success: true, job })
  } catch (error) {
    console.error("Error creating job:", error)
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 })
  }
}
