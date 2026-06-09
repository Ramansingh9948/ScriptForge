import { WorkflowState } from "../state/index.js";
import { HumanMessage } from "@langchain/core/messages";

export const captionAgent = async (
  state: typeof WorkflowState.State,
  llmInstance: any
) => {
  console.log("--- CAPTION AGENT: Generating Scene Captions ---");

  const scenesWithCaptions = await Promise.all(
    state.scenes.map(async (scene) => {
      let caption = scene.sceneDetail;
      
      try {
        const prompt = `Condense the following scene description into a single short sentence (maximum 8 words) for a video subtitle.
Scene description: ${scene.sceneDetail}
Output ONLY the condensed sentence without quotes, punctuation at the end, or markdown.`;

        const response = await llmInstance.invoke([new HumanMessage(prompt)]);
        const resultText = (typeof response.content === "string" ? response.content : JSON.stringify(response.content)).trim();
        
        if (resultText && resultText.length > 0) {
          caption = resultText;
        }
      } catch (err) {
        console.warn("LLM caption condensation failed, using full detail as fallback:", err);
      }

      // We attach the caption text to remarkImage (or a custom field we can access, or we can just extend our type, but since IScene has remarkImage/remarkVideo, let's add a caption property or just use the sceneDetail directly or store it in remarkImage[0]).
      // Actually, since JavaScript object references allow adding fields dynamically, we can just add a `caption` property to the scene object! In TypeScript, we can cast it or use it dynamically in our Editor Agent. Let's add a `caption` property.
      return {
        ...scene,
        caption: caption,
      };
    })
  );

  return {
    scenes: scenesWithCaptions,
  };
};
