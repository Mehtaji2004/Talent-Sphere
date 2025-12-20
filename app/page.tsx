import { JobSearch } from "@/components/job-search"
import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <JobSearch />
      </main>
    </div>
  )
}
