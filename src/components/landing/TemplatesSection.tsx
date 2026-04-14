import { Badge } from "@/components/ui/badge";
import { MessageSquare, Instagram, Linkedin, Mail } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const templates = [
  {
    platform: "WhatsApp",
    icon: MessageSquare,
    category: "Cold Outreach",
    title: "Service Introduction",
    preview: "Hey [Name]! 👋 I came across your brand and love what you're building. I help businesses like yours with [service] that actually drives results. Want me to show you what I mean? No strings attached.",
    tone: "Casual",
  },
  {
    platform: "Instagram",
    icon: Instagram,
    category: "Follow-up",
    title: "Gentle Nudge",
    preview: "Hi [Name], just circling back on my last message! I noticed you recently posted about [topic] — I have some ideas that could really level up your [area]. Mind if I share a quick mock-up?",
    tone: "Persuasive",
  },
  {
    platform: "LinkedIn",
    icon: Linkedin,
    category: "Cold Outreach",
    title: "Professional Intro",
    preview: "Hi [Name], I noticed [Company] is scaling fast — congrats! I specialize in helping companies at your stage with [service]. Would love to share how I helped [similar company] achieve [result]. Open to a quick chat?",
    tone: "Professional",
  },
  {
    platform: "Email",
    icon: Mail,
    category: "A/B Bold",
    title: "Direct Pitch",
    preview: "Subject: Your [area] is costing you clients\n\nHi [Name], I reviewed your [area] and spotted 3 things that could be turning away potential customers. I fixed similar issues for [client] and they saw a 40% increase in [metric]. Want the breakdown?",
    tone: "Bold",
  },
  {
    platform: "WhatsApp",
    icon: MessageSquare,
    category: "Kenyan Vibe 🇰🇪",
    title: "Local & Relatable",
    preview: "Niaje [Name]! 🙌 I've been checking out your page and you're doing amazing things. I think I can help you get even more clients with better [service]. Let me show you a free sample — no pressure, just vibes. 🔥",
    tone: "Kenyan 🇰🇪",
  },
  {
    platform: "Instagram",
    icon: Instagram,
    category: "Follow-up",
    title: "Value Drop",
    preview: "Hey [Name]! I put together a quick [deliverable] for your brand — totally free, no catch. I think it could boost your engagement by [metric]. Want me to send it over? 🎨",
    tone: "Casual",
  },
];

const toneColors: Record<string, string> = {
  Casual: "bg-primary/10 text-primary",
  Persuasive: "bg-accent/10 text-accent",
  Professional: "bg-muted text-muted-foreground",
  Bold: "bg-destructive/10 text-destructive",
  "Kenyan 🇰🇪": "bg-primary/10 text-primary",
};

const TemplatesSection = () => {
  const headerRef = useScrollReveal();
  const gridRef = useScrollReveal(0.05);

  return (
    <section id="templates" className="py-20 px-4">
      <div className="container mx-auto">
        <div ref={headerRef} className="text-center mb-16 scroll-reveal">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Templates</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready-to-Use Message Templates
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start with proven templates, then customize with AI. Copy, tweak, and send in seconds.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto scroll-reveal scroll-reveal-stagger">
          {templates.map((tmpl, i) => (
            <div
              key={i}
              className="scroll-reveal-child group bg-card rounded-2xl border border-border p-5 hover:border-primary/30 hover:shadow-[var(--shadow-card)] transition-all duration-300 flex flex-col hover-lift"
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <tmpl.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{tmpl.platform}</span>
                </div>
                <Badge variant="outline" className="text-[10px]">{tmpl.category}</Badge>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-foreground mb-2">{tmpl.title}</h3>

              {/* Preview */}
              <p className="text-xs text-muted-foreground leading-relaxed flex-1 whitespace-pre-line">
                {tmpl.preview}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className={`text-[10px] font-medium px-2 py-1 rounded-full ${toneColors[tmpl.tone] || "bg-muted text-muted-foreground"}`}>
                  {tmpl.tone}
                </span>
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  Click "Start Free" to customize →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
