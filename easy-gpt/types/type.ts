// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;

export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  streaming?: boolean;
  model?: string;
}

export interface ChatHeaderProps {
  onClearChat: () => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
}

export interface ChatWindowProps {
  messages: Message[];
  isTyping: boolean;
  streamingMessage: string;
}

export interface MessageProps {
  message: Message;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export interface Chat {
  id: string;
  title: string;
  createdAt: string;
}
  