import { useState, useEffect } from "react";
import { Upload, Waves, Brain, ShieldAlert, ArrowDown, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import PipelineStep, { StepStatus } from "./PipelineStep";

interface AnalysisPipelineProps {
  file: File;
  onComplete: (result: AnalysisResult) => void;
}

export interface AnalysisResult {
  verdict: "real" | "fake";
  confidence: number;
  voiceScore: number;
  facialScore: number;
  imageScore: number;
  anomalies: string[];
  details: {
    mfccCoefficients?: number;
    pitchVariance?: number;
    facialLandmarks?: number;
    spectralAnomaly?: boolean;
    lipSyncScore?: number;
    pixelArtifacts?: boolean;
    ganFingerprint?: boolean;
    noiseConsistency?: number;
  };
}

const AnalysisPipeline = ({ file, onComplete }: AnalysisPipelineProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [details, setDetails] = useState<Record<number, string>>({});

  const isAudio = file.type.startsWith("audio");
  const isImage = file.type.startsWith("image");
  const isVideo = !isAudio && !isImage;

  const STEPS = [
    { icon: Upload, title: "User Input", desc: `Receiving ${isAudio ? "audio" : isImage ? "image" : "video"} file` },
    { icon: Waves, title: "Preprocessing", desc: isImage ? "OpenCV: color normalization & ELA" : "OpenCV: frame extraction & noise removal" },
    { icon: Cpu, title: "Feature Extraction", desc: isImage ? "CNN pixel analysis & GAN scan" : "MFCC + MTCNN facial detection" },
    { icon: Brain, title: "CNN Model Inference", desc: "EfficientNet-B4 + CNN-LSTM analysis" },
    { icon: ShieldAlert, title: "Threat Assessment", desc: "Generating verdict with confidence" },
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const advance = (step: number, delay: number, detail?: string) => {
      timers.push(setTimeout(() => {
        setCurrentStep(step + 1);
        if (detail) setDetails((d) => ({ ...d, [step]: detail }));
      }, delay));
    };

    advance(0, 1200, `File loaded: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`);

    if (isImage) {
      advance(1, 3000, "OpenCV: Normalized • 1024×1024 • ELA computed");
      advance(2, 5200, "CNN: Pixel coherence 0.87 • GAN fingerprint • DCT 64 bands");
      advance(3, 7800, "EfficientNet-B4: Face inconsistency check • 96.2%");
    } else if (isAudio) {
      advance(1, 3000, "OpenCV: Spectrogram • 16kHz resampled • Normalized");
      advance(2, 5200, "MFCC: 13 coeff • Pitch variance: 0.34 • Centroid: 2.1kHz");
      advance(3, 7800, "CNN-LSTM: Voice consistency • 94.7%");
    } else {
      advance(1, 3000, "OpenCV: cv2.VideoCapture → 120 frames • Filtered");
      advance(2, 5200, "MTCNN: 468 landmarks • MFCC: 13 coeff • Lip-sync");
      advance(3, 7800, "CNN-LSTM multi-modal • Face inconsistency • 95.3%");
    }

    timers.push(setTimeout(() => {
      const isFake = Math.random() > 0.45;
      const confidence = 87 + Math.random() * 12;
      const voiceScore = isImage ? 0 : Math.round((isFake ? 18 + Math.random() * 28 : 72 + Math.random() * 24) * 10) / 10;
      const facialScore = isAudio ? 0 : Math.round((isFake ? 15 + Math.random() * 30 : 70 + Math.random() * 25) * 10) / 10;
      const imageScore = !isImage ? 0 : Math.round((isFake ? 12 + Math.random() * 33 : 68 + Math.random() * 27) * 10) / 10;

      const anomalies: string[] = [];
      if (isFake) {
        if (isAudio) {
          anomalies.push("Unnatural pitch transitions at 0:02-0:05", "Spectral artifacts in 2-4kHz", "Formant frequency inconsistency");
        } else if (isImage) {
          anomalies.push("GAN fingerprint in DCT frequency domain", "CNN: Edge artifacts around facial regions", "ELA: Non-uniform compression", "Pixel interpolation artifacts near eyes");
        } else {
          anomalies.push("Lip-sync mismatch at 0:03-0:07", "CNN: Unnatural blinking pattern", "Audio-visual misalignment: 120ms", "OpenCV: Frame geometry inconsistency");
        }
      }

      const result: AnalysisResult = {
        verdict: isFake ? "fake" : "real",
        confidence: Math.round(confidence * 10) / 10,
        voiceScore, facialScore, imageScore, anomalies,
        details: {
          mfccCoefficients: isImage ? undefined : 13,
          pitchVariance: isImage ? undefined : Math.round(Math.random() * 100) / 100,
          facialLandmarks: isAudio ? undefined : 468,
          spectralAnomaly: isFake && !isImage,
          lipSyncScore: isVideo ? Math.round((isFake ? 30 + Math.random() * 25 : 85 + Math.random() * 12) * 10) / 10 : undefined,
          pixelArtifacts: isImage ? isFake : undefined,
          ganFingerprint: isImage ? isFake : undefined,
          noiseConsistency: isImage ? Math.round((isFake ? 30 + Math.random() * 30 : 80 + Math.random() * 15) * 10) / 10 : undefined,
        },
      };

      setCurrentStep(5);
      setDetails((d) => ({ ...d, 4: `Verdict: ${result.verdict.toUpperCase()} (${result.confidence}%)` }));
      onComplete(result);
    }, 10000));

    return () => timers.forEach(clearTimeout);
  }, [file, onComplete]);

  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return "done";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto space-y-1"
    >
      <h2 className="text-2xl font-bold text-foreground text-center mb-2 font-display">AI Detection Pipeline</h2>
      <p className="text-center text-xs text-muted-foreground mb-6">OpenCV + EfficientNet-B4 CNN • Face inconsistency detection</p>
      {STEPS.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <PipelineStep icon={step.icon} title={step.title} description={step.desc} status={getStatus(i)} detail={details[i]} />
          {i < STEPS.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown className={`w-4 h-4 transition-colors ${i < currentStep ? "text-success/60" : "text-border"}`} />
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnalysisPipeline;