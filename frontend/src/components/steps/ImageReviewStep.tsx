import { ArrowRight } from "lucide-react";
import { API_BASE } from "../../constants/api";
import type { IScene } from "../../types/project";

interface ImageReviewStepProps {
  scenes: IScene[];
  onBack: () => void;
  onApprove: () => void;
}

export function ImageReviewStep({ scenes, onBack, onApprove }: ImageReviewStepProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold font-outfit gradient-text">Verify Generated Images</h2>
            <p className="text-xs text-text-secondary mt-1">Review the asset visual layout matching the generated image prompts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {scenes.map((scene) => (
            <div key={scene.sceneNumber} className="border border-color bg-bg-secondary/20 p-4 rounded-xl flex flex-col gap-3">
              <span className="bg-bg-tertiary border border-color px-2.5 py-0.5 rounded-full text-xs font-bold text-accent-blue self-start">
                🎬 SCENE {scene.sceneNumber}
              </span>

              <div className="relative aspect-video rounded-lg overflow-hidden border border-color bg-bg-primary flex items-center justify-center">
                {scene.imageURL ? (
                  <img
                    src={`${API_BASE}${scene.imageURL}`}
                    alt={`Scene ${scene.sceneNumber}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-text-tertiary text-xs">No image generated</span>
                )}
              </div>

              <div className="text-xs">
                <span className="text-text-tertiary block font-bold mb-0.5">IMAGE PROMPT:</span>
                <p className="text-text-secondary leading-relaxed">{scene.imageGenPrompt}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-color">
          <button onClick={onBack} className="btn-secondary">
            Back to Storyboard
          </button>
          <button onClick={onApprove} className="btn-primary flex items-center gap-1.5">
            <span>Approve Images</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
