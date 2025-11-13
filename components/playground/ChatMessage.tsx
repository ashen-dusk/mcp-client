import { UserMessageProps, AssistantMessageProps } from "@copilotkit/react-ui";
import { Markdown } from "@copilotkit/react-ui";
import { User, Bot } from "lucide-react";

export function UserMessage({ message }: UserMessageProps) {
  // Extract message content safely - handle both string and object cases
  const getMessageContent = () => {
    if (typeof message === 'string') {
      return message;
    }

    if (message && typeof message === 'object') {
      // Try multiple possible properties
      const msg = message as any;
      return msg.content || msg.text || msg.body || msg.message || '';
    }

    return '';
  };

  return (
    <div className="flex items-start gap-3 px-4 py-3 flex-row-reverse">
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8">
        <div className="w-full h-full flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
      </div>

      {/* Message */}
      <div className="relative py-2 px-3 rounded-2xl rounded-tr-sm max-w-[80%] text-sm leading-relaxed bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
        <div className="whitespace-pre-wrap text-foreground">{getMessageContent()}</div>
      </div>
    </div>
  );
}

export function AssistantMessage({ message, isLoading }: AssistantMessageProps) {
  // Extract message content safely - handle both string and object cases
  const getMessageContent = () => {
    if (typeof message === 'string') {
      return message;
    }

    if (message && typeof message === 'object') {
      // Try multiple possible properties
      const msg = message as any;
      return msg.content || msg.text || msg.body || msg.message || '';
    }

    return '';
  };

  const messageContent = getMessageContent();

  // Extract the generativeUI component (this is where tool renderings appear)
  const subComponent = message && typeof message === 'object' && 'generativeUI' in message
    ? (message as any).generativeUI?.()
    : null;

  console.log(messageContent, "AssistantMessage Content");
  console.log(subComponent, "AssistantMessage SubComponent");

  // Don't render anything if there's no content, no subComponent, and not loading
  if (!messageContent && !subComponent && !isLoading) {
    return null;
  }

  // Only show avatar when there's message content (not just tool calls)
  // Don't show avatar during tool-only execution (even when loading)
  const showAvatar = messageContent || (isLoading && !subComponent);

  return (
    <div className="flex items-start gap-1 p-1">
      {/* Avatar - only shown when there's actual message content */}
      {showAvatar && (
        <div className="shrink-0 w-8 h-8">
          {/* <div className="w-full h-full flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500"> */}
            <Bot className="w-5 h-5 text-white" />
          {/* </div> */}
        </div>
      )}

      {/* Message */}
      <div className={`flex-1 space-y-2 ${showAvatar ? 'max-w-[80%]' : 'w-full'}`}>
        {/* Render tool calls and actions (always visible, even during loading) */}
        {subComponent && (
          <div className="w-full">
            {subComponent}
          </div>
        )}

        {/* Message content */}
        {messageContent && !isLoading && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown content={messageContent} />
          </div>
        )}

        {/* Loading indicator - shown when loading and no content yet (even if tools are present) */}
        {isLoading && !messageContent && (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
          </div>
        )}
      </div>
    </div>
  );
}