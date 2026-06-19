import { Film } from "lucide-react";

export function AppHeader() {
  return (
    <header className="flex justify-between items-center mb-8 border-b border-color pb-4">
      <div className="flex items-center gap-2">
        <Film className="w-8 h-8 text-accent-blue" />
        <h1 className="logo-text text-2xl font-extrabold uppercase tracking-wider">ScriptForge</h1>
      </div>
      <div className="flex items-center gap-2 text-sm text-text-secondary bg-bg-secondary px-3 py-1.5 border border-color rounded-full">
        <span className="w-2.5 h-2.5 rounded-full bg-accent-blue animate-pulse"></span>
        <span>Pipeline Active</span>
      </div>
    </header>
  );
}
