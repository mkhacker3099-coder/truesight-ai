import { useState } from "react";
import { Shield, LogIn, UserPlus, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { login, type AuthUser } from "@/lib/auth";
import { saveProfile } from "@/lib/profile";
import Scene3D from "./Scene3D";

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    if (isSignup && !name) { setError("Please enter your name"); return; }
    const user: AuthUser = { name: isSignup ? name : email.split("@")[0], email };
    login(user);
    saveProfile({ name: user.name, email: user.email, avatar: "" });
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <Scene3D />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-background/70 to-background pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Fingerprint className="w-14 h-14 text-primary mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 15px hsl(190 100% 50% / 0.5))' }} />
          </motion.div>
          <h1 className="text-4xl font-black text-foreground font-display">
            Vox<span className="text-primary text-glow">Verify</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignup ? "Create your secure account" : "Sign in to your command center"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="bg-muted/50 border-border/50" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-muted/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-muted/50 border-border/50" />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full magnetic-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display">
            {isSignup ? <UserPlus className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
            {isSignup ? "Create Account" : "Sign In"}
          </Button>

          <div className="neon-line my-4" />

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button type="button" onClick={() => { setIsSignup(!isSignup); setError(""); }} className="text-primary hover:underline font-medium">
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;