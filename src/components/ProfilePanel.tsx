import { useState } from "react";
import { User, Save, CheckCircle2, ArrowLeft, Bell, Lock, Palette, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getProfile, saveProfile, type UserProfile } from "@/lib/profile";
import { getScanHistory } from "@/lib/history";

interface ProfilePanelProps {
  onBack?: () => void;
}

const ProfilePanel = ({ onBack }: ProfilePanelProps) => {
  const [profile, setProfile] = useState<UserProfile>(getProfile());
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
  const [notifications, setNotifications] = useState(true);
  const [autoScan, setAutoScan] = useState(false);
  const [darkMode, setDarkMode] = useState(!document.documentElement.classList.contains("light"));
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
    <div className="w-full max-w-2xl mx-auto space-y-6 page-enter">
      {/* Back + Title */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
      </div>

      {/* Avatar & Header */}
      <div className="gradient-border rounded-2xl bg-card p-6 flex items-center gap-5" style={{ animation: 'slideUp 0.5s ease-out' }}>
        <Avatar className="w-20 h-20 text-2xl">
          <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold text-foreground">{profile.name || "User"}</h3>
          <p className="text-sm text-muted-foreground">{profile.email || "No email set"}</p>
          <div className="flex items-center gap-1 mt-1">
            <Shield className="w-3 h-3 text-success" />
            <span className="text-xs text-success font-medium">Protected by DeepFakeGuard</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4" style={{ animation: 'slideUp 0.5s ease-out 0.1s both' }}>
        <StatCard label="Total Scans" value={totalScans.toString()} />
        <StatCard label="Fakes Found" value={fakesDetected.toString()} color="destructive" />
        <StatCard label="Avg Confidence" value={`${avgConfidence}%`} color="primary" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-0" style={{ animation: 'slideUp 0.5s ease-out 0.15s both' }}>
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "profile" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <User className="w-4 h-4 inline mr-1" /> Profile Info
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${activeTab === "settings" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
        >
          <Palette className="w-4 h-4 inline mr-1" /> Settings
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="grid gap-4 rounded-xl border border-border bg-card p-6" style={{ animation: 'scaleIn 0.3s ease-out' }}>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
            <Input id="name" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" className="bg-muted border-border" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
            <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} placeholder="your@email.com" className="bg-muted border-border" />
          </div>
          <Button onClick={handleSave} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Saved!" : "Save Profile"}
          </Button>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-4" style={{ animation: 'scaleIn 0.3s ease-out' }}>
          <SettingRow icon={<Bell className="w-4 h-4 text-primary" />} label="Push Notifications" desc="Get alerts for new scan results">
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </SettingRow>
          <SettingRow icon={<Lock className="w-4 h-4 text-warning" />} label="Auto-Scan Downloads" desc="Automatically scan downloaded media files">
            <Switch checked={autoScan} onCheckedChange={setAutoScan} />
          </SettingRow>
          <SettingRow icon={<Palette className="w-4 h-4 text-accent" />} label="Dark Mode" desc="Toggle dark/light theme appearance">
            <Switch checked={darkMode} onCheckedChange={(v) => {
              setDarkMode(v);
              document.documentElement.classList.toggle("light", !v);
              localStorage.setItem("deepfake_theme", v ? "dark" : "light");
            }} />
          </SettingRow>
          <SettingRow icon={<Globe className="w-4 h-4 text-success" />} label="Language" desc="App language preference">
            <span className="text-sm text-muted-foreground">English</span>
          </SettingRow>
        </div>
      )}
    </div>
  );
};

const SettingRow = ({ icon, label, desc, children }: { icon: React.ReactNode; label: string; desc: string; children: React.ReactNode }) => (
  <div className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

const StatCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="rounded-xl border border-border bg-card p-4 text-center card-hover">
    <p className={`text-2xl font-bold font-mono ${color === "destructive" ? "text-destructive" : color === "primary" ? "text-primary" : "text-foreground"}`}>
      {value}
    </p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

export default ProfilePanel;