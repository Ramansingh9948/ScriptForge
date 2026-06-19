import { AlertTriangle, CheckCircle, Info, RotateCcw } from "lucide-react";
import { API_BASE } from "../../constants/api";

interface FinalOutputStepProps {
  finalVideoURL: string;
  qaPassed: boolean;
  qaNotes: string;
  onRestart: () => void;
}

export function FinalOutputStep({ finalVideoURL, qaPassed, qaNotes, onRestart }: FinalOutputStepProps) {
  return (
    <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto w-full">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 border border-green-500/30 rounded-full mb-3">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold font-outfit gradient-text">Video Rendered Successfully!</h2>
        <p className="text-xs text-text-secondary mt-1">Stitched video with background music and captions overlayed is ready.</p>
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden border border-color bg-bg-primary shadow-2xl mb-6">
        {finalVideoURL ? (
          <video
            src={`${API_BASE}${finalVideoURL}`}
            controls
            autoPlay
            className="w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
            <AlertTriangle className="w-10 h-10 text-accent-pink mb-2" />
            <span>Video asset URL not resolved</span>
          </div>
        )}
      </div>

      <div className="bg-bg-secondary/40 border border-color rounded-xl p-5 mb-8">
        <h3 className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          Director's QA Report Card
        </h3>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold ${qaPassed ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {qaPassed ? "PASSED" : "FAILED"}
          </div>
          <p className="text-xs text-text-secondary leading-relaxed italic">
            "{qaNotes || "All checks completed successfully."}"
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="btn-primary flex-1 flex justify-center items-center gap-2 py-3"
        >
          <RotateCcw className="w-4.5 h-4.5" />
          <span>Create Another Video</span>
        </button>
        {finalVideoURL && (
          <a
            href={`${API_BASE}${finalVideoURL}`}
            download="ScriptForge_Video.mp4"
            className="btn-secondary flex-1 flex justify-center items-center gap-2 py-3 text-center"
          >
            <span>Download Video</span>
          </a>
        )}
      </div>
    </div>
  );
}
