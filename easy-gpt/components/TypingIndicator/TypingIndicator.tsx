import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
          <Bot />
        </div>

        <div className="rounded-2xl rounded-bl-md px-4 py-3">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
