import { Shield, User, History } from "lucide-react";

interface NavbarProps {
  onNavigate?: (page: string) => void;
  activePage?: string;
}

const Navbar = ({ onNavigate, activePage = "home" }: NavbarProps) => (
  <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <button onClick={() => onNavigate?.("home")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <Shield className="w-6 h-6 text-primary" />
        <span className="font-bold text-lg text-foreground">
          DeepFake<span className="text-primary">Guard</span>
        </span>
      </button>
      <div className="flex items-center gap-1 text-sm">
        <NavBtn active={activePage === "home"} onClick={() => onNavigate?.("home")}>
          Home
        </NavBtn>
        <NavBtn active={activePage === "history"} onClick={() => onNavigate?.("history")}>
          <History className="w-4 h-4 mr-1" /> History
        </NavBtn>
        <NavBtn active={activePage === "profile"} onClick={() => onNavigate?.("profile")}>
          <User className="w-4 h-4 mr-1" /> Profile
        </NavBtn>
      </div>
    </div>
  </nav>
);

const NavBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
      active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
    }`}
  >
    {children}
  </button>
);

export default Navbar;
