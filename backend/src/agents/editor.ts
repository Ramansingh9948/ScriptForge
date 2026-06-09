import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { WorkflowState } from "../state/index.js";

// Utility to get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to escape text for FFmpeg drawtext filter
const escapeDrawText = (text: string): string => {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "'\\''")
    .replace(/:/g, "\\:")
    .replace(/%/g, "\\%");
};

export const editorAgent = async (
  state: typeof WorkflowState.State,
  llmInstance: any
): Promise<any> => {
  console.log("--- EDITOR AGENT: Stitching and Editing Video with FFmpeg ---");

  const scenes = state.scenes;
  if (!scenes || scenes.length === 0) {
    throw new Error("No scenes found in state for video stitching");
  }

  // Define paths
  const projectRoot = path.join(__dirname, "..", "..");
  const mockAssetsDir = path.join(projectRoot, "src", "Mock-assets");
  const exportsDir = path.join(projectRoot, "src", "exports");

  // Ensure exports directory exists
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // Resolve input files
  const inputs: string[] = [];
  let filterComplex = "";
  let concatInputs = "";

  scenes.forEach((scene: any, index: number) => {
    // Resolve videoURL which looks like: /static/Video/1.mp4
    let relativeVideoPath = scene.videoURL.replace(/^\/static\//, "");
    let videoFilePath = path.join(mockAssetsDir, relativeVideoPath);

    // If file doesn't exist, fallback to 1.mp4
    if (!fs.existsSync(videoFilePath)) {
      console.warn(`File ${videoFilePath} not found, falling back to mock 1.mp4`);
      videoFilePath = path.join(mockAssetsDir, "Video", "1.mp4");
    }

    inputs.push(`-i "${videoFilePath}"`);

    // Trim each video to 5 seconds, scale and pad to 1280x720, add caption text overlay
    const escapedCaption = escapeDrawText(scene.caption || scene.sceneDetail || `Scene ${scene.sceneNumber}`);
    const fontPath = "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf";

    filterComplex += `[${index}:v]trim=duration=5,setpts=PTS-STARTPTS,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,setsar=1,drawtext=fontfile='${fontPath}':text='${escapedCaption}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.6:boxborderw=10:x=(w-text_w)/2:y=h-80[v${index}];`;
    concatInputs += `[v${index}]`;
  });

  // Concat all video streams
  filterComplex += `${concatInputs}concat=n=${scenes.length}:v=1:a=0[outv]`;

  // Add background music
  const musicFilePath = path.join(mockAssetsDir, "Music", "1.mp3");
  inputs.push(`-i "${musicFilePath}"`);

  // Generate unique output filename
  const timestamp = Date.now();
  const outputFileName = `final_video_${timestamp}.mp4`;
  const outputFilePath = path.join(exportsDir, outputFileName);

  // Compile final FFmpeg command
  // Inputs: -i video0 -i video1 ... -i music.mp3
  // Output maps [outv] and music audio, using -shortest to end at the video's length
  const ffmpegCmd = `ffmpeg ${inputs.join(" ")} -filter_complex "${filterComplex}" -map "[outv]" -map ${scenes.length}:a -shortest -c:v libx264 -pix_fmt yuv420p -c:a aac -y "${outputFilePath}"`;

  console.log("Running FFmpeg Command:", ffmpegCmd);

  return new Promise((resolve, reject) => {
    exec(ffmpegCmd, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error("FFmpeg execution error:", error);
        console.error("FFmpeg stderr:", stderr);
        return reject(error);
      }
      console.log("FFmpeg completed successfully!");
      
      // Return updated state. We will add finalVideoURL to the return values
      resolve({
        finalVideoURL: `/exports/${outputFileName}`,
        finalVideoPath: outputFilePath,
      });
    });
  });
};
