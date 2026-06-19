import { useState } from "react";
import { API_BASE } from "../constants/api";
import type { IScene, IVisualBible } from "../types/project";
import { EMPTY_VISUAL_BIBLE } from "../types/project";

export function useProjectPipeline() {
  const [step, setStep] = useState<number>(1);
  const [inputScript, setInputScript] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [refinedScript, setRefinedScript] = useState<string>("");
  const [universalTheme, setUniversalTheme] = useState<string>("");
  const [universalAspectRatio, setUniversalAspectRatio] = useState<string>("");
  const [visualBible, setVisualBible] = useState<IVisualBible>({ ...EMPTY_VISUAL_BIBLE });
  const [scenes, setScenes] = useState<IScene[]>([]);
  const [finalVideoURL, setFinalVideoURL] = useState<string>("");
  const [qaPassed, setQaPassed] = useState<boolean>(false);
  const [qaNotes, setQaNotes] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleApiError = (err: unknown) => {
    console.error(err);
    const message =
      err instanceof Error
        ? err.message
        : "Something went wrong. Please check that the backend is running on http://localhost:5000.";
    setError(message);
    setLoading(false);
  };

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

  const handleRestart = () => {
    setInputScript("");
    setProjectId("");
    setRefinedScript("");
    setUniversalTheme("");
    setUniversalAspectRatio("");
    setVisualBible({ ...EMPTY_VISUAL_BIBLE });
    setScenes([]);
    setFinalVideoURL("");
    setQaPassed(false);
    setQaNotes("");
    setStep(1);
    setError("");
  };

  return {
    step,
    setStep,
    inputScript,
    setInputScript,
    refinedScript,
    setRefinedScript,
    universalTheme,
    setUniversalTheme,
    universalAspectRatio,
    setUniversalAspectRatio,
    visualBible,
    setVisualBible,
    scenes,
    finalVideoURL,
    qaPassed,
    qaNotes,
    loading,
    loadingMessage,
    error,
    handleCreateProject,
    updateSceneDetail,
    updateSceneImagePrompt,
    updateSceneVideoPrompt,
    handleApproveScript,
    handleApproveImages,
    handleApproveVideos,
    handleRestart,
  };
}
