"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  CheckCircle,
  ArrowUp,
  Mic,
  MicOff,
  Loader2,
  Lock,
  Bot,
  Plus,
  Pencil,
  X, // <-- add this
} from "lucide-react";
import { PushToTalkState } from "@/hooks/usePushToTalk";
import { useCoAgent } from "@copilotkit/react-core";
import { AgentState, Assistant } from "@/types/mcp";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useAssistants } from "@/hooks/useAssistants";
import { toast } from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
    description: "Fast and affordable for everyday tasks",
    provider: "OpenAI",
    tag: "Balanced"
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    description: "Most capable, best for complex reasoning",
    provider: "OpenAI",
    tag: "Premium"
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Quick responses, good for simple queries",
    provider: "OpenAI",
    tag: "Fast"
  },
  {
    id: "deepseek-chat",
    name: "DeepSeek-V3",
    description: "Excellent at coding and technical tasks",
    provider: "DeepSeek",
    tag: "Coding"
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash",
    description: "Google's fast experimental model with multimodal capabilities",
    provider: "Google",
    tag: "Multimodal"
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B",
    description: "Meta's powerful instruction-tuned model, great for reasoning",
    provider: "Meta",
    tag: "Reasoning"
  },
  {
    id: "meta-llama/llama-4-maverick:free",
    name: "Llama 4 Maverick",
    description: "Meta's latest experimental Llama 4 variant",
    provider: "Meta",
    tag: "Experimental"
  },
  {
    id: "qwen/qwen3-235b-a22b:free",
    name: "Qwen 3 235B",
    description: "Massive 235B parameter model with exceptional capabilities",
    provider: "Qwen",
    tag: "Large"
  },
  {
    id: "qwen/qwen3-coder:free",
    name: "Qwen 3 Coder",
    description: "Specialized coding model, optimized for programming tasks",
    provider: "Qwen",
    tag: "Coding"
  },
  {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    description: "Advanced reasoning model for complex problem-solving",
    provider: "DeepSeek",
    tag: "Reasoning"
  },
  {
    id: "deepseek/deepseek-r1-0528:free",
    name: "DeepSeek R1-0528",
    description: "Enhanced reasoning variant with improved accuracy",
    provider: "DeepSeek",
    tag: "Reasoning"
  },
  {
    id: "deepseek/deepseek-chat-v3-0324:free",
    name: "DeepSeek Chat V3",
    description: "Latest DeepSeek chat model with improved performance",
    provider: "DeepSeek",
    tag: "Chat"
  },
  {
    id: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    name: "DeepSeek R1 Qwen 8B",
    description: "Hybrid model combining DeepSeek reasoning with Qwen efficiency",
    provider: "DeepSeek",
    tag: "Hybrid"
  },
  {
    id: "tngtech/deepseek-r1t2-chimera:free",
    name: "DeepSeek R1T2 Chimera",
    description: "Reasoning-enhanced chimera model with advanced capabilities",
    provider: "Community",
    tag: "Reasoning"
  },
  {
    id: "microsoft/mai-ds-r1:free",
    name: "Microsoft MAI-DS R1",
    description: "Microsoft's AI reasoning model for analytical tasks",
    provider: "Microsoft",
    tag: "Analytical"
  },
  {
    id: "openai/gpt-oss-20b:free",
    name: "GPT OSS 20B",
    description: "Open-source GPT model with 20B parameters",
    provider: "OpenAI",
    tag: "Open Source"
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

  // Fetch assistants
  const { assistants, activeAssistant, setActiveAssistant, createAssistant, updateAssistant, deleteAssistant } = useAssistants();

  // Separate state for model - independent of coagent state
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");

  const { state, setState } = useCoAgent<AgentState>({
    name: "mcpAssistant",
    initialState: {
      model: selectedModel,
      status: undefined,
      sessionId: getSessionId(session),
      assistant: activeAssistant,
    },
  });

  // Update coagent state when active assistant changes
  useEffect(() => {
    if (activeAssistant !== state.assistant) {
      setState({ ...state, assistant: activeAssistant });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeAssistant, setState]);

  // console.log("Agent State:", state);

  const [message, setMessage] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAssistantDropdown, setShowAssistantDropdown] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showCreateAssistantDialog, setShowCreateAssistantDialog] = useState(false);
  const [showEditAssistantDialog, setShowEditAssistantDialog] = useState(false);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null);
  const [deletingAssistant, setDeletingAssistant] = useState<Assistant | null>(null);
  const [assistantFormData, setAssistantFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    config: {
      ask_mode: true,
      max_tokens: 2000,
      temperature: 0.7,
      datetime_context: true,
    }
  });

  const handleModelChange = (modelId: string) => {
    // Update local state
    setSelectedModel(modelId);
    // Push to coagent state
    setState({...state, model: modelId});
    setShowModelDropdown(false);
  };

  const handleAssistantChange = async (assistantId: string) => {
    setIsBusy(true);
    try {
      await setActiveAssistant(assistantId);
      setShowAssistantDropdown(false);
    } catch (error) {
      console.error("Failed to set active assistant:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleCreateAssistant = async () => {
    if (!assistantFormData.name.trim() || !assistantFormData.instructions.trim()) {
      toast.error("Name and instructions are required");
      return;
    }
    setIsBusy(true);
    try {
      await createAssistant({
        name: assistantFormData.name,
        instructions: assistantFormData.instructions,
        description: assistantFormData.description || undefined,
        isActive: true, // Make new assistant active by default
        config: assistantFormData.config,
      });
      setShowCreateAssistantDialog(false);
      setAssistantFormData({
        name: "",
        description: "",
        instructions: "",
        config: {
          ask_mode: true,
          max_tokens: 2000,
          temperature: 0.7,
          datetime_context: true,
        }
      });
    } catch (error) {
      console.error("Failed to create assistant:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleEditClick = (assistant: Assistant, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the assistant
    setEditingAssistant(assistant);
    setAssistantFormData({
      name: assistant.name,
      description: assistant.description || "",
      instructions: assistant.instructions,
      config: assistant.config || {
        ask_mode: true,
        max_tokens: 2000,
        temperature: 0.7,
        datetime_context: true,
      }
    });
    setShowAssistantDropdown(false);
    setShowEditAssistantDialog(true);
  };

  const handleUpdateAssistant = async () => {
    if (!editingAssistant) return;
    if (!assistantFormData.name.trim() || !assistantFormData.instructions.trim()) {
      toast.error("Name and instructions are required");
      return;
    }
    setIsBusy(true);
    try {
      await updateAssistant(editingAssistant.id, {
        name: assistantFormData.name,
        instructions: assistantFormData.instructions,
        description: assistantFormData.description || undefined,
        config: assistantFormData.config,
      });
      setShowEditAssistantDialog(false);
      setEditingAssistant(null);
      setAssistantFormData({
        name: "",
        description: "",
        instructions: "",
        config: {
          ask_mode: true,
          max_tokens: 2000,
          temperature: 0.7,
          datetime_context: true,
        }
      });
    } catch (error) {
      console.error("Failed to update assistant:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteClick = (assistant: Assistant, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the assistant
    setDeletingAssistant(assistant);
    setShowAssistantDropdown(false);
    setShowDeleteConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingAssistant) return;
    setIsBusy(true);
    try {
      await deleteAssistant(deletingAssistant.id);
      setShowDeleteConfirmDialog(false);
      setDeletingAssistant(null);
    } catch (error) {
      console.error("Failed to delete assistant:", error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendMessage = () => {
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

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
    if (!session) {
      setShowAuthDialog(true);
      return;
    }

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
      return <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
    } else if (pushToTalkState === "transcribing") {
      return <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />;
    }
    return <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />;
  };

  const getMicrophoneColor = () => {
    if (pushToTalkState === "recording") {
      return "bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-500 animate-pulse";
    } else if (pushToTalkState === "transcribing") {
      return "bg-gray-600 hover:bg-gray-700 dark:bg-zinc-600 dark:hover:bg-zinc-500";
    }
    return "bg-gray-500 hover:bg-gray-600 dark:bg-zinc-600 dark:hover:bg-zinc-500";
  };

  return (
    <>
      {/* Authentication Required Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800">
                <Lock className="h-4 w-4 text-gray-900 dark:text-white" />
              </div>
              <DialogTitle className="text-base">Sign In Required</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              Sign in to start chatting with the AI assistant.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAuthDialog(false)}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Link href="/api/auth/signin" className="flex-1">
              <Button className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black cursor-pointer">
                Sign In
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Assistant Dialog */}
      <Dialog open={showCreateAssistantDialog} onOpenChange={setShowCreateAssistantDialog}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800">
                <Bot className="h-4 w-4 text-gray-900 dark:text-white" />
              </div>
              <DialogTitle className="text-base">Create New Assistant</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              Create a custom assistant with specific instructions to personalize your experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto flex-1 scrollbar-minimal">
            <div className="space-y-2">
              <Label htmlFor="assistant-name">Name *</Label>
              <Input
                id="assistant-name"
                placeholder="My Assistant"
                value={assistantFormData.name}
                onChange={(e) => setAssistantFormData({ ...assistantFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assistant-description">Description</Label>
              <Input
                id="assistant-description"
                placeholder="Brief description of the assistant"
                value={assistantFormData.description}
                onChange={(e) => setAssistantFormData({ ...assistantFormData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assistant-instructions">Instructions *</Label>
              <Textarea
                id="assistant-instructions"
                placeholder="You are a helpful assistant that..."
                value={assistantFormData.instructions}
                onChange={(e) => setAssistantFormData({ ...assistantFormData, instructions: e.target.value })}
                rows={5}
              />
            </div>

            {/* Config Section */}
            <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-zinc-700">
              <Label className="text-sm font-semibold">Configuration</Label>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="ask-mode" className="text-sm font-normal">Ask Mode</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Agent will ask to approve before executing tools/performing actions</p>
                </div>
                <Switch
                  id="ask-mode"
                  checked={assistantFormData.config.ask_mode}
                  onCheckedChange={(checked) =>
                    setAssistantFormData({
                      ...assistantFormData,
                      config: { ...assistantFormData.config, ask_mode: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="datetime-context" className="text-sm font-normal">DateTime Context</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Include date and time information</p>
                </div>
                <Switch
                  id="datetime-context"
                  checked={assistantFormData.config.datetime_context}
                  onCheckedChange={(checked) =>
                    setAssistantFormData({
                      ...assistantFormData,
                      config: { ...assistantFormData.config, datetime_context: checked }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  min={100}
                  max={10000}
                  step={100}
                  value={assistantFormData.config.max_tokens}
                  onChange={(e) =>
                    setAssistantFormData({
                      ...assistantFormData,
                      config: { ...assistantFormData.config, max_tokens: parseInt(e.target.value) || 2000 }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="temperature"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={assistantFormData.config.temperature}
                    onChange={(e) =>
                      setAssistantFormData({
                        ...assistantFormData,
                        config: { ...assistantFormData.config, temperature: parseFloat(e.target.value) || 0.7 }
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[50px]">
                    {assistantFormData.config.temperature}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateAssistantDialog(false);
                setAssistantFormData({
                  name: "",
                  description: "",
                  instructions: "",
                  config: {
                    ask_mode: true,
                    max_tokens: 2000,
                    temperature: 0.7,
                    datetime_context: true,
                  }
                });
              }}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAssistant}
              disabled={isBusy}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Assistant"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Assistant Dialog */}
      <Dialog open={showEditAssistantDialog} onOpenChange={setShowEditAssistantDialog}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-zinc-800">
                <Pencil className="h-4 w-4 text-gray-900 dark:text-white" />
              </div>
              <DialogTitle className="text-base">Edit Assistant</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              Update your assistant's configuration and instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 overflow-y-auto flex-1 scrollbar-minimal">
            <div className="space-y-2">
              <Label htmlFor="edit-assistant-name">Name *</Label>
              <Input
                id="edit-assistant-name"
                placeholder="My Assistant"
                value={assistantFormData.name}
                onChange={(e) => setAssistantFormData({ ...assistantFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assistant-description">Description</Label>
              <Input
                id="edit-assistant-description"
                placeholder="Brief description of the assistant"
                value={assistantFormData.description}
                onChange={(e) => setAssistantFormData({ ...assistantFormData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-assistant-instructions">Instructions *</Label>
              <Textarea
                id="edit-assistant-instructions"
                placeholder="You are a helpful assistant that..."
                value={assistantFormData.instructions}
                onChange={(e) => setAssistantFormData({ ...assistantFormData, instructions: e.target.value })}
                rows={5}
              />
            </div>

            {/* Config Section */}
            <div className="space-y-3 pt-2 border-t border-gray-200 dark:border-zinc-700">
              <Label className="text-sm font-semibold">Configuration</Label>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex-1 pr-4">
                  <Label htmlFor="edit-ask-mode" className="text-sm font-normal">Ask Mode</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Agent will ask to approve before executing tools/performing actions</p>
                </div>
                <Switch
                  id="edit-ask-mode"
                  checked={assistantFormData.config.ask_mode}
                  onCheckedChange={(checked) =>
                    setAssistantFormData({
                      ...assistantFormData,
                      config: { ...assistantFormData.config, ask_mode: checked }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edit-datetime-context" className="text-sm font-normal">DateTime Context</Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Include date and time information</p>
                </div>
                <Switch
                  id="edit-datetime-context"
                  checked={assistantFormData.config.datetime_context}
                  onCheckedChange={(checked) =>
                    setAssistantFormData({
                      ...assistantFormData,
                      config: { ...assistantFormData.config, datetime_context: checked }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-max-tokens">Max Tokens</Label>
                <Input
                  id="edit-max-tokens"
                  type="number"
                  min={100}
                  max={10000}
                  step={100}
                  value={assistantFormData.config.max_tokens}
                  onChange={(e) =>
                    setAssistantFormData({
                      ...assistantFormData,
                      config: { ...assistantFormData.config, max_tokens: parseInt(e.target.value) || 2000 }
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-temperature">Temperature</Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="edit-temperature"
                    type="number"
                    min={0}
                    max={2}
                    step={0.1}
                    value={assistantFormData.config.temperature}
                    onChange={(e) =>
                      setAssistantFormData({
                        ...assistantFormData,
                        config: { ...assistantFormData.config, temperature: parseFloat(e.target.value) || 0.7 }
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[50px]">
                    {assistantFormData.config.temperature}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditAssistantDialog(false);
                setEditingAssistant(null);
                setAssistantFormData({
                  name: "",
                  description: "",
                  instructions: "",
                  config: {
                    ask_mode: true,
                    max_tokens: 2000,
                    temperature: 0.7,
                    datetime_context: true,
                  }
                });
              }}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAssistant}
              disabled={isBusy}
              className="flex-1 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Assistant"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirmDialog} onOpenChange={setShowDeleteConfirmDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/20">
                <X className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <DialogTitle className="text-base">Delete Assistant</DialogTitle>
            </div>
            <DialogDescription className="text-sm leading-relaxed">
              Are you sure you want to delete <strong>{deletingAssistant?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteConfirmDialog(false);
                setDeletingAssistant(null);
              }}
              disabled={isBusy}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isBusy}
              className="flex-1 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBusy ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full px-2 sm:px-4">
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl border-2 border-gray-400 dark:border-zinc-700 shadow-xl hover:border-gray-500 dark:hover:border-zinc-600 transition-colors">
        <div className="flex items-end p-2 sm:p-4">
          {/* Message Input Area */}
          <div className="flex-1 mr-1.5 sm:mr-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your prompt..."
              className="w-full resize-none bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-[15px] leading-relaxed"
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

          {/* Assistant Selection Dropdown */}
          {session && (
            <div className="relative mr-1 sm:mr-2">
              <button
                onClick={() => setShowAssistantDropdown(!showAssistantDropdown)}
                className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700/50 rounded transition-all duration-200 cursor-pointer"
              >
                <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                {isBusy && <Loader2 className="w-3 h-3.5 ml-1 animate-spin text-gray-500 dark:text-gray-300" />}
                <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px] sm:max-w-none">
                  {activeAssistant?.name || "Default"}
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${showAssistantDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showAssistantDropdown && (
                <>
                  <div className="absolute bottom-full mb-2 right-0 md:right-0 left-0 md:left-auto bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-700/50 rounded-2xl shadow-2xl backdrop-blur-xl z-50 w-full md:min-w-[300px] md:max-w-[360px] max-h-[50vh] overflow-hidden">
                    {/* Assistants List */}
                    <div className="overflow-y-auto max-h-[calc(50vh-60px)] scrollbar-minimal px-1">
                      <div className="p-2">
                        {assistants && assistants.length > 0 ? (
                          assistants.map((assistant) => (
                            <button
                              key={assistant.id}
                              onClick={() => handleAssistantChange(assistant.id)}
                              className={`w-full group relative flex flex-col px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all duration-150 rounded-lg cursor-pointer
                                ${activeAssistant?.id === assistant.id
                                  ? 'bg-gray-200 dark:bg-zinc-700 border-2 border-gray-600 dark:border-zinc-400 z-10'
                                  : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50 border-2 border-transparent'}`}
                              disabled={isBusy}
                            >
                              {/* Name, Actions & Check Icon */}
                              <div className="flex items-center justify-between w-full mb-1">
                                <div className="flex items-center gap-2 flex-1">
                                  <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-gray-600 dark:text-gray-400" />
                                  <span className={`text-[11px] sm:text-xs font-medium ${activeAssistant?.id === assistant.id ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-900 dark:text-gray-100'}`}>{assistant.name}</span>
                                </div>
                                <div className="flex items-center gap-1 ml-2">
                                  <button
                                    onClick={(e) => handleEditClick(assistant, e)}
                                    className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded transition-colors cursor-pointer"
                                    title="Edit assistant"
                                    disabled={isBusy}
                                  >
                                    <Pencil className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteClick(assistant, e)}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors cursor-pointer"
                                    title="Delete assistant"
                                    disabled={isBusy}
                                  >
                                    <X className="w-3 h-3 text-red-600 dark:text-red-400" />
                                  </button>
                                  {/* Remove check/tick icon */}
                                  {/* {activeAssistant?.id === assistant.id && (
                                    <CheckCircle className="w-4 h-4 text-gray-900 dark:text-white flex-shrink-0" />
                                  )} */}
                                </div>
                              </div>

                              {/* Description */}
                              {assistant.description && (
                                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed ml-5">
                                  {assistant.description}
                                </p>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="px-3 sm:px-4 py-6 text-center">
                            <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400 dark:text-gray-600" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              No assistants yet
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Create New Assistant Button */}
                    <div className="border-t border-gray-200 dark:border-zinc-700 p-2">
                      <button
                        onClick={() => {
                          setShowAssistantDropdown(false);
                          setShowCreateAssistantDialog(true);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 text-[11px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg transition-all duration-150 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Create New Assistant
                      </button>
                    </div>
                  </div>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAssistantDropdown(false)}
                  />
                </>
              )}
            </div>
          )}

          {/* Model Selection Dropdown */}
          <div className="relative mr-1 sm:mr-2">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center space-x-1 sm:space-x-1.5 px-2 sm:px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-zinc-700/50 rounded transition-all duration-200"
            >
              <span className="text-[10px] sm:text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[80px] sm:max-w-none">
                {selectedModelData?.name}
              </span>
              <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500 dark:text-gray-400 transition-transform duration-200 flex-shrink-0 ${showModelDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showModelDropdown && (
              <>
                <div className="absolute bottom-full mb-2 right-0 md:right-0 left-0 md:left-auto bg-white dark:bg-zinc-900 border border-gray-200/80 dark:border-zinc-700/50 rounded-2xl shadow-2xl backdrop-blur-xl z-50 w-full md:min-w-[340px] md:max-w-[400px] max-h-[55vh] overflow-hidden">
                  {/* Models List */}
                  <div className="overflow-y-auto max-h-[55vh] scrollbar-minimal">
                    <div className="p-2">
                      {AVAILABLE_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => handleModelChange(model.id)}
                          className={`w-full group relative flex flex-col px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all duration-150
                            ${selectedModel === model.id
                              ? 'bg-gray-100 dark:bg-zinc-800'
                              : 'hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                            }`}
                        >
                          {/* Name & Check Icon */}
                          <div className="flex items-center justify-between w-full mb-1.5">
                            <div className="flex items-center gap-2 flex-1">
                              <span className={`text-[11px] sm:text-xs font-medium ${selectedModel === model.id ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                {model.name}
                              </span>
                              {/* Provider & Tag Badges */}
                              <div className="flex items-center gap-1 flex-wrap">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold border text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600">
                                  {model.provider}
                                </span>
                                {model.id.includes(':free') && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-semibold text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
                                    OpenRouter
                                  </span>
                                )}
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                                  {model.tag}
                                </span>
                              </div>
                            </div>
                            {selectedModel === model.id && (
                              <CheckCircle className="w-4 h-4 text-gray-900 dark:text-white flex-shrink-0 ml-2" />
                            )}
                          </div>

                          {/* Description */}
                          <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            {model.description}
                          </p>
                        </button>
                      ))}
                    </div>
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
                       text-white rounded-lg p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center
                       transition-all duration-200 shadow-lg mr-1 sm:mr-2 cursor-pointer disabled:cursor-not-allowed`}
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
            className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-black disabled:bg-gray-300 dark:disabled:bg-zinc-700 disabled:opacity-50
                     text-white rounded-lg p-1.5 sm:p-2 h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center
                     transition-all duration-200 shadow-lg cursor-pointer disabled:cursor-not-allowed"
          >
              <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>
      </div>
    </>
  );
}