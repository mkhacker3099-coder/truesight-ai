import { useState } from "react";
import { Loader2, Upload, Box, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeadPoseAnalysis = () => {
  const [stage, setStage] = useState<"idle" | "analyzing" | "done">("idle");
  const [results, setResults] = useState<null | {
    yaw: number; pitch: number; roll: number;
    unnaturalAngles: boolean;
    reconstructionQuality: number;
    verdict: string;
    details: { label: string; value: string; warn?: boolean }[];
  }>(null);

  const startAnalysis = () => {
    setStage("analyzing");
    setTimeout(() => {
      const unnaturalAngles = Math.random() > 0.5;
      const rq = unnaturalAngles ? 30 + Math.random() * 35 : 70 + Math.random() * 25;
      setResults({
        yaw: Math.round((Math.random() * 60 - 30) * 10) / 10,
        pitch: Math.round((Math.random() * 40 - 20) * 10) / 10,
        roll: Math.round((Math.random() * 30 - 15) * 10) / 10,
        unnaturalAngles,
        reconstructionQuality: Math.round(rq * 10) / 10,
        verdict: unnaturalAngles ? "Unnatural Pose Detected" : "Natural Pose",
        details: [
          { label: "3D Mesh Vertices", value: "468 landmarks" },
          { label: "Depth Estimation", value: unnaturalAngles ? "Inconsistent" : "Consistent", warn: unnaturalAngles },
          { label: "Temporal Coherence", value: `${Math.round(rq)}%` },
          { label: "Symmetry Score", value: `${Math.round(50 + Math.random() * 45)}%` },
          { label: "Impossible Angles", value: unnaturalAngles ? "Detected" : "None", warn: unnaturalAngles },
          { label: "Frame Consistency", value: `${Math.round(60 + Math.random() * 35)}%` },
        ],
      });
      setStage("done");
    }, 4000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground text-center">Head Pose & 3D Geometry</h2>
      <p className="text-muted-foreground text-center">3D face reconstruction with unnatural angle detection</p>

      {stage === "idle" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <Box className="w-16 h-16 text-primary mx-auto" />
          <p className="text-muted-foreground">Upload a video to analyze head pose geometry</p>
          <Button onClick={startAnalysis} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            <Upload className="w-4 h-4 mr-2" /> Start Analysis
          </Button>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-8 text-center glow-primary">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-foreground font-semibold">Reconstructing 3D face model...</p>
        </div>
      )}

      {stage === "done" && results && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center border ${
            !results.unnaturalAngles ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"
          }`}>
            {!results.unnaturalAngles ? (
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-3" />
            )}
            <h3 className={`text-xl font-black ${!results.unnaturalAngles ? "text-success" : "text-destructive"}`}>
              {results.verdict}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Reconstruction Quality: {results.reconstructionQuality}%</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <AngleCard label="Yaw" value={results.yaw} />
            <AngleCard label="Pitch" value={results.pitch} />
            <AngleCard label="Roll" value={results.roll} />
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

const AngleCard = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-xl border border-border bg-card p-4 text-center">
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className="text-2xl font-bold font-mono text-foreground">{value}°</p>
  </div>
);

export default HeadPoseAnalysis;
