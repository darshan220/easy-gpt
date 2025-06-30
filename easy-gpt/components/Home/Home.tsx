"use client";
import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import { Message } from "@/types/type";
import ChatHeader from "@/components/ChatHeader/ChatHeader";
import ChatWindow from "@/components/ChatWindow/ChatWindow";
import ChatInput from "@/components/ChatInput/ChatInput";
import Sidebar from "@/components/Sidebar/Sidebar";
import axios from "axios";

const MainPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      content: "Hello! I'm Claude, an AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [chats, setChats] = useState<{ id: number; title: string }[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      try {
        const parsedMessages: Message[] = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error loading chat history:", error);
      }
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatHistory", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, isTyping, streamingMessage]);

  // Theme toggle
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleToggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Chat management
  useEffect(() => {
    const savedChats = localStorage.getItem("chatList");
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatList", JSON.stringify(chats));
  }, [chats]);

  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: `Chat ${chats.length + 1}` };
    setChats((prev) => [newChat, ...prev]);
    setSelectedChatId(newId);
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  const handleSelectChat = (id: number) => {
    setSelectedChatId(id);
    // Optionally, load chat history for this chat
    // For now, just clear messages
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  const handleSendMessage = async (message: string): Promise<void> => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      content: message,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await axios.post(
        "http://localhost:3080/chat/get-response",
        {
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const assistantContent = response.data.data;

      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: assistantContent,
        sender: "assistant",
        timestamp: new Date().toLocaleTimeString(),
      };

      setStreamingMessage(assistantMessage.content);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // const simulateStreamingResponse = async (
  //   userMessage: string
  // ): Promise<void> => {
  //   // Simulate different responses based on user input
  //   let response =
  //     "I'm Claude, an AI assistant. I understand you're testing this chat interface. ";

  //   if (userMessage.toLowerCase().includes("hello")) {
  //     response = "Hello! It's great to meet you. How can I help you today? ";
  //   } else if (userMessage.toLowerCase().includes("help")) {
  //     response =
  //       "I'm here to help! You can ask me questions about various topics, and I'll do my best to provide helpful and accurate information. ";
  //   } else if (userMessage.toLowerCase().includes("weather")) {
  //     response =
  //       "I don't have access to real-time weather data, but I'd recommend checking a reliable weather service for current conditions in your area. ";
  //   }

  //   response +=
  //     "This is a demo of streaming responses where text appears gradually, just like ChatGPT!";

  //   setStreamingMessage("");
  //   const words = response.split(" ");

  //   for (let i = 0; i < words.length; i++) {
  //     await new Promise<void>((resolve) => setTimeout(resolve, 50)); // Simulate streaming delay
  //     setStreamingMessage((prev) => prev + (i === 0 ? "" : " ") + words[i]);
  //   }

  //   // Add complete assistant message
  //   const assistantMessage: Message = {
  //     id: Date.now() + 1,
  //     content: response,
  //     sender: "assistant",
  //     timestamp: new Date().toLocaleTimeString(),
  //   };

  //   setMessages((prev) => [...prev, assistantMessage]);
  //   setStreamingMessage("");
  //   setIsTyping(false);
  // };

  const clearChat = (): void => {
    setMessages([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div
      className={`min-h-screen flex flex-row ${
        theme === "dark" ? "bg-gray-950" : "bg-gray-50"
      }`}
    >
      <Head>
        <title>ChatGPT Clone</title>
        <meta
          name="description"
          content="A ChatGPT clone built with Next.js and Tailwind CSS"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Sidebar
          chats={chats}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          theme={theme}
        />
      </div>
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ChatHeader
          onClearChat={clearChat}
          onToggleTheme={handleToggleTheme}
          theme={theme}
        />
        <ChatWindow
          ref={chatWindowRef}
          messages={messages}
          isTyping={isTyping}
          streamingMessage={streamingMessage}
        />
        <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  );
};

export default MainPage;
