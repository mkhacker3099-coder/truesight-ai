import { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import FileUpload from "@/components/FileUpload";
import AnalysisPipeline, { AnalysisResult } from "@/components/AnalysisPipeline";
import ResultPanel from "@/components/ResultPanel";

type Stage = "landing" | "upload" | "analyzing" | "result";

const Index = () => {
  const [stage, setStage] = useState<Stage>("landing");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const detectRef = useRef<HTMLDivElement>(null);

  const scrollToDetect = () => {
    setStage("upload");
    setTimeout(() => detectRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleFileSelect = (f: File) => {
    setFile(f);
    setStage("analyzing");
  };

  const handleComplete = useCallback((r: AnalysisResult) => {
    setResult(r);
    setStage("result");
  }, []);

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStage("upload");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {(stage === "landing" || stage === "upload") && (
        <HeroSection onGetStarted={scrollToDetect} />
      )}

      <div id="features">
        {(stage === "landing" || stage === "upload") && <FeatureGrid />}
      </div>

      <div id="detect" ref={detectRef} className="py-20 px-4">
        <div className="container mx-auto">
          {stage === "upload" && <FileUpload onFileSelect={handleFileSelect} />}
          {stage === "analyzing" && file && (
            <AnalysisPipeline file={file} onComplete={handleComplete} />
          )}
          {stage === "result" && result && (
            <ResultPanel
              result={result}
              isAudio={file?.type.startsWith("audio") ?? false}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
