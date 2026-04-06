import { Shield } from "lucide-react";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        <span className="font-bold text-lg text-foreground">
          DeepFake<span className="text-primary">Guard</span>
        </span>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <a href="#features" className="hover:text-primary transition-colors">Features</a>
        <a href="#detect" className="hover:text-primary transition-colors">Detect</a>
      </div>
    </div>
  </nav>
);

export default Navbar;
