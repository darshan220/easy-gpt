"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Message, Chat } from "@/types/type";
import ChatHeader from "@/components/ChatHeader/ChatHeader";
import ChatWindow from "@/components/ChatWindow/ChatWindow";
import ChatInput from "@/components/ChatInput/ChatInput";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useAuth } from "@/components/Auth/AuthContext";
import axios from "axios";
import { useGetGroqModels } from "@/hooks/useGetGroqModels";

const MainPage: React.FC = () => {
  const { logout } = useAuth();
  const { models, fetchModels } = useGetGroqModels();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Create a new chat
  const handleNewChat = useCallback(() => {
    const newId = Date.now().toString();
    const newChat: Chat = { 
      id: newId, 
      title: `Chat ${chats.length + 1}`,
      createdAt: new Date().toISOString()
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setSelectedChatId(newId);
    setMessages([]);
    localStorage.setItem("chatList", JSON.stringify(updatedChats));
    localStorage.setItem(`chat_${newId}`, JSON.stringify([]));
  }, [chats]);

  // Load chat list from localStorage on component mount
  useEffect(() => {
    const savedChats = localStorage.getItem("chatList");
    if (savedChats) {
      try {
        const parsedChats: Chat[] = JSON.parse(savedChats);
        setChats(parsedChats);
        
        // If there are chats but none selected, select the first one
        if (parsedChats.length > 0 && !selectedChatId) {
          setSelectedChatId(parsedChats[0].id);
        } else if (parsedChats.length === 0) {
          // No chats exist, create a default one
          const newId = Date.now().toString();
          const newChat: Chat = { 
            id: newId, 
            title: 'New Chat',
            createdAt: new Date().toISOString()
          };
          const updatedChats = [newChat];
          setChats(updatedChats);
          setSelectedChatId(newId);
          localStorage.setItem("chatList", JSON.stringify(updatedChats));
        }
      } catch (error) {
        console.error("Error loading chat list:", error);
        // If there's an error, create a new chat directly
        const newId = Date.now().toString();
        const newChat: Chat = { 
          id: newId, 
          title: 'New Chat',
          createdAt: new Date().toISOString()
        };
        const updatedChats = [newChat];
        setChats(updatedChats);
        setSelectedChatId(newId);
        localStorage.setItem("chatList", JSON.stringify(updatedChats));
      }
    } else {
      // No chats exist, create a default one
      const newId = Date.now().toString();
      const newChat: Chat = { 
        id: newId, 
        title: 'New Chat',
        createdAt: new Date().toISOString()
      };
      const updatedChats = [newChat];
      setChats(updatedChats);
      setSelectedChatId(newId);
      localStorage.setItem("chatList", JSON.stringify(updatedChats));
    }
    // Remove handleNewChat from dependencies to prevent infinite loops
  }, [selectedChatId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load messages for the selected chat
  useEffect(() => {
    if (!selectedChatId) return;
    
    const chatHistory = localStorage.getItem(`chat_${selectedChatId}`);
    if (chatHistory) {
      try {
        const parsedMessages: Message[] = JSON.parse(chatHistory);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error loading chat messages:", error);
      }
    } else {
      // Initialize with welcome message for new chat
      const welcomeMessage: Message = {
        id: Date.now(),
        content: "Hello! I'm your AI assistant. How can I help you today?",
        sender: "assistant",
        timestamp: new Date().toISOString(),
        model: selectedModel
      };
      setMessages([welcomeMessage]);
      localStorage.setItem(`chat_${selectedChatId}`, JSON.stringify([welcomeMessage]));
    }
  }, [selectedChatId, selectedModel]);

  useEffect(() => {
    fetchModels();
  }, []);

  useEffect(() => {
    if (models.length > 0) {
      setSelectedModel((prev) => prev || models[0].id);
    }
  }, [models]);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && selectedChatId) {
      localStorage.setItem(`chat_${selectedChatId}`, JSON.stringify(messages));
      
      // Update chat title if it's the first user message
      if (messages.length === 2 && messages[1].sender === 'user') {
        const firstMessage = messages[1].content.substring(0, 30);
        const newTitle = firstMessage + (messages[1].content.length > 30 ? '...' : '');
        
        setChats(prevChats => {
          const updatedChats = prevChats.map(chat => 
            chat.id === selectedChatId 
              ? { ...chat, title: newTitle }
              : chat
          );
          localStorage.setItem("chatList", JSON.stringify(updatedChats));
          return updatedChats;
        });
      }
    }
  }, [messages, selectedChatId]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingMessage]);

  const handleSelectChat = (id: number) => {
    setSelectedChatId(String(id));
  };

  // const deleteChat = (id: string, e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   const newChats = chats.filter(chat => chat.id !== id);
  //   setChats(newChats);
  //   localStorage.setItem("chatList", JSON.stringify(newChats));
    
  //   // Clear messages if the deleted chat was selected
  //   if (selectedChatId === id) {
  //     setMessages([]);
  //     localStorage.removeItem(`chat_${id}`);
      
  //     // Select another chat if available
  //     if (newChats.length > 0) {
  //       setSelectedChatId(newChats[0].id);
  //     } else {
  //       // No chats left, create a new one
  //       handleNewChat();
  //     }
  //   } else {
  //     // Just remove the chat's messages from storage
  //     localStorage.removeItem(`chat_${id}`);
  //   }
  // };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSendMessage = async (message: string): Promise<void> => {
    if (!message.trim() || !selectedModel || !selectedChatId) return;

    const userMessage: Message = {
      id: Date.now(),
      content: message,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Add user message to the chat
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Prepare chat history for the API
      const chatHistory = updatedMessages.map(msg => ({
        role: msg.sender,
        content: msg.content
      }));

      const response = await axios.post(
        "http://localhost:3080/chat/get-response",
        {
          messages: chatHistory,
          model: selectedModel,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const responseData = response.data;
      const assistantMessage = responseData.choices[0].message;

      const newAssistantMessage: Message = {
        id: responseData.id,
        content: assistantMessage.content,
        sender: assistantMessage.role,
        timestamp: new Date(responseData.created * 1000).toISOString(),
        model: responseData.model,
      };

      // Add assistant's response to the chat
      const finalMessages = [...updatedMessages, newAssistantMessage];
      setMessages(finalMessages);
      
      // Save to local storage
      if (selectedChatId) {
        localStorage.setItem(`chat_${selectedChatId}`, JSON.stringify(finalMessages));
      }
      
    } catch (error) {
      console.error("Error fetching response:", error);
      
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now(),
        content: "Sorry, I encountered an error. Please try again.",
        sender: "assistant",
        timestamp: new Date().toISOString(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setStreamingMessage("");
    }
  };

  return (
    <div className="flex h-screen bg-gray-800 text-gray-100">
      <Sidebar
        chats={chats}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={Number(selectedChatId)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Glass effect overlay */}
        <div className="relative z-10 flex flex-col h-full">
          <ChatHeader
            onClearChat={() => {
              setMessages([]);
              localStorage.removeItem("chatHistory");
            }}
            onLogout={handleLogout}
          />

          <div className="flex-1 overflow-x-auto mx-48">
            <ChatWindow
              messages={messages}
              isTyping={isTyping}
              streamingMessage={streamingMessage}
              ref={chatWindowRef}
            />
          </div>

          <div className="bg-gray-900/50 backdrop-blur-sm mx-48">
            <ChatInput
              onSendMessage={handleSendMessage}
              isTyping={isTyping}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              availableModels={models}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
