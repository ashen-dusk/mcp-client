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
  const { data: session } = useSession();

  // Generate sessionId for authenticated or anonymous users
  const getSessionId = () => {
    let id = localStorage.getItem("copilotkit-session");
    if (!id) {
      const email = session?.user?.email;
      id = email?.endsWith("@gmail.com")
        ? email.replace(/@gmail\.com$/, "")
        : email || crypto.randomUUID();
      localStorage.setItem("copilotkit-session", id);
    }
    return id;
  };

  const { state, setState } = useCoAgent<AgentState>({
    name: "mcpAssistant",
    initialState: {
      model: "gpt-4o-mini",
      status: undefined,
      sessionId: getSessionId(),
    },
  });

  const [message, setMessage] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const handleModelChange = (modelId: string) => {
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

  const selectedModelData = AVAILABLE_MODELS.find(m => m.id === state.model);

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
      return "bg-red-600 hover:bg-red-500 animate-pulse";
    } else if (pushToTalkState === "transcribing") {
      return "bg-blue-600 hover:bg-blue-500";
    }
    return "bg-zinc-600 hover:bg-zinc-500";
  };

  return (
    <div className="w-full px-4 py-3">
      <div className="relative bg-zinc-800 rounded-2xl border border-zinc-800 shadow-xl">
        <div className="flex items-end p-4">
          {/* Message Input Area */}
          <div className="flex-1 mr-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your prompt..."
              className="w-full resize-none bg-transparent border-0 outline-none text-gray-100 placeholder-gray-500 text-[15px] leading-relaxed"
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
              className="flex items-center space-x-1.5 px-3 py-1.5 hover:bg-zinc-700/50 rounded transition-all duration-200"
            >
              <span className="text-xs font-medium text-gray-300">
                {selectedModelData?.name}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${showModelDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showModelDropdown && (
              <>
                <div className="absolute bottom-full mb-2 right-0 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 min-w-[280px] max-w-[320px] overflow-hidden">
                  <div className="py-1">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => handleModelChange(model.id)}
                        className={`w-full flex flex-col px-4 py-3 text-left transition-all duration-150
                          ${state.model === model.id
                            ? 'bg-blue-600/20 border-l-2 border-blue-400'
                            : 'text-gray-300 hover:bg-zinc-800 hover:text-white border-l-2 border-transparent'
                          }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className={`text-sm font-semibold ${state.model === model.id ? 'text-blue-400' : 'text-gray-100'}`}>
                            {model.name}
                          </span>
                          {state.model === model.id && (
                            <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400 leading-relaxed">
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
                       transition-all duration-200 shadow-lg mr-2`}
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
            className="bg-zinc-600 hover:bg-zinc-500 disabled:bg-zinc-700 disabled:opacity-50
                     text-white rounded-lg p-2 h-8 w-8 flex items-center justify-center
                     transition-all duration-200 shadow-lg"
          >
              <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}