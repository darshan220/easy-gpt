import { MessageProps } from "@/types/type";
import { Bot } from "lucide-react";
import { useState } from "react";

const AssistantMessage: React.FC<MessageProps> = ({ message }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Simple markdown rendering for bold text
  const renderMarkdown = (text: string): string => {
    return (
      text
        // Convert **bold**
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // Convert \n to <br>
        .replace(/\n/g, "<br>")
    );
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-xs lg:max-w-2xl">
        <div className="flex items-start space-x-3">
          <div className="w-8 h- rounded-full flex items-center justify-center flex-shrink-0">
            <Bot />
          </div>

          <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2 flex-1">
            <div
              className="text-sm text-gray-800"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(message?.content ?? ""),
              }}
            />
            {message.streaming && (
              <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
            )}
          </div>

          <button
            onClick={copyToClipboard}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy message"
            aria-label="Copy message to clipboard"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Assistant timestamp details */}
        {/* {message.timestamp && (
          <div className="ml-11 mt-1">
            <span className="text-xs text-gray-500">{message.timestamp}</span>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AssistantMessage;
