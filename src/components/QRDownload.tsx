import { QRCodeSVG } from "qrcode.react";
import { Download, Smartphone } from "lucide-react";

interface QRDownloadProps {
  url?: string;
}

const QRDownload = ({ url = "https://trusty-detector.lovable.app" }: QRDownloadProps) => {
  return (
    <div className="glass rounded-2xl p-6 text-center space-y-4">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Smartphone className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground font-display text-sm">Download VoxVerify</h3>
      </div>
      <div className="inline-block p-3 bg-white rounded-xl">
        <QRCodeSVG
          value={url}
          size={140}
          bgColor="#ffffff"
          fgColor="#0a0a1a"
          level="M"
          includeMargin={false}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Scan QR code to install on your device
      </p>
      <div className="flex items-center justify-center gap-1 text-xs text-primary">
        <Download className="w-3 h-3" />
        <span>Available on all platforms</span>
      </div>
    </div>
  );
};

export default QRDownload;