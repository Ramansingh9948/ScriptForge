import { AlertTriangle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <div className="glass-card border-accent-pink bg-red-950/20 p-4 rounded-xl flex items-start gap-3 mb-6">
      <AlertTriangle className="w-5 h-5 text-accent-pink shrink-0 mt-0.5" />
      <div>
        <h3 className="font-bold text-accent-pink">Error Occurred</h3>
        <p className="text-sm text-text-secondary mt-1">{message}</p>
      </div>
    </div>
  );
}
