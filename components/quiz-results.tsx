"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Clock, Trophy, RotateCcw, Home } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface QuizResultsProps {
  topic: string
  questions: Question[]
  selectedAnswers: number[]
  timeLimit: number
  timeUsed: number
  onRestart: () => void
  onComplete: () => void
}

export function QuizResults({
  topic,
  questions,
  selectedAnswers,
  timeLimit,
  timeUsed,
  onRestart,
  onComplete,
}: QuizResultsProps) {
  const { user } = useAuth()
  const correctAnswers = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length
  const score = Math.round((correctAnswers / questions.length) * 100)
  const timeUsedMinutes = Math.floor(timeUsed / 60)
  const timeUsedSeconds = timeUsed % 60

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

  useEffect(() => {
    const result = {
      id: Date.now(),
      userId: user?.id || null, // Link quiz result to user
      userName: user ? `${user.firstName} ${user.lastName}` : "Anonymous",
      topic,
      score,
      correctAnswers,
      totalQuestions: questions.length,
      timeUsed,
      timeLimit: timeLimit * 60,
      date: new Date().toISOString(),
      difficulty: questions.map((q) => q.difficulty),
    }

    const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    const updatedResults = [result, ...existingResults.slice(0, 49)] // Keep last 50 results
    localStorage.setItem("quizResults", JSON.stringify(updatedResults))
  }, [topic, score, correctAnswers, questions.length, timeUsed, timeLimit, user])

  const scoreBadge = getScoreBadge(score)

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
          <p className="text-muted-foreground">{topic} Assessment Results</p>
          {user && (
            <p className="text-sm text-muted-foreground">
              Completed by: {user.firstName} {user.lastName}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-4">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}%</div>
            <Badge variant={scoreBadge.variant} className="text-sm px-4 py-1">
              {scoreBadge.text}
            </Badge>
            <p className="text-muted-foreground">
              {correctAnswers} out of {questions.length} questions correct
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>
                {correctAnswers}/{questions.length}
              </span>
            </div>
            <Progress value={(correctAnswers / questions.length) * 100} className="h-3" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Clock className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="font-semibold">Time Used</div>
              <div className="text-sm text-muted-foreground">
                {timeUsedMinutes}:{timeUsedSeconds.toString().padStart(2, "0")}
              </div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Trophy className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
              <div className="font-semibold">Accuracy</div>
              <div className="text-sm text-muted-foreground">{score}%</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button onClick={onRestart} variant="outline" className="flex-1 gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Retake Quiz
            </Button>
            <Button onClick={onComplete} className="flex-1 gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Question Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index]
            const isCorrect = userAnswer === question.correctAnswer
            const wasAnswered = userAnswer !== -1

            return (
              <div key={question.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Question {index + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm">{question.question}</p>

                    <div className="space-y-1 text-sm">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded ${
                            optionIndex === question.correctAnswer
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : optionIndex === userAnswer && !isCorrect
                                ? "bg-red-50 text-red-800 border border-red-200"
                                : "bg-muted/30"
                          }`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span> {option}
                          {optionIndex === question.correctAnswer && <span className="ml-2 text-xs">(Correct)</span>}
                          {optionIndex === userAnswer && !isCorrect && (
                            <span className="ml-2 text-xs">(Your answer)</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
