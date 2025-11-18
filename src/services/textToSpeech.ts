export type SpeechRate = "slow" | "normal" | "fast";

export class TextToSpeechService {
  private synth: SpeechSynthesis | null = null;
  private rate: number = 1.0;
  private pitch: number = 1.0;
  private volume: number = 1.0;

  constructor() {
    if ("speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
    }
  }

  isSupported(): boolean {
    return this.synth !== null;
  }

  speak(
    text: string,
    options?: { rate?: SpeechRate; pitch?: number; volume?: number }
  ): void {
    if (!this.synth) {
      console.warn("Text-to-speech not supported in this browser");
      return;
    }

    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (options?.rate) {
      switch (options.rate) {
        case "slow":
          utterance.rate = 0.7;
          break;
        case "normal":
          utterance.rate = 1.0;
          break;
        case "fast":
          utterance.rate = 1.3;
          break;
      }
    } else {
      utterance.rate = this.rate;
    }

    utterance.pitch = options?.pitch ?? this.pitch;
    utterance.volume = options?.volume ?? this.volume;

    this.synth.speak(utterance);
  }

  stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }

  setRate(rate: SpeechRate): void {
    switch (rate) {
      case "slow":
        this.rate = 0.7;
        break;
      case "normal":
        this.rate = 1.0;
        break;
      case "fast":
        this.rate = 1.3;
        break;
    }
  }

  setPitch(pitch: number): void {
    this.pitch = Math.max(0, Math.min(2, pitch));
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  isSpeaking(): boolean {
    return this.synth?.speaking ?? false;
  }
}
