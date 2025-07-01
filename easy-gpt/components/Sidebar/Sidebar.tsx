import { Menu, Plus, MessageSquare, LogOut } from "lucide-react";

interface SidebarProps {
  chats: { id: number; title: string }[];
  onNewChat: () => void;
  onSelectChat: (id: number) => void;
  selectedChatId: number | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

const Sidebar = ({
  chats,
  onNewChat,
  onSelectChat,
  selectedChatId,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}: SidebarProps) => {
  return (
    <aside
      className={`h-[calc(100%-24px)] m-3 rounded-2xl flex flex-col bg-gray-900 text-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Collapse/Expand Button */}
      <div className="p-[11px] flex items-center justify-between">
        {!isCollapsed && (
          <button
            onClick={onNewChat}
            className=" cursor-pointer flex items-center justify-center w-full p-2 rounded-md border border-gray-600 hover:bg-gray-800 transition-colors text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New chat
          </button>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-md hover:bg-gray-800 transition-colors ${
            !isCollapsed ? "ml-2" : ""
          }`}
        >
          <Menu />
        </button>
      </div>

      {/* Chat History */}
      <nav className="flex-1 overflow-y-auto py-2">
        {!isCollapsed && (
          <div className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
            Recent
          </div>
        )}

        {chats.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-400">
            {!isCollapsed ? "No recent chats" : <MessageSquare />}
          </div>
        ) : (
          <ul className="space-y-1">
            {chats.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`mx-[10px] max-w-[230px] rounded-2xl w-full text-left p-3 text-sm flex items-center truncate cursor-pointer text-gray-300 hover:bg-gray-800`}
                  title={chat.title}
                >
                  <MessageSquare className="w-4 h-4 mr-3 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="truncate">{chat.title}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* User and Settings */}
      <div className="p-3 border-t border-r border-gray-700">
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">User</span>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-white"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
