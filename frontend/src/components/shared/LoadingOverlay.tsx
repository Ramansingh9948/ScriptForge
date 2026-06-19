interface LoadingOverlayProps {
  message: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  return (
    <div className="glass-card p-12 text-center flex flex-col justify-center items-center">
      <div className="cyber-spinner mb-6"></div>
      <h3 className="text-xl font-bold font-outfit mb-2 gradient-text">Agent Processing</h3>
      <p className="text-text-secondary max-w-md text-sm leading-relaxed">{message}</p>
    </div>
  );
}
