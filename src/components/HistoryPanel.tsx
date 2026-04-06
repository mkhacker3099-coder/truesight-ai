import { Trash2, ShieldCheck, ShieldAlert, Clock, Image, FileAudio, FileVideo } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getScanHistory, clearHistory, type ScanRecord } from "@/lib/history";
import { useState } from "react";

interface HistoryPanelProps {
  onViewResult?: (record: ScanRecord) => void;
}

const HistoryPanel = ({ onViewResult }: HistoryPanelProps) => {
  const [history, setHistory] = useState(getScanHistory());

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  const getIcon = (type: string) => {
    if (type.startsWith("audio")) return FileAudio;
    if (type.startsWith("video")) return FileVideo;
    return Image;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Scan History</h2>
        {history.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear} className="border-destructive/30 text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-1" /> Clear All
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>No scan history yet. Upload a file to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((record) => {
            const Icon = getIcon(record.fileType);
            const isFake = record.result.verdict === "fake";
            return (
              <button
                key={record.id}
                onClick={() => onViewResult?.(record)}
                className="w-full text-left rounded-xl border border-border bg-card p-4 hover:bg-primary/5 transition-colors flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isFake ? "bg-destructive/10" : "bg-success/10"}`}>
                  <Icon className={`w-5 h-5 ${isFake ? "text-destructive" : "text-success"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{record.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(record.timestamp).toLocaleDateString()} • {(record.fileSize / 1024).toFixed(0)} KB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-mono font-bold ${isFake ? "text-destructive" : "text-success"}`}>
                    {record.result.confidence}%
                  </span>
                  {isFake ? (
                    <ShieldAlert className="w-5 h-5 text-destructive" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-success" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HistoryPanel;
