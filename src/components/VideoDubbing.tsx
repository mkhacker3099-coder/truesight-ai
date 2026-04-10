import { useState } from "react";
import { Languages, Loader2, Upload, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  "Hindi", "Spanish", "French", "German", "Japanese", "Korean",
  "Chinese", "Arabic", "Portuguese", "Russian", "Italian", "Tamil",
];

const VideoDubbing = () => {
  const [stage, setStage] = useState<"idle" | "selecting" | "processing" | "done">("idle");
  const [targetLang, setTargetLang] = useState("");
  const [progress, setProgress] = useState(0);

  const startUpload = () => setStage("selecting");

  const startProcessing = (lang: string) => {
    setTargetLang(lang);
    setStage("processing");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setStage("done");
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground text-center">AI Video Dubbing</h2>
      <p className="text-muted-foreground text-center">Auto-translate video into another language with lip-sync voice matching</p>

      {stage === "idle" && (
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <Languages className="w-16 h-16 text-primary mx-auto" />
          <p className="text-muted-foreground">Upload a video to translate and dub into another language</p>
          <Button onClick={startUpload} className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
            <Upload className="w-4 h-4 mr-2" /> Upload Video
          </Button>
        </div>
      )}

      {stage === "selecting" && (
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-foreground text-center">Select Target Language</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                onClick={() => startProcessing(lang)}
                className="rounded-lg border border-border bg-muted/50 p-3 text-sm text-foreground hover:bg-primary/10 hover:border-primary/30 transition-colors font-medium"
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === "processing" && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 p-8 text-center space-y-4 glow-primary">
          <Loader2 className="w-16 h-16 text-primary mx-auto animate-spin" />
          <p className="text-foreground font-semibold">Dubbing to {targetLang}...</p>
          <div className="max-w-sm mx-auto">
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{Math.min(Math.round(progress), 100)}% — Translating & syncing lip movements</p>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="rounded-xl border border-success/40 bg-success/5 p-8 text-center space-y-4">
          <CheckCircle2 className="w-16 h-16 text-success mx-auto" />
          <h3 className="text-xl font-bold text-foreground">Dubbing Complete!</h3>
          <p className="text-muted-foreground">Video has been dubbed to <span className="text-primary font-semibold">{targetLang}</span> with lip-sync matching</p>
          <div className="flex gap-3 justify-center">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Play className="w-4 h-4 mr-2" /> Preview
            </Button>
            <Button variant="outline" onClick={() => { setStage("idle"); setProgress(0); }} className="border-primary/30 text-primary">
              Dub Another
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoDubbing;
