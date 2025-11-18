import { Mic, MicOff, Volume2, VolumeX, HelpCircle } from "lucide-react";

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  onToggleListening: () => void;
  onToggleSpeech: () => void;
  onShowHelp: () => void;
  speechEnabled: boolean;
}

export function VoiceControls({
  isListening,
  isSpeaking,
  onToggleListening,
  onToggleSpeech,
  onShowHelp,
  speechEnabled,
}: VoiceControlsProps) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={onToggleListening}
        className={`p-4 rounded-full transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
          isListening
            ? "bg-red-500 hover:bg-red-600 focus:ring-red-300 animate-pulse"
            : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-300"
        } text-white shadow-lg`}
        aria-label={isListening ? "Stop listening" : "Start listening"}
        title={isListening ? "Stop listening" : "Start listening"}
      >
        {isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      <button
        onClick={onToggleSpeech}
        className={`p-3 rounded-full transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
          speechEnabled
            ? "bg-green-500 hover:bg-green-600 focus:ring-green-300"
            : "bg-gray-400 hover:bg-gray-500 focus:ring-gray-300"
        } text-white shadow-lg`}
        aria-label={
          speechEnabled ? "Disable speech feedback" : "Enable speech feedback"
        }
        title={
          speechEnabled ? "Disable speech feedback" : "Enable speech feedback"
        }
      >
        {speechEnabled ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
        {isSpeaking && <span className="sr-only">Currently speaking</span>}
      </button>

      <button
        onClick={onShowHelp}
        className="p-3 rounded-full bg-slate-700 hover:bg-slate-800 transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-400 focus:ring-offset-2 text-white shadow-lg"
        aria-label="Show help"
        title="Show available commands"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    </div>
  );
}
