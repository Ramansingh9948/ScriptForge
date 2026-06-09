import "dotenv/config";
export declare const app: import("@langchain/langgraph").CompiledStateGraph<{
    inputScript: string;
    refinedScript: string;
    universalTheme: string;
    universalAspectRatio: string;
    visualBible: import("./state/index.js").IVisualBible;
    scenes: import("./state/index.js").IScene[];
}, {
    inputScript?: string | import("@langchain/langgraph").OverwriteValue<string>;
    refinedScript?: string | import("@langchain/langgraph").OverwriteValue<string>;
    universalTheme?: string | import("@langchain/langgraph").OverwriteValue<string>;
    universalAspectRatio?: string | import("@langchain/langgraph").OverwriteValue<string>;
    visualBible?: import("./state/index.js").IVisualBible | import("@langchain/langgraph").OverwriteValue<import("./state/index.js").IVisualBible>;
    scenes?: import("./state/index.js").IScene[] | import("@langchain/langgraph").OverwriteValue<import("./state/index.js").IScene[]>;
}, "__start__" | "director", {
    inputScript: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    refinedScript: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    universalTheme: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    universalAspectRatio: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    visualBible: import("@langchain/langgraph").BaseChannel<import("./state/index.js").IVisualBible, import("./state/index.js").IVisualBible | import("@langchain/langgraph").OverwriteValue<import("./state/index.js").IVisualBible>, unknown>;
    scenes: import("@langchain/langgraph").BaseChannel<import("./state/index.js").IScene[], import("./state/index.js").IScene[] | import("@langchain/langgraph").OverwriteValue<import("./state/index.js").IScene[]>, unknown>;
}, {
    inputScript: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    refinedScript: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    universalTheme: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    universalAspectRatio: import("@langchain/langgraph").BaseChannel<string, string | import("@langchain/langgraph").OverwriteValue<string>, unknown>;
    visualBible: import("@langchain/langgraph").BaseChannel<import("./state/index.js").IVisualBible, import("./state/index.js").IVisualBible | import("@langchain/langgraph").OverwriteValue<import("./state/index.js").IVisualBible>, unknown>;
    scenes: import("@langchain/langgraph").BaseChannel<import("./state/index.js").IScene[], import("./state/index.js").IScene[] | import("@langchain/langgraph").OverwriteValue<import("./state/index.js").IScene[]>, unknown>;
}, import("@langchain/langgraph").StateDefinition, {
    director: {
        refinedScript: any;
        universalTheme: any;
        universalAspectRatio: any;
        visualBible: any;
        scenes: any;
    };
}, unknown, unknown, []>;
//# sourceMappingURL=index.d.ts.map