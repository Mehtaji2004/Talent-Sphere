"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Briefcase, Brain, FileText, Calendar, Trophy, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export function UserProfile() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [applications, setApplications] = useState([])
  const [quizResults, setQuizResults] = useState([])
  const [postedJobs, setPostedJobs] = useState([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    // Load user data
    const allApplications = JSON.parse(localStorage.getItem("jobApplications") || "[]")
    const allQuizResults = JSON.parse(localStorage.getItem("quizResults") || "[]")
    const allPostedJobs = JSON.parse(localStorage.getItem("localJobs") || "[]")

    // Filter user-specific data
    const userApplications = allApplications.filter((app: any) => app.userId === user.id)
    const userQuizResults = allQuizResults.filter((result: any) => result.userId === user.id)
    const userPostedJobs = allPostedJobs.filter((job: any) => job.postedBy === user.id)

    setApplications(userApplications)
    setQuizResults(userQuizResults)
    setPostedJobs(userPostedJobs)
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const averageQuizScore =
    quizResults.length > 0
      ? Math.round(quizResults.reduce((sum: number, result: any) => sum + result.score, 0) / quizResults.length)
      : 0

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-muted-foreground">{user.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {user.userType === "job-seeker"
                    ? "Job Seeker"
                    : user.userType === "employer"
                      ? "Employer"
                      : "Job Seeker & Employer"}
                </Badge>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{applications.length}</div>
            <div className="text-sm text-muted-foreground">Applications</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{quizResults.length}</div>
            <div className="text-sm text-muted-foreground">Quizzes</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{postedJobs.length}</div>
            <div className="text-sm text-muted-foreground">Jobs Posted</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{averageQuizScore}%</div>
            <div className="text-sm text-muted-foreground">Avg Quiz Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Tabs */}
      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="quizzes">Quiz History</TabsTrigger>
          <TabsTrigger value="jobs">Posted Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                My Job Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                  <p className="text-muted-foreground">Start applying for jobs to see them here!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app: any) => (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{app.jobTitle}</h3>
                        <Badge variant="outline">{app.status}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{app.company}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied {formatDate(app.appliedDate)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quizzes">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                My Quiz History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {quizResults.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No quizzes taken yet</h3>
                  <p className="text-muted-foreground">Take a skill assessment to track your progress!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {quizResults.slice(0, 5).map((result: any) => (
                    <div key={result.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{result.topic}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">{result.score}%</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          {result.correctAnswers}/{result.totalQuestions} correct
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(result.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                My Posted Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              {postedJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
                  <p className="text-muted-foreground">Post your first job to find great candidates!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {postedJobs.map((job: any) => (
                    <div key={job.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge variant="secondary">{job.job_type}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{job.company}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{job.candidate_required_location}</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Posted {formatDate(job.publication_date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
