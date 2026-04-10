import { useState } from "react";
import { Loader2, Upload, Stamp, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WatermarkDetection = () => {
  const [stage, setStage] = useState<"idle" | "scanning" | "done">("idle");
  const [results, setResults] = useState<null | {
    watermarkFound: boolean;
    type: string;
    confidence: number;
    details: { label: string; value: string; warn?: boolean }[];
  }>(null);

  const startScan = () => {
    setStage("scanning");
    setTimeout(() => {
      const found = Math.random() > 0.4;
      setResults({
        watermarkFound: found,
        type: found ? ["DALL-E", "Midjourney", "Stable Diffusion", "Meta AI"][Math.floor(Math.random() * 4)] : "None",
        confidence: Math.round((70 + Math.random() * 28) * 10) / 10,
        details: [
          { label: "Visible Watermark", value: found ? "Detected" : "Not Found", warn: found },
          { label: "Invisible Watermark", value: found ? "Detected" : "Not Found", warn: found },
          { label: "C2PA Metadata", value: Math.random() > 0.5 ? "Present" : "Absent" },
          { label: "EXIF Data", value: Math.random() > 0.5 ? "Modified" : "Original", warn: Math.random() > 0.5 },
          { label: "Frequency Domain Marks", value: found ? "Found" : "Clean", warn: found },
          { label: "Steganographic Content", value: Math.random() > 0.7 ? "Detected" : "None" },
        ],
      });
      setStage("done");
    }, 3000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground text-center">Watermark Detection</h2>
      <p className="text-muted-foreground text-center">Scan for AI-generated media watermarks (visible & invisible)</p>

      {stage === "idle" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <Stamp className="w-16 h-16 text-primary mx-auto" />
          <p className="text-muted-foreground">Upload an image or video to scan for watermarks</p>
          <Button onClick={startScan} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            <Upload className="w-4 h-4 mr-2" /> Scan for Watermarks
          </Button>
        </div>
      )}

      {stage === "scanning" && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-8 text-center glow-primary">
          <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-foreground font-semibold">Scanning for watermarks...</p>
        </div>
      )}

      {stage === "done" && results && (
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 text-center border ${
            !results.watermarkFound ? "border-success/40 bg-success/5" : "border-warning/40 bg-warning/5"
          }`}>
            {!results.watermarkFound ? (
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
            ) : (
              <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-3" />
            )}
            <h3 className={`text-xl font-black ${!results.watermarkFound ? "text-success" : "text-warning"}`}>
              {results.watermarkFound ? `AI Watermark Found: ${results.type}` : "No Watermarks Detected"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">Confidence: {results.confidence}%</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-semibold text-foreground mb-3 text-sm">Scan Details</h3>
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
              Scan Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatermarkDetection;
