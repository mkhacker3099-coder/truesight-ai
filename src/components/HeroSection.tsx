import { Shield, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Scene3D from "./Scene3D";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Scene3D />

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/30 via-background/60 to-background pointer-events-none" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,_transparent_30%,_hsl(230_25%_3%_/_0.8)_100%)] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
        >
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Security Shield Active</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-8xl font-black tracking-tight mb-6 leading-tight font-display"
        >
          <span className="text-foreground">Vox</span>
          <span className="text-primary text-glow">Verify</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Your AI-powered security shield is active and monitoring.
          Detect deepfake voice, video & image scams in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button
            size="lg"
            onClick={onGetStarted}
            className="magnetic-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-primary text-lg px-8 py-6 font-semibold font-display"
          >
            <Zap className="w-5 h-5 mr-2" />
            Start Detection
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="magnetic-btn border-secondary/50 text-secondary hover:bg-secondary/10 text-lg px-8 py-6 font-semibold"
          >
            <Brain className="w-5 h-5 mr-2" />
            How It Works
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Shield, label: "Real-Time Detection", desc: "Instant analysis of media content" },
            { icon: Brain, label: "Deep Learning CNN", desc: "EfficientNet-B4 neural network" },
            { icon: Zap, label: "Multi-Modal Analysis", desc: "Audio + Video + Image scanning" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="glass rounded-xl p-6 text-center card-hover"
            >
              <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">{item.label}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;