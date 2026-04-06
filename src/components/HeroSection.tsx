import { Shield, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="AI neural network shield"
          className="w-full h-full object-cover opacity-30"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Protection</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          <span className="text-foreground">DeepFake</span>
          <br />
          <span className="text-primary text-glow">Detector</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Detect AI-generated voice & video scams in real-time. Protect yourself from
          deepfake fraud with our advanced deep learning analysis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg px-8 py-6 font-semibold"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Detection
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/30 text-primary hover:bg-primary/10 text-lg px-8 py-6 font-semibold"
          >
            <Brain className="w-5 h-5 mr-2" />
            How It Works
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Shield, label: "Real-Time Detection", desc: "Instant analysis of media content" },
            { icon: Brain, label: "Deep Learning AI", desc: "Advanced neural network models" },
            { icon: Zap, label: "Audio + Video", desc: "Combined multi-modal analysis" },
          ].map((item, i) => (
            <div
              key={i}
              className="gradient-border rounded-xl bg-card p-6 text-center"
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
