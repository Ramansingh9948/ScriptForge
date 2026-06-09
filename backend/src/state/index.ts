import { Annotation } from "@langchain/langgraph";

export interface IVisualBible {
  artStyle: string;
  characterDescription: string;
  characterWardrobe: string;
  environmentStyle: string;
  lightingStyle: string;
  cameraStyle: string;
  colorPalette: string;
  renderQuality: string;
}

export interface IScene {
  sceneNumber: number;
  sceneDetail: string;

  // Image Generation
  imageGenPrompt: string;
  isImageGenerated: boolean;
  imageURL: string;
  remarkImage: string[];

  // Video Generation
  videoGenPrompt: string;
  isVideoGenerated: boolean;
  videoURL: string;
  remarkVideo: string[];
}

export const WorkflowState = Annotation.Root({
  inputScript: Annotation<string>({
    reducer: (current, update) => update ?? current,
    default: () => "",
  }),

  refinedScript: Annotation<string>({
    reducer: (current, update) => update ?? current,
    default: () => "",
  }),

  universalTheme: Annotation<string>({
    reducer: (current, update) => update ?? current,
    default: () => "",
  }),

  universalAspectRatio: Annotation<string>({
    reducer: (current, update) => update ?? current,
    default: () => "",
  }),

  visualBible: Annotation<IVisualBible>({
    reducer: (current, update) => update ?? current,
    default: () => ({
      artStyle: "",
      characterDescription: "",
      characterWardrobe: "",
      environmentStyle: "",
      lightingStyle: "",
      cameraStyle: "",
      colorPalette: "",
      renderQuality: "",
    }),
  }),

  scenes: Annotation<IScene[]>({
    reducer: (current, update) => update ?? current,
    default: () => [],
  }),
});
