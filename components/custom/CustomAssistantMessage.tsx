import { type AssistantMessageProps } from "@copilotkit/react-ui";
import { useChatContext, Markdown } from "@copilotkit/react-ui";
import {
  Message,
  MessageAvatar,
  MessageContent,
} from "../ui/shadcn-io/ai/message";

export default function CustomAssistantMessage(props: AssistantMessageProps) {
  const { icons } = useChatContext();
  const { message, isLoading } = props;

  const wrapperStyles = "flex items-center gap-2 justify-end mb-4";
  const messageStyles = "items-start";

  // 🛠 Prevent double render — skip empty finalized messages
  if (!message?.content && !isLoading) return null;

  return (
    <div className={wrapperStyles}>
      <Message from="assistant" className={messageStyles}>
        <MessageContent>
          {message?.content ? (
            <Markdown content={message.content} />
          ) : isLoading ? (
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              {icons.spinnerIcon}
              <span>Thinking...</span>
            </div>
          ) : null}
        </MessageContent>
        <MessageAvatar src="https://github.com/openai.png" name="AI" />
      </Message>
    </div>
  );
}
