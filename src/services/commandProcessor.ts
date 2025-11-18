export type CommandAction =
  | { type: "navigate"; target: string }
  | { type: "scroll"; direction: "up" | "down" | "top" | "bottom" }
  | { type: "click"; target: string }
  | { type: "help" }
  | { type: "clarification"; options: string[] }
  | { type: "unknown" };

export interface CommandResult {
  action: CommandAction;
  confidence: number;
  originalCommand: string;
}

export class CommandProcessor {
  private commandPatterns: Array<{
    pattern: RegExp;
    action: (match: RegExpMatchArray) => CommandAction;
    keywords: string[];
  }> = [
    {
      pattern: /(?:go to|navigate to|open|show me)\s+(\w+)/i,
      action: (match) => ({ type: "navigate", target: match[1].toLowerCase() }),
      keywords: ["go", "navigate", "open", "show"],
    },
    {
      pattern: /scroll\s+(up|down|top|bottom)/i,
      action: (match) => ({
        type: "scroll",
        direction: match[1].toLowerCase() as "up" | "down" | "top" | "bottom",
      }),
      keywords: ["scroll"],
    },
    {
      pattern: /(click|select|choose|tap)\s+(\w+)/i,
      action: (match) => ({ type: "click", target: match[2].toLowerCase() }),
      keywords: ["click", "select", "choose", "tap"],
    },
    {
      pattern: /(?:help|what can you do|commands|instructions)/i,
      action: () => ({ type: "help" }),
      keywords: ["help", "commands", "instructions"],
    },
  ];

  private navigationTargets = [
    "home",
    "settings",
    "profile",
    "about",
    "dashboard",
    "menu",
  ];
  private clickableTargets = ["button", "link", "item", "option", "tab"];

  processCommand(transcript: string): CommandResult {
    const normalizedTranscript = transcript.toLowerCase().trim();

    for (const { pattern, action } of this.commandPatterns) {
      const match = normalizedTranscript.match(pattern);
      if (match) {
        const commandAction = action(match);
        return {
          action: commandAction,
          confidence: 0.9,
          originalCommand: transcript,
        };
      }
    }

    const possibleMatches = this.findSimilarCommands(normalizedTranscript);
    if (possibleMatches.length > 0) {
      return {
        action: { type: "clarification", options: possibleMatches },
        confidence: 0.5,
        originalCommand: transcript,
      };
    }

    return {
      action: { type: "unknown" },
      confidence: 0,
      originalCommand: transcript,
    };
  }

  private findSimilarCommands(transcript: string): string[] {
    const words = transcript.split(/\s+/);
    const suggestions: string[] = [];

    for (const word of words) {
      if (
        this.navigationTargets.some((target) => this.isSimilar(word, target))
      ) {
        const target = this.navigationTargets.find((t) =>
          this.isSimilar(word, t)
        );
        if (target) suggestions.push(`go to ${target}`);
      }

      if (
        this.clickableTargets.some((target) => this.isSimilar(word, target))
      ) {
        const target = this.clickableTargets.find((t) =>
          this.isSimilar(word, t)
        );
        if (target) suggestions.push(`click ${target}`);
      }
    }

    return [...new Set(suggestions)].slice(0, 3);
  }

  private isSimilar(word1: string, word2: string): boolean {
    if (word1 === word2) return true;
    if (word1.includes(word2) || word2.includes(word1)) return true;

    const distance = this.levenshteinDistance(word1, word2);
    return distance <= 2;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  getAvailableCommands(): string[] {
    return [
      "Go to [home/settings/profile/about/dashboard/menu]",
      "Scroll [up/down/top/bottom]",
      "Click [button/link/item/option/tab]",
      "Help",
    ];
  }
}
