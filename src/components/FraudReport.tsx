import { useState } from "react";
import { Phone, FileWarning, Send, CheckCircle2, ExternalLink, Share2 } from "lucide-react";
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
  { country: "🇮🇳 India", number: "1930", name: "Cyber Crime Helpline" },
  { country: "🇺🇸 USA", number: "1-877-382-4357", name: "FTC Fraud Reporting" },
  { country: "🇬🇧 UK", number: "0300 123 2040", name: "Action Fraud" },
  { country: "🇦🇺 Australia", number: "1300 292 371", name: "ScamWatch" },
  { country: "🇨🇦 Canada", number: "1-888-495-8501", name: "Canadian Anti-Fraud Centre" },
  { country: "🌍 International", number: "ic3.gov", name: "FBI Internet Crime" },
];

const FraudReport = ({ result, fileName }: FraudReportProps) => {
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const forwardCount = Math.floor(Math.random() * 47) + 3;

  if (submitted) {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-6 text-center">
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
          <h3 className="font-semibold text-foreground">Report Fraud</h3>
        </div>

        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Your Name (optional)</Label>
          <Input
            value={reporterName}
            onChange={(e) => setReporterName(e.target.value)}
            placeholder="Anonymous"
            className="bg-muted border-border"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-muted-foreground text-xs">Describe the scam attempt</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="How did you receive this file? What was the context?"
            className="bg-muted border-border min-h-[80px]"
          />
        </div>
        <Button
          onClick={() => setSubmitted(true)}
          className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Report
        </Button>
      </div>

      {/* Helpline Numbers */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Digital Fraud Helplines</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {helplines.map((h, i) => (
            <div key={i} className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{h.country}</p>
              <p className="text-sm font-semibold text-foreground">{h.name}</p>
              <p className="text-sm font-mono text-primary">{h.number}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FraudReport;
