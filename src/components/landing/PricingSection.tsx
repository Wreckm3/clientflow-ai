import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "KSh 0",
    period: "forever",
    description: "Get started with 5 messages/day",
    features: [
      "5 messages per day",
      "Message generator",
      "Reply analyzer",
      "Smart improve",
      "Basic dashboard",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "KSh 250",
    period: "/month",
    description: "Unlimited messages, all features",
    features: [
      "Unlimited messages",
      "All free features",
      "A/B message variations",
      "Client targeting intelligence",
      "Message history & stats",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you're ready to go all-in on getting clients.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border ${
                plan.highlighted
                  ? "border-primary bg-primary/5 shadow-[var(--shadow-elevated)]"
                  : "border-border bg-card shadow-[var(--shadow-soft)]"
              }`}
            >
              {plan.highlighted && (
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-full mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="mt-2 mb-1">
                <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth?mode=signup">
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                  {plan.cta}
                </Button>
              </Link>
              {plan.highlighted && (
                <Link to="/auth?mode=signup">
                  <Button variant="outline" className="w-full mt-3 gap-2 border-[#4CAF50] text-[#4CAF50] hover:bg-[#4CAF50]/10">
                    <img src="/mpesa-logo.png" alt="M-Pesa" className="w-5 h-5" />
                    Pay with M-Pesa
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          🇰🇪 M-Pesa payments coming soon · Stripe available for international users
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
