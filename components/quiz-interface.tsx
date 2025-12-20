"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, ArrowRight } from "lucide-react"
import { QuizResults } from "./quiz-results"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "Easy" | "Medium" | "Hard"
}

interface QuizInterfaceProps {
  topic: string
  timeLimit: number
  questionCount: number
  onComplete: () => void
}

export function QuizInterface({ topic, timeLimit, questionCount, onComplete }: QuizInterfaceProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // Convert to seconds
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, questionCount }),
      })
      const data = await res.json()
      setQuestions(data.questions)
      setSelectedAnswers(new Array(data.questions.length).fill(-1))
    } catch (err) {
      console.error("Error fetching quiz:", err)
    }
    setLoading(false)
  }

  fetchQuestions()
}, [topic, questionCount])

  useEffect(() => {
    if (loading || quizCompleted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setQuizCompleted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loading, quizCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">Generating AI Questions</h3>
          <p className="text-muted-foreground">Creating personalized questions for {topic}...</p>
        </CardContent>
      </Card>
    )
  }

  if (quizCompleted) {
    return (
      <QuizResults
        topic={topic}
        questions={questions}
        selectedAnswers={selectedAnswers}
        timeLimit={timeLimit}
        timeUsed={timeLimit * 60 - timeRemaining}
        onRestart={() => window.location.reload()}
        onComplete={onComplete}
      />
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">{topic} Assessment</CardTitle>
              <p className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={timeRemaining < 300 ? "destructive" : "secondary"} className="gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeRemaining)}
              </Badge>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{currentQuestion.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-xl font-semibold leading-relaxed">{currentQuestion.question}</h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswers[currentQuestionIndex] === index
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQuestionIndex] === index
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground"
                    }`}
                  >
                    {selectedAnswers[currentQuestionIndex] === index && <CheckCircle className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
              Previous
            </Button>

            <Button onClick={nextQuestion} disabled={selectedAnswers[currentQuestionIndex] === -1} className="gap-2">
              {currentQuestionIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg border-2 font-medium transition-all ${
                  index === currentQuestionIndex
                    ? "border-primary bg-primary text-primary-foreground"
                    : selectedAnswers[index] !== -1
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-border hover:border-primary/50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
