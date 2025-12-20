import { UserProfile } from "@/components/user-profile"
import { Navigation } from "@/components/navigation"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <UserProfile />
        </div>
      </main>
    </div>
  )
}
