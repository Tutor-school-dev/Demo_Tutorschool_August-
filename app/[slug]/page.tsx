import { Suspense } from "react";
import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import JobListingsContent from "../job-listings/JobListingsContent";
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
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string | string[] }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Only handle job-listings slugs
  if (!resolvedParams.slug.startsWith('job-listings-')) {
    return {
      title: "Page Not Found | TutorSchool",
      description: "The requested page could not be found.",
    };
  }

  // Extract job ID (handle both string and array cases)
  let jobId = resolvedSearchParams.id;
  if (Array.isArray(jobId)) {
    jobId = jobId[0]; // Take the first ID if multiple
  }
  
  if (!jobId) {
    return {
      title: "Job Not Found | TutorSchool",
      description: "The requested tutoring job could not be found.",
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

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string | string[] }>;
}

export default async function SlugPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Extract job ID (handle both string and array cases)
  let jobId = resolvedSearchParams.id;
  if (Array.isArray(jobId)) {
    jobId = jobId[0]; // Take the first ID if multiple
  }
  
  // Only handle job-listings slugs, redirect others to 404
  if (!resolvedParams.slug.startsWith('job-listings-')) {
    notFound();
  }

  // If no job ID, redirect to job listings
  if (!jobId) {
    redirect('/job-listings');
  }

  // Render the same JobListingsContent component
  // It will handle showing the job preview based on the ID parameter
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JobListingsContent />
    </Suspense>
  );
}