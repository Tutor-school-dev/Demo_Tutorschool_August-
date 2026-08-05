import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PDFPageProps {
  params: Promise<{
    filename: string;
  }>;
}

// List of valid PDF filenames
const validPDFs = [
  'gsc-themes-6-8-years.pdf',
  'gsc-themes-9-11-years.pdf', 
  'gsc-themes-12-14-years.pdf',
  'gsc-themes-15-17-years.pdf'
];

export async function generateMetadata({ params }: PDFPageProps): Promise<Metadata> {
  const { filename } = await params;
  
  if (!validPDFs.includes(filename)) {
    return {
      title: 'PDF Not Found | TutorSchool'
    };
  }

  // Get age group from filename for dynamic title
  let ageGroup = '';
  if (filename.includes('6-8')) ageGroup = '6-8 years';
  else if (filename.includes('9-11')) ageGroup = '9-11 years';
  else if (filename.includes('12-14')) ageGroup = '12-14 years';
  else if (filename.includes('15-17')) ageGroup = '15-17 years';

  return {
    title: `Gitopadesh Themes (${ageGroup}) | TutorSchool`,
    description: `Global Sloka Competition themes and guidelines for age group ${ageGroup}`,
    icons: {
      icon: '/tutorschool.jpeg',
      shortcut: '/tutorschool.jpeg',
      apple: '/tutorschool.jpeg',
    },
  };
}

export default async function PDFPage({ params }: PDFPageProps) {
  const { filename } = await params;
  
  // Check if the PDF filename is valid
  if (!validPDFs.includes(filename)) {
    notFound();
  }

  // Serve the PDF content directly with our custom metadata
  return (
    <div className="w-full h-screen">
      <iframe
        src={`/${filename}`}
        className="w-full h-full border-0"
        title={`Gitopadesh Competition Themes`}
      />
    </div>
  );
}