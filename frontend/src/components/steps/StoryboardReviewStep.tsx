import { ArrowRight, Layers, RotateCcw } from "lucide-react";
import type { IScene, IVisualBible } from "../../types/project";

interface StoryboardReviewStepProps {
  refinedScript: string;
  universalTheme: string;
  universalAspectRatio: string;
  visualBible: IVisualBible;
  scenes: IScene[];
  onRefinedScriptChange: (value: string) => void;
  onUniversalThemeChange: (value: string) => void;
  onUniversalAspectRatioChange: (value: string) => void;
  onVisualBibleChange: (value: IVisualBible) => void;
  onSceneDetailChange: (index: number, value: string) => void;
  onSceneImagePromptChange: (index: number, value: string) => void;
  onSceneVideoPromptChange: (index: number, value: string) => void;
  onRestart: () => void;
  onApprove: () => void;
}

export function StoryboardReviewStep({
  refinedScript,
  universalTheme,
  universalAspectRatio,
  visualBible,
  scenes,
  onRefinedScriptChange,
  onUniversalThemeChange,
  onUniversalAspectRatioChange,
  onVisualBibleChange,
  onSceneDetailChange,
  onSceneImagePromptChange,
  onSceneVideoPromptChange,
  onRestart,
  onApprove,
}: StoryboardReviewStepProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="glass-card p-6">
        <h2 className="text-xl font-bold font-outfit mb-4 gradient-text">Storyboard & Script Breakdown</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b border-color pb-6">
          <div>
            <span className="text-xs text-text-tertiary block font-bold uppercase mb-1">UNIVERSAL THEME</span>
            <input
              type="text"
              value={universalTheme}
              onChange={(e) => onUniversalThemeChange(e.target.value)}
              className="w-full text-sm font-semibold"
            />
          </div>
          <div>
            <span className="text-xs text-text-tertiary block font-bold uppercase mb-1">ASPECT RATIO</span>
            <input
              type="text"
              value={universalAspectRatio}
              onChange={(e) => onUniversalAspectRatioChange(e.target.value)}
              className="w-full text-sm font-semibold"
            />
          </div>
          <div>
            <span className="text-xs text-text-tertiary block font-bold uppercase mb-1">REFINED SCRIPT NARRATIVE</span>
            <textarea
              value={refinedScript}
              rows={1}
              onChange={(e) => onRefinedScriptChange(e.target.value)}
              className="w-full text-xs font-semibold py-1.5 resize-y"
            />
          </div>
        </div>

        <div className="bg-bg-secondary/50 border border-color p-4 rounded-xl mb-6">
          <h3 className="text-xs font-bold text-accent-blue uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Visual Bible Specifications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-text-tertiary block">Art Style</span>
              <input
                type="text"
                value={visualBible.artStyle}
                onChange={(e) => onVisualBibleChange({ ...visualBible, artStyle: e.target.value })}
                className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
              />
            </div>
            <div>
              <span className="text-text-tertiary block">Environment</span>
              <input
                type="text"
                value={visualBible.environmentStyle}
                onChange={(e) => onVisualBibleChange({ ...visualBible, environmentStyle: e.target.value })}
                className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
              />
            </div>
            <div>
              <span className="text-text-tertiary block">Camera Style</span>
              <input
                type="text"
                value={visualBible.cameraStyle}
                onChange={(e) => onVisualBibleChange({ ...visualBible, cameraStyle: e.target.value })}
                className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
              />
            </div>
            <div>
              <span className="text-text-tertiary block">Color Palette</span>
              <input
                type="text"
                value={visualBible.colorPalette}
                onChange={(e) => onVisualBibleChange({ ...visualBible, colorPalette: e.target.value })}
                className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
              />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
          Scene Blueprints
        </h3>
        <div className="flex flex-col gap-4">
          {scenes.map((scene, idx) => (
            <div key={scene.sceneNumber} className="border border-color bg-bg-secondary/30 p-4 rounded-xl flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="bg-bg-tertiary border border-color px-2.5 py-0.5 rounded-full text-xs font-bold text-accent-blue">
                  🎬 SCENE {scene.sceneNumber}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-[10px] font-bold text-text-tertiary block mb-1">NARRATIVE DETAIL</label>
                  <textarea
                    rows={2}
                    value={scene.sceneDetail}
                    onChange={(e) => onSceneDetailChange(idx, e.target.value)}
                    className="w-full text-sm bg-bg-secondary"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-text-tertiary block mb-1">IMAGE PROMPT</label>
                    <input
                      type="text"
                      value={scene.imageGenPrompt}
                      onChange={(e) => onSceneImagePromptChange(idx, e.target.value)}
                      className="w-full text-xs bg-bg-secondary"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-text-tertiary block mb-1">VIDEO PROMPT</label>
                    <input
                      type="text"
                      value={scene.videoGenPrompt}
                      onChange={(e) => onSceneVideoPromptChange(idx, e.target.value)}
                      className="w-full text-xs bg-bg-secondary"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-4 border-t border-color">
          <button onClick={onRestart} className="btn-secondary flex items-center gap-1.5">
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
          <button onClick={onApprove} className="btn-primary flex items-center gap-1.5">
            <span>Approve Script & Scenes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
