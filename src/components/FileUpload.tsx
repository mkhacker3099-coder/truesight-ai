import { useState, useRef } from "react";
import { Upload, FileAudio, FileVideo, Image, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
    if (file.type.startsWith("image")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
    onFileSelect(file);
  };

  const isAudio = selectedFile?.type.startsWith("audio");
  const isVideo = selectedFile?.type.startsWith("video");
  const isImage = selectedFile?.type.startsWith("image");
  const FileIcon = isAudio ? FileAudio : isVideo ? FileVideo : Image;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-foreground text-center mb-2 font-display">Upload Media</h2>
      <p className="text-muted-foreground text-center mb-6">Upload audio, video, or image for deepfake analysis</p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300 glass ${
          dragActive
            ? "border-primary bg-primary/10 glow-primary"
            : selectedFile
            ? "border-success/50"
            : "border-border/50 hover:border-primary/50 hover:glow-primary"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,video/*,image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="space-y-3">
            {preview ? (
              <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
            ) : (
              <FileIcon className="w-12 h-12 text-success mx-auto" />
            )}
            <p className="text-foreground font-medium">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {isAudio ? "Audio" : isVideo ? "Video" : isImage ? "Image" : "Media"}
            </p>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreview(null); }}>
              <X className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <p className="text-foreground font-medium">Drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supports MP3, WAV, MP4, AVI, MOV, JPG, PNG</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FileUpload;