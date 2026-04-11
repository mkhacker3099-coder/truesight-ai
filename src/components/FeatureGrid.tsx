import { Upload, Waves, ScanFace, Brain, ShieldAlert, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Upload, title: "User Input", desc: "Upload audio (MP3, WAV), video (MP4, AVI), or image (JPG, PNG) files for analysis." },
  { icon: Waves, title: "Preprocessing", desc: "OpenCV frame extraction, noise removal, and ELA computation for manipulation detection." },
  { icon: ScanFace, title: "Feature Extraction", desc: "MFCC voice patterns, MTCNN facial landmarks, and GAN fingerprint scanning." },
  { icon: Brain, title: "CNN Deep Learning", desc: "EfficientNet-B4 + CNN-LSTM neural networks for face inconsistency detection." },
  { icon: ShieldAlert, title: "Alert Warning", desc: "Instant threat alerts with fraud reporting and government helpline numbers." },
  { icon: CheckCircle2, title: "Result: Real / Fake", desc: "Clear verdict with confidence score, detailed metrics, and image explanations." },
];

const FeatureGrid = () => {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4 font-display"
        >
          Detection Pipeline
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-muted-foreground text-center max-w-xl mx-auto mb-12"
        >
          Our 6-stage deep learning pipeline powered by OpenCV & CNN models
        </motion.p>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={item}
              className="glass rounded-xl p-6 card-hover group"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all group-hover:scale-110">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid;