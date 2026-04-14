import { MessageSquare, Brain, Target, GitCompare, BarChart3, Sparkles } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const features = [
  {
    icon: MessageSquare,
    title: "Message Generator",
    description: "Generate cold outreach, follow-ups, and variations tailored to your service, audience, and platform.",
  },
  {
    icon: Brain,
    title: "Reply Analyzer",
    description: "Paste a client reply and get AI-powered analysis: what it means, suggested response, and best next action.",
  },
  {
    icon: Target,
    title: "Client Targeting",
    description: "Input your service, and AI suggests where to find clients, their pain points, and the best messaging angle.",
  },
  {
    icon: GitCompare,
    title: "A/B Variations",
    description: "Generate Safe, Bold, and Aggressive message variants. Test which style converts best for your niche.",
  },
  {
    icon: Sparkles,
    title: "Smart Improve",
    description: "One-click buttons to make messages shorter, more persuasive, or more sales-focused instantly.",
  },
  {
    icon: BarChart3,
    title: "Usage Dashboard",
    description: "Track your message history, daily usage, and stats — all in a clean, simple dashboard.",
  },
];

const FeaturesSection = () => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal(0.1);

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto">
        <div ref={headerRef} className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Land Clients
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            From generating the perfect outreach to analyzing replies — ClientFlow AI has you covered.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-reveal scroll-reveal-stagger">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="scroll-reveal-child group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-card)] hover-lift"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
