import "dotenv/config";
import { StateGraph, START, END } from "@langchain/langgraph";
import { WorkflowState } from "./state/index.js";
import { directorAgent } from "./agents/director.js";
import { directorLLM } from "./azure/index.js";
/* =========================
   GRAPH COMPILATION
========================= */
const workflow = new StateGraph(WorkflowState)
    .addNode("director", (state) => directorAgent(state, directorLLM))
    .addEdge(START, "director")
    .addEdge("director", END);
export const app = workflow.compile();
/* =========================
   TEST RUNNER
========================= */
(async () => {
    console.log("Running Director Agent Workflow...");
    const result = await app.invoke({
        inputScript: "Create a short cinematic video about an astronaut discovering an ancient neon temple on Mars.",
    });
    console.log("\n====================================");
    console.log("FINAL WORKFLOW RESULT");
    console.log("====================================");
    console.log("Refined Script:", result.refinedScript);
    console.log("Universal Theme:", result.universalTheme);
    console.log("Aspect Ratio:", result.universalAspectRatio);
    console.log("\nVisual Bible:", JSON.stringify(result.visualBible, null, 2));
    console.log("\n====================================");
    console.log(`GENERATED SCENES (${result.scenes.length} total)`);
    console.log("====================================");
    // Loop through and display each individual scene's blueprint
    result.scenes.forEach((scene) => {
        console.log(`\n🎬 SCENE ${scene.sceneNumber}`);
        console.log(`   Description : ${scene.sceneDetail}`);
        console.log(`   Image Prompt: ${scene.imageGenPrompt}`);
        console.log(`   Video Prompt: ${scene.videoGenPrompt}`);
        console.log("   ------------------------------------------------");
    });
})();
//# sourceMappingURL=index.js.map