import { useState } from "react";

interface ChatHeaderProps {
  onClearChat: () => void;
  onLogout: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClearChat,
  onLogout,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-10 bg-gray-800">
      <div className="flex justify-between px-4 py-3">

        <div>
          <h1 className="text-lg font-semibold text-white">
            Slam AI
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white transition-colors"
              aria-label="More options"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1 z-20">
                <button
                  onClick={() => {
                    onClearChat();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                >
                  Clear Chat History
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
