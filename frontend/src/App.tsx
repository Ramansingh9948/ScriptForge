import { AppFooter } from "./components/layout/AppFooter";
import { AppHeader } from "./components/layout/AppHeader";
import { StepperProgress } from "./components/layout/StepperProgress";
import { ErrorBanner } from "./components/shared/ErrorBanner";
import { LoadingOverlay } from "./components/shared/LoadingOverlay";
import { FinalOutputStep } from "./components/steps/FinalOutputStep";
import { ImageReviewStep } from "./components/steps/ImageReviewStep";
import { ScriptInputStep } from "./components/steps/ScriptInputStep";
import { StoryboardReviewStep } from "./components/steps/StoryboardReviewStep";
import { VideoReviewStep } from "./components/steps/VideoReviewStep";
import { useProjectPipeline } from "./hooks/useProjectPipeline";

function App() {
  const pipeline = useProjectPipeline();

  return (
    <div className="min-height-vh flex flex-col p-4 md:p-8 max-w-6xl mx-auto">
      <AppHeader />
      <StepperProgress step={pipeline.step} />

      <main className="flex-grow flex flex-col justify-center">
        {pipeline.error && <ErrorBanner message={pipeline.error} />}

        {pipeline.loading ? (
          <LoadingOverlay message={pipeline.loadingMessage} />
        ) : (
          <>
            {pipeline.step === 1 && (
              <ScriptInputStep
                inputScript={pipeline.inputScript}
                onInputChange={pipeline.setInputScript}
                onSubmit={pipeline.handleCreateProject}
              />
            )}

            {pipeline.step === 2 && (
              <StoryboardReviewStep
                refinedScript={pipeline.refinedScript}
                universalTheme={pipeline.universalTheme}
                universalAspectRatio={pipeline.universalAspectRatio}
                visualBible={pipeline.visualBible}
                scenes={pipeline.scenes}
                onRefinedScriptChange={pipeline.setRefinedScript}
                onUniversalThemeChange={pipeline.setUniversalTheme}
                onUniversalAspectRatioChange={pipeline.setUniversalAspectRatio}
                onVisualBibleChange={pipeline.setVisualBible}
                onSceneDetailChange={pipeline.updateSceneDetail}
                onSceneImagePromptChange={pipeline.updateSceneImagePrompt}
                onSceneVideoPromptChange={pipeline.updateSceneVideoPrompt}
                onRestart={pipeline.handleRestart}
                onApprove={pipeline.handleApproveScript}
              />
            )}

            {pipeline.step === 3 && (
              <ImageReviewStep
                scenes={pipeline.scenes}
                onBack={() => pipeline.setStep(2)}
                onApprove={pipeline.handleApproveImages}
              />
            )}

            {pipeline.step === 4 && (
              <VideoReviewStep
                scenes={pipeline.scenes}
                onBack={() => pipeline.setStep(3)}
                onApprove={pipeline.handleApproveVideos}
              />
            )}

            {pipeline.step === 5 && (
              <FinalOutputStep
                finalVideoURL={pipeline.finalVideoURL}
                qaPassed={pipeline.qaPassed}
                qaNotes={pipeline.qaNotes}
                onRestart={pipeline.handleRestart}
              />
            )}
          </>
        )}
      </main>

      <AppFooter />
    </div>
  );
}

export default App;
