"use client";
import { CopilotChat } from "@copilotkit/react-ui";
import { ToolRenderer } from "@/components/playground/ToolRenderer";
import "@copilotkit/react-ui/styles.css";
import ChatInput from "../../components/playground/ChatInput";
import { usePushToTalk } from "@/hooks/usePushToTalk";
import { Message } from "@copilotkit/shared";
import { CopilotKitCSSProperties } from "@copilotkit/react-ui";
import CustomUserMessage from "@/components/custom/CustomUserMessage";
import CustomAssistantMessage from "@/components/custom/CustomAssistantMessage";

interface ChatInputWrapperProps {
  onSend: (message: string) => void;
}

const ChatInputWrapper = ({ onSend }: ChatInputWrapperProps) => {
  // Hook for voice input functionality
  const { pushToTalkState, setPushToTalkState } = usePushToTalk({
    sendFunction: async (text: string) => {
      // Call the onSend prop to send the transcribed message
      onSend(text);
      // Return a message object (CopilotKit will handle the actual message)
      return {
        id: Date.now().toString(),
        content: text,
        role: "user",
      } as Message;
    },
  });

  return (
    <div className="w-full">
      <ChatInput
        onSendMessage={onSend}
        pushToTalkState={pushToTalkState}
        onPushToTalkStateChange={setPushToTalkState}
      />
    </div>
  );
};

const PlaygroundPage = () => {
  return (
    <div
      className="max-w-2xl mx-auto"
      style={
        {
          "--copilot-kit-background-color": "var(--background)",
        } as CopilotKitCSSProperties
      }
    >
      <ToolRenderer />
      <CopilotChat
        labels={{
          initial: "Hello! I am your MCP assistant. How can I help you today?",
          title: "MCP Playground",
          placeholder: "Ask about your connected servers...",
        }}
        className="h-[85vh] rounded-md"
        Input={ChatInputWrapper}
        UserMessage={CustomUserMessage}
        AssistantMessage={CustomAssistantMessage}
      />
    </div>
  );
};

export default PlaygroundPage;
