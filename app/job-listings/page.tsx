import { Suspense } from "react";
import { Metadata } from "next";
import JobListingsContent from "./JobListingsContent";
import { getApiUrl } from "@/lib/utils";

// Function to fetch job data for metadata (server-side)
async function getJobData(jobId: string) {
  try {
    const apiUrl = getApiUrl();
    const response = await fetch(`${apiUrl}/admin/pub/jobs`, {
      cache: 'no-store', // Always fetch fresh data for SEO
    });
    
    if (!response.ok) return null;
    
    const jobs = await response.json();
    const job = jobs.find((j: any) => j.j_id === jobId);
    return job;
  } catch (error) {
    console.error('Failed to fetch job for metadata:', error);
    return null;
  }
}

// Generate dynamic metadata based on job ID
export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<{ id?: string }> 
}): Promise<Metadata> {
  const params = await searchParams;
  const jobId = params.id;
  
  if (!jobId) {
    return {
      title: "Tutoring Jobs - Find Teaching Opportunities | TutorSchool",
      description: "Browse available tutoring positions and teaching jobs. Join our platform to find students and start your tutoring career with flexible schedules and competitive pay.",
      keywords: ["tutoring jobs", "teaching positions", "tutor opportunities", "education jobs", "online tutoring", "home tutoring"],
      openGraph: {
        title: "Tutoring Jobs - Find Teaching Opportunities",
        description: "Browse available tutoring positions and teaching jobs. Join our platform to find students and start your tutoring career.",
        type: "website",
        siteName: "TutorSchool",
      },
      twitter: {
        card: "summary_large_image",
        title: "Tutoring Jobs - Find Teaching Opportunities",
        description: "Browse available tutoring positions and teaching jobs. Join our platform to find students and start your tutoring career.",
      }
    };
  }

  const job = await getJobData(jobId);
  
  if (!job) {
    return {
      title: "Job Not Found | TutorSchool",
      description: "The requested tutoring job could not be found. Browse other available positions.",
    };
  }

  // Clean HTML from description for meta
  const cleanDescription = job.j_desc?.replace(/<[^>]*>/g, '') || '';
  const truncatedDesc = cleanDescription.length > 160 
    ? cleanDescription.substring(0, 157) + '...' 
    : cleanDescription;

  return {
    title: `${job.j_title} - Tutoring Job in ${job.j_location} | TutorSchool`,
    description: `${truncatedDesc} Apply now for this tutoring position posted by ${job.j_posted_by}. Flexible schedules and competitive compensation.`,
    keywords: [
      "tutoring job",
      job.j_location,
      job.j_title,
      "teaching opportunity",
      "tutor position",
      job.j_preview
    ],
    openGraph: {
      title: `${job.j_title} - Tutoring Job in ${job.j_location}`,
      description: truncatedDesc,
      type: "article",
      siteName: "TutorSchool",
      publishedTime: job.j_created_at,
      modifiedTime: job.j_updated_at,
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.j_title} - Tutoring Job in ${job.j_location}`,
      description: truncatedDesc,
    }
  };
}

function JobListingsPageContent() {
  return <JobListingsContent />;
}

export default function JobListingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobListingsPageContent />
    </Suspense>
  );
}