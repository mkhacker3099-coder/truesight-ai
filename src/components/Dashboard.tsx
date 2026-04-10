import { Shield, Scan, AlertTriangle, TrendingUp, Fingerprint, Brain, Headphones, Video, Stamp, Languages } from "lucide-react";
import { getGreeting, type AuthUser } from "@/lib/auth";
import { getScanHistory } from "@/lib/history";

interface DashboardProps {
  user: AuthUser;
  onNavigate: (page: string) => void;
}

const Dashboard = ({ user, onNavigate }: DashboardProps) => {
  const greeting = getGreeting();
  const history = getScanHistory();
  const totalScans = history.length;
  const fakesDetected = history.filter((r) => r.result.verdict === "fake").length;
  const avgConfidence = totalScans > 0
    ? Math.round((history.reduce((s, r) => s + r.result.confidence, 0) / totalScans) * 10) / 10
    : 0;
  const recentScans = history.slice(0, 5);

  const tools = [
    { icon: Scan, label: "DeepFake Detector", desc: "Analyze media for AI manipulation", page: "home" },
    { icon: Fingerprint, label: "Biometric Identity", desc: "Face + voice recognition combined", page: "biometric" },
    { icon: Brain, label: "Prosody & Emotion", desc: "Natural pauses & stress patterns", page: "prosody" },
    { icon: Headphones, label: "Head Pose & Geometry", desc: "3D face reconstruction analysis", page: "headpose" },
    { icon: AlertTriangle, label: "Multimode AI Detector", desc: "Video frames, audio & text analysis", page: "multimode" },
    { icon: Stamp, label: "Watermark Detection", desc: "Scan for AI-generated watermarks", page: "watermark" },
    { icon: Languages, label: "AI Video Dubbing", desc: "Auto-translate with lip-sync matching", page: "dubbing" },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="gradient-border rounded-2xl bg-card p-8">
        <h1 className="text-3xl font-bold text-foreground">
          {greeting}, <span className="text-primary">{user.name || "User"}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-2">Welcome back to DeepFakeGuard. Stay protected.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<Scan className="w-5 h-5 text-primary" />} label="Total Scans" value={totalScans.toString()} />
        <StatCard icon={<AlertTriangle className="w-5 h-5 text-destructive" />} label="Fakes Found" value={fakesDetected.toString()} />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-success" />} label="Avg Confidence" value={`${avgConfidence}%`} />
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Tools & Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <button
              key={i}
              onClick={() => onNavigate(tool.page)}
              className="gradient-border rounded-xl bg-card p-5 text-left hover:bg-primary/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{tool.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentScans.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            {recentScans.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{r.fileName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</p>
                </div>
                <span className={`text-sm font-mono font-bold ${r.result.verdict === "fake" ? "text-destructive" : "text-success"}`}>
                  {r.result.verdict.toUpperCase()} ({r.result.confidence}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default Dashboard;
