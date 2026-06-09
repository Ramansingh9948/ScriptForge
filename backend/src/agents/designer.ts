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

export const designerAgent = async (
  state: typeof WorkflowState.State,
  llmInstance: any
) => {
  const mode = getMode();
  console.log(`--- DESIGNER AGENT: Generating Scene Images (Mode: ${mode}) ---`);

  if (mode === "api") {
    const endpoint = process.env.AZURE_FLUX_ENDPOINT;
    const key = process.env.AZURE_FLUX_KEY;

    if (!endpoint || !key) {
      throw new Error("AZURE_FLUX_ENDPOINT or AZURE_FLUX_KEY environment variables are missing.");
    }

    console.log(`Calling Flux API endpoint: ${endpoint} for ${state.scenes.length} scenes...`);

    const updatedScenes = await Promise.all(
      state.scenes.map(async (scene, index) => {
        try {
          console.log(`Generating image for Scene ${scene.sceneNumber} using prompt: "${scene.imageGenPrompt}"`);
          
          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${key}`,
              "api-key": key, // Support both standard OpenAIBearer and Azure keys
            },
            body: JSON.stringify({
              prompt: scene.imageGenPrompt,
              n: 1,
              size: "1024x1024",
              model: "FLUX-1.1-pro",
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Flux API returned status ${response.status}: ${errorText}`);
          }

          const data: any = await response.json();
          let imageURL = data.data?.[0]?.url;
          const b64Data = data.data?.[0]?.b64_json;

          if (b64Data && !imageURL) {
            console.log(`Base64 image data returned for Scene ${scene.sceneNumber}. Saving to disk...`);
            const timestamp = Date.now();
            const filename = `gen_image_${scene.sceneNumber}_${timestamp}.jpg`;
            const exportsDir = path.join(projectRoot, "src", "exports");
            
            // Ensure exports directory exists
            if (!fs.existsSync(exportsDir)) {
              fs.mkdirSync(exportsDir, { recursive: true });
            }
            
            const exportFilePath = path.join(exportsDir, filename);
            fs.writeFileSync(exportFilePath, Buffer.from(b64Data, "base64"));
            
            imageURL = `/exports/${filename}`;
            console.log(`Saved base64 image to: ${exportFilePath}`);
          }

          if (!imageURL) {
            throw new Error(`No image URL or base64 data returned in Flux API response. Response body: ${JSON.stringify(data)}`);
          }

          console.log(`Scene ${scene.sceneNumber} image generated: ${imageURL}`);

          return {
            ...scene,
            imageURL: imageURL,
            isImageGenerated: true,
            remarkImage: [...(scene.remarkImage || []), "Generated using Azure FLUX-1.1-pro API"],
          };
        } catch (err: any) {
          console.error(`Error generating image for Scene ${scene.sceneNumber}:`, err);
          // Fallback to mock image if API fails
          const mockImageIndex = (index % 4) + 1;
          const fallbackURL = `/static/Images/${mockImageIndex}.jpg`;
          return {
            ...scene,
            imageURL: scene.imageURL || fallbackURL,
            isImageGenerated: true,
            remarkImage: [...(scene.remarkImage || []), `Flux API failed: ${err.message || err}. Felled back to mock.`],
          };
        }
      })
    );

    return {
      scenes: updatedScenes,
    };
  } else {
    // Mock Mode
    const updatedScenes = state.scenes.map((scene, index) => {
      const mockImageIndex = (index % 4) + 1;
      const imageURL = `/static/Images/${mockImageIndex}.jpg`;

      return {
        ...scene,
        imageURL: scene.imageURL || imageURL,
        isImageGenerated: true,
        remarkImage: [...(scene.remarkImage || []), "Mock image mapped successfully"],
      };
    });

    return {
      scenes: updatedScenes,
    };
  }
};
