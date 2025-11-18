interface StatusIndicatorProps {
  message: string;
  type: "info" | "success" | "error" | "warning";
}

export function StatusIndicator({ message, type }: StatusIndicatorProps) {
  const colors = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 ${colors[type]} transition-all`}
      role="status"
      aria-live="polite"
    >
      <p className="font-medium">{message}</p>
    </div>
  );
}
