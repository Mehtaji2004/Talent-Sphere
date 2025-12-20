"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, ExternalLink, Loader2, Mail, Eye } from "lucide-react"
import Link from "next/link"

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
}

export function JobSearch() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("all-categories")
  const [location, setLocation] = useState("")

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (category) params.append("category", category)
      if (location) params.append("location", location)

      // Fetch remote jobs from API
      const response = await fetch(`https://remotive.com/api/remote-jobs?${params.toString()}`)
      const data = await response.json()
      const remoteJobs = data.jobs || []

      // Get local jobs from localStorage
      const localJobs = JSON.parse(localStorage.getItem("localJobs") || "[]")

      // Filter local jobs based on search criteria
      const filteredLocalJobs = localJobs.filter((job: Job) => {
        const matchesSearch =
          !searchTerm ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesLocation =
          !location || job.candidate_required_location.toLowerCase().includes(location.toLowerCase())

        return matchesSearch && matchesLocation
      })

      // Combine and sort jobs (local jobs first, then remote)
      const allJobs = [...filteredLocalJobs, ...remoteJobs]
      setJobs(allJobs)
    } catch (error) {
      console.error("Error fetching jobs:", error)
      const localJobs = JSON.parse(localStorage.getItem("localJobs") || "[]")
      setJobs(localJobs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchJobs()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Remote Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Input
                  placeholder="Job title, keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-categories">All Categories</SelectItem>
                    <SelectItem value="software-dev">Software Development</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="devops">DevOps</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input
                  placeholder="Location (optional)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search Jobs
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Job Results */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{jobs.length > 0 ? `${jobs.length} Jobs Found` : "Latest Remote Jobs"}</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No jobs found. Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {jobs.slice(0, 20).map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        {/* {job.company_logo && (
                          <img src={job.company_logo || "/placeholder.svg"} alt={`${job.company_name} logo`} className="w-12 h-12 rounded-lg object-contain bg-muted p-1" />
                        )} */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                            {job.isLocalJob && (
                              <Badge variant="default" className="text-xs">
                                Local Post
                              </Badge>
                            )}
                          </div>
                          <p className="text-lg text-primary font-medium mb-2">{job.company}</p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {job.candidate_required_location || "Remote"}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDate(job.publication_date)}
                            </div>
                            {job.salary && (
                              <div className="flex items-center gap-1">
                                <span className="font-medium">{job.salary}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{job.job_type}</Badge>
                        {job.tags?.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <p className="text-muted-foreground line-clamp-2">
                        {job.description.replace(/<[^>]*>/g, "").substring(0, 200)}...
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 md:ml-4">
                      <Link href={`/jobs/${job.id}`}>
                        <Button variant="outline" className="w-full gap-2 bg-transparent">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                      </Link>

                      {job.isLocalJob ? (
                        <Button asChild>
                          <a href={`mailto:${job.contactEmail}`} className="gap-2">
                            Contact Employer
                            <Mail className="h-4 w-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button asChild>
                          <a href={job.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                            Apply Now
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
