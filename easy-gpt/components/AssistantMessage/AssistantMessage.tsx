import { MessageProps } from "@/types/type";
import { Bot } from "lucide-react";
import "./assistantMessage.css";
import { TypewriterEffect } from "../TypeWritter/TypeWritter";
// import { useEffect, useState } from "react";

const AssistantMessage: React.FC<MessageProps> = ({ message }) => {
  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Simple markdown rendering for bold text
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n");
    const blocks = [];
    let isInCodeBlock = false;
    let currentCodeLines: string[] = [];

    let blockCount = 0; // stable counter for unique keys

    for (const line of lines) {
      const trimmed = line.trim();

      if (/^```/.test(trimmed)) {
        if (isInCodeBlock) {
          blocks.push({
            id: `code-${blockCount++}`,
            tag: "pre",
            text: currentCodeLines.join("\n"),
            className: "code-block",
          });
          currentCodeLines = [];
          isInCodeBlock = false;
        } else {
          isInCodeBlock = true;
          currentCodeLines = [];
        }
        continue;
      }

      if (isInCodeBlock) {
        currentCodeLines.push(line);
        continue;
      }

      if (/^###\s*/.test(trimmed)) {
        blocks.push({
          id: `h3-${blockCount++}`,
          tag: "h3",
          text: trimmed.replace(/^###\s*/, ""),
          className: "assistant-heading",
        });
        continue;
      }

      const bulletMatch = trimmed.match(/^- \*\*(.+?)\*\*:\s*(.+)/);
      if (bulletMatch) {
        blocks.push({
          id: `li-${blockCount++}`,
          tag: "li",
          text: `${bulletMatch[1]}: ${bulletMatch[2]}`,
          className: "assistant-paragraph",
        });
        continue;
      }

      if (/^✅\s*/.test(trimmed)) {
        blocks.push({
          id: `tip-${blockCount++}`,
          tag: "div",
          text: `✅ ${trimmed.replace(/^✅\s*/, "")}`,
          className: "tip-box",
        });
        continue;
      }

      if (/^(\s{2,}|\/\/|const |let |function |return )/.test(trimmed)) {
        blocks.push({
          id: `inlinecode-${blockCount++}`,
          tag: "pre",
          text: line,
          className: "code-block",
        });
        continue;
      }

      if (trimmed) {
        blocks.push({
          id: `p-${blockCount++}`,
          tag: "p",
          text: trimmed,
          className: "assistant-paragraph",
        });
      }
    }

    return blocks;
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-xs lg:max-w-2xl">
        <div className="flex items-start space-x-3">
          <div className="w-8 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot />
          </div>

          <div className="text-white px-4 py-2 flex-1">
            <TypewriterEffect
              blocks={renderMarkdown(message.content)}
              speed={30}
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
