import { useState } from "react";
import { User, Save, CheckCircle2, ArrowLeft, Bell, Lock, Palette, Globe, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
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
  const [aggressiveMode, setAggressiveMode] = useState(false);
  const [darkMode, setDarkMode] = useState(!document.documentElement.classList.contains("light"));
  const history = getScanHistory();

  const totalScans = history.length;
  const fakesDetected = history.filter((r) => r.result.verdict === "fake").length;
  const avgConfidence = totalScans > 0
    ? Math.round((history.reduce((s, r) => s + r.result.confidence, 0) / totalScans) * 10) / 10
    : 0;

  const handleSave = () => {
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = profile.name ? profile.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "U";

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <motion.div className="w-full max-w-2xl mx-auto space-y-6" variants={container} initial="hidden" animate="show">
      <motion.div variants={item} className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="w-10 h-10 rounded-lg glass flex items-center justify-center hover:glow-primary transition-all">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
        )}
        <h2 className="text-2xl font-bold text-foreground font-display">My Profile</h2>
      </motion.div>

      <motion.div variants={item} className="gradient-border rounded-2xl glass p-6 flex items-center gap-5">
        <Avatar className="w-20 h-20 text-2xl">
          <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl font-display">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-xl font-bold text-foreground font-display">{profile.name || "Agent"}</h3>
          <p className="text-sm text-muted-foreground">{profile.email || "No email set"}</p>
          <div className="flex items-center gap-1 mt-1">
            <Shield className="w-3 h-3 text-success" />
            <span className="text-xs text-success font-medium">Protected by VoxVerify</span>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-3 gap-4">
        <StatCard label="Total Scans" value={totalScans.toString()} />
        <StatCard label="Fakes Found" value={fakesDetected.toString()} color="destructive" />
        <StatCard label="Avg Confidence" value={`${avgConfidence}%`} color="primary" />
      </motion.div>

      <motion.div variants={item} className="flex gap-2 border-b border-border/30 pb-0">
        <button onClick={() => setActiveTab("profile")} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors font-display ${activeTab === "profile" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <User className="w-4 h-4 inline mr-1" /> Profile
        </button>
        <button onClick={() => setActiveTab("settings")} className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors font-display ${activeTab === "settings" ? "bg-primary/10 text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}>
          <Palette className="w-4 h-4 inline mr-1" /> Settings
        </button>
      </motion.div>

      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-xl p-6 space-y-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground">Full Name</Label>
            <Input value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" className="bg-muted/50 border-border/50" />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Email</Label>
            <Input type="email" value={profile.email} onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))} placeholder="your@email.com" className="bg-muted/50 border-border/50" />
          </div>
          <Button onClick={handleSave} className="w-full magnetic-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display">
            {saved ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved ? "Saved!" : "Save Profile"}
          </Button>
        </motion.div>
      )}

      {activeTab === "settings" && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
          <SettingRow icon={<Bell className="w-4 h-4 text-primary" />} label="Push Notifications" desc="Get alerts for scan results">
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </SettingRow>
          <SettingRow icon={<Lock className="w-4 h-4 text-warning" />} label="Auto-Scan Downloads" desc="Scan downloaded media files automatically">
            <Switch checked={autoScan} onCheckedChange={setAutoScan} />
          </SettingRow>
          <SettingRow icon={<Zap className="w-4 h-4 text-destructive" />} label="Aggressive Mode" desc="Enhanced scanning with deeper analysis">
            <Switch checked={aggressiveMode} onCheckedChange={setAggressiveMode} />
          </SettingRow>
          <SettingRow icon={<Palette className="w-4 h-4 text-secondary" />} label="Dark Mode" desc="Toggle dark/light theme">
            <Switch checked={darkMode} onCheckedChange={(v) => {
              setDarkMode(v);
              document.documentElement.classList.toggle("light", !v);
              localStorage.setItem("deepfake_theme", v ? "dark" : "light");
            }} />
          </SettingRow>
          <SettingRow icon={<Globe className="w-4 h-4 text-success" />} label="Language" desc="App language">
            <span className="text-sm text-muted-foreground">English</span>
          </SettingRow>
        </motion.div>
      )}
    </motion.div>
  );
};

const SettingRow = ({ icon, label, desc, children }: { icon: React.ReactNode; label: string; desc: string; children: React.ReactNode }) => (
  <div className="glass rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
    {children}
  </div>
);

const StatCard = ({ label, value, color }: { label: string; value: string; color?: string }) => (
  <div className="glass rounded-xl p-4 text-center card-hover">
    <p className={`text-2xl font-bold font-mono ${color === "destructive" ? "text-destructive" : color === "primary" ? "text-primary" : "text-foreground"}`}>{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{label}</p>
  </div>
);

export default ProfilePanel;