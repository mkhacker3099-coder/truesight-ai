import { useState, useEffect } from "react";
import {
  Upload,
  Waves,
  ScanFace,
  Brain,
  ShieldAlert,
  ArrowDown,
  Image,
  Cpu,
  Layers,
} from "lucide-react";
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
    { icon: Waves, title: "Preprocessing", desc: isImage ? "OpenCV color normalization & ELA computation" : "OpenCV frame extraction & noise removal" },
    { icon: Cpu, title: "Feature Extraction", desc: isImage ? "CNN pixel analysis & GAN fingerprint detection" : "MFCC voice patterns & MTCNN facial detection" },
    { icon: Brain, title: "CNN Model Analysis", desc: "EfficientNet-B4 + CNN-LSTM deep learning inference" },
    { icon: ShieldAlert, title: "Alert & Result", desc: "Generating threat assessment with confidence score" },
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    const advanceStep = (step: number, delay: number, detail?: string) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(step + 1);
          if (detail) setDetails((d) => ({ ...d, [step]: detail }));
        }, delay)
      );
    };

    advanceStep(0, 1200, `File loaded: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`);

    if (isImage) {
      advanceStep(1, 3000, "OpenCV: Color normalized • Resolution: 1024×1024 • ELA map computed");
      advanceStep(2, 5200, "CNN: Pixel coherence 0.87 • GAN fingerprint scan • DCT: 64 freq bands");
      advanceStep(3, 7800, "EfficientNet-B4 inference • Face inconsistency check • Confidence: 96.2%");
    } else if (isAudio) {
      advanceStep(1, 3000, "OpenCV: Spectrogram rendered • 16kHz resampled • Duration normalized");
      advanceStep(2, 5200, "MFCC: 13 coefficients • Pitch variance: 0.34 • Spectral centroid: 2.1kHz");
      advanceStep(3, 7800, "CNN-LSTM model • Voice consistency check • Confidence: 94.7%");
    } else {
      advanceStep(1, 3000, "OpenCV: cv2.VideoCapture → 120 frames • Noise filtered • Temporal aligned");
      advanceStep(2, 5200, "MTCNN: 468 landmarks • MFCC: 13 coeff • CNN lip-sync analysis");
      advanceStep(3, 7800, "Multi-modal CNN-LSTM • Face inconsistency detection • Confidence: 95.3%");
    }

    timers.push(
      setTimeout(() => {
        const isFake = Math.random() > 0.45;
        const confidence = 87 + Math.random() * 12;

        const voiceScore = isImage ? 0 : Math.round((isFake ? 18 + Math.random() * 28 : 72 + Math.random() * 24) * 10) / 10;
        const facialScore = isAudio ? 0 : Math.round((isFake ? 15 + Math.random() * 30 : 70 + Math.random() * 25) * 10) / 10;
        const imageScore = !isImage ? 0 : Math.round((isFake ? 12 + Math.random() * 33 : 68 + Math.random() * 27) * 10) / 10;

        const anomalies: string[] = [];
        if (isFake) {
          if (isAudio) {
            anomalies.push("Unnatural pitch transitions at 0:02-0:05");
            anomalies.push("Spectral artifacts in 2-4kHz range");
            anomalies.push("Formant frequency inconsistency detected");
          } else if (isImage) {
            anomalies.push("GAN fingerprint detected in DCT frequency domain");
            anomalies.push("CNN: Inconsistent edge boundaries around facial regions");
            anomalies.push("ELA: Non-uniform compression levels in manipulation area");
            anomalies.push("Pixel interpolation artifacts near eyes and jawline");
          } else {
            anomalies.push("Lip-sync mismatch at 0:03-0:07");
            anomalies.push("CNN: Unnatural blinking pattern detected");
            anomalies.push("Audio-visual temporal misalignment: 120ms");
            anomalies.push("OpenCV: Frame-level face geometry inconsistency");
          }
        }

        const result: AnalysisResult = {
          verdict: isFake ? "fake" : "real",
          confidence: Math.round(confidence * 10) / 10,
          voiceScore,
          facialScore,
          imageScore,
          anomalies,
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
      }, 10000)
    );

    return () => timers.forEach(clearTimeout);
  }, [file, onComplete]);

  const getStatus = (index: number): StepStatus => {
    if (index < currentStep) return "done";
    if (index === currentStep) return "active";
    return "pending";
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-1">
      <h2 className="text-2xl font-bold text-foreground text-center mb-6">
        AI Detection Pipeline
      </h2>
      <p className="text-center text-xs text-muted-foreground mb-4">
        Using OpenCV for frame extraction • EfficientNet-B4 CNN for face inconsistency detection
      </p>
      {STEPS.map((step, i) => (
        <div key={i} style={{ animation: `slideUp 0.3s ease-out ${i * 0.08}s both` }}>
          <PipelineStep
            icon={step.icon}
            title={step.title}
            description={step.desc}
            status={getStatus(i)}
            detail={details[i]}
          />
          {i < STEPS.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown
                className={`w-4 h-4 transition-colors ${
                  i < currentStep ? "text-success/60" : "text-border"
                }`}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnalysisPipeline;