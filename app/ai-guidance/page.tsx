"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sparkles, MessageCircle, Clock, User, Bot } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface GuidanceSession {
  id: number
  topic?: string
  question: string
  ai_response: string
  created_at: string
}

export default function AIGuidancePage() {
  const { user } = useAuth()
  const [question, setQuestion] = useState("")
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState<GuidanceSession[]>([])
  const [currentResponse, setCurrentResponse] = useState("")

  useEffect(() => {
    if (user) {
      fetchGuidanceSessions()
    }
  }, [user])

  const fetchGuidanceSessions = async () => {
    if (!user) return

    try {
      const response = await fetch("/api/ai-guidance/history")
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error("Error fetching guidance sessions:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim() || !user) return

    setLoading(true)
    setCurrentResponse("")

    try {
      const response = await fetch("/api/ai-guidance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
          topic: topic.trim() || undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setCurrentResponse(data.response)
        setQuestion("")
        setTopic("")
        fetchGuidanceSessions() // Refresh history
      } else {
        console.error("Error getting AI guidance:", data.error)
      }
    } catch (error) {
      console.error("Error submitting question:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card>
            <CardContent className="py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Sign In Required</h3>
              <p className="text-muted-foreground mb-4">
                Please sign in to access AI guidance and save your conversation history.
              </p>
              <Button asChild>
                <a href="/auth/login">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Sparkles className="h-10 w-10 text-primary" />
            AI Career Guidance
          </h1>
          <p className="text-xl text-muted-foreground">Get personalized advice for your career journey</p>
        </div>

        {/* Question Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Ask Your Question
            </CardTitle>
            <CardDescription>
              Get AI-powered guidance on career development, interview preparation, skill building, and more.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Topic (Optional)</label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Interview Preparation, Career Change, Skill Development"
                  className="mb-4"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Your Question *</label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask anything about your career, job search, interviews, skills, or professional development..."
                  rows={4}
                  required
                />
              </div>

              <Button type="submit" disabled={loading || !question.trim()} className="w-full">
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Getting AI Guidance...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Get AI Guidance
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Response */}
        {currentResponse && (
          <Card className="mb-8 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Bot className="h-5 w-5" />
                AI Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">{currentResponse}</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Previous Sessions */}
        {sessions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6" />
              Previous Sessions
            </h2>

            <div className="space-y-4">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {session.topic && <Badge variant="outline">{session.topic}</Badge>}
                        <span className="text-sm text-muted-foreground">{formatDate(session.created_at)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3">
                      <User className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-muted-foreground mb-1">Your Question:</p>
                        <p className="text-sm">{session.question}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-primary mb-1">AI Response:</p>
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {session.ai_response}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {sessions.length === 0 && !currentResponse && (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Previous Sessions</h3>
              <p className="text-muted-foreground">
                Start by asking your first question above to get personalized AI guidance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
