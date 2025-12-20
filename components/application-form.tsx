"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Upload, User, FileText, Send, LogIn } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"

interface Job {
  id: number
  title: string
  company: string
  isLocalJob?: boolean
  contactEmail?: string
}

interface ApplicationFormProps {
  job: Job
  onBack: () => void
}

interface ApplicationData {
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedinUrl: string
  portfolioUrl: string
  coverLetter: string
  resumeFile: File | null
  portfolioFile: File | null
  agreedToTerms: boolean
  allowContact: boolean
}

export function ApplicationForm({ job, onBack }: ApplicationFormProps) {
  const { user } = useAuth()
  const [formData, setFormData] = useState<ApplicationData>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    linkedinUrl: "",
    portfolioUrl: "",
    coverLetter: "",
    resumeFile: null,
    portfolioFile: null,
    agreedToTerms: false,
    allowContact: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ApplicationData, value: string | boolean | File | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: "resumeFile" | "portfolioFile", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      alert("You must be signed in to submit an application.")
      return
    }

    setIsSubmitting(true)

    try {
      const application = {
        id: Date.now(),
        userId: user.id,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        applicantName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        linkedinUrl: formData.linkedinUrl,
        portfolioUrl: formData.portfolioUrl,
        coverLetter: formData.coverLetter,
        resumeFileName: formData.resumeFile?.name || null,
        portfolioFileName: formData.portfolioFile?.name || null,
        appliedDate: new Date().toISOString(),
        status: "submitted",
      }

      const existingApplications = JSON.parse(localStorage.getItem("jobApplications") || "[]")
      const updatedApplications = [application, ...existingApplications]
      localStorage.setItem("jobApplications", JSON.stringify(updatedApplications))

      alert(`Application submitted successfully for ${job.title} at ${job.company}!`)
      onBack()
    } catch (error) {
      console.error("Error submitting application:", error)
      alert("Error submitting application. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Job
          </Button>
        </div>

        <Card>
          <CardContent className="py-12 text-center">
            <LogIn className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Sign in to apply</h3>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to apply for jobs. This helps us track your applications and provide better
              service.
            </p>
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
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Job
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Apply for {job.title}</h1>
          <p className="text-muted-foreground">at {job.company}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Application Form
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Applying as: {user.firstName} {user.lastName} ({user.email})
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                  <Input
                    id="linkedinUrl"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolioUrl">Portfolio Website</Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    placeholder="https://yourportfolio.com"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Documents</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="resume">Resume/CV *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange("resumeFile", e.target.files?.[0] || null)}
                      required
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX format</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="portfolio"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange("portfolioFile", e.target.files?.[0] || null)}
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">Additional work samples</p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter *</Label>
              <Textarea
                id="coverLetter"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                value={formData.coverLetter}
                onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                rows={6}
                required
              />
            </div>

            {/* Agreements */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreedToTerms}
                  onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and privacy policy *
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="contact"
                  checked={formData.allowContact}
                  onCheckedChange={(checked) => handleInputChange("allowContact", checked as boolean)}
                />
                <Label htmlFor="contact" className="text-sm">
                  I allow the company to contact me about future opportunities
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isSubmitting || !formData.agreedToTerms} className="flex-1 gap-2">
                {isSubmitting ? (
                  <>
                    <FileText className="h-4 w-4 animate-pulse" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
