import { HumanMessage } from "@langchain/core/messages";
import { WorkflowState } from "../state/index.js";
export const directorAgent = async (state, llmInstance) => {
    const prompt = `
You are an award-winning Film Director, Storyboard Artist, and AI Video Production Planner.

Your job is to convert a user idea into a complete AI video production blueprint.

USER REQUEST:
${state.inputScript || ""}

==================================================
GOAL
==================================================

Generate:
1. Refined Script
2. Universal Theme
3. Universal Aspect Ratio
4. Visual Bible
5. Scene Breakdown
6. Image Generation Prompts
7. Video Generation Prompts

==================================================
FINAL OUTPUT FORMAT
==================================================

Return ONLY valid JSON matching this exact structure:

{
  "refinedScript": "string",
  "universalTheme": "string",
  "universalAspectRatio": "string",
  "visualBible": {
    "artStyle": "string",
    "characterDescription": "string",
    "characterWardrobe": "string",
    "environmentStyle": "string",
    "lightingStyle": "string",
    "cameraStyle": "string",
    "colorPalette": "string",
    "renderQuality": "string"
  },
  "scenes": [
    {
      "sceneNumber": 1,
      "sceneDetail": "string",
      "imageGenPrompt": "string",
      "videoGenPrompt": "string",
      "isImageGenerated": false,
      "imageURL": "",
      "remarkImage": [],
      "isVideoGenerated": false,
      "videoURL": "",
      "remarkVideo": []
    }
  ]
}

IMPORTANT: Return ONLY raw JSON text. No markdown formatting, no descriptions.
`;
    const response = await llmInstance.invoke([
        new HumanMessage(prompt),
    ]);
    let content = typeof response.content === "string" ? response.content : JSON.stringify(response.content);
    if (content.includes("```")) {
        content = content.replace(/```json/g, "").replace(/```/g, "").trim();
    }
    const parsed = JSON.parse(content);
    return {
        refinedScript: parsed.refinedScript ?? "",
        universalTheme: parsed.universalTheme ?? "",
        universalAspectRatio: parsed.universalAspectRatio ?? "",
        visualBible: parsed.visualBible ?? {
            artStyle: "",
            characterDescription: "",
            characterWardrobe: "",
            environmentStyle: "",
            lightingStyle: "",
            cameraStyle: "",
            colorPalette: "",
            renderQuality: "",
        },
        scenes: parsed.scenes ?? [],
    };
};
//# sourceMappingURL=director.js.map