"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  CheckCircle,
  ArrowUp,
  Mic,
  MicOff,
  Loader2
} from "lucide-react";
import { PushToTalkState } from "@/hooks/usePushToTalk";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/types/mcp";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

interface CustomChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  pushToTalkState?: PushToTalkState;
  onPushToTalkStateChange?: (state: PushToTalkState) => void;
}

const AVAILABLE_MODELS = [
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    description: "Fast and affordable for everyday tasks"
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most capable, best for complex reasoning"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Quick responses, good for simple queries"
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek-V3",
    description: "Excellent at coding and technical tasks"
  },
];

export default function ChatInput({
  onSendMessage,
  pushToTalkState = "idle",
  onPushToTalkStateChange
}: CustomChatInputProps) {

  // Generate sessionId for authenticated or anonymous users (browser only)
  const { data: session } = useSession();
  const getSessionId = (session: Session | null) => {
    if (typeof window === "undefined") return undefined;

    const sessionId = localStorage.getItem("copilotkit-session");

    if (session?.user?.email) {
    // Authenticated user
    const email = session.user.email;
    const derivedId = email.endsWith("@gmail.com")
      ? email.replace(/@gmail\.com$/, "")
      : email;
    localStorage.setItem("copilotkit-session", derivedId);
    return derivedId;

  } else {
    // Anonymous user
    if (!sessionId) {
      const randomId = crypto.randomUUID();
      localStorage.setItem("copilotkit-session", randomId);
      return randomId;
    }
    return sessionId;
  }
  };

  // Separate state for model - independent of coagent state
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  const { state, setState } = useCoAgent<AgentState>({
    name: "mcpAssistant",
    initialState: {
      model: selectedModel,
      status: undefined,
      sessionId: getSessionId(session),
    },
  });

  console.log("Agent State:", state);

  const [message, setMessage] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleModelChange = (modelId: string) => {
    // Update local state
    setSelectedModel(modelId);
    // Push to coagent state
    setState({...state, model: modelId});
    setShowModelDropdown(false);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleMicrophoneClick = () => {
    if (!onPushToTalkStateChange) return;

    if (pushToTalkState === "idle") {
      onPushToTalkStateChange("recording");
    } else if (pushToTalkState === "recording") {
      onPushToTalkStateChange("idle");
    }
  };

  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === selectedModel);

  const getMicrophoneIcon = () => {
    if (pushToTalkState === "recording") {
      return <MicOff className="w-4 h-4" />;
    } else if (pushToTalkState === "transcribing") {
      return <Loader2 className="w-4 h-4 animate-spin" />;
    }
    return <Mic className="w-4 h-4" />;
  };

  const getMicrophoneColor = () => {
    if (pushToTalkState === "recording") {
      return "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 animate-pulse";
    } else if (pushToTalkState === "transcribing") {
      return "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500";
    }
    return "bg-gray-500 hover:bg-gray-600 dark:bg-zinc-600 dark:hover:bg-zinc-500";
  };

  return (
    <div className="w-full px-4 py-3">
      <div className="relative bg-white dark:bg-zinc-800 rounded-2xl border-2 border-blue-200 dark:border-zinc-700 shadow-xl hover:border-blue-300 dark:hover:border-zinc-600 transition-colors">
        <div className="flex items-end p-4">
          {/* Message Input Area */}
          <div className="flex-1 mr-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your prompt..."
              className="w-full resize-none bg-transparent border-0 outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-[15px] leading-relaxed"
              rows={1}
              style={{ 
                minHeight: '60px',
                maxHeight: '120px',
                overflowY: message.split('\n').length > 3 ? 'auto' : 'hidden'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 120) + 'px';
              }}
            />
          </div>

          {/* Model Selection Dropdown */}
          <div className="relative mr-2">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700/50 rounded transition-all duration-200"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {selectedModelData?.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showModelDropdown && (
              <>
                <div className="absolute bottom-full mb-2 right-0 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-2xl z-50 min-w-[280px] max-w-[320px] overflow-hidden">
                  <div className="py-1">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelChange(model.id)}
                        className={`w-full flex flex-col px-4 py-3 text-left transition-all duration-150
                          ${selectedModel === model.id
                            ? 'bg-blue-50 dark:bg-blue-600/20 border-l-2 border-blue-500 dark:border-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-white border-l-2 border-transparent'
                          }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-sm font-semibold ${selectedModel === model.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                            {model.name}
                          </span>
                          {selectedModel === model.id && (
                            <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          {model.description}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowModelDropdown(false)}
                />
              </>
            )}
          </div>

          {/* Microphone Button */}
          {onPushToTalkStateChange && (
            <Button
              onClick={handleMicrophoneClick}
              disabled={pushToTalkState === "transcribing"}
              className={`${getMicrophoneColor()} disabled:opacity-50
                       text-white rounded-lg p-2 h-8 w-8 flex items-center justify-center
                       transition-all duration-200 shadow-lg mr-2 cursor-pointer disabled:cursor-not-allowed`}
              title={
                pushToTalkState === "recording"
                  ? "Stop recording"
                  : pushToTalkState === "transcribing"
                  ? "Transcribing..."
                  : "Start voice recording"
              }
            >
              {getMicrophoneIcon()}
            </Button>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:opacity-50
                     text-white rounded-lg p-2 h-8 w-8 flex items-center justify-center
                     transition-all duration-200 shadow-lg cursor-pointer disabled:cursor-not-allowed"
          >
              <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}