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
  imageGenPrompt: string;
  videoGenPrompt: string;
  imageURL?: string;
  videoURL?: string;
  caption?: string;
}

export const EMPTY_VISUAL_BIBLE: IVisualBible = {
  artStyle: "",
  characterDescription: "",
  characterWardrobe: "",
  environmentStyle: "",
  lightingStyle: "",
  cameraStyle: "",
  colorPalette: "",
  renderQuality: "",
};
