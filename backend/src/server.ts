import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import {
  directorAgent,
  designerAgent,
  videoGenAgent,
  captionAgent,
  editorAgent,
  qaAgent,
  directorLLM,
} from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parsing
app.use(cors());
app.use(express.json());

// Resolve directories relative to project root
const projectRoot = path.join(__dirname, "..");
const mockAssetsPath = fs.existsSync(path.join(projectRoot, "src", "Mock-assets"))
  ? path.join(projectRoot, "src", "Mock-assets")
  : path.join(__dirname, "Mock-assets");

const exportsPath = fs.existsSync(path.join(projectRoot, "src", "exports"))
  ? path.join(projectRoot, "src", "exports")
  : path.join(__dirname, "exports");

// Expose static directories for Mock-assets and final stitched outputs
app.use("/static", express.static(mockAssetsPath));
app.use("/exports", express.static(exportsPath));

// In-memory store for project sessions
const projectStore: Record<string, any> = {};

console.log("Express Server configuring static directories:");
console.log("- Mock assets path:", mockAssetsPath);
console.log("- Exports path:", exportsPath);

/* ==================================================
   API ENDPOINTS
   ================================================== */

// 1. CREATE PROJECT: Run Director Agent to generate refined script & scenes
app.post("/api/project/create", async (req, res) => {
  const { inputScript } = req.body;
  if (!inputScript) {
    return res.status(400).json({ error: "Missing inputScript in request body" });
  }

  try {
    console.log("Starting script refinement for prompt:", inputScript);
    
    // Call the Director Agent
    const result = await directorAgent({ inputScript } as any, directorLLM);
    
    const projectId = crypto.randomUUID();
    
    // Initialize project state
    const projectState = {
      projectId,
      inputScript,
      refinedScript: result.refinedScript,
      universalTheme: result.universalTheme,
      universalAspectRatio: result.universalAspectRatio,
      visualBible: result.visualBible,
      scenes: result.scenes,
    };

    projectStore[projectId] = projectState;

    res.json(projectState);
  } catch (error: any) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: error.message || "Failed to refine script" });
  }
});

// 2. APPROVE SCRIPT: Run Designer Agent to generate images
app.post("/api/project/approve-script", async (req, res) => {
  const { projectId, scenes, refinedScript, universalTheme, universalAspectRatio, visualBible } = req.body;
  
  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId" });
  }

  try {
    console.log(`Script approved for project ${projectId}. Triggering Designer Agent...`);

    // Merge any manual user edits from frontend
    const currentState = {
      ...(projectStore[projectId] || {}),
      scenes: scenes || [],
      refinedScript: refinedScript || "",
      universalTheme: universalTheme || "",
      universalAspectRatio: universalAspectRatio || "",
      visualBible: visualBible || {},
    };

    // Run Designer Agent
    const result = await designerAgent(currentState as any, directorLLM);

    // Save state
    currentState.scenes = result.scenes;
    projectStore[projectId] = currentState;

    res.json({
      projectId,
      scenes: currentState.scenes,
    });
  } catch (error: any) {
    console.error("Error generating scene images:", error);
    res.status(500).json({ error: error.message || "Failed to generate scene images" });
  }
});

// 3. APPROVE IMAGES: Run Video Gen Agent to generate scene videos
app.post("/api/project/approve-images", async (req, res) => {
  const { projectId, scenes } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId" });
  }

  try {
    console.log(`Images approved for project ${projectId}. Triggering Video Gen Agent...`);

    const currentState = {
      ...(projectStore[projectId] || {}),
      scenes: scenes || (projectStore[projectId]?.scenes || []),
    };

    // Run Video Gen Agent
    const result = await videoGenAgent(currentState as any, directorLLM);

    // Save state
    currentState.scenes = result.scenes;
    projectStore[projectId] = currentState;

    res.json({
      projectId,
      scenes: currentState.scenes,
    });
  } catch (error: any) {
    console.error("Error generating scene videos:", error);
    res.status(500).json({ error: error.message || "Failed to generate scene videos" });
  }
});

// 4. APPROVE VIDEOS: Run Caption, Editor (FFmpeg), and QA Agents
app.post("/api/project/approve-videos", async (req, res) => {
  const { projectId, scenes } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: "Missing projectId" });
  }

  try {
    console.log(`Videos approved for project ${projectId}. Running Final assembly...`);

    const currentState = {
      ...(projectStore[projectId] || {}),
      scenes: scenes || (projectStore[projectId]?.scenes || []),
    };

    // A. Run Caption Agent to generate/condense subtitle overlays
    const captionResult = await captionAgent(currentState as any, directorLLM);
    currentState.scenes = captionResult.scenes;

    // B. Run Editor Agent (FFmpeg stitching)
    const editResult = await editorAgent(currentState as any, directorLLM);
    currentState.finalVideoURL = editResult.finalVideoURL;
    currentState.finalVideoPath = editResult.finalVideoPath;

    // C. Run QA Agent
    const qaResult = await qaAgent(currentState as any, directorLLM);
    
    // Save final state
    projectStore[projectId] = currentState;

    res.json({
      projectId,
      finalVideoURL: currentState.finalVideoURL,
      qaPassed: qaResult.qaPassed,
      qaNotes: qaResult.qaNotes,
    });
  } catch (error: any) {
    console.error("Error assembling final video:", error);
    res.status(500).json({ error: error.message || "Failed to assemble final video" });
  }
});

// Start express server
app.listen(PORT, () => {
  console.log(`ScriptForge backend running on http://localhost:${PORT}`);
});
