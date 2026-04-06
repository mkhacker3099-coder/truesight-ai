import { useState, useCallback, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeatureGrid from "@/components/FeatureGrid";
import FileUpload from "@/components/FileUpload";
import AnalysisPipeline, { AnalysisResult } from "@/components/AnalysisPipeline";
import ResultPanel from "@/components/ResultPanel";
import ProfilePanel from "@/components/ProfilePanel";
import HistoryPanel from "@/components/HistoryPanel";
import { addScanRecord, type ScanRecord } from "@/lib/history";

type Stage = "landing" | "upload" | "analyzing" | "result";
type Page = "home" | "profile" | "history";

const Index = () => {
  const [stage, setStage] = useState<Stage>("landing");
  const [page, setPage] = useState<Page>("home");
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

  // Save to history when result is set
  const handleCompleteAndSave = useCallback((r: AnalysisResult) => {
    handleComplete(r);
    if (file) {
      addScanRecord({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        result: r,
      });
    }
  }, [file, handleComplete]);

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setStage("upload");
  };

  const handleNavigate = (p: string) => {
    setPage(p as Page);
    if (p === "home" && stage === "landing") {
      setStage("landing");
    }
  };

  const handleViewHistoryResult = (record: ScanRecord) => {
    setResult(record.result);
    setFile(new File([], record.fileName, { type: record.fileType }));
    setStage("result");
    setPage("home");
  };

  const isAudio = file?.type.startsWith("audio") ?? false;
  const isImage = file?.type.startsWith("image") ?? false;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={handleNavigate} activePage={page} />

      {page === "profile" && (
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto">
            <ProfilePanel />
          </div>
        </div>
      )}

      {page === "history" && (
        <div className="pt-24 pb-20 px-4">
          <div className="container mx-auto">
            <HistoryPanel onViewResult={handleViewHistoryResult} />
          </div>
        </div>
      )}

      {page === "home" && (
        <>
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
                <AnalysisPipeline file={file} onComplete={handleCompleteAndSave} />
              )}
              {stage === "result" && result && (
                <ResultPanel
                  result={result}
                  isAudio={isAudio}
                  isImage={isImage}
                  onReset={handleReset}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
