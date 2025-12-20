"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, Clock, Hash, Play, History } from "lucide-react"
import { QuizInterface } from "./quiz-interface"
import { QuizHistory } from "./quiz-history"

interface QuizConfig {
  topic: string
  customTopic: string
  timeLimit: number
  questionCount: number
}

export function QuizSetup() {
  const [config, setConfig] = useState<QuizConfig>({
    topic: "",
    customTopic: "",
    timeLimit: 10,
    questionCount: 5,
  })
  const [quizStarted, setQuizStarted] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const predefinedTopics = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "Data Structures",
    "Algorithms",
    "Database Design",
    "System Design",
    "Machine Learning",
    "DevOps",
    "Cybersecurity",
    "UI/UX Design",
    "Project Management",
    "Marketing",
    "Sales",
    "Custom",
  ]

  const handleConfigChange = (field: keyof QuizConfig, value: string | number) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const startQuiz = () => {
    if (!config.topic || (config.topic === "Custom" && !config.customTopic.trim())) {
      alert("Please select or enter a topic")
      return
    }
    setQuizStarted(true)
  }

  const handleQuizComplete = () => {
    setQuizStarted(false)
    setShowHistory(false)
  }

  if (showHistory) {
    return <QuizHistory onBack={() => setShowHistory(false)} />
  }

  if (quizStarted) {
    return (
      <QuizInterface
        topic={config.topic === "Custom" ? config.customTopic : config.topic}
        timeLimit={config.timeLimit}
        questionCount={config.questionCount}
        onComplete={handleQuizComplete}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Quiz Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic">Select Topic *</Label>
            <Select value={config.topic} onValueChange={(value) => handleConfigChange("topic", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a topic for your quiz" />
              </SelectTrigger>
              <SelectContent>
                {predefinedTopics.map((topic) => (
                  <SelectItem key={topic} value={topic}>
                    {topic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Topic Input */}
          {config.topic === "Custom" && (
            <div className="space-y-2">
              <Label htmlFor="customTopic">Custom Topic *</Label>
              <Input
                id="customTopic"
                placeholder="Enter your custom topic (e.g., 'Advanced TypeScript', 'Cloud Architecture')"
                value={config.customTopic}
                onChange={(e) => handleConfigChange("customTopic", e.target.value)}
              />
            </div>
          )}

          {/* Time Limit */}
          <div className="space-y-2">
            <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Select
                value={config.timeLimit.toString()}
                onValueChange={(value) => handleConfigChange("timeLimit", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="questionCount">Number of Questions</Label>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <Select
                value={config.questionCount.toString()}
                onValueChange={(value) => handleConfigChange("questionCount", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 questions</SelectItem>
                  <SelectItem value="10">10 questions</SelectItem>
                  <SelectItem value="15">15 questions</SelectItem>
                  <SelectItem value="20">20 questions</SelectItem>
                  <SelectItem value="25">25 questions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quiz Preview */}
          {config.topic && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Quiz Preview:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Topic: {config.topic === "Custom" ? config.customTopic || "Custom Topic" : config.topic}</li>
                <li>• Duration: {config.timeLimit} minutes</li>
                <li>• Questions: {config.questionCount}</li>
                <li>• Difficulty: Mixed (Beginner to Advanced)</li>
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button onClick={startQuiz} className="flex-1 gap-2" size="lg">
              <Play className="h-4 w-4" />
              Start Quiz
            </Button>
            <Button variant="outline" onClick={() => setShowHistory(true)} className="gap-2">
              <History className="h-4 w-4" />
              View History
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold mb-2">How it works</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AI generates questions based on your chosen topic</li>
                <li>• Questions range from basic concepts to advanced scenarios</li>
                <li>• Timer starts automatically when you begin</li>
                <li>• Get instant feedback and detailed explanations</li>
                <li>• Track your progress and improvement over time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
