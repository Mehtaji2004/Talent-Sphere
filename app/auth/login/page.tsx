import { LoginForm } from "@/components/login-form"
import { Navigation } from "@/components/navigation"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
