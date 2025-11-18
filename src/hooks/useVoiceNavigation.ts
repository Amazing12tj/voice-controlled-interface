import { useState, useEffect, useRef, useCallback } from 'react';
import { VoiceRecognitionService } from '../services/voiceRecognition';
import { CommandProcessor } from '../services/commandProcessor';
import type { CommandResult } from '../services/commandProcessor';
import { TextToSpeechService } from '../services/textToSpeech';
import type { CommandHistoryItem } from '../components/CommandHistory';

export function useVoiceNavigation() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isInterim, setIsInterim] = useState(false);
  const [status, setStatus] = useState<{
    message: string;
    type: 'info' | 'success' | 'error' | 'warning';
  } | null>(null);
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  const voiceRecognitionRef = useRef<VoiceRecognitionService | null>(null);
  const commandProcessorRef = useRef<CommandProcessor | null>(null);
  const ttsRef = useRef<TextToSpeechService | null>(null);

  useEffect(() => {
    voiceRecognitionRef.current = new VoiceRecognitionService();
    commandProcessorRef.current = new CommandProcessor();
    ttsRef.current = new TextToSpeechService();

    if (!voiceRecognitionRef.current.isSupported()) {
      setStatus({
        message: 'Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
        type: 'error',
      });
    }

    if (!ttsRef.current.isSupported()) {
      setStatus({
        message: 'Text-to-speech is not supported in this browser.',
        type: 'warning',
      });
      setSpeechEnabled(false);
    }

    return () => {
      voiceRecognitionRef.current?.stop();
      ttsRef.current?.stop();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (speechEnabled && ttsRef.current) {
      ttsRef.current.speak(text);
    }
  }, [speechEnabled]);

  const executeCommand = useCallback(
    (result: CommandResult) => {
      let response = '';
      let status: 'success' | 'error' | 'clarification' = 'success';

      switch (result.action.type) {
        case 'navigate':
          response = `Navigating to ${result.action.target}`;
          speak(response);
          setStatus({ message: response, type: 'success' });
          break;

        case 'scroll':
          response = `Scrolling ${result.action.direction}`;
          speak(response);
          setStatus({ message: response, type: 'success' });

          if (result.action.direction === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (result.action.direction === 'bottom') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          } else if (result.action.direction === 'up') {
            window.scrollBy({ top: -300, behavior: 'smooth' });
          } else if (result.action.direction === 'down') {
            window.scrollBy({ top: 300, behavior: 'smooth' });
          }
          break;

        case 'click':
          response = `Clicking ${result.action.target}`;
          speak(response);
          setStatus({ message: response, type: 'success' });
          break;

        case 'help':
          response = 'Opening help menu';
          speak(response);
          setShowHelp(true);
          setStatus({ message: response, type: 'info' });
          break;

        case 'clarification':
          response = `Did you mean: ${result.action.options.join(', ')}?`;
          speak(response);
          setStatus({ message: response, type: 'warning' });
          status = 'clarification';
          break;

        case 'unknown':
          response = 'Command not recognized. Say "help" for available commands.';
          speak(response);
          setStatus({ message: response, type: 'error' });
          status = 'error';
          break;
      }

      setHistory((prev) => [
        {
          id: Date.now().toString(),
          command: result.originalCommand,
          status,
          response,
          timestamp: new Date(),
        },
        ...prev.slice(0, 19),
      ]);
    },
    [speak]
  );

  const toggleListening = useCallback(() => {
    if (!voiceRecognitionRef.current?.isSupported()) {
      setStatus({
        message: 'Voice recognition is not supported in this browser.',
        type: 'error',
      });
      return;
    }

    if (isListening) {
      voiceRecognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
      setIsInterim(false);
      speak('Voice control stopped');
      setStatus({ message: 'Voice control stopped', type: 'info' });
    } else {
      voiceRecognitionRef.current.start(
        (text: string, isFinal: boolean) => {
          setTranscript(text);
          setIsInterim(!isFinal);

          if (isFinal && commandProcessorRef.current) {
            const result = commandProcessorRef.current.processCommand(text);
            executeCommand(result);
          }
        },
        (error: string) => {
          setStatus({ message: `Error: ${error}`, type: 'error' });
          setIsListening(false);
        }
      );
      setIsListening(true);
      speak('Voice control activated');
      setStatus({ message: 'Listening for commands...', type: 'info' });
    }
  }, [isListening, speak, executeCommand]);

  const toggleSpeech = useCallback(() => {
    setSpeechEnabled((prev) => {
      const newValue = !prev;
      const message = newValue ? 'Speech feedback enabled' : 'Speech feedback disabled';
      setStatus({ message, type: 'info' });
      if (newValue) {
        ttsRef.current?.speak(message);
      }
      return newValue;
    });
  }, []);

  const getAvailableCommands = useCallback(() => {
    return commandProcessorRef.current?.getAvailableCommands() || [];
  }, []);

  return {
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
    isSpeaking: ttsRef.current?.isSpeaking() ?? false,
  };
}
