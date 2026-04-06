import { ShieldCheck, ShieldAlert, AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "./AnalysisPipeline";

interface ResultPanelProps {
  result: AnalysisResult;
  isAudio: boolean;
  onReset: () => void;
}

const ResultPanel = ({ result, isAudio, onReset }: ResultPanelProps) => {
  const isFake = result.verdict === "fake";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main verdict */}
      <div
        className={`rounded-2xl p-8 text-center border ${
          isFake
            ? "border-destructive/40 bg-destructive/5 glow-danger"
            : "border-success/40 bg-success/5 glow-success"
        }`}
      >
        {isFake ? (
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4 animate-pulse" />
        ) : (
          <ShieldCheck className="w-16 h-16 text-success mx-auto mb-4" />
        )}

        <h2
          className={`text-4xl font-black mb-2 ${
            isFake ? "text-destructive" : "text-success"
          }`}
        >
          {isFake ? "FAKE DETECTED" : "AUTHENTIC"}
        </h2>
        <p className="text-muted-foreground text-lg">
          Confidence: <span className="font-mono font-bold text-foreground">{result.confidence}%</span>
        </p>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ScoreCard
          label="Voice Authenticity"
          score={result.voiceScore}
          max={100}
          isFake={isFake}
        />
        {!isAudio && (
          <ScoreCard
            label="Facial Authenticity"
            score={result.facialScore}
            max={100}
            isFake={isFake}
          />
        )}
      </div>

      {/* Anomalies */}
      {result.anomalies.length > 0 && (
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-warning">Anomalies Detected</h3>
          </div>
          <ul className="space-y-2">
            {result.anomalies.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-warning mt-0.5">•</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Alert */}
      {isFake && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-center">
          <p className="text-destructive font-semibold text-lg mb-1">
            ⚠️ Warning: Potential Scam Detected
          </p>
          <p className="text-sm text-muted-foreground">
            This media shows signs of AI manipulation. Do not share personal information
            or make financial decisions based on this content.
          </p>
        </div>
      )}

      <div className="text-center pt-2">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Analyze Another File
        </Button>
      </div>
    </div>
  );
};

const ScoreCard = ({
  label,
  score,
  max,
  isFake,
}: {
  label: string;
  score: number;
  max: number;
  isFake: boolean;
}) => {
  const pct = (score / max) * 100;
  const color = score > 60 ? "bg-success" : score > 35 ? "bg-warning" : "bg-destructive";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <p className="text-2xl font-bold font-mono text-foreground mb-2">{score}%</p>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export default ResultPanel;
