import { VoiceControls } from './components/VoiceControls';
import { TranscriptDisplay } from './components/TranscriptDisplay';
import { CommandHistory } from './components/CommandHistory';
import { HelpModal } from './components/HelpModal';
import { StatusIndicator } from './components/StatusIndicator';
import { useVoiceNavigation } from './hooks/useVoiceNavigation';
import { Mic } from 'lucide-react';

function App() {
  const {
    isListening,
    transcript,
    isInterim,
    status,
    history,
    speechEnabled,
    showHelp,
    toggleListening,
    toggleSpeech,
    setShowHelp,
    getAvailableCommands,
    isSpeaking,
  } = useVoiceNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Voice Navigation</h1>
                <p className="text-slate-600 text-sm mt-1">Hands-free control with AI-powered speech recognition</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center gap-6">
                <VoiceControls
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  onToggleListening={toggleListening}
                  onToggleSpeech={toggleSpeech}
                  onShowHelp={() => setShowHelp(true)}
                  speechEnabled={speechEnabled}
                />

                <div className="w-full">
                  <TranscriptDisplay transcript={transcript} isInterim={isInterim} />
                </div>

                {status && (
                  <div className="w-full">
                    <StatusIndicator message={status.message} type={status.type} />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Start Guide</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <p className="text-slate-700 pt-1">Click the microphone button to activate voice control</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <p className="text-slate-700 pt-1">Speak your command clearly (e.g., "Go to home", "Scroll down")</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 text-blue-700 font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <p className="text-slate-700 pt-1">Listen for audio confirmation and see the action executed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <CommandHistory history={history} />
          </div>
        </div>

        <div className="mt-8 bg-slate-700 rounded-lg shadow-md p-6 text-white">
          <h2 className="text-xl font-bold mb-3">Accessibility Features</h2>
          <ul className="space-y-2 text-slate-200">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Continuous speech recognition with visual feedback
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Text-to-speech confirmation for all commands
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              High contrast interface with clear status indicators
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Full keyboard navigation support
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              ARIA labels for screen reader compatibility
            </li>
          </ul>
        </div>
      </main>

      <HelpModal
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        commands={getAvailableCommands()}
      />
    </div>
  );
}

export default App;
