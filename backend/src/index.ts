import "dotenv/config";
import { StateGraph, START, END } from "@langchain/langgraph";
import { WorkflowState } from "./state/index.js";
import { directorAgent } from "./agents/director.js";
import { designerAgent } from "./agents/designer.js";
import { videoGenAgent } from "./agents/videoGen.js";
import { captionAgent } from "./agents/caption.js";
import { editorAgent } from "./agents/editor.js";
import { qaAgent } from "./agents/qa.js";
import { directorLLM } from "./azure/index.js";

/* =========================
   GRAPH COMPILATION
========================= */

const workflow = new StateGraph(WorkflowState)
  .addNode("director", (state) => directorAgent(state, directorLLM))
  .addNode("designer", (state) => designerAgent(state, directorLLM))
  .addNode("videoGen", (state) => videoGenAgent(state, directorLLM))
  .addNode("caption", (state) => captionAgent(state, directorLLM))
  .addNode("editor", (state) => editorAgent(state, directorLLM))
  .addNode("qa", (state) => qaAgent(state, directorLLM))

  .addEdge(START, "director")
  .addEdge("director", "designer")
  .addEdge("designer", "videoGen")
  .addEdge("videoGen", "caption")
  .addEdge("caption", "editor")
  .addEdge("editor", "qa")
  .addEdge("qa", END);

export const app = workflow.compile();
export {
  directorAgent,
  designerAgent,
  videoGenAgent,
  captionAgent,
  editorAgent,
  qaAgent,
  directorLLM,
};
