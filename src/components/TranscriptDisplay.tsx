interface TranscriptDisplayProps {
  transcript: string;
  isInterim: boolean;
}

export function TranscriptDisplay({
  transcript,
  isInterim,
}: TranscriptDisplayProps) {
  if (!transcript) return null;

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 min-h-[80px] border-2 border-slate-200"
      role="region"
      aria-live="polite"
      aria-label="Voice transcript"
    >
      <p className="text-sm text-slate-500 mb-2 font-medium">
        {isInterim ? "Listening..." : "Command received:"}
      </p>
      <p
        className={`text-lg ${
          isInterim ? "text-slate-400 italic" : "text-slate-900 font-medium"
        }`}
      >
        {transcript}
      </p>
    </div>
  );
}
