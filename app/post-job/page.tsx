import { JobPostingForm } from "@/components/job-posting-form"
import { Navigation } from "@/components/navigation"

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">Post a Job</h1>
            <p className="text-muted-foreground">Reach thousands of qualified candidates by posting your job opening</p>
          </div>
          <JobPostingForm />
        </div>
      </main>
    </div>
  )
}
