import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Film, 
  Image as ImageIcon, 
  Video as VideoIcon, 
  RotateCcw,
  Layers, 
  AlertTriangle,
  Info
} from "lucide-react";

interface IVisualBible {
  artStyle: string;
  characterDescription: string;
  characterWardrobe: string;
  environmentStyle: string;
  lightingStyle: string;
  cameraStyle: string;
  colorPalette: string;
  renderQuality: string;
}

interface IScene {
  sceneNumber: number;
  sceneDetail: string;
  imageGenPrompt: string;
  videoGenPrompt: string;
  imageURL?: string;
  videoURL?: string;
  caption?: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  const [step, setStep] = useState<number>(1);
  const [inputScript, setInputScript] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [refinedScript, setRefinedScript] = useState<string>("");
  const [universalTheme, setUniversalTheme] = useState<string>("");
  const [universalAspectRatio, setUniversalAspectRatio] = useState<string>("");
  const [visualBible, setVisualBible] = useState<IVisualBible>({
    artStyle: "",
    characterDescription: "",
    characterWardrobe: "",
    environmentStyle: "",
    lightingStyle: "",
    cameraStyle: "",
    colorPalette: "",
    renderQuality: "",
  });
  const [scenes, setScenes] = useState<IScene[]>([]);
  const [finalVideoURL, setFinalVideoURL] = useState<string>("");
  const [qaPassed, setQaPassed] = useState<boolean>(false);
  const [qaNotes, setQaNotes] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Preset prompts
  const presets = [
    "An astronaut discovering an ancient neon temple on Mars.",
    "A cyberpunk detective searching for a missing holographic cat in Neo-Tokyo.",
    "A majestic underwater reef glowing with bio-luminescent flora, tracked by a mini-sub."
  ];

  // Helper to handle API errors
  const handleApiError = (err: any) => {
    console.error(err);
    setError(err.message || "Something went wrong. Please check that the backend is running on http://localhost:5000.");
    setLoading(false);
  };

