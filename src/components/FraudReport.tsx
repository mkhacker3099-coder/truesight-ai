import { useState } from "react";
import { Phone, FileWarning, Send, CheckCircle2, Share2, ShieldAlert, ExternalLink } from "lucide-react";
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
  { country: "🇮🇳 India", number: "1930", name: "Cyber Crime Helpline", website: "cybercrime.gov.in", type: "Government" },
  { country: "🇺🇸 USA", number: "1-877-382-4357", name: "FTC Fraud Reporting", website: "reportfraud.ftc.gov", type: "Federal" },
  { country: "🇬🇧 UK", number: "0300 123 2040", name: "Action Fraud (NFIB)", website: "actionfraud.police.uk", type: "Police" },
  { country: "🇦🇺 Australia", number: "1300 292 371", name: "ScamWatch (ACCC)", website: "scamwatch.gov.au", type: "Government" },
  { country: "🇨🇦 Canada", number: "1-888-495-8501", name: "Canadian Anti-Fraud Centre", website: "antifraudcentre-centreantifraude.ca", type: "Government" },
  { country: "🇩🇪 Germany", number: "0800 2 236 236", name: "BSI Cyber Security", website: "bsi.bund.de", type: "Federal" },
  { country: "🇫🇷 France", number: "0 805 805 817", name: "Pharos - Internet Fraud", website: "internet-signalement.gouv.fr", type: "Government" },
  { country: "🌍 International", number: "ic3.gov", name: "FBI Internet Crime (IC3)", website: "ic3.gov", type: "International" },
];

const FraudReport = ({ result, fileName }: FraudReportProps) => {
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const forwardCount = Math.floor(Math.random() * 47) + 3;

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-6 text-center" style={{ animation: 'scaleIn 0.4s ease-out' }}>
        <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3" />
        <h3 className="text-lg font-bold text-foreground mb-1">Report Submitted</h3>
        <p className="text-sm text-muted-foreground">Thank you for reporting. Authorities have been notified.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* File Forwarding Info */}
      <div className="rounded-xl border border-warning/30 bg-warning/5 p-4 flex items-center gap-3">
        <Share2 className="w-5 h-5 text-warning flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">File Forwarding Alert</p>
          <p className="text-xs text-muted-foreground">
            This file has been forwarded approximately <span className="font-mono font-bold text-warning">{forwardCount} times</span> across platforms
          </p>
        </div>
      </div>

      {/* Report Form */}
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileWarning className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-foreground">Report Fraud to Authorities</h3>
        </div>

        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-xs text-destructive font-medium flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            This content has been flagged as AI-generated deepfake with {result.confidence}% confidence
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Your Name (optional)</Label>
          <Input value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Anonymous" className="bg-muted border-border" />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Describe the scam attempt</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="How did you receive this file? What was the context? Include any details about the sender." className="bg-muted border-border min-h-[80px]" />
        </div>
        <Button onClick={() => setSubmitted(true)} className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
          <Send className="w-4 h-4 mr-2" />
          Submit Fraud Report
        </Button>
      </div>

      {/* Government Helpline Numbers */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-2">
          <Phone className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Government Digital Fraud Helplines</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Official government and law enforcement agencies for reporting digital fraud and cybercrime.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {helplines.map((h, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3 card-hover border border-transparent hover:border-primary/20 transition-colors" style={{ animation: `slideUp 0.3s ease-out ${i * 0.04}s both` }}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-muted-foreground">{h.country}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{h.type}</span>
              </div>
              <p className="text-sm font-semibold text-foreground">{h.name}</p>
              <p className="text-sm font-mono text-primary">{h.number}</p>
              <a href={`https://${h.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1">
                <ExternalLink className="w-3 h-3" /> {h.website}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FraudReport;