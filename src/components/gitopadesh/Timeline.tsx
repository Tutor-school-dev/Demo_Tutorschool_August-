import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const Timeline = () => {
  const events = [
    { date: "28 September 2025", event: "Competition Launch" },
    { date: "15 November 2025", event: "Last Date for Submission" },
    { date: "30 November 2025", event: "Regional Shortlisting" },
    { date: "06 December 2025", event: "Global Results" },
    { date: "December 2025", event: "Award Ceremony at Kanha Shantivanam" }
  ];

  return (
    <section id="timeline" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Competition Timeline
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Mark your calendar for these important dates
          </p>

          <div className="space-y-6">
            {events.map((item, index) => (
              <Card 
                key={index}
                className="p-6 bg-gradient-to-r from-secondary/5 to-white border-l-4 border-primary hover:shadow-lg transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-primary font-bold text-lg mb-1">
                      📅 {item.date}
                    </div>
                    <div className="text-foreground font-medium text-xl">
                      {item.event}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Decorative feather */}
          <div className="text-center mt-12 text-5xl">🪶</div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;