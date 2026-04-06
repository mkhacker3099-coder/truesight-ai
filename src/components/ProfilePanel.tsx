import { useState, useEffect } from "react";
import { User, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfile, saveProfile, type UserProfile } from "@/lib/profile";
import { getScanHistory } from "@/lib/history";

const ProfilePanel = () => {
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [saved, setSaved] = useState(false);
  const history = getScanHistory();

  const totalScans = history.length;
  const fakesDetected = history.filter((r) => r.result.verdict === "fake").length;
  const avgConfidence =
    totalScans > 0
      ? Math.round((history.reduce((s, r) => s + r.result.confidence, 0) / totalScans) * 10) / 10
      : 0;

  const handleSave = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-foreground text-center">Your Profile</h2>

      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-20 h-20 text-2xl">
          <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="grid gap-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-muted-foreground">Name</Label>
          <Input
            id="name"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            placeholder="Your name"
            className="bg-muted border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-muted-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
            className="bg-muted border-border"
          />
        </div>
        <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          {saved ? "Saved!" : "Save Profile"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Scans" value={totalScans.toString()} />
        <StatCard label="Fakes Found" value={fakesDetected.toString()} color="destructive" />
        <StatCard label="Avg Confidence" value={`${avgConfidence}%`} color="primary" />
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="rounded-xl border border-border bg-card p-4 text-center">
    <p className={`text-2xl font-bold font-mono ${color === "destructive" ? "text-destructive" : color === "primary" ? "text-primary" : "text-foreground"}`}>
      {value}
    </p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

export default ProfilePanel;
