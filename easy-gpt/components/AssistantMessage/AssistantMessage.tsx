import { MessageProps } from "@/types/type";
import { useState } from "react";

const AssistantMessage: React.FC<MessageProps> = ({ message }) => {
  console.log(message, "message");
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
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
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
            {copied ? (
              <svg
                className="w-4 h-4 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
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
            )}
          </button>
        </div>

        {message.timestamp && (
          <div className="ml-11 mt-1">
            <span className="text-xs text-gray-500">{message.timestamp}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantMessage;
