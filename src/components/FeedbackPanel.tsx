import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";

const FeedbackPanel = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg mx-auto text-center py-16">
        <CheckCircle2 className="w-16 h-16 text-success mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-foreground mb-2 font-display">Thank You!</h2>
        <p className="text-muted-foreground">Your feedback helps improve VoxVerify!</p>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-foreground text-center font-display">Your Feedback</h2>
      <p className="text-muted-foreground text-center">Help us improve VoxVerify</p>

      <div className="glass rounded-xl p-6 space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Rate your experience</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="transition-transform hover:scale-125">
                <Star className={`w-8 h-8 ${star <= (hover || rating) ? "fill-warning text-warning" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
        </div>
        <Textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder="Tell us what you think..." className="bg-muted/50 border-border/50 min-h-[120px]" />
        <Button onClick={() => { if (rating > 0) setSubmitted(true); }} disabled={rating === 0} className="w-full magnetic-btn bg-primary text-primary-foreground hover:bg-primary/90 glow-primary font-display">
          <Send className="w-4 h-4 mr-2" /> Submit Feedback
        </Button>
      </div>
    </motion.div>
  );
};

export default FeedbackPanel;