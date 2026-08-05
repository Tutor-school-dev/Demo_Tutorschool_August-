"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Link } from "lucide-react";
import { toast } from "sonner";
import { Job } from "@/hooks/useJobListings";
import { generateJobUrl } from "@/lib/seoUtils";

interface SocialShareProps {
  job: Job;
  url?: string;
  title?: string;
  className?: string;
}

export function SocialShare({ job, url, title = "Check out this tutoring opportunity!", className }: SocialShareProps) {
  const getJobUrl = () => {
    return generateJobUrl(job);
  };
  
  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const jobUrl = getJobUrl();
    
    // Create engaging WhatsApp message
    const shareText = `🎓 *Tutoring Opportunity Alert!*

📝 *Position:* ${title}
💼 *Posted by:* Professional Educator
🎯 *Type:* ${title.includes('Online') ? 'Online Teaching' : 'Home/In-Person Tutoring'}

✨ *Why Apply?*
• Flexible schedule
• Competitive compensation
• Make a real impact on student's life
• Join our trusted educator network

� *Apply Now:* ${jobUrl}

#TutoringJobs #Teaching #Education #FlexibleWork

_Share this opportunity with fellow educators! 🤝_`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const jobUrl = getJobUrl();
    navigator.clipboard
      .writeText(jobUrl)
      .then(() => toast.success("Job URL copied to clipboard! 📋"));
  };

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
      <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleWhatsAppShare}
          className="flex sm:flex-initial flex-1 justify-center sm:justify-start items-center gap-2 bg-transparent hover:bg-green-50 dark:hover:bg-green-950 min-w-0 text-green-600 hover:text-green-700"
        >
          <MessageCircle className="flex-shrink-0 w-4 h-4" />
          <span className="hidden xs:inline sm:inline">WhatsApp</span>
          <span className="xs:hidden sm:hidden">W</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex sm:flex-initial flex-1 justify-center sm:justify-start items-center gap-2 bg-transparent min-w-0"
        >
          <Link className="flex-shrink-0 w-4 h-4" />
          <span className="hidden xs:inline sm:inline">Copy Link</span>
          <span className="xs:hidden sm:hidden">Copy</span>
        </Button>
      </div>
    </div>
  );
}