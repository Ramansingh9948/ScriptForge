import { Annotation } from "@langchain/langgraph";
export const WorkflowState = Annotation.Root({
    inputScript: Annotation({
        reducer: (current, update) => update ?? current,
        default: () => "",
    }),
    refinedScript: Annotation({
        reducer: (current, update) => update ?? current,
        default: () => "",
    }),
    universalTheme: Annotation({
        reducer: (current, update) => update ?? current,
        default: () => "",
    }),
    universalAspectRatio: Annotation({
        reducer: (current, update) => update ?? current,
        default: () => "",
    }),
    visualBible: Annotation({
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
    scenes: Annotation({
        reducer: (current, update) => update ?? current,
        default: () => [],
    }),
});
//# sourceMappingURL=index.js.map