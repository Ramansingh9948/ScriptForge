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
