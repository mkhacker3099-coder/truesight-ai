import { useState } from "react";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, type AuthUser } from "@/lib/auth";
import { saveProfile } from "@/lib/profile";

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

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (isSignup && !name) {
      setError("Please enter your name");
      return;
    }

    const user: AuthUser = { name: isSignup ? name : email.split("@")[0], email };
    login(user);
    saveProfile({ name: user.name, email: user.email, avatar: "" });
    onLogin(user);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-black text-foreground">
            DeepFake<span className="text-primary">Guard</span>
          </h1>
          <p className="text-muted-foreground mt-2">
            {isSignup ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 space-y-4">
          {isSignup && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="bg-muted border-border"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-muted-foreground">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-muted border-border"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            {isSignup ? <UserPlus className="w-4 h-4 mr-2" /> : <LogIn className="w-4 h-4 mr-2" />}
            {isSignup ? "Sign Up" : "Sign In"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => { setIsSignup(!isSignup); setError(""); }}
              className="text-primary hover:underline font-medium"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
