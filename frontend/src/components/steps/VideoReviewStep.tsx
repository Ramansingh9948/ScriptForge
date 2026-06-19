import { ArrowRight } from "lucide-react";
import { API_BASE } from "../../constants/api";
import type { IScene } from "../../types/project";

interface VideoReviewStepProps {
  scenes: IScene[];
  onBack: () => void;
  onApprove: () => void;
}

export function VideoReviewStep({ scenes, onBack, onApprove }: VideoReviewStepProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold font-outfit gradient-text">Verify Scene Video Clips</h2>
            <p className="text-xs text-text-secondary mt-1">Preview individual video segments before they are compiled and stitched.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {scenes.map((scene) => (
            <div key={scene.sceneNumber} className="border border-color bg-bg-secondary/20 p-4 rounded-xl flex flex-col gap-3">
              <span className="bg-bg-tertiary border border-color px-2.5 py-0.5 rounded-full text-xs font-bold text-accent-blue self-start">
                🎬 SCENE {scene.sceneNumber}
              </span>

              <div className="relative aspect-video rounded-lg overflow-hidden border border-color bg-bg-primary">
                {scene.videoURL ? (
                  <video
                    src={`${API_BASE}${scene.videoURL}`}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-text-tertiary text-xs flex justify-center items-center h-full">No video generated</span>
                )}
              </div>

              <div className="text-xs">
                <span className="text-text-tertiary block font-bold mb-0.5">VIDEO PROMPT:</span>
                <p className="text-text-secondary leading-relaxed">{scene.videoGenPrompt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-color">
          <button onClick={onBack} className="btn-secondary">
            Back to Images
          </button>
          <button onClick={onApprove} className="btn-primary flex items-center gap-1.5">
            <span>Approve Videos & Stitch Final</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
