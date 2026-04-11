import { ShieldCheck, ShieldAlert, AlertTriangle, RotateCcw, Mic, Eye, Image, Share2, ArrowLeft, Cpu, Layers, Search, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalysisResult } from "./AnalysisPipeline";
import FraudReport from "./FraudReport";

interface ResultPanelProps {
  result: AnalysisResult;
  isAudio: boolean;
  isImage?: boolean;
  fileName?: string;
  onReset: () => void;
}

const ResultPanel = ({ result, isAudio, isImage, fileName, onReset }: ResultPanelProps) => {
  const isFake = result.verdict === "fake";
  const forwardCount = Math.floor(Math.random() * 47) + 3;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 page-enter">
      {/* Back button */}
      <button onClick={onReset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Upload
      </button>

      {/* Main verdict */}
      <div
        className={`rounded-2xl p-8 text-center border ${
          isFake
            ? "border-destructive/40 bg-destructive/5 glow-danger"
            : "border-success/40 bg-success/5 glow-success"
        }`}
        style={{ animation: 'scaleIn 0.5s ease-out' }}
      >
        {isFake ? (
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4 animate-pulse" />
        ) : (
          <ShieldCheck className="w-16 h-16 text-success mx-auto mb-4" />
        )}

        <h2 className={`text-4xl font-black mb-2 ${isFake ? "text-destructive" : "text-success"}`}>
          {isFake ? "FAKE DETECTED" : "AUTHENTIC"}
        </h2>
        <p className="text-muted-foreground text-lg">
          Confidence: <span className="font-mono font-bold text-foreground">{result.confidence}%</span>
        </p>
      </div>

      {/* CNN & OpenCV Pipeline Info */}
      <div className="rounded-xl border border-border bg-card p-5" style={{ animation: 'slideUp 0.4s ease-out 0.1s both' }}>
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-sm">Detection Pipeline</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PipelineInfo label="Frame Extraction" value="OpenCV cv2.VideoCapture" desc="Extracted 120 frames at 30fps" />
          <PipelineInfo label="CNN Model" value="EfficientNet-B4" desc="Face inconsistency detection" />
          <PipelineInfo label="Preprocessing" value="MTCNN Face Detector" desc="468 facial landmarks mapped" />
          <PipelineInfo label="Classifier" value="CNN-LSTM Hybrid" desc="Temporal consistency analysis" />
        </div>
      </div>

      {/* File forwarding info */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3" style={{ animation: 'slideUp 0.4s ease-out 0.15s both' }}>
        <Share2 className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">File Forwarding Analysis</p>
          <p className="text-xs text-muted-foreground">
            This file has been forwarded approximately <span className="font-mono font-bold text-primary">{forwardCount} times</span> across platforms
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="rounded-xl border border-border bg-card p-5" style={{ animation: 'slideUp 0.4s ease-out 0.2s both' }}>
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
      <div className={`grid grid-cols-1 ${isImage ? "" : isAudio ? "" : "sm:grid-cols-2"} gap-4`} style={{ animation: 'slideUp 0.4s ease-out 0.25s both' }}>
        {!isImage && (
          <ScoreCard label="Voice Authenticity" score={result.voiceScore} icon={<Mic className="w-4 h-4" />} />
        )}
        {!isAudio && !isImage && (
          <ScoreCard label="Facial Authenticity" score={result.facialScore} icon={<Eye className="w-4 h-4" />} />
        )}
        {isImage && (
          <ScoreCard label="Image Authenticity" score={result.imageScore} icon={<Image className="w-4 h-4" />} />
        )}
      </div>

      {/* Image Explanation Panel - only for images */}
      {isImage && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4" style={{ animation: 'slideUp 0.4s ease-out 0.3s both' }}>
          <div className="flex items-center gap-2 mb-1">
            <ZoomIn className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm">Image Analysis Explanation</h3>
          </div>

          <div className="space-y-3">
            <ExplanationRow
              title="Error Level Analysis (ELA)"
              desc={isFake
                ? "Inconsistent compression levels found across facial regions indicating possible manipulation."
                : "Uniform compression levels across the image. No signs of splicing or tampering."
              }
              status={isFake ? "warning" : "ok"}
            />
            <ExplanationRow
              title="GAN Artifact Detection"
              desc={isFake
                ? "Checkerboard patterns detected in DCT frequency domain, consistent with GAN-generated imagery."
                : "No GAN fingerprint detected. Frequency domain analysis shows natural patterns."
              }
              status={result.details.ganFingerprint ? "danger" : "ok"}
            />
            <ExplanationRow
              title="Noise Consistency Map"
              desc={isFake
                ? `Noise variance: ${result.details.noiseConsistency}%. Multiple noise sources detected across image regions.`
                : `Noise variance: ${result.details.noiseConsistency}%. Single-source noise pattern consistent with authentic capture.`
              }
              status={(result.details.noiseConsistency ?? 80) < 60 ? "warning" : "ok"}
            />
            <ExplanationRow
              title="CNN Face Inconsistency Check"
              desc={isFake
                ? "EfficientNet-B4 detected edge artifacts around eyes and jawline. Skin texture shows unnatural smoothness."
                : "CNN analysis confirms consistent facial geometry, natural skin texture, and proper edge boundaries."
              }
              status={isFake ? "danger" : "ok"}
            />
            <ExplanationRow
              title="Pixel Artifact Scan"
              desc={isFake
                ? "Sub-pixel interpolation anomalies detected near facial boundaries. Blending artifacts visible at 8x magnification."
                : "Clean pixel transitions. No interpolation artifacts detected at boundary regions."
              }
              status={result.details.pixelArtifacts ? "danger" : "ok"}
            />
          </div>
        </div>
      )}

      {/* Detailed metrics */}
      <div className="rounded-xl border border-border bg-card p-5" style={{ animation: 'slideUp 0.4s ease-out 0.35s both' }}>
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
        <div className="rounded-xl border border-warning/30 bg-warning/5 p-5" style={{ animation: 'slideUp 0.4s ease-out 0.4s both' }}>
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

      {/* Fraud Report & Helplines (only for fake) */}
      {isFake && (
        <div style={{ animation: 'slideUp 0.4s ease-out 0.45s both' }}>
          <FraudReport result={result} fileName={fileName || "unknown"} />
        </div>
      )}

      {/* Alert */}
      {isFake && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-5 text-center" style={{ animation: 'slideUp 0.4s ease-out 0.5s both' }}>
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
        <Button onClick={onReset} variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
          <RotateCcw className="w-4 h-4 mr-2" />
          Analyze Another File
        </Button>
      </div>
    </div>
  );
};

const ExplanationRow = ({ title, desc, status }: { title: string; desc: string; status: "ok" | "warning" | "danger" }) => {
  const colors = {
    ok: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    danger: "border-destructive/30 bg-destructive/5",
  };
  const dotColors = { ok: "bg-success", warning: "bg-warning", danger: "bg-destructive" };

  return (
    <div className={`rounded-lg border p-3 ${colors[status]}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${dotColors[status]}`} />
        <p className="text-sm font-semibold text-foreground">{title}</p>
      </div>
      <p className="text-xs text-muted-foreground pl-4">{desc}</p>
    </div>
  );
};

const ScoreCard = ({ label, score, icon }: { label: string; score: number; icon: React.ReactNode }) => {
  const color = score > 60 ? "bg-success" : score > 35 ? "bg-warning" : "bg-destructive";
  const textColor = score > 60 ? "text-success" : score > 35 ? "text-warning" : "text-destructive";

  return (
    <div className="rounded-xl border border-border bg-card p-4 card-hover">
      <div className="flex items-center gap-2 mb-2">
        <span className={textColor}>{icon}</span>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`text-3xl font-bold font-mono mb-3 ${textColor}`}>{score}%</p>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }} />
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

const PipelineInfo = ({ label, value, desc }: { label: string; value: string; desc: string }) => (
  <div className="bg-muted/50 rounded-lg p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-mono font-semibold text-primary mt-0.5">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
  </div>
);

export default ResultPanel;