import { Metadata } from 'next';
import GitopadeshLanding from "@/components/gitopadesh/GitopadeshLanding";

export const metadata: Metadata = {
  title: "Bhagavad Gita Sloka Competition 2025 | TutorSchool",
  description: "Join the Bhagavad Gita Sloka Competition by TutorSchool! Showcase your child's talent in reciting shlokas and win exciting prizes. Register today!",
  openGraph: {
    title: "Bhagavad Gita Sloka Competition 2025 | TutorSchool",
    description: "Join the Bhagavad Gita Sloka Competition by TutorSchool! Showcase your child's talent in reciting shlokas and win exciting prizes. Register today!",
    type: "website",
    url: "https://tutorschool.in/gsc",
    siteName: "TutorSchool",
    images: [
      {
        url: "/gitopadesh.png",
        width: 1200,
        height: 630,
        alt: "Bhagavad Gita Sloka Competition 2025 - TutorSchool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhagavad Gita Sloka Competition 2025 | TutorSchool",
    description: "Join the Bhagavad Gita Sloka Competition by TutorSchool! Showcase your child's talent in reciting shlokas and win exciting prizes. Register today!",
    images: ["/gitopadesh.png"],
  },
  keywords: [
    "Bhagavad Gita",
    "Sloka Competition",
    "Sanskrit",
    "Spiritual Education",
    "TutorSchool",
    "Competition 2025",
    "Hindu Philosophy",
    "Gita Recitation"
  ],
  robots: {
    index: true,
    follow: true,
  },
};

export default function GitopadeshPage() {
  return <GitopadeshLanding />;
}
