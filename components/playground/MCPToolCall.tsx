"use client";

import { Loader2, CheckCircle2, XCircle, ChevronDown, Copy, Wrench } from "lucide-react";
import * as React from "react";

interface ToolCallProps {
  status: "complete" | "inProgress" | "executing";
  name?: string;
  args?: any;
  result?: any;
}

export default function MCPToolCall({
  status,
  name = "",
  args,
  result,
}: ToolCallProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Format content for display
  const format = (content: any): string => {
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
      console.log(result, "MCPToolCall Result");
      if (result && result.error) {
        const errorMessage = JSON.stringify(result.error);
        console.log(errorMessage, "MCPToolCall Error");
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-800",
          textColor: "text-red-700 dark:text-red-400",
        };
      } else {
        const hasError = result === "" ? false : JSON.parse(result?.content?.[0]?.text || "{}")?.error;
        if (hasError) {
          return {
            icon: <XCircle className="w-5 h-5 text-red-500" />,
            bgColor: "bg-red-50 dark:bg-red-950/20",
            borderColor: "border-red-200 dark:border-red-800",
            textColor: "text-red-700 dark:text-red-400",
          };
        }
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-200 dark:border-green-800",
          textColor: "text-green-700 dark:text-green-400",
        };
      }
    }
    return {
      icon: <Loader2 className="w-5 h-5 animate-spin text-blue-500" />,
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-400",
    };
  };

  const config = getStatusConfig();

  const handleCopy = (content: string) => {
    navigator.clipboard?.writeText(content);
  };

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border-l-4 rounded overflow-hidden transition-all duration-200`}
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
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className={`${config.textColor} font-medium text-sm truncate`}>
                {name || "MCP Tool Call"}
              </span>
            </div>
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
        <div className="px-3 pb-3 space-y-2 border-t border-gray-200 dark:border-gray-700 pt-2">
          {args && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Parameters
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(format(args));
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded overflow-auto max-h-[180px] font-mono border border-gray-200 dark:border-gray-700">
                {format(args)}
              </pre>
            </div>
          )}

          {status === "complete" && result && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Result
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(format(result));
                  }}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2.5 rounded overflow-auto max-h-[180px] font-mono border border-gray-200 dark:border-gray-700">
                {format(result)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
