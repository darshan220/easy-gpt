import { useState, FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { Plus, SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
  isTyping?: boolean;
}

const TOOL_OPTIONS = [
  "Create an image",
  "Search the web",
  "Write or code",
  "Run deep research",
  "Think for longer",
];

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled,
  isTyping = false,
}) => {
  const [message, setMessage] = useState<string>("");
  const [isToolsOpen, setIsToolsOpen] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!message.trim() || disabled) return;

    const messageToSend = message.trim();
    setMessage("");

    try {
      await onSendMessage(messageToSend);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value);
  };

  return (
    <div className="w-full p-4 bg-gray-800">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Tools button */}
        <button
          type="button"
          onClick={() => setIsToolsOpen(!isToolsOpen)}
          className="absolute left-3 text-gray-400 hover:text-white focus:outline-none"
          title="Tools"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* Small text input bar */}
        <input
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder={isTyping ? "AI is typing..." : "Ask anything"}
          className="w-full pl-10 pr-12 py-3 text-gray-100 bg-gray-700 border border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder-gray-400"
          disabled={isTyping || disabled}
          aria-label="Type your message"
        />

        {/* Tools dropdown */}
        {isToolsOpen && (
          <div className="absolute bottom-14 left-3 w-60 bg-gray-800 border border-gray-600 rounded-md shadow-lg">
            {TOOL_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setMessage(option);
                  setIsToolsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700 focus:outline-none"
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Send button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || isTyping}
          className="absolute right-3 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          <SendHorizonal className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
