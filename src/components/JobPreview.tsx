"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  Clock,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { BarLoader } from 'react-spinners';
import { Job } from "@/hooks/useJobListings";
import { JobStructuredData } from "./JobStructuredData";
import { JobApplicationDialog } from "./JobApplicationDialog";
import { JobApplicationSuccessDialog } from "./JobApplicationSuccessDialog";
import { useApplyJob } from "@/hooks/useApplyJob";
import { isTeacherAuthenticated } from "@/lib/authUtils";
import { useDashboardStore } from "@/hooks/useDashboardStore";
import { toast } from "sonner";

interface JobPreviewProps {
  job_id: string;
  jobsData: Job[] | null;
  onBack: () => void;
}

export function JobPreview({ job_id, jobsData, onBack }: JobPreviewProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  const { apply_job } = useApplyJob();
  const { teacher } = useDashboardStore();
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const jobDate = new Date(dateString);
    const diffInMs = now.getTime() - jobDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const handleApplyJob = async () => {
    // Check if user is authenticated
    if (!isTeacherAuthenticated() || !teacher) {
      setShowLoginDialog(true);
      return;
    }

    // User is authenticated, apply directly
    setIsApplying(true);
    try {
      const result = await apply_job(job_id, teacher.id);
      if (result.status === 201 || result.status === 200) {
        // Show success dialog instead of just toast
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error("Application error:", error);
      toast.error("Failed to submit application");
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplicationSuccess = () => {
    // Show success dialog for post-login application
    setShowSuccessDialog(true);
  };

  const job = jobsData ? jobsData.find((job) => job.j_id === job_id) : null;

  useEffect(() => {
    if (job) {
      document.title = job.j_title;
    } else {
      document.title = "Tutorschool";
    }
  }, [job]);

  if (!jobsData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BarLoader color="#36d7b7" width={150} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex justify-center items-center bg-background min-h-screen">
        <Card className="mx-4 w-full max-w-md">
          <CardContent className="py-12 text-center">
            <Briefcase className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
            <h2 className="mb-2 font-semibold text-foreground text-xl">
              Job Not Found
            </h2>
            <p className="mb-6 text-muted-foreground">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <Button
              onClick={onBack}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Jobs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Add structured data for SEO */}
      <JobStructuredData job={job} />
      
      <div className="mx-auto px-4 py-8 max-w-4xl">
        {/* Header with back button */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => {
              document.title = "Tutor School";
              onBack();
            }}
            className="mb-6 hover:text-foreground"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Jobs
          </Button>
        </div>

        {/* Main content */}
        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Left column - Job details */}
          <div className="space-y-6 lg:col-span-2">
            {/* Job header */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Badge className="bg-accent w-fit text-accent-foreground">
                  {job.j_preview}
                </Badge>
                <h1 className="font-bold text-foreground text-4xl text-balance leading-tight">
                  {job.j_title}
                </h1>
              </div>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.j_location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Posted {getTimeAgo(job.j_created_at)}</span>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Job description */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h2 className="flex items-center gap-2 font-semibold text-card-foreground text-xl">
                  <Briefcase className="w-5 h-5" />
                  Job Description
                </h2>
              </CardHeader>
              <CardContent>
                <div className="prose-invert max-w-none prose">
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    {stripHtml(job.j_desc)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Job timeline */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h2 className="flex items-center gap-2 font-semibold text-card-foreground text-xl">
                  <Calendar className="w-5 h-5" />
                  Timeline
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary mt-2 rounded-full w-2 h-2"></div>
                    <div>
                      <p className="font-medium text-foreground">
                        Job Posted
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(job.j_created_at)}
                      </p>
                    </div>
                  </div>
                  {job.j_updated_at !== job.j_created_at && (
                    <div className="flex items-start gap-3">
                      <div className="bg-accent mt-2 rounded-full w-2 h-2"></div>
                      <div>
                        <p className="font-medium text-foreground">
                          Last Updated
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {formatDate(job.j_updated_at)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column - Contact info and actions */}
          <div className="space-y-6">
            {/* Contact information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h2 className="flex items-center gap-2 font-semibold text-card-foreground text-xl">
                  <Building className="w-5 h-5" />
                  Contact Information
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        {job.j_posted_by}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Hiring Manager
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">
                        {job.j_posted_by_number}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Phone Number
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action buttons */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleApplyJob}
                    disabled={isApplying}
                  >
                    {isApplying ? "Applying..." : "Apply here!"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job metadata */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h3 className="font-semibold text-card-foreground">
                  Job Details
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-foreground">{job.j_location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posted:</span>
                    <span className="text-foreground">
                      {getTimeAgo(job.j_created_at)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Job Application Dialog */}
      <JobApplicationDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        jobId={job_id}
        onApplicationSuccess={handleApplicationSuccess}
      />

      {/* Job Application Success Dialog */}
      <JobApplicationSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        jobTitle={job?.j_title}
      />
    </div>
  );
}