"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Clock, Building2, BookOpen, Trophy } from "lucide-react"

interface PYQ {
  id: number
  company: string
  category: string
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
  difficulty: string
  year?: number
}

export default function PYQsPage() {
  const [pyqs, setPyqs] = useState<PYQ[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  useEffect(() => {
    if (selectedCompany !== "all") {
      fetchCategories(selectedCompany)
    }
  }, [selectedCompany])

  useEffect(() => {
    fetchPYQs()
  }, [selectedCompany, selectedCategory])

  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/pyqs/companies")
      const data = await response.json()
      setCompanies(["all", ...data])
      setSelectedCompany("all")
    } catch (error) {
      console.error("Error fetching companies:", error)
    }
  }

  const fetchCategories = async (company: string) => {
    try {
      const response = await fetch(`/api/pyqs/categories?company=${company}`)
      const data = await response.json()
      setCategories(["all", ...data])
      setSelectedCategory("all")
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const fetchPYQs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCompany !== "all") params.append("company", selectedCompany)
      if (selectedCategory !== "all") params.append("category", selectedCategory)

      const response = await fetch(`/api/pyqs?${params}`)
      const data = await response.json()
      setPyqs(data)
      setCurrentIndex(0)
      setShowAnswer(false)
      setSelectedAnswer(null)
      setScore(0)
      setAnsweredQuestions(new Set())
    } catch (error) {
      console.error("Error fetching PYQs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const currentPYQ = pyqs[currentIndex]
    const isCorrect = selectedAnswer === currentPYQ.correct_answer

    if (isCorrect && !answeredQuestions.has(currentIndex)) {
      setScore(score + 1)
    }

    setAnsweredQuestions((prev) => new Set([...prev, currentIndex]))
    setShowAnswer(true)
  }

  const handleNextQuestion = () => {
    if (currentIndex < pyqs.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
      setSelectedAnswer(null)
    }
  }

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
      setSelectedAnswer(null)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  const currentPYQ = pyqs[currentIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Previous Year Questions</h1>
          <p className="text-xl text-muted-foreground">Practice with real interview questions from top companies</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Filter Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Company</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={fetchPYQs} className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Load Questions
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {pyqs.length > 0 && (
          <>
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  Question {currentIndex + 1} of {pyqs.length}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    Score: {score}/{answeredQuestions.size}
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / pyqs.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Card */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <Badge variant="outline">{currentPYQ.company}</Badge>
                    <Badge variant="outline">{currentPYQ.category}</Badge>
                    <Badge className={getDifficultyColor(currentPYQ.difficulty)}>{currentPYQ.difficulty}</Badge>
                    {currentPYQ.year && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {currentPYQ.year}
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg leading-relaxed">{currentPYQ.question}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentPYQ.options && currentPYQ.options.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {currentPYQ.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={showAnswer}
                        className={`w-full p-4 text-left rounded-lg border transition-all ${
                          selectedAnswer === option
                            ? showAnswer
                              ? option === currentPYQ.correct_answer
                                ? "border-green-500 bg-green-50 text-green-800"
                                : "border-red-500 bg-red-50 text-red-800"
                              : "border-primary bg-primary/5"
                            : showAnswer && option === currentPYQ.correct_answer
                              ? "border-green-500 bg-green-50 text-green-800"
                              : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="mb-6">
                    <p className="text-muted-foreground mb-4">
                      This is an open-ended question. Think about your approach and then view the explanation.
                    </p>
                  </div>
                )}

                {showAnswer && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2 text-green-800">Explanation:</h4>
                    <p className="text-muted-foreground leading-relaxed">{currentPYQ.explanation}</p>
                  </div>
                )}

                <div className="flex justify-between items-center mt-6">
                  <Button variant="outline" onClick={handlePrevQuestion} disabled={currentIndex === 0}>
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {!showAnswer ? (
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswer && Boolean(currentPYQ.options)}
                      >
                        {currentPYQ.options ? "Submit Answer" : "Show Explanation"}
                      </Button>
                    ) : (
                      <Button onClick={handleNextQuestion} disabled={currentIndex === pyqs.length - 1}>
                        Next Question
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {pyqs.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Questions Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or select a different company/category.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
