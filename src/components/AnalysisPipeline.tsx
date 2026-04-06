import { useState, useEffect } from "react";
import {
  Upload,
  Waves,
  ScanFace,
  Brain,
  ShieldAlert,
  CheckCircle2,
  ArrowDown,
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
  anomalies: string[];
}

const STEPS = [
  { icon: Upload, title: "User Input", desc: "Receiving audio/video file" },
  { icon: Waves, title: "Preprocessing", desc: "Noise removal & frame extraction" },
  { icon: ScanFace, title: "Feature Extraction", desc: "Voice patterns & facial analysis" },
  { icon: Brain, title: "AI Model Analysis", desc: "Deep learning model inference" },
  { icon: ShieldAlert, title: "Alert & Result", desc: "Generating threat assessment" },
];

const AnalysisPipeline = ({ file, onComplete }: AnalysisPipelineProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [details, setDetails] = useState<Record<number, string>>({});

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

    const isAudio = file.type.startsWith("audio");

    advanceStep(0, 1200, `File loaded: ${file.name} (${(file.size / 1024).toFixed(0)}KB)`);
    advanceStep(1, 3000, isAudio ? "Noise reduced • 16kHz resampled" : "Frames extracted: 120 • Noise filtered");
    advanceStep(2, 5200, isAudio ? "MFCC features: 13 coefficients • Pitch variance: 0.34" : "Facial landmarks: 468 • Voice MFCC: 13 coeff");
    advanceStep(3, 7800, "CNN-LSTM model • Confidence: 94.7%");

    timers.push(
      setTimeout(() => {
        // Simulate result - randomized for demo
        const isFake = Math.random() > 0.5;
        const confidence = 85 + Math.random() * 14;
        const result: AnalysisResult = {
          verdict: isFake ? "fake" : "real",
          confidence: Math.round(confidence * 10) / 10,
          voiceScore: Math.round((isFake ? 20 + Math.random() * 30 : 75 + Math.random() * 20) * 10) / 10,
          facialScore: isAudio ? 0 : Math.round((isFake ? 15 + Math.random() * 35 : 70 + Math.random() * 25) * 10) / 10,
          anomalies: isFake
            ? [
                "Unnatural pitch transitions detected",
                "Lip-sync mismatch at 0:03-0:07",
                "Spectral artifacts in 2-4kHz range",
              ]
            : [],
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
