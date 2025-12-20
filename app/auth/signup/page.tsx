import { SignupForm } from "@/components/signup-form"
import { Navigation } from "@/components/navigation"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <SignupForm />
        </div>
      </main>
    </div>
  )
}
