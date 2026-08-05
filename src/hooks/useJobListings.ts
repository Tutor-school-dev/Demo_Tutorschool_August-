"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { getApiUrl } from '@/lib/utils';

export interface Job {
  j_id: string;
  j_title: string;
  j_desc: string;
  j_posted_by: string;
  j_posted_by_number: string;
  j_location: string;
  j_preview: string;
  j_active: boolean;
  j_created_at: string;
  j_updated_at: string;
}

export function useJobListings() {
  const [jobsData, setJobsData] = useState<Job[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiUrl = getApiUrl();
      const response = await axios.get(`${apiUrl}/admin/pub/jobs`);
      const activeJobs = response.data?.filter((job: Job) => job.j_active === true);
      setJobsData(activeJobs || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError(err as Error);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return { jobsData, loading, error, refetch: fetchJobs };
}