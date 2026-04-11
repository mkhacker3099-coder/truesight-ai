import { Shield, User, History, LogOut, Home, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  onNavigate?: (page: string) => void;
  activePage?: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ onNavigate, activePage = "home", isLoggedIn, onLogout }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "home", icon: Home, label: "Detect" },
    { id: "history", icon: History, label: "History" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => onNavigate?.("dashboard")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Shield className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg text-foreground font-display">
            Vox<span className="text-primary">Verify</span>
          </span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          {isLoggedIn && navItems.map((item) => (
            <NavBtn key={item.id} active={activePage === item.id} onClick={() => onNavigate?.(item.id)}>
              <item.icon className="w-4 h-4 mr-1" /> {item.label}
            </NavBtn>
          ))}
          <ThemeToggle />
          {isLoggedIn && onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </button>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          {isLoggedIn && (
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-foreground">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && isLoggedIn && (
        <div className="md:hidden glass-strong border-t border-border/30 px-4 py-3 space-y-1" style={{ animation: 'slideUp 0.3s ease-out' }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate?.(item.id); setMobileOpen(false); }}
              className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activePage === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
          {onLogout && (
            <button
              onClick={() => { onLogout(); setMobileOpen(false); }}
              className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

const NavBtn = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 py-2 rounded-lg transition-all ${
      active ? "bg-primary/10 text-primary glow-primary" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
    }`}
  >
    {children}
  </button>
);

export default Navbar;