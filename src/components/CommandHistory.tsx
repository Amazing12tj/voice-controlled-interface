import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export interface CommandHistoryItem {
  id: string;
  command: string;
  status: "success" | "error" | "clarification";
  response: string;
  timestamp: Date;
}

interface CommandHistoryProps {
  history: CommandHistoryItem[];
}

export function CommandHistory({ history }: CommandHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">
          No commands yet. Start speaking to see your history.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-slate-700 px-4 py-3">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Command History
        </h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {history.map((item) => (
          <div
            key={item.id}
            className="border-b border-slate-200 p-4 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {item.status === "success" && (
                  <CheckCircle
                    className="w-5 h-5 text-green-500"
                    aria-label="Success"
                  />
                )}
                {item.status === "error" && (
                  <XCircle
                    className="w-5 h-5 text-red-500"
                    aria-label="Error"
                  />
                )}
                {item.status === "clarification" && (
                  <AlertCircle
                    className="w-5 h-5 text-amber-500"
                    aria-label="Clarification needed"
                  />
                )}
              </div>
              <div className="flex-grow">
                <p className="font-medium text-slate-900">{item.command}</p>
                <p className="text-sm text-slate-600 mt-1">{item.response}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {item.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
