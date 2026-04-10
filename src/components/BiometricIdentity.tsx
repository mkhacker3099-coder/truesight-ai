import { useState } from "react";
import { Fingerprint, ScanFace, Mic, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const BiometricIdentity = () => {
  const [stage, setStage] = useState<"idle" | "scanning" | "done">("idle");
  const [results, setResults] = useState<null | { faceMatch: number; voiceMatch: number; combined: number; verdict: string }>(null);

  const startScan = () => {
    setStage("scanning");
    setTimeout(() => {
      const faceMatch = 70 + Math.random() * 28;
      const voiceMatch = 65 + Math.random() * 30;
      const combined = (faceMatch * 0.5 + voiceMatch * 0.5);
      setResults({
        faceMatch: Math.round(faceMatch * 10) / 10,
        voiceMatch: Math.round(voiceMatch * 10) / 10,
        combined: Math.round(combined * 10) / 10,
        verdict: combined > 75 ? "Verified" : "Unverified",
      });
      setStage("done");
    }, 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground text-center">Biometric Identity Verification</h2>
      <p className="text-muted-foreground text-center">Combined face recognition + voice recognition analysis</p>

      {stage === "idle" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-6">
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <ScanFace className="w-16 h-16 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Face Recognition</p>
            </div>
            <div className="text-center">
              <Mic className="w-16 h-16 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Voice Recognition</p>
            </div>
          </div>
          <Button onClick={startScan} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            <Fingerprint className="w-4 h-4 mr-2" />
            Start Biometric Scan
          </Button>
        </div>
      )}

      {stage === "scanning" && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-8 text-center glow-primary">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-foreground font-semibold">Scanning biometric data...</p>
          <p className="text-sm text-muted-foreground mt-1">Analyzing facial geometry & voice patterns</p>
        </div>
      )}

      {stage === "done" && results && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center border ${
            results.verdict === "Verified" ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
          }`}>
            {results.verdict === "Verified" ? (
              <ShieldCheck className="w-12 h-12 text-success mx-auto mb-3" />
            ) : (
              <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-3" />
            )}
            <h3 className={`text-2xl font-black ${results.verdict === "Verified" ? "text-success" : "text-destructive"}`}>
              {results.verdict.toUpperCase()}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Combined Score: {results.combined}%</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ScoreBar label="Face Match" score={results.faceMatch} icon={<ScanFace className="w-4 h-4" />} />
            <ScoreBar label="Voice Match" score={results.voiceMatch} icon={<Mic className="w-4 h-4" />} />
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => { setStage("idle"); setResults(null); }} className="border-primary/30 text-primary">
              Scan Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const ScoreBar = ({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) => {
  const color = score > 75 ? "bg-success" : score > 50 ? "bg-warning" : "bg-destructive";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary">{icon}</span>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className="text-2xl font-bold font-mono text-foreground mb-2">{score}%</p>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

export default BiometricIdentity;
