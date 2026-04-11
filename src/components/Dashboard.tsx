import { Shield, Scan, AlertTriangle, TrendingUp, Fingerprint, Brain, Headphones, Stamp, Languages, Activity, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getGreeting, type AuthUser } from "@/lib/auth";
import { getScanHistory } from "@/lib/history";
import ThreatVisualizer from "./ThreatVisualizer";
import QRDownload from "./QRDownload";

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
  const threatLevel = fakesDetected === 0 ? "safe" : fakesDetected <= 2 ? "medium" : "high";

  const tools = [
    { icon: Scan, label: "DeepFake Detector", desc: "Analyze media for AI manipulation", page: "home" },
    { icon: Fingerprint, label: "Biometric Identity", desc: "Face + voice recognition", page: "biometric" },
    { icon: Brain, label: "Prosody & Emotion", desc: "Stress & pause analysis", page: "prosody" },
    { icon: Headphones, label: "Head Pose & Geometry", desc: "3D reconstruction analysis", page: "headpose" },
    { icon: AlertTriangle, label: "Multimode Detector", desc: "Video, audio & text", page: "multimode" },
    { icon: Stamp, label: "Watermark Detection", desc: "AI watermark scanner", page: "watermark" },
    { icon: Languages, label: "AI Video Dubbing", desc: "Lip-sync translation", page: "dubbing" },
  ];

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <motion.div className="space-y-8" variants={container} initial="hidden" animate="show">
      {/* Greeting */}
      <motion.div variants={item} className="gradient-border rounded-2xl glass p-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center" style={{ boxShadow: 'var(--glow-primary)' }}>
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground font-display">
              {greeting}, <span className="text-primary text-glow">{user.name || "Agent"}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">Welcome to your security command center.</p>
          </div>
        </div>
      </motion.div>

      {/* Stats + Threat Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={<Scan className="w-5 h-5 text-primary" />} label="Total Scans" value={totalScans.toString()} glow="primary" />
            <StatCard icon={<AlertTriangle className="w-5 h-5 text-destructive" />} label="Fakes Found" value={fakesDetected.toString()} glow="danger" />
            <StatCard icon={<TrendingUp className="w-5 h-5 text-success" />} label="Avg Confidence" value={`${avgConfidence}%`} glow="success" />
            <StatCard icon={<Activity className="w-5 h-5 text-secondary" />} label="Safety Rate" value={`${safeRate}%`} glow="secondary" />
          </div>
        </motion.div>
        <motion.div variants={item} className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-2 font-display">THREAT LEVEL</p>
          <ThreatVisualizer level={threatLevel as "safe" | "medium" | "high"} />
          <p className={`text-center text-sm font-bold mt-2 font-display ${threatLevel === "safe" ? "text-success" : threatLevel === "medium" ? "text-warning" : "text-destructive"}`}>
            {threatLevel.toUpperCase()}
          </p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground font-display">Quick Actions</h2>
          <button onClick={() => onNavigate("home")} className="text-sm text-primary hover:underline flex items-center gap-1">
            <Zap className="w-3 h-3" /> Start Scan
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button onClick={() => onNavigate("home")} className="glass rounded-xl p-4 text-center card-hover group">
            <Scan className="w-6 h-6 text-primary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-foreground">Scan Media</p>
          </button>
          <button onClick={() => onNavigate("history")} className="glass rounded-xl p-4 text-center card-hover group">
            <Clock className="w-6 h-6 text-secondary mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-foreground">View History</p>
          </button>
          <button onClick={() => onNavigate("profile")} className="glass rounded-xl p-4 text-center card-hover group">
            <Activity className="w-6 h-6 text-success mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-xs font-medium text-foreground">My Profile</p>
          </button>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <motion.div variants={item}>
        <h2 className="text-xl font-bold text-foreground mb-4 font-display">AI Tools & Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.button
              key={i}
              variants={item}
              onClick={() => onNavigate(tool.page)}
              className="glass rounded-xl p-5 text-left card-hover group"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                <tool.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground text-sm">{tool.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity + QR */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recentScans.length > 0 && (
          <motion.div variants={item} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground font-display">Recent Activity</h2>
              <button onClick={() => onNavigate("history")} className="text-sm text-primary hover:underline">View All →</button>
            </div>
            <div className="glass rounded-xl divide-y divide-border/30 overflow-hidden">
              {recentScans.map((r, i) => (
                <motion.div key={r.id} variants={item} className="flex items-center justify-between p-4 hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${r.result.verdict === "fake" ? "bg-destructive" : "bg-success"}`} />
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{r.fileName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-mono font-bold ${r.result.verdict === "fake" ? "text-destructive" : "text-success"}`}>
                    {r.result.verdict.toUpperCase()}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        <motion.div variants={item}>
          <QRDownload />
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatCard = ({ icon, label, value, glow }: { icon: React.ReactNode; label: string; value: string; glow: string }) => (
  <div className={`glass rounded-xl p-5 flex items-center gap-4 card-hover`} style={{ boxShadow: `var(--glow-${glow})` }}>
    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">{icon}</div>
    <div>
      <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default Dashboard;