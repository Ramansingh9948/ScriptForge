import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WorkflowState } from "../state/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..", "..");

const getMode = (): string => {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8"));
    return process.env.MODE || pkg.mode || "mock";
  } catch (e) {
    return process.env.MODE || "mock";
  }
};

export const videoGenAgent = async (
  state: typeof WorkflowState.State,
  llmInstance: any
) => {
  const mode = getMode();
  console.log(`--- VIDEO GEN AGENT: Generating Scene Videos (Mode: ${mode}) ---`);

  if (mode === "api") {
    const endpoint = process.env.AZURE_SORA_ENDPOINT;
    const key = process.env.AZURE_SORA_KEY;

    // If Sora API endpoints and keys are configured, make real API requests
    if (endpoint && key) {
      console.log(`Azure Sora credentials detected. Triggering real video generation at: ${endpoint}`);

      const updatedScenes = await Promise.all(
        state.scenes.map(async (scene) => {
          try {
            console.log(`Submitting Video Gen request for Scene ${scene.sceneNumber}...`);
            
            // Standard Sora / Video AI task creation POST request
            const response = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`,
                "api-key": key,
              },
              body: JSON.stringify({
                prompt: scene.videoGenPrompt,
                image_url: scene.imageURL, // Image-to-Video context
                duration: 5,
                aspect_ratio: state.universalAspectRatio || "16:9",
              }),
            });

            if (!response.ok) {
              const errText = await response.text();
              throw new Error(`Sora API task submission failed: ${response.status} - ${errText}`);
            }

            const data: any = await response.json();
            
            // If the response returns a direct video URL (some APIs do):
            let videoURL = data.video_url || data.url;

            // If the response returns a status polling endpoint (typical for Sora/video models):
            const taskId = data.id || data.task_id;
            const statusUrl = data.status_url || (taskId ? `${endpoint}/status/${taskId}` : null);

            if (statusUrl && !videoURL) {
              console.log(`Video task submitted successfully (Task ID: ${taskId}). Polling status...`);
              let isDone = false;
              let attempts = 0;
              const maxAttempts = 20; // limit polling to ~100s

              while (!isDone && attempts < maxAttempts) {
                // Wait 5 seconds between polls
                await new Promise((resolve) => setTimeout(resolve, 5000));
                attempts++;

                const pollResponse = await fetch(statusUrl, {
                  headers: {
                    "Authorization": `Bearer ${key}`,
                    "api-key": key,
                  },
                });

                if (pollResponse.ok) {
                  const pollData: any = await pollResponse.json();
                  const status = pollData.status?.toLowerCase();

                  if (status === "completed" || status === "succeeded") {
                    videoURL = pollData.video_url || pollData.url;
                    isDone = true;
                    console.log(`Sora video generation completed for Scene ${scene.sceneNumber}: ${videoURL}`);
                  } else if (status === "failed") {
                    throw new Error(`Sora task execution failed on Azure: ${pollData.error || "unknown error"}`);
                  } else {
                    console.log(`Scene ${scene.sceneNumber} video status: ${status} (Attempt ${attempts}/${maxAttempts})`);
                  }
                }
              }
            }

            if (!videoURL) {
              throw new Error("Video URL could not be resolved from Sora API response or polling timeout.");
            }

            return {
              ...scene,
              videoURL: videoURL,
              isVideoGenerated: true,
              remarkVideo: [...(scene.remarkVideo || []), "Generated using Azure Sora Video Gen API"],
            };
          } catch (err: any) {
            console.error(`Sora API failed for Scene ${scene.sceneNumber}:`, err);
            // Fallback to local mock asset if API fails
            const mockIndex = (scene.sceneNumber % 4) + 1;
            const fallbackVideo = `/static/Video/${mockIndex}.mp4`;
            return {
              ...scene,
              videoURL: scene.videoURL || fallbackVideo,
              isVideoGenerated: true,
              remarkVideo: [...(scene.remarkVideo || []), `Sora API error: ${err.message || err}. Felled back to mock.`],
            };
          }
        })
      );

      return {
        scenes: updatedScenes,
      };
    } else {
      console.log("Azure Sora credentials not fully set in .env. Falling back to mock video clips.");
      // Fall back to mock videos
      const updatedScenes = state.scenes.map((scene, index) => {
        const mockVideoIndex = (index % 4) + 1;
        const videoURL = `/static/Video/${mockVideoIndex}.mp4`;
        return {
          ...scene,
          videoURL: scene.videoURL || videoURL,
          isVideoGenerated: true,
          remarkVideo: [...(scene.remarkVideo || []), "Sora credentials not set, fallback to mock video"],
        };
      });
      return {
        scenes: updatedScenes,
      };
    }
  } else {
    // Mock Mode
    const updatedScenes = state.scenes.map((scene, index) => {
      const mockVideoIndex = (index % 4) + 1;
      const videoURL = `/static/Video/${mockVideoIndex}.mp4`;
      return {
        ...scene,
        videoURL: scene.videoURL || videoURL,
        isVideoGenerated: true,
        remarkVideo: [...(scene.remarkVideo || []), "Mock video mapped successfully"],
      };
    });

    return {
      scenes: updatedScenes,
    };
  }
};
