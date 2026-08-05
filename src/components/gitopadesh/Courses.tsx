import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Star } from "lucide-react";
import Image from "next/image";

const Courses = () => {
  const courses = [
    {
      title: "Bhagavad Gita for Beginners",
      description: "Start your spiritual journey with the foundational teachings of the Gita",
      level: "Beginner",
      duration: "4 weeks",
      rating: 4.8,
      levelColor: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Advanced Sloka Recitation",
      description: "Master the art of perfect pronunciation and delivery of sacred verses",
      level: "Advanced",
      duration: "6 weeks",
      rating: 4.8,
      levelColor: "bg-accent/10 text-accent border-accent/20"
    },
    {
      title: "Understanding Karma Yoga",
      description: "Deep dive into the philosophy of selfless action and duty",
      level: "Intermediate",
      duration: "5 weeks",
      rating: 4.8,
      levelColor: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Meditation & Mindfulness",
      description: "Learn practical meditation techniques from the Bhagavad Gita",
      level: "Beginner",
      duration: "3 weeks",
      rating: 4.8,
      levelColor: "bg-primary/10 text-primary border-primary/20"
    },
    {
      title: "Complete Gita Study",
      description: "Comprehensive analysis of all 18 chapters with expert guidance",
      level: "All Levels",
      duration: "12 weeks",
      rating: 4.8,
      levelColor: "bg-secondary/20 text-pink-700 border-pink-300"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-muted/20">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Explore Our Courses
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Deepen your understanding of the Bhagavad Gita with our expert-led courses
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <Card 
                key={index}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/30 bg-white"
              >
                {/* Course Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src="/gita-course.jpg" 
                    alt={course.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 backdrop-blur-sm bg-white/90 ${course.levelColor}`}>
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-accent text-accent" />
                      <span className="font-semibold text-foreground">{course.rating}</span>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;