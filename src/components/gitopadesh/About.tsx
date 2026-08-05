import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-foreground">
            Gitopadesh Global Sloka Competition
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-16">
            Inspired by the timeless wisdom of the Bhagavad Gita
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 text-center bg-gradient-to-br from-white to-secondary/10 border-2 border-secondary/20 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold mb-3 text-foreground">For Ages 6-17</h3>
              <p className="text-muted-foreground">
                Open to School-going Students Worldwide.<br />
                <span className="text-sm">(Individual and School Group)</span>
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold mb-3 text-foreground">3-Minute Video</h3>
              <p className="text-muted-foreground">
                Submit a short video reciting and explaining a sloka
              </p>
            </Card>

            <Card className="p-8 text-center bg-gradient-to-br from-white to-accent/5 border-2 border-accent/20 hover:shadow-lg transition-all">
              <h3 className="text-xl font-bold mb-3 text-foreground">Exciting Prizes</h3>
              <p className="text-muted-foreground">
                Rolling Trophy, Certificates & medals will be given to all winners and runners-up
              </p>
            </Card>
          </div>

          {/* Details Section */}
          <div id="guidelines" className="space-y-12 pt-8">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-foreground">
              About the Competition
            </h3>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 hover:border-blue-300 transition-all">
                <h4 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                  <span className="text-3xl mr-3">📘</span>
                  Objective
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  To inspire children globally to connect with the timeless wisdom of the Bhagavad Gita by learning, reciting, and reflecting on selected shlokas through a structured and inspiring Global Competition.
                </p>
              </Card>

              <Card className="p-8 bg-gradient-to-br from-amber-50 to-white border-2 border-amber-200 hover:border-amber-300 transition-all">
                <h4 className="text-2xl font-semibold mb-4 text-foreground flex items-center">
                  <span className="text-3xl mr-3">🎓</span>
                  Eligibility
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Open to school-going children aged 6 to 17 years. Participants can enter individually or as part of a school team.
                </p>
              </Card>
            </div>

            {/* How to Participate */}
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200">
              <h4 className="text-2xl font-semibold mb-6 text-foreground flex items-center">
                <span className="text-3xl mr-3">💡</span>
                How to Participate
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-700">1</span>
                  </div>
                  <p className="text-muted-foreground pt-2">Choose a theme from your age category's module</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-700">2</span>
                  </div>
                  <p className="text-muted-foreground pt-2">Prepare a 3-minute video with sloka recitation and explanation</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-700">3</span>
                  </div>
                  <p className="text-muted-foreground pt-2">Upload your video through the competition portal</p>
                </div>
              </div>
            </Card>

            {/* Categories */}
            <Card className="p-8 bg-gradient-to-br from-green-50 to-white border-2 border-green-200">
              <h4 className="text-2xl font-semibold mb-6 text-foreground flex items-center">
                <span className="text-3xl mr-3">👥</span>
                Categories
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="px-3 py-1 bg-green-200 rounded-md text-sm font-semibold text-green-800">06-08 years</div>
                  <div>
                    <p className="font-medium">Category 1 • Module 1: Themes 01-05</p>
                    <a href="/pdf/gsc-themes-6-8-years.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Click here</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="px-3 py-1 bg-green-200 rounded-md text-sm font-semibold text-green-800">09-11 years</div>
                  <div>
                    <p className="font-medium">Category 2 • Module 2: Themes 06-10</p>
                    <a href="/pdf/gsc-themes-9-11-years.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Click here</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="px-3 py-1 bg-green-200 rounded-md text-sm font-semibold text-green-800">12-14 years</div>
                  <div>
                    <p className="font-medium">Category 3 • Module 3: Themes 11-15</p>
                    <a href="/pdf/gsc-themes-12-14-years.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Click here</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="px-3 py-1 bg-green-200 rounded-md text-sm font-semibold text-green-800">15-17 years</div>
                  <div>
                    <p className="font-medium">Category 4 • Module 4: Themes 16-20</p>
                    <a href="/pdf/gsc-themes-15-17-years.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">Click here</a>
                  </div>
                </div>
              </div>
            </Card>

            {/* Assessment Criteria */}
            <Card className="p-8 bg-gradient-to-br from-indigo-50 to-white border-2 border-indigo-200">
              <h4 className="text-2xl font-semibold mb-6 text-foreground flex items-center">
                <span className="text-3xl mr-3">🏆</span>
                Assessment Criteria (100 Points)
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-muted-foreground">Pronunciation & Clarity in Recitation</span>
                  <span className="px-3 py-1 bg-indigo-200 rounded-md text-sm font-semibold text-indigo-800">25 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-muted-foreground">Understanding of Meaning</span>
                  <span className="px-3 py-1 bg-indigo-200 rounded-md text-sm font-semibold text-indigo-800">25 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-muted-foreground">Clarity of Explanation</span>
                  <span className="px-3 py-1 bg-indigo-200 rounded-md text-sm font-semibold text-indigo-800">25 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-muted-foreground">Connection to Theme & Relevance</span>
                  <span className="px-3 py-1 bg-indigo-200 rounded-md text-sm font-semibold text-indigo-800">15 Points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                  <span className="text-muted-foreground">Presentation Skills</span>
                  <span className="px-3 py-1 bg-indigo-200 rounded-md text-sm font-semibold text-indigo-800">10 Points</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;