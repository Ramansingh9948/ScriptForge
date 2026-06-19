import { Film, Image as ImageIcon, Layers, Sparkles, Video as VideoIcon } from "lucide-react";

const STEPS = [
  { num: 1, label: "Script", icon: Sparkles },
  { num: 2, label: "Storyboard", icon: Layers },
  { num: 3, label: "Images", icon: ImageIcon },
  { num: 4, label: "Videos", icon: VideoIcon },
  { num: 5, label: "Assemble", icon: Film },
] as const;

interface StepperProgressProps {
  step: number;
}

export function StepperProgress({ step }: StepperProgressProps) {
  return (
    <div className="stepper-container w-full mb-8">
      <div className="stepper-line" />
      <div
        className="stepper-line-active"
        style={{ width: `${((step - 1) / 4) * 100}%` }}
      />
      {STEPS.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.num} className="flex flex-col items-center gap-1 z-10">
            <div
              className={`step-node ${step === s.num ? "active" : ""} ${step > s.num ? "completed" : ""}`}
              title={s.label}
            >
              {step > s.num ? "✓" : <Icon className="w-4 h-4" />}
            </div>
            <span className={`text-xs font-semibold ${step === s.num ? "text-accent-blue" : "text-text-secondary"}`}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
