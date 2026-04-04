import { Zap } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">ClientFlow AI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} ClientFlow AI. Built for hustlers. 🇰🇪
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
