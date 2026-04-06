import { useState, useRef } from "react";
import { Upload, FileAudio, FileVideo, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    onFileSelect(file);
  };

  const isAudio = selectedFile?.type.startsWith("audio");
  const isVideo = selectedFile?.type.startsWith("video");

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-foreground text-center mb-2">
        Upload Media
      </h2>
      <p className="text-muted-foreground text-center mb-6">
        Upload an audio or video file for deepfake analysis
      </p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all duration-300 ${
          dragActive
            ? "border-primary bg-primary/10 glow-primary"
            : selectedFile
            ? "border-success/50 bg-success/5"
            : "border-border hover:border-primary/50 hover:bg-primary/5"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="space-y-3">
            {isAudio ? (
              <FileAudio className="w-12 h-12 text-success mx-auto" />
            ) : (
              <FileVideo className="w-12 h-12 text-success mx-auto" />
            )}
            <p className="text-foreground font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB •{" "}
              {isAudio ? "Audio" : isVideo ? "Video" : "Media"} File
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
            >
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
            <p className="text-foreground font-medium">
              Drop your file here or click to browse
            </p>
            <p className="text-sm text-muted-foreground">
              Supports MP3, WAV, MP4, AVI, MOV and more
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
