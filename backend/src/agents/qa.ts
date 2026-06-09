import fs from "fs";
import { WorkflowState } from "../state/index.js";
import { HumanMessage } from "@langchain/core/messages";

export const qaAgent = async (
  state: typeof WorkflowState.State & { finalVideoPath?: string; finalVideoURL?: string },
  llmInstance: any
) => {
  console.log("--- QA AGENT: Verifying Final Video Assets ---");

  const videoPath = state.finalVideoPath;
  let isVerified = false;
  let qaReport = "";

  if (videoPath && fs.existsSync(videoPath)) {
    const stats = fs.statSync(videoPath);
    if (stats.size > 1000) { // Check that file is larger than 1KB
      isVerified = true;
      console.log(`QA Success: Video exists and size is ${stats.size} bytes`);
    } else {
      qaReport = "Video file size is suspiciously small (possibly empty/corrupted).";
    }
  } else {
    qaReport = `Video file not found at path: ${videoPath}`;
  }

  // Use LLM to write a quick, fun QA director report card
  let directorNotes = "Check completed successfully.";
  if (isVerified) {
    try {
      const prompt = `Write a short 2-3 sentence Director's QA Report Card congratulating the team on completing the video pipeline. 
Theme: ${state.universalTheme || "Sci-Fi"}
Aspect Ratio: ${state.universalAspectRatio || "16:9"}
Scenes processed: ${state.scenes?.length || 0}
Make it sound like a cinematic critique, professional and positive.`;

      const response = await llmInstance.invoke([new HumanMessage(prompt)]);
      const resultText = (typeof response.content === "string" ? response.content : JSON.stringify(response.content)).trim();
      if (resultText) {
        directorNotes = resultText;
      }
    } catch (err) {
      console.warn("LLM QA report generation failed:", err);
    }
  }

  return {
    qaPassed: isVerified,
    qaNotes: isVerified ? directorNotes : qaReport,
  };
};
