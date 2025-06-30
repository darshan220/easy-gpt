import { ChatHeaderProps } from "@/types/type";
import { Moon, SunMoon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../Auth/AuthContext";

const ChatHeader: React.FC<ChatHeaderProps> = ({
  onClearChat,
  onToggleTheme,
  theme,
}) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const { logout } = useAuth();

  // Creative sun/moon toggle
  const ThemeToggle = () => (
    <button
      onClick={onToggleTheme}
      className="cursor-pointer relative w-10 h-10 flex items-center justify-center focus:outline-none transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className={theme === "dark" ? "text-white" : ""} />
      ) : (
        <SunMoon />
      )}
    </button>
  );

  return (
    <header
      className={`border-b px-4 py-3 sticky top-0 z-10 transition-colors ${
        theme === "dark"
          ? "bg-gray-900 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
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
          <div>
            <h1
              className={`text-lg font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              ChatGPT Modal
            </h1>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              AI Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="cursor-pointer p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              aria-label="Open menu"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <button
                  onClick={() => {
                    onClearChat();
                    setShowMenu(false);
                  }}
                  className="cursor-pointer w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Clear Chat History
                </button>
              </div>
            )}
          </div>
          {/* User profile icon */}
          <div className="ml-2 w-9 h-9 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center shadow">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12zm0 2c-3 0-9 1.5-9 4.5V21h18v-2.5c0-3-6-4.5-9-4.5z" />
            </svg>
          </div>
          <header
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: 16,
          }}
        >
          <button
            onClick={logout}
            style={{
              padding: "6px 16px",
              borderRadius: 4,
              background: "#333",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </header>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
