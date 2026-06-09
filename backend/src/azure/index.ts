import { AzureChatOpenAI } from "@langchain/openai";

export const directorLLM = new AzureChatOpenAI({
  azureOpenAIApiDeploymentName: "o4-mini",
});
