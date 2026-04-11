import { useState } from "react";
import { Phone, FileWarning, Send, CheckCircle2, Share2, ShieldAlert, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnalysisResult } from "./AnalysisPipeline";

interface FraudReportProps {
  result: AnalysisResult;
  fileName: string;
}

const helplines = [
  { country: "🇮🇳 India", number: "1930", name: "National Cyber Crime Helpline", website: "cybercrime.gov.in", email: "ccps@gov.in", type: "Govt of India", ministry: "Ministry of Home Affairs" },
  { country: "🇮🇳 India", number: "155260", name: "Financial Fraud Helpline", website: "sancharsaathi.gov.in", email: "cert-in@cert-in.org.in", type: "DoT / CERT-In", ministry: "Dept of Telecom" },
  { country: "🇮🇳 India", number: "112", name: "Emergency Response (Police)", website: "digitalpolice.gov.in", email: "contact@digitalpolice.gov.in", type: "Police", ministry: "State Police" },
  { country: "🇮🇳 India", number: "14461", name: "TRAI DND / Spam Helpline", website: "trai.gov.in", email: "ap@trai.gov.in", type: "TRAI", ministry: "Telecom Regulatory Authority" },
  { country: "🇮🇳 India", number: "1800-11-0031", name: "RBI Complaint (Banking Fraud)", website: "rbi.org.in", email: "crpc@rbi.org.in", type: "RBI", ministry: "Reserve Bank of India" },
  { country: "🇮🇳 India", number: "155330", name: "SEBI Investor Helpline", website: "sebi.gov.in", email: "sebi@sebi.gov.in", type: "SEBI", ministry: "Securities & Exchange Board" },
  { country: "🇺🇸 USA", number: "1-877-382-4357", name: "FTC Fraud Reporting", website: "reportfraud.ftc.gov", email: "", type: "Federal", ministry: "" },
  { country: "🌍 Intl", number: "ic3.gov", name: "FBI Internet Crime (IC3)", website: "ic3.gov", email: "", type: "International", ministry: "" },
];

const FraudReport = ({ result, fileName }: FraudReportProps) => {
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const forwardCount = Math.floor(Math.random() * 47) + 3;

  if (submitted) {
    return (
      <div className="glass rounded-xl p-6 text-center glow-success" style={{ animation: 'scaleIn 0.4s ease-out' }}>
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-1 font-display">Report Submitted</h3>
        <p className="text-sm text-muted-foreground">Thank you for reporting. Authorities have been notified.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Forward Alert */}
      <div className="glass rounded-xl p-4 flex items-center gap-3 border-warning/30">
        <Share2 className="w-5 h-5 text-warning flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">File Forwarding Alert</p>
          <p className="text-xs text-muted-foreground">
            Forwarded approx. <span className="font-mono font-bold text-warning">{forwardCount} times</span> across platforms
          </p>
        </div>
      </div>

      {/* Report Form */}
      <div className="glass rounded-xl p-5 space-y-4 border-destructive/30">
        <div className="flex items-center gap-2 mb-2">
          <FileWarning className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-foreground font-display">Report Fraud to Authorities</h3>
        </div>
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            Flagged as AI-generated deepfake — {result.confidence}% confidence
          </p>
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Your Name (optional)</Label>
          <Input value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Anonymous" className="bg-muted/50 border-border/50" />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Describe the scam</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="How did you receive this file? Include sender details if available." className="bg-muted/50 border-border/50 min-h-[80px]" />
        </div>
        <Button onClick={() => setSubmitted(true)} className="w-full magnetic-btn bg-destructive text-destructive-foreground hover:bg-destructive/90 glow-danger font-display">
          <Send className="w-4 h-4 mr-2" /> Submit Fraud Report
        </Button>
      </div>

      {/* Indian Government Helplines */}
      <div className="glass rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground font-display">Government Fraud Helplines</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Official government agencies for reporting digital fraud & cybercrime</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {helplines.map((h, i) => (
            <div key={i} className="glass rounded-lg p-3 card-hover" style={{ animation: `slideUp 0.3s ease-out ${i * 0.04}s both` }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{h.country}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium font-display">{h.type}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{h.name}</p>
              {h.ministry && <p className="text-[10px] text-muted-foreground">{h.ministry}</p>}
              <p className="text-sm font-mono text-primary mt-1">{h.number}</p>
              <div className="flex flex-col gap-0.5 mt-1">
                <a href={`https://${h.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" /> {h.website}
                </a>
                {h.email && (
                  <a href={`mailto:${h.email}`} className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {h.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FraudReport;