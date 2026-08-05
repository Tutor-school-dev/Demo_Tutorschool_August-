import { Job } from "@/hooks/useJobListings";

/**
 * Generates an SEO-friendly slug from job data
 * Example: "job-listings-Math-Tutor-Class-12-CBSE-Delhi-110001"
 */
export function generateJobSlug(job: Job): string {
  const cleanText = (text: string) => {
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters except spaces
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
      .slice(0, 100); // Limit length
  };

  const titleSlug = cleanText(job.j_title);
  const locationSlug = cleanText(job.j_location);
  const previewSlug = cleanText(job.j_preview);

  // Combine parts with meaningful separators
  const parts = [
    'job-listings',
    titleSlug,
    previewSlug,
    locationSlug
  ].filter(part => part && part.length > 0);

  return parts.join('-');
}

/**
 * Generates the complete SEO-friendly URL for a job
 */
export function generateJobUrl(job: Job, baseUrl?: string): string {
  const domain = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://tutorschool.vercel.app');
  const slug = generateJobSlug(job);
  return `${domain}/${slug}?id=${job.j_id}`;
}

/**
 * Extracts job ID from URL parameters
 */
export function extractJobIdFromUrl(searchParams: URLSearchParams): string | null {
  return searchParams.get('id');
}

/**
 * Creates a job-specific page title for SEO
 */
export function generateJobPageTitle(job: Job): string {
  const cleanTitle = job.j_title.replace(/<[^>]*>/g, '');
  return `${cleanTitle} - ${job.j_location} | TutorSchool`;
}

/**
 * Creates a job-specific meta description for SEO
 */
export function generateJobMetaDescription(job: Job): string {
  const cleanDesc = job.j_desc?.replace(/<[^>]*>/g, '') || '';
  const truncatedDesc = cleanDesc.length > 120 
    ? cleanDesc.substring(0, 117) + '...' 
    : cleanDesc;
  
  return `${truncatedDesc} Apply for this ${job.j_preview} tutoring position in ${job.j_location}. Posted by ${job.j_posted_by}.`;
}