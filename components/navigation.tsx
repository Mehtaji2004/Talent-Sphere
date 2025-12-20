"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Briefcase, PlusCircle, Brain, User, LogIn, BookOpen, Sparkles, Mic } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function Navigation() {
  const { user } = useAuth()

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">TalentSphere</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Search Jobs
              </Button>
            </Link>
            <Link href="/post-job">
              <Button variant="ghost" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Post Job
              </Button>
            </Link>
            <Link href="/quiz">
              <Button variant="ghost" className="gap-2">
                <Brain className="h-4 w-4" />
                Skill Quiz
              </Button>
            </Link>
            <Link href="/pyqs">
              <Button variant="ghost" className="gap-2">
                <BookOpen className="h-4 w-4" />
                PYQs
              </Button>
            </Link>
            <Link href="/ai-guidance">
              <Button variant="ghost" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Guidance
              </Button>
            </Link>
            {/* NEW Mock Interview link */}
            <Link href="/interview">
              <Button variant="ghost" className="gap-2">
                <Mic className="h-4 w-4" />
                Mock Interview
              </Button>
            </Link>

            {user ? (
              <Link href="/profile">
                <Button variant="ghost" className="gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </Link>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}

            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
