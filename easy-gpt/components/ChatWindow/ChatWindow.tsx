import { forwardRef } from "react";
import UserMessage from "../UserMessage/UserMessage";
import AssistantMessage from "../AssistantMessage/AssistantMessage";
import { ChatWindowProps, Message } from "@/types/type";
import TypingIndicator from "../TypingIndicator/TypingIndicator";

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
  ({ messages, isTyping, streamingMessage }, ref) => {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
        {messages.length === 0 && !isTyping && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to Slam AI Assistant
            </h3>
            <p className="text-gray-500">
              Start a conversation by typing a message below.
            </p>
          </div>
        )}

        {messages.map((message: Message) =>
          message.sender === "user" ? (
            <UserMessage key={message.id} message={message} />
          ) : (
            <AssistantMessage key={message.id} message={message} />
          )
        )}

        {isTyping && (
          <>
            <TypingIndicator />
            {streamingMessage && (
              <AssistantMessage
                message={{
                  id: Date.now(),
                  content: streamingMessage,
                  sender: "assistant",
                  timestamp: "",
                  streaming: true,
                }}
              />
            )}
          </>
        )}
      </div>
    );
  }
);

ChatWindow.displayName = "ChatWindow";

export default ChatWindow;
