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
    isImageGenerated: boolean;
    imageURL: string;
    remarkImage: string[];
    videoGenPrompt: string;
    isVideoGenerated: boolean;
    videoURL: string;
    remarkVideo: string[];
}
export declare const WorkflowState: import("@langchain/langgraph").AnnotationRoot<{
    inputScript: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    refinedScript: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    universalTheme: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    universalAspectRatio: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    visualBible: import("@langchain/langgraph").BaseChannel<IVisualBible, IVisualBible | import("@langchain/langgraph").OverwriteValue<IVisualBible>, unknown>;
    scenes: import("@langchain/langgraph").BaseChannel<IScene[], IScene[] | import("@langchain/langgraph").OverwriteValue<IScene[]>, unknown>;
}>;
//# sourceMappingURL=index.d.ts.map