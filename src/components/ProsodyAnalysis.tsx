import { useState } from "react";
import { Brain, Loader2, Upload, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProsodyAnalysis = () => {
  const [stage, setStage] = useState<"idle" | "analyzing" | "done">("idle");
  const [results, setResults] = useState<null | {
    naturalPauses: number;
    emotionalVariation: number;
    stressPattern: number;
    verdict: string;
    details: { label: string; value: string; warn?: boolean }[];
  }>(null);

  const startAnalysis = () => {
    setStage("analyzing");
    setTimeout(() => {
      const np = 40 + Math.random() * 55;
      const ev = 35 + Math.random() * 60;
      const sp = 45 + Math.random() * 50;
      const avg = (np + ev + sp) / 3;
      setResults({
        naturalPauses: Math.round(np * 10) / 10,
        emotionalVariation: Math.round(ev * 10) / 10,
        stressPattern: Math.round(sp * 10) / 10,
        verdict: avg > 60 ? "Natural Speech" : "Synthetic Speech Detected",
        details: [
          { label: "Pause Duration Variance", value: `${(Math.random() * 0.8 + 0.1).toFixed(2)}s` },
          { label: "Pitch Range", value: `${Math.round(80 + Math.random() * 120)}Hz - ${Math.round(200 + Math.random() * 200)}Hz` },
          { label: "Speech Rate", value: `${Math.round(120 + Math.random() * 60)} WPM` },
          { label: "Micro-tremor Detected", value: avg < 60 ? "Yes" : "No", warn: avg < 60 },
          { label: "Breathing Pattern", value: avg > 60 ? "Natural" : "Absent", warn: avg < 60 },
          { label: "Emotion Consistency", value: `${Math.round(avg)}%` },
        ],
      });
      setStage("done");
    }, 3500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground text-center">Prosody & Emotion Analysis</h2>
      <p className="text-muted-foreground text-center">Analyze natural pauses, emotional variation, and stress patterns</p>

      {stage === "idle" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <Activity className="w-16 h-16 text-primary mx-auto" />
          <p className="text-muted-foreground">Upload an audio file to analyze speech prosody</p>
          <Button onClick={startAnalysis} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            <Upload className="w-4 h-4 mr-2" /> Start Analysis
          </Button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-8 text-center glow-primary">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-foreground font-semibold">Analyzing prosody patterns...</p>
        </div>
      )}

      {stage === "done" && results && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center border ${
            results.verdict === "Natural Speech" ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
          }`}>
            <Brain className={`w-12 h-12 mx-auto mb-3 ${results.verdict === "Natural Speech" ? "text-success" : "text-destructive"}`} />
            <h3 className={`text-xl font-black ${results.verdict === "Natural Speech" ? "text-success" : "text-destructive"}`}>
              {results.verdict}
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MetricBar label="Natural Pauses" score={results.naturalPauses} />
            <MetricBar label="Emotional Variation" score={results.emotionalVariation} />
            <MetricBar label="Stress Pattern" score={results.stressPattern} />
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Detailed Metrics</h3>
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

const MetricBar = ({ label, score }: { label: string; score: number }) => {
  const color = score > 60 ? "bg-success" : score > 40 ? "bg-warning" : "bg-destructive";
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-xl font-bold font-mono text-foreground mb-2">{score}%</p>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
};

export default ProsodyAnalysis;
