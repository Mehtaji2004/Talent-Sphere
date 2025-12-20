import { JobDetails } from "@/components/job-details"
import { Navigation } from "@/components/navigation"

export default function JobPage({ params }: any) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <JobDetails jobId={params.id} />
      </main>
    </div>
  )
}

