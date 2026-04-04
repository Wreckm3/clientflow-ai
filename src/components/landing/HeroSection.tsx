import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, TrendingUp, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-subtle">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-up">
          <Zap className="w-4 h-4" />
          AI-powered client outreach
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          Get More Clients{" "}
          <span className="text-gradient-primary">Without Overthinking</span>{" "}
          Your Messages
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          Generate, improve, and reply to client messages using AI — in seconds.
          Built for freelancers and small businesses in Africa.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <Link to="/auth?mode=signup">
            <Button size="lg" className="text-base px-8 h-12 gap-2">
              Start Getting Clients <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">Free plan · 5 messages/day · No credit card</p>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 pt-8 border-t border-border animate-fade-up" style={{ animationDelay: "0.4s" }}>
          {[
            { icon: MessageSquare, label: "Messages Generated", value: "50K+" },
            { icon: TrendingUp, label: "Response Rate", value: "3x Higher" },
            { icon: Zap, label: "Time Saved", value: "10hrs/week" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
