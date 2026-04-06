import { Upload, Waves, ScanFace, Brain, ShieldAlert, CheckCircle2 } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "User Input",
    desc: "Upload audio (MP3, WAV) or video (MP4, AVI) files for instant analysis.",
  },
  {
    icon: Waves,
    title: "Preprocessing",
    desc: "Advanced noise removal and video frame extraction to prepare media for analysis.",
  },
  {
    icon: ScanFace,
    title: "Feature Extraction",
    desc: "Extract voice patterns (MFCC, pitch) and facial landmarks for multi-modal detection.",
  },
  {
    icon: Brain,
    title: "AI Deep Learning Model",
    desc: "CNN-LSTM neural network trained on thousands of deepfake samples for high accuracy.",
  },
  {
    icon: ShieldAlert,
    title: "Alert Warning",
    desc: "Instant threat alerts with detailed breakdown if manipulation is detected.",
  },
  {
    icon: CheckCircle2,
    title: "Result: Real / Fake",
    desc: "Clear verdict with confidence score, anomaly details, and recommended actions.",
  },
];

const FeatureGrid = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto max-w-6xl">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
        Detection Pipeline
      </h2>
      <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
        Our 6-stage deep learning pipeline analyzes every aspect of your media
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="gradient-border rounded-xl bg-card p-6 hover:bg-primary/5 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureGrid;
