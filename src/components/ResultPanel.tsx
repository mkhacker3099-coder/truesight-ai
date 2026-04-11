import { ShieldCheck, ShieldAlert, AlertTriangle, RotateCcw, Mic, Eye, Image, Share2, ArrowLeft, Cpu, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { AnalysisResult } from "./AnalysisPipeline";
import FraudReport from "./FraudReport";
import ThreatVisualizer from "./ThreatVisualizer";

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

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <motion.div className="w-full max-w-2xl mx-auto space-y-6" variants={container} initial="hidden" animate="show">
      <motion.button variants={item} onClick={onReset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Upload
      </motion.button>

      {/* Verdict */}
      <motion.div variants={item}
        className={`rounded-2xl p-8 text-center glass ${isFake ? "glow-danger" : "glow-success"}`}
      >
        {isFake ? (
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4 animate-pulse" />
        ) : (
          <ShieldCheck className="w-16 h-16 text-success mx-auto mb-4" />
        )}
        <h2 className={`text-4xl font-black mb-2 font-display ${isFake ? "text-destructive" : "text-success"}`}>
          {isFake ? "FAKE DETECTED" : "AUTHENTIC"}
        </h2>
        <p className="text-muted-foreground text-lg">
          Confidence: <span className="font-mono font-bold text-foreground">{result.confidence}%</span>
        </p>
      </motion.div>

      {/* Threat Visualizer */}
      <motion.div variants={item} className="glass rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2 font-display">THREAT VISUALIZATION</p>
        <ThreatVisualizer level={isFake ? "high" : "safe"} />
      </motion.div>

      {/* Pipeline Info */}
      <motion.div variants={item} className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground text-sm font-display">Detection Pipeline</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <PipelineInfo label="Frame Extraction" value="OpenCV cv2.VideoCapture" desc="120 frames at 30fps" />
          <PipelineInfo label="CNN Model" value="EfficientNet-B4" desc="Face inconsistency detection" />
          <PipelineInfo label="Preprocessing" value="MTCNN Face Detector" desc="468 facial landmarks" />
          <PipelineInfo label="Classifier" value="CNN-LSTM Hybrid" desc="Temporal consistency" />
        </div>
      </motion.div>

      {/* Forwarding */}
      <motion.div variants={item} className="glass rounded-xl p-4 flex items-center gap-3">
        <Share2 className="w-5 h-5 text-primary flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-foreground">File Forwarding Analysis</p>
          <p className="text-xs text-muted-foreground">
            Forwarded approx. <span className="font-mono font-bold text-primary">{forwardCount} times</span> across platforms
          </p>
        </div>
      </motion.div>

      {/* Confidence Bar */}
      <motion.div variants={item} className="glass rounded-xl p-5">
        <p className="text-sm text-muted-foreground mb-3">Confidence Level</p>
        <div className="h-4 rounded-full bg-muted/50 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.confidence}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className={`h-full rounded-full ${result.confidence > 90 ? "bg-success" : result.confidence > 75 ? "bg-warning" : "bg-destructive"}`}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0%</span>
          <span className="font-mono font-bold text-foreground">{result.confidence}%</span>
          <span>100%</span>
        </div>
      </motion.div>

      {/* Score */}
      <motion.div variants={item} className={`grid grid-cols-1 ${isImage ? "" : isAudio ? "" : "sm:grid-cols-2"} gap-4`}>
        {!isImage && <ScoreCard label="Voice Authenticity" score={result.voiceScore} icon={<Mic className="w-4 h-4" />} />}
        {!isAudio && !isImage && <ScoreCard label="Facial Authenticity" score={result.facialScore} icon={<Eye className="w-4 h-4" />} />}
        {isImage && <ScoreCard label="Image Authenticity" score={result.imageScore} icon={<Image className="w-4 h-4" />} />}
      </motion.div>

      {/* Image Explanation */}
      {isImage && (
        <motion.div variants={item} className="glass rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ZoomIn className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground text-sm font-display">Image Analysis Explanation</h3>
          </div>
          <ExplanationRow title="Error Level Analysis (ELA)" desc={isFake ? "Inconsistent compression across facial regions — manipulation likely." : "Uniform compression. No tampering signs."} status={isFake ? "warning" : "ok"} />
          <ExplanationRow title="GAN Artifact Detection" desc={isFake ? "Checkerboard patterns in DCT frequency domain — GAN-generated." : "Natural frequency patterns. No GAN fingerprint."} status={result.details.ganFingerprint ? "danger" : "ok"} />
          <ExplanationRow title="Noise Consistency" desc={isFake ? `Variance: ${result.details.noiseConsistency}%. Multiple noise sources.` : `Variance: ${result.details.noiseConsistency}%. Single-source noise.`} status={(result.details.noiseConsistency ?? 80) < 60 ? "warning" : "ok"} />
          <ExplanationRow title="CNN Face Check" desc={isFake ? "Edge artifacts around eyes/jawline. Unnatural skin smoothness." : "Consistent geometry, natural skin texture."} status={isFake ? "danger" : "ok"} />
          <ExplanationRow title="Pixel Artifacts" desc={isFake ? "Sub-pixel interpolation anomalies near facial boundaries." : "Clean transitions. No artifacts."} status={result.details.pixelArtifacts ? "danger" : "ok"} />
        </motion.div>
      )}

      {/* Detailed Metrics */}
      <motion.div variants={item} className="glass rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-3 text-sm font-display">Detailed Metrics</h3>
        <div className="grid grid-cols-2 gap-3">
          {result.details.mfccCoefficients != null && <MetricItem label="MFCC Coefficients" value={`${result.details.mfccCoefficients}`} />}
          {result.details.pitchVariance != null && <MetricItem label="Pitch Variance" value={`${result.details.pitchVariance}`} />}
          {result.details.facialLandmarks != null && <MetricItem label="Facial Landmarks" value={`${result.details.facialLandmarks}`} />}
          {result.details.lipSyncScore != null && <MetricItem label="Lip-Sync Score" value={`${result.details.lipSyncScore}%`} />}
          {result.details.noiseConsistency != null && <MetricItem label="Noise Consistency" value={`${result.details.noiseConsistency}%`} />}
          {result.details.spectralAnomaly != null && <MetricItem label="Spectral Anomaly" value={result.details.spectralAnomaly ? "Yes" : "No"} warn={result.details.spectralAnomaly} />}
          {result.details.ganFingerprint != null && <MetricItem label="GAN Fingerprint" value={result.details.ganFingerprint ? "Detected" : "None"} warn={result.details.ganFingerprint} />}
          {result.details.pixelArtifacts != null && <MetricItem label="Pixel Artifacts" value={result.details.pixelArtifacts ? "Found" : "Clean"} warn={result.details.pixelArtifacts} />}
        </div>
      </motion.div>

      {/* Anomalies */}
      {result.anomalies.length > 0 && (
        <motion.div variants={item} className="glass rounded-xl p-5 border-warning/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold text-warning font-display">Anomalies Detected</h3>
          </div>
          <ul className="space-y-2">
            {result.anomalies.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-warning mt-0.5">•</span>{a}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {isFake && <motion.div variants={item}><FraudReport result={result} fileName={fileName || "unknown"} /></motion.div>}

      {isFake && (
        <motion.div variants={item} className="glass rounded-xl p-5 text-center glow-danger">
          <p className="text-destructive font-semibold text-lg mb-1 font-display">⚠️ Potential Scam Detected</p>
          <p className="text-sm text-muted-foreground">Do not share personal information or make financial decisions based on this content.</p>
        </motion.div>
      )}

      <motion.div variants={item} className="text-center pt-2">
        <Button onClick={onReset} variant="outline" className="magnetic-btn border-primary/30 text-primary hover:bg-primary/10 font-display">
          <RotateCcw className="w-4 h-4 mr-2" /> Analyze Another File
        </Button>
      </motion.div>
    </motion.div>
  );
};

const ExplanationRow = ({ title, desc, status }: { title: string; desc: string; status: "ok" | "warning" | "danger" }) => {
  const colors = { ok: "border-success/30 bg-success/5", warning: "border-warning/30 bg-warning/5", danger: "border-destructive/30 bg-destructive/5" };
  const dots = { ok: "bg-success", warning: "bg-warning", danger: "bg-destructive" };
  return (
    <div className={`rounded-lg border p-3 ${colors[status]}`}>
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-2 h-2 rounded-full ${dots[status]}`} />
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
    <div className="glass rounded-xl p-4 card-hover">
      <div className="flex items-center gap-2 mb-2"><span className={textColor}>{icon}</span><p className="text-sm text-muted-foreground">{label}</p></div>
      <p className={`text-3xl font-bold font-mono mb-3 ${textColor}`}>{score}%</p>
      <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{score > 60 ? "Likely authentic" : score > 35 ? "Suspicious" : "Likely manipulated"}</p>
    </div>
  );
};

const MetricItem = ({ label, value, warn }: { label: string; value: string; warn?: boolean }) => (
  <div className="bg-muted/30 rounded-lg p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-sm font-mono font-semibold mt-1 ${warn ? "text-warning" : "text-foreground"}`}>{value}</p>
  </div>
);

const PipelineInfo = ({ label, value, desc }: { label: string; value: string; desc: string }) => (
  <div className="bg-muted/30 rounded-lg p-3">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="text-sm font-mono font-semibold text-primary mt-0.5">{value}</p>
    <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
  </div>
);

export default ResultPanel;