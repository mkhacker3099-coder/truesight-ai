import { Shield, Scan, AlertTriangle, TrendingUp, Fingerprint, Brain, Headphones, Video, Stamp, Languages, Activity, Clock } from "lucide-react";
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
  const safeRate = totalScans > 0 ? Math.round(((totalScans - fakesDetected) / totalScans) * 100) : 100;

  const tools = [
    { icon: Scan, label: "DeepFake Detector", desc: "Analyze media for AI manipulation", page: "home", color: "text-primary" },
    { icon: Fingerprint, label: "Biometric Identity", desc: "Face + voice recognition combined", page: "biometric", color: "text-accent" },
    { icon: Brain, label: "Prosody & Emotion", desc: "Natural pauses & stress patterns", page: "prosody", color: "text-warning" },
    { icon: Headphones, label: "Head Pose & Geometry", desc: "3D face reconstruction analysis", page: "headpose", color: "text-primary" },
    { icon: AlertTriangle, label: "Multimode AI Detector", desc: "Video frames, audio & text analysis", page: "multimode", color: "text-destructive" },
    { icon: Stamp, label: "Watermark Detection", desc: "Scan for AI-generated watermarks", page: "watermark", color: "text-success" },
    { icon: Languages, label: "AI Video Dubbing", desc: "Auto-translate with lip-sync matching", page: "dubbing", color: "text-primary" },
  ];

  return (
    <div className="space-y-8 page-enter">
      {/* Greeting */}
      <div className="gradient-border rounded-2xl bg-card p-8" style={{ animation: 'slideUp 0.5s ease-out' }}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {greeting}, <span className="text-primary">{user.name || "User"}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">Welcome back to DeepFakeGuard. Your digital safety dashboard.</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={<Scan className="w-5 h-5 text-primary" />} label="Total Scans" value={totalScans.toString()} delay={0} />
        <StatCard icon={<AlertTriangle className="w-5 h-5 text-destructive" />} label="Fakes Found" value={fakesDetected.toString()} delay={1} />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-success" />} label="Avg Confidence" value={`${avgConfidence}%`} delay={2} />
        <StatCard icon={<Activity className="w-5 h-5 text-accent" />} label="Safety Rate" value={`${safeRate}%`} delay={3} />
      </div>

      {/* Quick Actions */}
      <div style={{ animation: 'slideUp 0.6s ease-out 0.15s both' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
          <button onClick={() => onNavigate("home")} className="text-sm text-primary hover:underline">Start Scan →</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate("home")} className="gradient-border rounded-xl bg-card p-4 text-center card-hover group">
            <Scan className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-foreground">Scan Media</p>
          </button>
          <button onClick={() => onNavigate("history")} className="gradient-border rounded-xl bg-card p-4 text-center card-hover group">
            <Clock className="w-6 h-6 text-accent mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-foreground">View History</p>
          </button>
          <button onClick={() => onNavigate("profile")} className="gradient-border rounded-xl bg-card p-4 text-center card-hover group">
            <Activity className="w-6 h-6 text-success mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-foreground">My Profile</p>
          </button>
        </div>
      </div>

      {/* Tools Grid */}
      <div style={{ animation: 'slideUp 0.6s ease-out 0.25s both' }}>
        <h2 className="text-xl font-bold text-foreground mb-4">AI Tools & Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <button
              key={i}
              onClick={() => onNavigate(tool.page)}
              className="gradient-border rounded-xl bg-card p-5 text-left card-hover group"
              style={{ animation: `scaleIn 0.4s ease-out ${0.3 + i * 0.05}s both` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                <tool.icon className={`w-5 h-5 ${tool.color}`} />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{tool.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      {recentScans.length > 0 && (
        <div style={{ animation: 'slideUp 0.6s ease-out 0.4s both' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            <button onClick={() => onNavigate("history")} className="text-sm text-primary hover:underline">View All →</button>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            {recentScans.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors" style={{ animation: `slideUp 0.3s ease-out ${0.45 + i * 0.05}s both` }}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${r.result.verdict === "fake" ? "bg-destructive" : "bg-success"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{r.fileName}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</p>
                  </div>
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

const StatCard = ({ icon, label, value, delay }: { icon: React.ReactNode; label: string; value: string; delay: number }) => (
  <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4 card-hover" style={{ animation: `scaleIn 0.4s ease-out ${delay * 0.08}s both` }}>
    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default Dashboard;