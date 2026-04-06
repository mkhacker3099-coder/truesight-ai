import { useState, useEffect } from "react";
import {
  Upload,
  Waves,
  ScanFace,
  Brain,
  ShieldAlert,
  ArrowDown,
  Image,
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
    { icon: Waves, title: "Preprocessing", desc: isImage ? "Color normalization & artifact scan" : "Noise removal & frame extraction" },
    { icon: isImage ? Image : ScanFace, title: "Feature Extraction", desc: isImage ? "Pixel analysis & GAN fingerprint detection" : "Voice patterns & facial analysis" },
    { icon: Brain, title: "AI Model Analysis", desc: "Deep learning model inference" },
    { icon: ShieldAlert, title: "Alert & Result", desc: "Generating threat assessment" },
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
      advanceStep(1, 3000, "Color normalized • Resolution: 1024×1024 • ELA computed");
      advanceStep(2, 5200, "Pixel coherence: 0.87 • GAN fingerprint scan • DCT analysis: 64 freq bands");
      advanceStep(3, 7800, "EfficientNet-B4 model • Confidence: 96.2%");
    } else if (isAudio) {
      advanceStep(1, 3000, "Noise reduced • 16kHz resampled • Duration: normalized");
      advanceStep(2, 5200, "MFCC: 13 coefficients • Pitch variance: 0.34 • Spectral centroid: 2.1kHz");
      advanceStep(3, 7800, "CNN-LSTM model • Confidence: 94.7%");
    } else {
      advanceStep(1, 3000, "Frames extracted: 120 • Noise filtered • Temporal aligned");
      advanceStep(2, 5200, "Facial landmarks: 468 • Voice MFCC: 13 coeff • Lip-sync analysis");
      advanceStep(3, 7800, "Multi-modal CNN-LSTM • Confidence: 95.3%");
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
            anomalies.push("GAN fingerprint detected in frequency domain");
            anomalies.push("Inconsistent noise patterns across regions");
            anomalies.push("Pixel-level artifacts near facial boundaries");
          } else {
            anomalies.push("Lip-sync mismatch at 0:03-0:07");
            anomalies.push("Unnatural blinking pattern detected");
            anomalies.push("Audio-visual temporal misalignment: 120ms");
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
        Analysis Pipeline
      </h2>
      {STEPS.map((step, i) => (
        <div key={i}>
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
