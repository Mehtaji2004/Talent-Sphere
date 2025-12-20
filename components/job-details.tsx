"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Clock,
  DollarSign,
  Building,
  ExternalLink,
  Mail,
  ArrowLeft,
  FileText,
  Users,
  Award,
} from "lucide-react"
import Link from "next/link"
import { ApplicationForm } from "./application-form"

interface Job {
  id: number
  title: string
  company: string
  location: string
  job_type: string
  publication_date: string
  candidate_required_location: string
  salary?: string
  description: string
  url: string
  company_logo?: string
  tags?: string[]
  isLocalJob?: boolean
  contactEmail?: string
  requirements?: string
  benefits?: string
  companyWebsite?: string
  experienceLevel?: string
}

interface JobDetailsProps {
  jobId: string
}

export function JobDetails({ jobId }: JobDetailsProps) {
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // First check local jobs
        const localJobs = JSON.parse(localStorage.getItem("localJobs") || "[]")
        const localJob = localJobs.find((j: Job) => j.id.toString() === jobId)

        if (localJob) {
          setJob(localJob)
          setLoading(false)
          return
        }

        // If not found locally, fetch from Remotive API
        const response = await fetch("https://remotive.com/api/remote-jobs")
        const data = await response.json()
        const remoteJob = data.jobs?.find((j: Job) => j.id.toString() === jobId)

        if (remoteJob) {
          setJob(remoteJob)
        }
      } catch (error) {
        console.error("Error fetching job details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJobDetails()
  }, [jobId])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <p className="text-muted-foreground mb-6">The job you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>
    )
  }

  if (showApplicationForm) {
    return <ApplicationForm job={job} onBack={() => setShowApplicationForm(false)} />
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      {/* Job Header */}
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* {job.company_logo && (
              <img
                src={job.company_logo || "/placeholder.svg"}
                alt={`${job.company} logo`}
                className="w-20 h-20 rounded-lg object-contain bg-muted p-2"
              />
            )} */}

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">{job.title}</h1>
                  {job.isLocalJob && <Badge variant="default">Local Post</Badge>}
                </div>
                <p className="text-xl text-primary font-semibold">{job.company}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.candidate_required_location || "Remote"}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Posted {formatDate(job.publication_date)}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                )}
                {job.experienceLevel && (
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {job.experienceLevel}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{job.job_type}</Badge>
                {job.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={() => setShowApplicationForm(true)} size="lg" className="gap-2">
                <FileText className="h-4 w-4" />
                Apply Now
              </Button>

              {job.isLocalJob ? (
                <Button variant="outline" asChild>
                  <a href={`mailto:${job.contactEmail}`} className="gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Employer
                  </a>
                </Button>
              ) : (
                <Button variant="outline" asChild>
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    External Apply
                  </a>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: job.description.replace(/\n/g, "<br>"),
            }}
          />
        </CardContent>
      </Card>

      {/* Requirements */}
      {job.requirements && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: job.requirements.replace(/\n/g, "<br>"),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {job.benefits && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Benefits & Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: job.benefits.replace(/\n/g, "<br>"),
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Company Info */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            About {job.company}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">Learn more about {job.company} and their current opportunities.</p>
          {job.companyWebsite && (
            <Button variant="outline" asChild>
              <a href={job.companyWebsite} target="_blank" rel="noopener noreferrer" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Visit Company Website
              </a>
            </Button>
          )}
        </CardContent>
      </Card> */}
    </div>
  )
}
