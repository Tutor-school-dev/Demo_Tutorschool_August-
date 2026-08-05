import { Card } from "@/components/ui/card";
import Image from "next/image";

const Prizes = () => {
  return (
    <section id="prizes" className="py-20 bg-gradient-to-b from-muted/30 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Exciting Prizes
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-8 max-w-3xl mx-auto">
            Rolling Trophy, Certificates & medals will be given to all winners and runners-up in addition to prizes
          </p>

          {/* Trophy Image */}
          <div className="flex justify-center mb-12">
            <Image 
              src="/trophy.png" 
              alt="Competition Trophy - Awarded to Winners and Runners-up" 
              width={256}
              height={256}
              className="w-64 h-64 object-contain drop-shadow-2xl animate-scale-in"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-white border-2 border-accent/20 hover:border-accent/40 hover:shadow-xl transition-all group">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-accent transition-colors">
                Rolling Trophies
              </h3>
              <p className="text-muted-foreground">
                For outstanding performances
              </p>
            </Card>

            <Card className="p-8 text-center bg-white border-2 border-primary/20 hover:border-primary/40 hover:shadow-xl transition-all group">
              <div className="text-5xl mb-4">📜</div>
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                Certificates
              </h3>
              <p className="text-muted-foreground">
                Recognition for all participants
              </p>
            </Card>

            <Card className="p-8 text-center bg-white border-2 border-secondary/30 hover:border-secondary/50 hover:shadow-xl transition-all group">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-pink-600 transition-colors">
                Attractive Prizes
              </h3>
              <p className="text-muted-foreground">
                Gifts and rewards for participants
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Prizes;