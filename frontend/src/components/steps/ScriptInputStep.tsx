import { ArrowRight } from "lucide-react";
import { SCRIPT_PRESETS } from "../../constants/api";

interface ScriptInputStepProps {
  inputScript: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ScriptInputStep({ inputScript, onInputChange, onSubmit }: ScriptInputStepProps) {
  return (
    <div className="glass-card p-6 md:p-8 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl font-bold font-outfit mb-2 gradient-text">Create New Video Project</h2>
      <p className="text-text-secondary text-sm mb-6">
        Input a short script concept. Our director agent will refine the narration, establish a thematic Bible, and segment it into detailed storyboard scenes.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <label htmlFor="scriptInput" className="text-xs font-bold uppercase tracking-wider text-text-secondary">
          NARATIVE PROMPT
        </label>
        <textarea
          id="scriptInput"
          rows={4}
          value={inputScript}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Describe your video project idea (e.g. A deep space reconnaissance ship descends into a neon dust storm...)"
          className="w-full"
          required
        />

        <div className="mb-4">
          <span className="text-xs font-semibold text-text-tertiary block mb-2">TRY AN EXAMPLE CONCEPT:</span>
          <div className="flex flex-col gap-2">
            {SCRIPT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onInputChange(preset)}
                className="text-left text-xs bg-bg-secondary hover:bg-bg-tertiary border border-color hover:border-text-secondary p-2.5 rounded-lg text-text-secondary transition-all"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!inputScript.trim()}
          className="btn-primary flex justify-center items-center gap-2 w-full py-3"
        >
          <span>Launch Director Agent</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
