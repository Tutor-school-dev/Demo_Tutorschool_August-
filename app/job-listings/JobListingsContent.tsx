"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, User, Phone, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SocialShare } from "@/components/SocialShare";
import { BarLoader } from 'react-spinners';
import { JobPreview } from "@/components/JobPreview";
import { useJobListings } from "@/hooks/useJobListings";
import { generateJobSlug, extractJobIdFromUrl } from "@/lib/seoUtils";

export default function JobListingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const job_id = extractJobIdFromUrl(searchParams);

  const { jobsData, loading, error } = useJobListings();

  // Get unique locations for filter dropdown
  const uniqueLocations = useMemo(() => {
    const locations = jobsData?.map((job) => job.j_location) || [];
    return Array.from(new Set(locations)).sort();
  }, [jobsData]);

  // Filter and search jobs
  const filteredJobs = useMemo(() => {
    return jobsData?.filter((job) => {
      const matchesSearch =
        searchTerm === "" ||
        job.j_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.j_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.j_preview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.j_posted_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.j_posted_by_number.includes(searchTerm);

      const matchesLocation = locationFilter === "" || locationFilter === "all" || job.j_location === locationFilter;

      const matchesDate =
        dateFilter === "" ||
        dateFilter === "all" ||
        (() => {
          const jobDate = new Date(job.j_created_at);
          const now = new Date();
          const daysDiff = Math.floor((now.getTime() - jobDate.getTime()) / (1000 * 60 * 60 * 24));

          if (dateFilter === "last7days") {
            return daysDiff <= 7;
          } else if (dateFilter === "lastmonth") {
            return daysDiff <= 30;
          }
          return true;
        })();

      return matchesSearch && matchesLocation && matchesDate;
    }) || [];
  }, [searchTerm, locationFilter, dateFilter, jobsData]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, locationFilter, dateFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const handleJobClick = (jobId: string) => {
    const job = jobsData?.find(j => j.j_id === jobId);
    if (!job) return;
    
    const slug = generateJobSlug(job);
    const url = `/${slug}?id=${jobId}`;
    
    // Create clean URL with just the job ID
    router.push(url);
  };

  const handleBackToList = () => {
    router.push('/job-listings');
  };

  if (error) {
    return (
      <main className="bg-background min-h-screen">
        <div className="mx-auto px-4 py-8 container">
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <h3 className="mb-2 font-semibold text-card-foreground text-lg">Error loading jobs</h3>
              <p className="text-muted-foreground">Please try again later.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {job_id ? (
        <JobPreview job_id={job_id} jobsData={jobsData} onBack={handleBackToList} />
      ) : (
        <div className="mx-auto px-4 py-8 container">
          <div className="mb-8">
            <h1 className="mb-2 font-bold text-foreground text-4xl text-balance">Find Your Next Opportunity</h1>
            <p className="text-muted-foreground text-lg">Discover amazing job opportunities from top companies</p>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <BarLoader color="#36d7b7" width={150} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search and Filters */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-muted-foreground" />
                    <h2 className="font-semibold text-card-foreground text-lg">Search & Filter Jobs</h2>
                  </div>
                  <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                    <div className="relative">
                      <Search className="top-1/2 left-3 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                      <Input
                        placeholder="Search jobs, location, company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-input pl-10 border-border text-foreground placeholder:text-muted-foreground"
                      />
                    </div>

                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Filter by location" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location} className="text-popover-foreground">
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="last7days">Created (Last 7 days)</SelectItem>
                        <SelectItem value="lastmonth">Created (Last month)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
              </Card>

              {/* Results Summary */}
              <div className="flex justify-between items-center">
                <p className="text-muted-foreground">
                  Showing {paginatedJobs.length} of {filteredJobs.length} jobs
                </p>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  Page {currentPage} of {totalPages}
                </Badge>
              </div>

              {/* Job Cards */}
              <div className="gap-4 grid">
                {paginatedJobs.map((job) => (
                  <Card
                    key={job.j_id}
                    onClick={() => handleJobClick(job.j_id)}
                    className="bg-card hover:bg-blue-50 shadow-md p-4 border-border rounded-xl transition-colors hover:cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex md:flex-row flex-col md:justify-between md:items-start gap-6">
                        <div className="flex-1">
                          <h3 className="mb-3 font-bold text-card-foreground text-2xl leading-tight">
                            {job.j_title}
                          </h3>

                          <p className="mb-4 text-muted-foreground text-base leading-relaxed">
                            {stripHtml(job.j_desc)}
                          </p>

                          <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              <span>{job.j_location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4" />
                              <span>{job.j_posted_by}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{job.j_posted_by_number}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <Badge className="bg-primary shadow px-3 py-1 rounded-lg text-primary-foreground text-sm">
                            {job.j_preview}
                          </Badge>
                          <div className="space-y-1 text-muted-foreground text-xs text-right">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Created: {formatDate(job.j_created_at)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Updated: {formatDate(job.j_updated_at)}
                            </div>
                          </div>
                          <div className="mt-4">
                            <SocialShare 
                              job={job}
                              title={`${job.j_title} in ${job.j_location}`}
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-secondary hover:bg-accent border-border text-secondary-foreground"
                  >
                    <ChevronLeft className="mr-1 w-4 h-4" />
                    Previous
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      if (pageNum > totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={
                            currentPage === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary border-border text-secondary-foreground hover:bg-accent"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="bg-secondary hover:bg-accent border-border text-secondary-foreground"
                  >
                    Next
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* No Results */}
              {filteredJobs.length === 0 && (
                <Card className="bg-card border-border">
                  <CardContent className="py-12 text-center">
                    <Search className="mx-auto mb-4 w-12 h-12 text-muted-foreground" />
                    <h3 className="mb-2 font-semibold text-card-foreground text-lg">No jobs found</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria or filters to find more results.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}