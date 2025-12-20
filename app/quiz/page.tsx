import { QuizSetup } from "@/components/quiz-setup"
import { Navigation } from "@/components/navigation"

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-4">AI Skill Assessment</h1>
            <p className="text-muted-foreground">
              Test your knowledge with AI-generated questions tailored to your chosen topic
            </p>
          </div>
          <QuizSetup />
        </div>
      </main>
    </div>
  )
}
