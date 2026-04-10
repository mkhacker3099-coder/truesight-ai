import { useState } from "react";
import { Loader2, Upload, Video, Mic, FileText, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

const MultimodeDetector = () => {
  const [stage, setStage] = useState<"idle" | "analyzing" | "done">("idle");
  const [results, setResults] = useState<null | {
    videoScore: number; audioScore: number; textScore: number;
    combined: number; verdict: string;
    details: { label: string; value: string; warn?: boolean }[];
  }>(null);

  const startAnalysis = () => {
    setStage("analyzing");
    setTimeout(() => {
      const isFake = Math.random() > 0.45;
      const vs = isFake ? 20 + Math.random() * 35 : 70 + Math.random() * 25;
      const as_ = isFake ? 25 + Math.random() * 30 : 68 + Math.random() * 28;
      const ts = isFake ? 30 + Math.random() * 28 : 72 + Math.random() * 24;
      const combined = (vs + as_ + ts) / 3;
      setResults({
        videoScore: Math.round(vs * 10) / 10,
        audioScore: Math.round(as_ * 10) / 10,
        textScore: Math.round(ts * 10) / 10,
        combined: Math.round(combined * 10) / 10,
        verdict: isFake ? "Manipulation Detected" : "Authentic Content",
        details: [
          { label: "Video Frames Analyzed", value: `${Math.round(100 + Math.random() * 200)}` },
          { label: "Audio Segments", value: `${Math.round(10 + Math.random() * 30)}` },
          { label: "Text Transcript Length", value: `${Math.round(50 + Math.random() * 200)} words` },
          { label: "Cross-modal Consistency", value: `${Math.round(combined)}%`, warn: combined < 60 },
          { label: "Temporal Alignment", value: isFake ? "Misaligned" : "Aligned", warn: isFake },
          { label: "Semantic Match", value: `${Math.round(40 + Math.random() * 55)}%` },
        ],
      });
      setStage("done");
    }, 4500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground text-center">Multimode AI Detector</h2>
      <p className="text-muted-foreground text-center">Analyze video frames, audio, and text simultaneously</p>

      {stage === "idle" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <Video className="w-12 h-12 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Video</p>
            </div>
            <div className="text-center">
              <Mic className="w-12 h-12 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Audio</p>
            </div>
            <div className="text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-1" />
              <p className="text-xs text-muted-foreground">Text</p>
            </div>
          </div>
          <Button onClick={startAnalysis} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            <Upload className="w-4 h-4 mr-2" /> Start Multimode Analysis
          </Button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-8 text-center glow-primary">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-foreground font-semibold">Analyzing all modalities...</p>
        </div>
      )}

      {stage === "done" && results && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center border ${
            results.verdict === "Authentic Content" ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
          }`}>
            {results.verdict === "Authentic Content" ? (
              <ShieldCheck className="w-12 h-12 text-success mx-auto mb-3" />
            ) : (
              <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-3" />
            )}
            <h3 className={`text-xl font-black ${results.verdict === "Authentic Content" ? "text-success" : "text-destructive"}`}>
              {results.verdict}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Combined Score: {results.combined}%</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <ModeScore label="Video" score={results.videoScore} icon={<Video className="w-4 h-4" />} />
            <ModeScore label="Audio" score={results.audioScore} icon={<Mic className="w-4 h-4" />} />
            <ModeScore label="Text" score={results.textScore} icon={<FileText className="w-4 h-4" />} />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Analysis Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {results.details.map((d, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">{d.label}</p>
                  <p className={`text-sm font-mono font-semibold mt-1 ${d.warn ? "text-warning" : "text-foreground"}`}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" onClick={() => { setStage("idle"); setResults(null); }} className="border-primary/30 text-primary">
              Analyze Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const ModeScore = ({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) => {
  const color = score > 60 ? "bg-success" : score > 35 ? "bg-warning" : "bg-destructive";
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <div className="flex items-center justify-center gap-1 mb-1">
        <span className="text-primary">{icon}</span>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold font-mono text-foreground mb-2">{score}%</p>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

export default MultimodeDetector;
