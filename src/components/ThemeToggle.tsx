import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { getTheme, setTheme, type Theme } from "@/lib/theme";

const ThemeToggle = () => {
  const [current, setCurrent] = useState<Theme>(getTheme());

  useEffect(() => {
    setTheme(current);
  }, [current]);

  const toggle = () => {
    const next = current === "dark" ? "light" : "dark";
    setCurrent(next);
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors text-muted-foreground hover:text-primary hover:bg-primary/5"
      aria-label="Toggle theme"
    >
      {current === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
