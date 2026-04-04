const examples = [
  {
    before: "Hi, I do graphic design. Do you need any design work done? Let me know.",
    after: "Hey! I noticed your brand has amazing products but your social media graphics aren't doing them justice. I help businesses like yours create scroll-stopping designs that drive sales. Want me to show you a quick before/after mock-up? No charge 🎨",
    service: "Graphic Designer",
  },
  {
    before: "Hello, I'm a video editor. I can edit your videos. DM me if interested.",
    after: "Your last Reel had great content but the pacing lost viewers at 0:03. I specialize in editing short-form videos that keep people watching till the end — which means more reach and more clients for you. Can I send you a free re-edit sample?",
    service: "Video Editor",
  },
];

const ExamplesSection = () => {
  return (
    <section id="examples" className="py-20 px-4 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Proof</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Real Message Examples That Get Replies
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            See how AI transforms generic messages into high-converting outreach.
          </p>
        </div>

        <div className="space-y-8 max-w-3xl mx-auto">
          {examples.map((ex) => (
            <div key={ex.service} className="bg-card rounded-2xl border border-border overflow-hidden shadow-[var(--shadow-soft)]">
              <div className="px-6 py-3 bg-muted border-b border-border">
                <span className="text-sm font-medium text-muted-foreground">{ex.service}</span>
              </div>
              <div className="grid md:grid-cols-2">
                <div className="p-6 border-r border-border">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-destructive/10 text-destructive rounded mb-3">Before</span>
                  <p className="text-sm text-muted-foreground leading-relaxed">{ex.before}</p>
                </div>
                <div className="p-6">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded mb-3">After — AI Generated</span>
                  <p className="text-sm text-foreground leading-relaxed">{ex.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;
