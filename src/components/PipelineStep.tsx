import { LucideIcon, Check, Loader2 } from "lucide-react";

export type StepStatus = "pending" | "active" | "done";

interface PipelineStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  status: StepStatus;
  detail?: string;
}

const PipelineStep = ({ icon: Icon, title, description, status, detail }: PipelineStepProps) => {
  return (
    <div
      className={`relative rounded-xl border p-5 transition-all duration-500 ${
        status === "active"
          ? "border-primary/60 bg-primary/5 glow-primary"
          : status === "done"
          ? "border-success/40 bg-success/5"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            status === "active"
              ? "bg-primary/20 text-primary"
              : status === "done"
              ? "bg-success/20 text-success"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "done" ? (
            <Check className="w-5 h-5" />
          ) : status === "active" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className={`font-semibold text-sm ${
              status === "active"
                ? "text-primary"
                : status === "done"
                ? "text-success"
                : "text-muted-foreground"
            }`}
          >
            {title}
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          {detail && status === "done" && (
            <p className="text-xs font-mono text-success/80 mt-2 bg-success/5 rounded px-2 py-1">
              {detail}
            </p>
          )}
        </div>
      </div>

      {status === "active" && (
        <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ animation: "progress-fill 2s ease-in-out forwards" }}
          />
        </div>
      )}
    </div>
  );
};

export default PipelineStep;
