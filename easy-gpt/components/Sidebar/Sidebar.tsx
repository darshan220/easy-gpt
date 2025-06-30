import React from "react";

interface SidebarProps {
  chats: { id: number; title: string }[];
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
  selectedChatId: number | null;
  theme: "light" | "dark";
}

const Sidebar: React.FC<SidebarProps> = ({ chats, onNewChat, onSelectChat, selectedChatId, theme }) => {
  return (
    <aside className={`h-screen w-64 flex flex-col border-r transition-colors ${theme === "dark" ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"}`}>
      <div className="p-4 border-b flex items-center justify-between">
        <span className={`font-bold text-lg ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Chats</span>
        <button
          onClick={onNewChat}
          className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
        >
          + New Chat
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <div className="p-4 text-gray-400 text-sm">No previous chats</div>
        ) : (
          <ul className=" border-b-2 border-gray-200 divide-y divide-gray-200">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`cursor-pointer w-full text-left px-4 py-2 transition-colors rounded ${selectedChatId === chat.id ? (theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900") : (theme === "dark" ? "text-gray-300 hover:bg-gray-900" : "text-gray-700 hover:bg-gray-50")}`}
                >
                  {chat.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
