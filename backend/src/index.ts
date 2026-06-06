import "dotenv/config";
import { Annotation } from "@langchain/langgraph";
import { StateGraph, START, END } from "@langchain/langgraph";
import { AzureChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

// --- State Definition ---
const State = Annotation.Root({
  query: Annotation<string>({
    value: (current, update) => update,
    default: () => "",
  }),
  searchResults: Annotation<any[]>({
    value: (current, update) => update,
    default: () => [],
  }),
  finalAnswer: Annotation<string>({
    value: (current, update) => update,
    default: () => "",
  }),
});

// --- Agent 1: Planner ---
const plannerLLM = new AzureChatOpenAI({
  azureOpenAIApiDeploymentName: "o4-mini",
});

const plannerAgent = async (state: typeof State.State) => {
  const prompt = `Based on the user's request, generate a precise search query.
    User request: ${state.query}
    Search query: `;

  const response = await plannerLLM.invoke([new HumanMessage(prompt)]);
  return { query: response.content as string };
};

// --- Agent 2: Searcher ---
const searcherLLM = new AzureChatOpenAI({
  azureOpenAIApiDeploymentName: "o4-mini",
});

// Mock web search (replace with real API)
const performWebSearch = async (query: string) => {
  return [
    { title: "Paris - Capital of France", url: "https://en.wikipedia.org/wiki/Paris", snippet: "Paris is the capital of France." },
    { title: "France Overview", url: "https://en.wikipedia.org/wiki/France", snippet: "France is a country in Europe." },
  ];
};

const searcherAgent = async (state: typeof State.State) => {
  const results = await performWebSearch(state.query);
  const prompt = `Structure the following search results as JSON:
    ${JSON.stringify(results)}
    Return only valid JSON.`;

  const response = await searcherLLM.invoke([new HumanMessage(prompt)]);
  const jsonResults = JSON.parse(response.content as string);

  return {
    searchResults: jsonResults,
    finalAnswer: `Search completed for: ${state.query}`,
  };
};

// --- Build and Run Graph ---
const graph = new StateGraph(State)
  .addNode("planner", plannerAgent)
  .addNode("searcher", searcherAgent)
  .addEdge(START, "planner")
  .addEdge("planner", "searcher")
  .addEdge("searcher", END);

const app = graph.compile();

// Example usage
(async () => {
  const result = await app.invoke({
    query: "What is the capital of France?",
  });
  console.log("Final Answer:", result.finalAnswer);
  console.log("Search Results:", result.searchResults);
})();