import { ShieldCheck, ShieldAlert, AlertTriangle, RotateCcw, Mic, Eye, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "./AnalysisPipeline";

interface ResultPanelProps {
  result: AnalysisResult;
  isAudio: boolean;
  isImage?: boolean;
  onReset: () => void;
}

const ResultPanel = ({ result, isAudio, isImage, onReset }: ResultPanelProps) => {
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

      {/* Confidence bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground mb-3">Overall Confidence Level</p>
        <div className="h-4 rounded-full bg-muted overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              result.confidence > 90 ? "bg-success" : result.confidence > 75 ? "bg-warning" : "bg-destructive"
            }`}
            style={{ width: `${result.confidence}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0%</span>
          <span className="font-mono font-bold text-foreground">{result.confidence}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className={`grid grid-cols-1 ${isImage ? "" : isAudio ? "" : "sm:grid-cols-2"} gap-4`}>
        {!isImage && (
          <ScoreCard
            label="Voice Authenticity"
            score={result.voiceScore}
            icon={<Mic className="w-4 h-4" />}
            details={result.details}
            type="voice"
          />
        )}
        {!isAudio && !isImage && (
          <ScoreCard
            label="Facial Authenticity"
            score={result.facialScore}
            icon={<Eye className="w-4 h-4" />}
            details={result.details}
            type="facial"
          />
        )}
        {isImage && (
          <ScoreCard
            label="Image Authenticity"
            score={result.imageScore}
            icon={<Image className="w-4 h-4" />}
            details={result.details}
            type="image"
          />
        )}
      </div>

      {/* Detailed metrics */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="font-semibold text-foreground mb-3 text-sm">Detailed Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {result.details.mfccCoefficients != null && (
            <MetricItem label="MFCC Coefficients" value={`${result.details.mfccCoefficients}`} />
          )}
          {result.details.pitchVariance != null && (
            <MetricItem label="Pitch Variance" value={`${result.details.pitchVariance}`} />
          )}
          {result.details.facialLandmarks != null && (
            <MetricItem label="Facial Landmarks" value={`${result.details.facialLandmarks}`} />
          )}
          {result.details.lipSyncScore != null && (
            <MetricItem label="Lip-Sync Score" value={`${result.details.lipSyncScore}%`} />
          )}
          {result.details.noiseConsistency != null && (
            <MetricItem label="Noise Consistency" value={`${result.details.noiseConsistency}%`} />
          )}
          {result.details.spectralAnomaly != null && (
            <MetricItem label="Spectral Anomaly" value={result.details.spectralAnomaly ? "Yes" : "No"} warn={result.details.spectralAnomaly} />
          )}
          {result.details.ganFingerprint != null && (
            <MetricItem label="GAN Fingerprint" value={result.details.ganFingerprint ? "Detected" : "None"} warn={result.details.ganFingerprint} />
          )}
          {result.details.pixelArtifacts != null && (
            <MetricItem label="Pixel Artifacts" value={result.details.pixelArtifacts ? "Found" : "Clean"} warn={result.details.pixelArtifacts} />
          )}
        </div>
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
  icon,
  details,
  type,
}: {
  label: string;
  score: number;
  icon: React.ReactNode;
  details: AnalysisResult["details"];
  type: "voice" | "facial" | "image";
}) => {
  const color = score > 60 ? "bg-success" : score > 35 ? "bg-warning" : "bg-destructive";
  const textColor = score > 60 ? "text-success" : score > 35 ? "text-warning" : "text-destructive";

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={textColor}>{icon}</span>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`text-3xl font-bold font-mono mb-3 ${textColor}`}>{score}%</p>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {score > 60 ? "Likely authentic" : score > 35 ? "Suspicious" : "Likely manipulated"}
      </p>
    </div>
  );
};

const MetricItem = ({ label, value, warn }: { label: string; value: string; warn?: boolean }) => (
  <div className="bg-muted/50 rounded-lg p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-sm font-mono font-semibold mt-1 ${warn ? "text-warning" : "text-foreground"}`}>{value}</p>
  </div>
);

export default ResultPanel;
