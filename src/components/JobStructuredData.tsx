"use client";

import { useEffect } from 'react';

interface JobStructuredDataProps {
  job: {
    j_id: string;
    j_title: string;
    j_desc: string;
    j_posted_by: string;
    j_location: string;
    j_preview: string;
    j_created_at: string;
    j_updated_at: string;
  };
}

export function JobStructuredData({ job }: JobStructuredDataProps) {
  useEffect(() => {
    // Clean HTML from description
    const cleanDescription = job.j_desc?.replace(/<[^>]*>/g, '') || '';
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      "title": job.j_title,
      "description": cleanDescription,
      "identifier": {
        "@type": "PropertyValue",
        "name": "Job ID",
        "value": job.j_id
      },
      "datePosted": job.j_created_at,
      "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      "employmentType": "CONTRACTOR",
      "hiringOrganization": {
        "@type": "Organization",
        "name": "TutorSchool",
        "sameAs": "https://tutorschool.vercel.app"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": job.j_location,
          "addressCountry": "IN"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "INR",
        "value": {
          "@type": "QuantitativeValue",
          "unitText": "HOUR"
        }
      },
      "jobBenefits": [
        "Flexible schedule",
        "Work from home option",
        "Competitive compensation",
        "Professional development"
      ],
      "skills": [
        "Teaching",
        "Education",
        "Tutoring",
        job.j_preview
      ],
      "workHours": "Flexible",
      "educationRequirements": {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "degree"
      },
      "qualifications": "Teaching experience preferred",
      "responsibilities": cleanDescription,
      "industry": "Education",
      "occupationalCategory": "Education, Training, and Library Occupations"
    };

    // Remove existing structured data
    const existingScript = document.querySelector('script[type="application/ld+json"][data-job-posting]');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-job-posting', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[type="application/ld+json"][data-job-posting]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [job]);

  return null; // This component doesn't render anything visible
}