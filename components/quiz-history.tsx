"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Trophy, Clock, Calendar, TrendingUp } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface QuizResult {
  id: number
  userId?: string
  topic: string
  score: number
  correctAnswers: number
  totalQuestions: number
  timeUsed: number
  timeLimit: number
  date: string
  difficulty: string[]
}

interface QuizHistoryProps {
  onBack: () => void
}

export function QuizHistory({ onBack }: QuizHistoryProps) {
  const { user } = useAuth()
  const [results, setResults] = useState<QuizResult[]>([])

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    const userResults = user ? savedResults.filter((result: QuizResult) => result.userId === user.id) : savedResults
    setResults(userResults)
  }, [user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: "Excellent", variant: "default" as const }
    if (score >= 80) return { text: "Good", variant: "secondary" as const }
    if (score >= 60) return { text: "Average", variant: "outline" as const }
    return { text: "Needs Improvement", variant: "destructive" as const }
  }

  const averageScore =
    results.length > 0 ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : 0

  const totalQuizzes = results.length
  const bestScore = results.length > 0 ? Math.max(...results.map((r) => r.score)) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Quiz Setup
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{user ? `${user.firstName}'s Quiz History` : "Quiz History"}</h1>
          <p className="text-muted-foreground">Track your learning progress over time</p>
        </div>
      </div>

      {/* Stats Overview */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{bestScore}%</div>
              <div className="text-sm text-muted-foreground">Best Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{averageScore}%</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold">{totalQuizzes}</div>
              <div className="text-sm text-muted-foreground">Quizzes Taken</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quiz Results */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quizzes</CardTitle>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No quiz history yet</h3>
              <p className="text-muted-foreground mb-4">Take your first quiz to start tracking your progress!</p>
              <Button onClick={onBack}>Start Your First Quiz</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((result) => {
                const scoreBadge = getScoreBadge(result.score)
                return (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{result.topic}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(result.date)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>{result.score}%</div>
                        <Badge variant={scoreBadge.variant} className="text-xs">
                          {scoreBadge.text}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {result.correctAnswers}/{result.totalQuestions} correct
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{formatTime(result.timeUsed)} used</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Limit:</span>
                        <span>{formatTime(result.timeLimit)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Questions:</span>
                        <span>{result.totalQuestions}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
