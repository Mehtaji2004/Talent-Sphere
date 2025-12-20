"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, DollarSign, Clock, X, Plus, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface JobFormData {
  title: string
  company: string
  location: string
  jobType: string
  salaryMin: string
  salaryMax: string
  currency: string
  description: string
  requirements: string
  benefits: string
  contactEmail: string
  companyWebsite: string
  tags: string[]
  isRemote: boolean
  experienceLevel: string
}

export function JobPostingForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState<JobFormData>({
    title: "",
    company: "",
    location: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    currency: "INR",
    description: "",
    requirements: "",
    benefits: "",
    contactEmail: "",
    companyWebsite: "",
    tags: [],
    isRemote: false,
    experienceLevel: "",
  })

  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        contactEmail: user.email,
      }))
    }
  }, [user])

  if (!user) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Sign in required</h3>
          <p className="text-muted-foreground mb-6">You need to be signed in to post a job.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button variant="outline" className="bg-transparent">
                Create Account
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  const handleInputChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newJob = {
        id: Date.now(),
        ...formData,
        publication_date: new Date().toISOString(),
        candidate_required_location: formData.isRemote ? "Remote" : formData.location,
        salary:
          formData.salaryMin && formData.salaryMax
            ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax}`
            : "",
        url: `mailto:${formData.contactEmail}`,
        company_logo: null,
        isLocalJob: true,
        postedBy: user.id, // Track who posted the job
        postedByName: `${user.firstName} ${user.lastName}`,
      }

      // Save to localStorage
      const existingJobs = JSON.parse(localStorage.getItem("localJobs") || "[]")
      const updatedJobs = [newJob, ...existingJobs]
      localStorage.setItem("localJobs", JSON.stringify(updatedJobs))

      // Show success message and redirect
      alert("Job posted successfully!")
      router.push("/profile")
    } catch (error) {
      console.error("Error posting job:", error)
      alert("Error posting job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Job Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Posting as: {user.firstName} {user.lastName} ({user.email})
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                placeholder="e.g. TechCorp Inc."
                value={formData.company}
                onChange={(e) => handleInputChange("company", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Location and Remote */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={formData.isRemote}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Work Type</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={formData.isRemote}
                  onCheckedChange={(checked) => handleInputChange("isRemote", checked as boolean)}
                />
                <Label htmlFor="remote">Remote Position</Label>
              </div>
            </div>
          </div>

          {/* Job Type and Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobType">Job Type *</Label>
              <Select value={formData.jobType} onValueChange={(value) => handleInputChange("jobType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experienceLevel">Experience Level</Label>
              <Select
                value={formData.experienceLevel}
                onValueChange={(value) => handleInputChange("experienceLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entry">Entry Level</SelectItem>
                  <SelectItem value="mid">Mid Level</SelectItem>
                  <SelectItem value="senior">Senior Level</SelectItem>
                  <SelectItem value="lead">Lead/Principal</SelectItem>
                  <SelectItem value="executive">Executive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <Label>Salary Range (Optional)</Label>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="Min"
                value={formData.salaryMin}
                onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                type="number"
              />
              <span className="text-muted-foreground">to</span>
              <Input
                placeholder="Max"
                value={formData.salaryMax}
                onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                type="number"
              />
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              required
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements">Requirements</Label>
            <Textarea
              id="requirements"
              placeholder="List the required skills, experience, and qualifications..."
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              rows={4}
            />
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <Label htmlFor="benefits">Benefits & Perks</Label>
            <Textarea
              id="benefits"
              placeholder="Health insurance, flexible hours, remote work, etc..."
              value={formData.benefits}
              onChange={(e) => handleInputChange("benefits", e.target.value)}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Skills & Tags</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill or tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="hr@company.com"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                type="url"
                placeholder="https://company.com"
                value={formData.companyWebsite}
                onChange={(e) => handleInputChange("companyWebsite", e.target.value)}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Posting Job...
                </>
              ) : (
                "Post Job"
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
