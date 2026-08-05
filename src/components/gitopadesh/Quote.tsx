const Quote = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
      <div className="container mx-auto px-4 text-center">
        <blockquote className="text-2xl md:text-3xl font-bold text-foreground mb-4 italic">
          "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन"
        </blockquote>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          You have the right to perform your actions, but you are not entitled to the fruits of the actions.
        </p>
        <cite className="block mt-4 text-sm text-muted-foreground">
          - Bhagavad Gita 2.47
        </cite>
      </div>
    </section>
  );
};

export default Quote;