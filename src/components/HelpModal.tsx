import { X, MessageSquare } from "lucide-react";

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  commands: string[];
}

export function HelpModal({ isOpen, onClose, commands }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby="help-modal-title"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-700 px-6 py-4 flex items-center justify-between sticky top-0">
          <h2
            id="help-modal-title"
            className="text-xl font-bold text-white flex items-center gap-2"
          >
            <MessageSquare className="w-6 h-6" />
            Available Voice Commands
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-slate-600 rounded-full p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close help"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Getting Started
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Click the microphone button to start listening. Speak clearly and
              naturally. The system will recognize your commands and provide
              audio feedback.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Supported Commands
            </h3>
            <ul className="space-y-3">
              {commands.map((command, index) => (
                <li
                  key={index}
                  className="bg-slate-50 rounded-lg p-4 border-l-4 border-blue-500"
                >
                  <code className="text-slate-800 font-mono">{command}</code>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Examples
            </h3>
            <div className="space-y-2">
              <p className="text-slate-600">
                <span className="font-medium text-slate-900">Navigation:</span>{" "}
                "Go to home", "Open settings"
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-900">Scrolling:</span>{" "}
                "Scroll down", "Scroll to top"
              </p>
              <p className="text-slate-600">
                <span className="font-medium text-slate-900">Interaction:</span>{" "}
                "Click button", "Select option"
              </p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Accessibility Features
            </h3>
            <ul className="text-blue-800 space-y-1 list-disc list-inside">
              <li>Continuous speech recognition with visual feedback</li>
              <li>Text-to-speech confirmation of commands</li>
              <li>High contrast visual indicators</li>
              <li>Keyboard accessible controls</li>
              <li>ARIA labels for screen readers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