  // 1. Submit script to /api/project/create
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputScript.trim()) return;

    setError("");
    setLoading(true);
    setLoadingMessage("Analyzing script and generating scene blueprints... This runs the Director Agent.");

    try {
      const response = await fetch(`${API_BASE}/api/project/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputScript }),
      });

      if (!response.ok) throw new Error("Failed to initialize project.");
      const data = await response.json();

      setProjectId(data.projectId);
      setRefinedScript(data.refinedScript);
      setUniversalTheme(data.universalTheme);
      setUniversalAspectRatio(data.universalAspectRatio);
      setVisualBible(data.visualBible);
      setScenes(data.scenes);
      setStep(2);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to update local scenes state as user edits details
  const updateSceneDetail = (index: number, val: string) => {
    const next = [...scenes];
    if (next[index]) {
      next[index].sceneDetail = val;
      setScenes(next);
    }
  };

  const updateSceneImagePrompt = (index: number, val: string) => {
    const next = [...scenes];
    if (next[index]) {
      next[index].imageGenPrompt = val;
      setScenes(next);
    }
  };

  const updateSceneVideoPrompt = (index: number, val: string) => {
    const next = [...scenes];
    if (next[index]) {
      next[index].videoGenPrompt = val;
      setScenes(next);
    }
  };

  // 2. Approve script/scenes to /api/project/approve-script
  const handleApproveScript = async () => {
    setError("");
    setLoading(true);
    setLoadingMessage("Designer Agent generating scene images from approved details... (API fallback to mock assets)");

    try {
      const response = await fetch(`${API_BASE}/api/project/approve-script`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          scenes,
          refinedScript,
          universalTheme,
          universalAspectRatio,
          visualBible,
        }),
      });

      if (!response.ok) throw new Error("Failed to process script approval.");
      const data = await response.json();

      setScenes(data.scenes);
      setStep(3);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Approve images to /api/project/approve-images
  const handleApproveImages = async () => {
    setError("");
    setLoading(true);
    setLoadingMessage("Video Gen Agent assembling motion prompts and generating video scenes... (API fallback to mock assets)");

    try {
      const response = await fetch(`${API_BASE}/api/project/approve-images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, scenes }),
      });

      if (!response.ok) throw new Error("Failed to process image approval.");
      const data = await response.json();

      setScenes(data.scenes);
      setStep(4);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Approve videos to /api/project/approve-videos (final assembly)
  const handleApproveVideos = async () => {
    setError("");
    setLoading(true);
    setLoadingMessage("Editor Agent applying captions, adding background music, stitching scenes via FFmpeg, and verifying with QA Agent...");

    try {
      const response = await fetch(`${API_BASE}/api/project/approve-videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, scenes }),
      });

      if (!response.ok) throw new Error("Failed to compile final video.");
      const data = await response.json();

      setFinalVideoURL(data.finalVideoURL);
      setQaPassed(data.qaPassed);
      setQaNotes(data.qaNotes);
      setStep(5);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // 5. Restart flow
  const handleRestart = () => {
    setInputScript("");
    setProjectId("");
    setRefinedScript("");
    setUniversalTheme("");
    setUniversalAspectRatio("");
    setVisualBible({
      artStyle: "",
      characterDescription: "",
      characterWardrobe: "",
      environmentStyle: "",
      lightingStyle: "",
      cameraStyle: "",
      colorPalette: "",
      renderQuality: "",
    });
    setScenes([]);
    setFinalVideoURL("");
    setQaPassed(false);
    setQaNotes("");
    setStep(1);
    setError("");
  };

  return (
    <div className="min-height-vh flex flex-col p-4 md:p-8 max-w-6xl mx-auto">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8 border-b border-color pb-4">
        <div className="flex items-center gap-2">
          <Film className="w-8 h-8 text-accent-blue" />
          <h1 className="logo-text text-2xl font-extrabold uppercase tracking-wider">ScriptForge</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary bg-bg-secondary px-3 py-1.5 border border-color rounded-full">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse"></span>
          <span>Pipeline Active</span>
        </div>
      </header>

      {/* STEPPER PROGRESS */}
      <div className="stepper-container w-full mb-8">
        <div className="stepper-line" />
        <div 
          className="stepper-line-active" 
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        />
        {[
          { num: 1, label: "Script", icon: Sparkles },
          { num: 2, label: "Storyboard", icon: Layers },
          { num: 3, label: "Images", icon: ImageIcon },
          { num: 4, label: "Videos", icon: VideoIcon },
          { num: 5, label: "Assemble", icon: Film },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="flex flex-col items-center gap-1 z-10">
              <div 
                className={`step-node ${step === s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}
                title={s.label}
              >
                {step > s.num ? "✓" : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs font-semibold ${step === s.num ? "text-accent-blue" : "text-text-secondary"}`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-grow flex flex-col justify-center">
        {error && (
          <div className="glass-card border-accent-pink bg-red-950/20 p-4 rounded-xl flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-accent-pink shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-accent-pink">Error Occurred</h3>
              <p className="text-sm text-text-secondary mt-1">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="glass-card p-12 text-center flex flex-col justify-center items-center">
            <div className="cyber-spinner mb-6"></div>
            <h3 className="text-xl font-bold font-outfit mb-2 gradient-text">Agent Processing</h3>
            <p className="text-text-secondary max-w-md text-sm leading-relaxed">{loadingMessage}</p>
          </div>
        ) : (
          <>
            {/* STEP 1: INPUT SCRIPT */}
            {step === 1 && (
              <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto w-full">
                <h2 className="text-2xl font-bold font-outfit mb-2 gradient-text">Create New Video Project</h2>
                <p className="text-text-secondary text-sm mb-6">
                  Input a short script concept. Our director agent will refine the narration, establish a thematic Bible, and segment it into detailed storyboard scenes.
                </p>

                <form onSubmit={handleCreateProject} className="flex flex-col gap-4">
                  <label htmlFor="scriptInput" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                    NARATIVE PROMPT
                  </label>
                  <textarea
                    id="scriptInput"
                    rows={4}
                    value={inputScript}
                    onChange={(e) => setInputScript(e.target.value)}
                    placeholder="Describe your video project idea (e.g. A deep space reconnaissance ship descends into a neon dust storm...)"
                    className="w-full"
                    required
                  />

                  {/* PRESET PROMPTS */}
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-text-tertiary block mb-2">TRY AN EXAMPLE CONCEPT:</span>
                    <div className="flex flex-col gap-2">
                      {presets.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setInputScript(preset)}
                          className="text-left text-xs bg-bg-secondary hover:bg-bg-tertiary border border-color hover:border-text-secondary p-2.5 rounded-lg text-text-secondary transition-all"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!inputScript.trim()}
                    className="btn-primary flex justify-center items-center gap-2 w-full py-3"
                  >
                    <span>Launch Director Agent</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* STEP 2: STORYBOARD REVIEW */}
            {step === 2 && (
              <div className="flex flex-col gap-6 w-full">
                <div className="glass-card p-6">
                  <h2 className="text-xl font-bold font-outfit mb-4 gradient-text">Storyboard & Script Breakdown</h2>
                  
                  {/* STYLE SPECIFICATIONS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 border-b border-color pb-6">
                    <div>
                      <span className="text-xs text-text-tertiary block font-bold uppercase mb-1">UNIVERSAL THEME</span>
                      <input 
                        type="text" 
                        value={universalTheme} 
                        onChange={(e) => setUniversalTheme(e.target.value)} 
                        className="w-full text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-text-tertiary block font-bold uppercase mb-1">ASPECT RATIO</span>
                      <input 
                        type="text" 
                        value={universalAspectRatio} 
                        onChange={(e) => setUniversalAspectRatio(e.target.value)} 
                        className="w-full text-sm font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-xs text-text-tertiary block font-bold uppercase mb-1">REFINED SCRIPT NARRATIVE</span>
                      <textarea 
                        value={refinedScript} 
                        rows={1}
                        onChange={(e) => setRefinedScript(e.target.value)} 
                        className="w-full text-xs font-semibold py-1.5 resize-y"
                      />
                    </div>
                  </div>

                  {/* VISUAL BIBLE CAROUSEL/DETAILS */}
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
                          onChange={(e) => setVisualBible({...visualBible, artStyle: e.target.value})} 
                          className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
                        />
                      </div>
                      <div>
                        <span className="text-text-tertiary block">Environment</span>
                        <input 
                          type="text" 
                          value={visualBible.environmentStyle} 
                          onChange={(e) => setVisualBible({...visualBible, environmentStyle: e.target.value})} 
                          className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
                        />
                      </div>
                      <div>
                        <span className="text-text-tertiary block">Camera Style</span>
                        <input 
                          type="text" 
                          value={visualBible.cameraStyle} 
                          onChange={(e) => setVisualBible({...visualBible, cameraStyle: e.target.value})} 
                          className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
                        />
                      </div>
                      <div>
                        <span className="text-text-tertiary block">Color Palette</span>
                        <input 
                          type="text" 
                          value={visualBible.colorPalette} 
                          onChange={(e) => setVisualBible({...visualBible, colorPalette: e.target.value})} 
                          className="bg-transparent border-0 border-b border-color focus:border-accent-blue rounded-none p-1 w-full text-text-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SCENES EDITING TABLE */}
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
                              onChange={(e) => updateSceneDetail(idx, e.target.value)}
                              className="w-full text-sm bg-bg-secondary"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-text-tertiary block mb-1">IMAGE PROMPT</label>
                              <input
                                type="text"
                                value={scene.imageGenPrompt}
                                onChange={(e) => updateSceneImagePrompt(idx, e.target.value)}
                                className="w-full text-xs bg-bg-secondary"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-text-tertiary block mb-1">VIDEO PROMPT</label>
                              <input
                                type="text"
                                value={scene.videoGenPrompt}
                                onChange={(e) => updateSceneVideoPrompt(idx, e.target.value)}
                                className="w-full text-xs bg-bg-secondary"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-color">
                    <button onClick={handleRestart} className="btn-secondary flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                    <button onClick={handleApproveScript} className="btn-primary flex items-center gap-1.5">
                      <span>Approve Script & Scenes</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: IMAGE REVIEW */}
            {step === 3 && (
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
                        
                        {/* Image Viewer */}
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
                    <button onClick={() => setStep(2)} className="btn-secondary">
                      Back to Storyboard
                    </button>
                    <button onClick={handleApproveImages} className="btn-primary flex items-center gap-1.5">
                      <span>Approve Images</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: VIDEO REVIEW */}
            {step === 4 && (
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
                        
                        {/* Video Viewer */}
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
                    <button onClick={() => setStep(3)} className="btn-secondary">
                      Back to Images
                    </button>
                    <button onClick={handleApproveVideos} className="btn-primary flex items-center gap-1.5">
                      <span>Approve Videos & Stitch Final</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: FINAL OUTPUT RESULT */}
            {step === 5 && (
              <div className="glass-card p-6 md:p-8 max-w-3xl mx-auto w-full">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center p-3 bg-green-500/10 border border-green-500/30 rounded-full mb-3">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold font-outfit gradient-text">Video Rendered Successfully!</h2>
                  <p className="text-xs text-text-secondary mt-1">Stitched video with background music and captions overlayed is ready.</p>
                </div>

                {/* Final Stitched Video Player */}
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

                {/* QA REPORT CARD */}
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
                    onClick={handleRestart} 
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
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center text-[10px] text-text-tertiary mt-12 pt-4 border-t border-color">
        ScriptForge Video Generation Agentic Pipeline prototype. Backend: LangGraph + Express + FFmpeg.
      </footer>
    </div>
  );
}

export default App;
