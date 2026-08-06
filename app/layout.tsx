import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from '@/components/providers/query-client-provider';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { GoogleAuthProvider } from "@/components/providers/GoogleAuthProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_GO_APP_URL || 'https://tutorschool.vercel.app'),
  title: "TutorSchool - India's #1 Verified Home & Online Tutor Matching",
  description: "Match with verified home & online tutors for CBSE, ICSE & State boards — Class 1 to 12. Free trial class, no advance payment. Get matched in 24 hours.",
  keywords: ["home tutor", "online tutor", "CBSE tutor", "ICSE tutor", "tutor near me", "tuition classes", "private tutor India"],
  authors: [{ name: "TutorSchool" }],
  icons: {
    icon: [
      {
        url: "/tutorschool-logo.jpg",
        sizes: "any",
      },
      {
        url: "/tutorschool-logo.jpg",
        sizes: "32x32",
        type: "image/jpeg",
      },
    ],
    apple: [
      {
        url: "/tutorschool-logo.jpg",
        sizes: "180x180",
        type: "image/jpeg",
      },
    ],
  },
  openGraph: {
    title: "TutorSchool - India's #1 Verified Home & Online Tutor Matching",
    description: "Match with verified home & online tutors for CBSE, ICSE & State boards. Free trial class, no advance payment. Get matched in 24 hours.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/tutorschool-logo.jpg",
        width: 1200,
        height: 630,
        alt: "TutorSchool - India's #1 verified tutor matching platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TutorSchool - India's #1 Verified Home & Online Tutor Matching",
    description: "Match with verified home & online tutors for CBSE, ICSE & State boards. Free trial class, no advance payment. Get matched in 24 hours.",
    images: ["/tutorschool-logo.jpg"],
  },
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PH72P4VJ');`
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-PH72P4VJ"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
          disableTransitionOnChange
        >
          <GoogleAuthProvider>
            <QueryClientProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {children}
              </TooltipProvider>
            </QueryClientProvider>
          </GoogleAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}