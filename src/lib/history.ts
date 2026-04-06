import type { AnalysisResult } from "@/components/AnalysisPipeline";

export interface ScanRecord {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  result: AnalysisResult;
  timestamp: number;
}

const HISTORY_KEY = "deepfake_scan_history";

export const getScanHistory = (): ScanRecord[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const addScanRecord = (record: Omit<ScanRecord, "id" | "timestamp">): ScanRecord => {
  const entry: ScanRecord = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  const history = getScanHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  return entry;
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};
