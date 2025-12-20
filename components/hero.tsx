import { Button } from "@/components/ui/button"
import { ArrowRight, Users, Building, Award } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-card to-background py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Find Your Dream Job</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Yours One Stop solution where you can see real time jobs opening across the globe , post jobs as well as prepare for Interviews
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <Button size="lg" className="gap-2">
              Start Job Search
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/post-job">
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              Post a Job
              <Building className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">10,000+ Jobs</h3>
            <p className="text-muted-foreground text-sm">From startups to Fortune 500 companies</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">500+ Companies</h3>
            <p className="text-muted-foreground text-sm">Top employers actively hiring</p>
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Skill Assessment</h3>
            <p className="text-muted-foreground text-sm">AI-powered quizzes to showcase abilities</p>
          </div>
        </div>
      </div>
    </section>
  )
}
