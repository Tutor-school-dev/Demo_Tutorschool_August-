const logos = [
  { name: "Startup India Hub", src: "/logos/startup-india-hub.png" },
  { name: "Zoho for Startups", src: "/logos/zoho-for-startups.png" },
  { name: "Startup Bihar", src: "/logos/startup-bihar.png" },
  { name: "Brighter Minds", src: "/logos/brighter-minds.webp" },
  { name: "Gitopadesh", src: "/logos/gitopadesh.png" },
  { name: "Heartfulness", src: "/logos/het.png" },
  { name: "CIMP-BIF", src: "/logos/cimp-biif.jpg" },
  { name: "B.Hub", src: "/logos/bhub.jpg" },
  { name: "AWS for Startups", src: "/logos/aws-for-startups.png" },
];

export default function TrustedBy() {
  const items = [...logos, ...logos];

  return (
    <section className="py-8 bg-emerald-50/50 border-y border-emerald-100/50 overflow-hidden">
      <div className="flex items-center gap-10 max-w-7xl mx-auto px-6 lg:px-10">
        <span className="text-slate-500 text-sm font-medium whitespace-nowrap shrink-0">
          Trusted by
        </span>
        <div className="relative overflow-hidden flex-1">
          <div className="flex animate-scroll-logos gap-14 items-center">
            {items.map((logo, i) => (
              <img
                key={`${logo.name}-${i}`}
                src={logo.src}
                alt={logo.name}
                className="h-10 sm:h-12 w-auto object-contain shrink-0 contrast-125 brightness-90"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
