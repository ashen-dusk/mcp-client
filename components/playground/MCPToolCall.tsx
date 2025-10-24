"use client";

import { Loader2, CheckCircle2, XCircle, ChevronDown, Copy } from "lucide-react";
import * as React from "react";

type ToolCallData = Record<string, unknown> | string | null | undefined;

interface ToolCallProps {
  status: "complete" | "inProgress" | "executing";
  name?: string;
  args?: ToolCallData;
  result?: ToolCallData;
}

export default function MCPToolCall({
  status,
  name = "",
  args,
  result,
}: ToolCallProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Format content for display
  const format = (content: ToolCallData): string => {
    if (!content) return "";
    const text =
      typeof content === "object"
        ? JSON.stringify(content, null, 2)
        : String(content);
    return text
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\");
  };

  const getStatusConfig = () => {
    if (status === "complete") {
      // console.log(result, "MCPToolCall Result");
      if (result && typeof result === "object" && "error" in result) {
        const errorMessage = JSON.stringify(result.error);
        console.log(errorMessage, "MCPToolCall Error");
        return {
          icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-300 dark:border-red-800",
          textColor: "text-red-900 dark:text-red-300",
        };
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const hasError = result === "" ? false : (typeof result === "object" && result !== null && "content" in result ? JSON.parse((result as any).content?.[0]?.text || "{}")?.error : false);
        if (hasError) {
          return {
            icon: <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />,
            bgColor: "bg-red-50 dark:bg-red-950/20",
            borderColor: "border-red-300 dark:border-red-800",
            textColor: "text-red-900 dark:text-red-300",
          };
        }
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-300 dark:border-green-800",
          textColor: "text-green-900 dark:text-green-300",
        };
      }
    }
    return {
      icon: <Loader2 className="w-5 h-5 animate-spin text-gray-700 dark:text-gray-300" />,
      bgColor: "bg-gray-50 dark:bg-zinc-800",
      borderColor: "border-gray-300 dark:border-zinc-600",
      textColor: "text-gray-900 dark:text-white",
    };
  };

  const config = getStatusConfig();

  const handleCopy = (content: string) => {
    navigator.clipboard?.writeText(content);
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-md overflow-hidden transition-all duration-200`}
    >
      <div
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-opacity-80"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex items-center justify-center">
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`${config.textColor} font-medium text-sm truncate block`}>
              {name || "MCP Tool Call"}
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {status === "complete" ? "Completed" : "In Progress"}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="px-3 pb-3 space-y-2 border-t border-gray-300 dark:border-zinc-600 pt-2">
          {args && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Parameters
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(format(args));
                  }}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-white dark:bg-zinc-900 p-2.5 rounded overflow-auto max-h-[180px] font-mono border border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100">
                {format(args)}
              </pre>
            </div>
          )}

          {status === "complete" && result && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                  Result
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(format(result));
                  }}
                  className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-white dark:bg-zinc-900 p-2.5 rounded overflow-auto max-h-[180px] font-mono border border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100">
                {format(result)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
