"use client";

import React, { useState, useEffect } from "react";
import { Flex, useToast } from "@chakra-ui/react";
import ChatHistory from "../components/ai-assistant-components/ChatHistory";
import ChatWindow from "../components/ai-assistant-components/ChatWindow";

// Generate a unique ID for each chat
const generateChatId = () => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function AIAssistant() {
  const [query, setQuery] = useState<string>("");
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<
    Record<
      string,
      {
        id: string;
        title: string;
        messages: { query: string; response: string }[];
        timestamp: number;
      }
    >
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const toast = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setChatHistory(parsedHistory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleAskAI = async () => {
    if (!query.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a question before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    setCurrentResponse("");

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/ask?query=${encodeURIComponent(query)}`
      );

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setCurrentResponse((prev) => prev + chunk);
      }

      const newMessage = { query, response: fullResponse };

      if (!currentChatId) {
        const newChatId = generateChatId();
        const firstFewWords = query.split(" ").slice(0, 4).join(" ") + "...";

        setChatHistory((prev) => ({
          ...prev,
          [newChatId]: {
            id: newChatId,
            title: firstFewWords,
            messages: [newMessage],
            timestamp: Date.now(),
          },
        }));
        setCurrentChatId(newChatId);
      } else {
        setChatHistory((prev) => ({
          ...prev,
          [currentChatId]: {
            ...prev[currentChatId],
            messages: [...prev[currentChatId].messages, newMessage],
            timestamp: Date.now(),
          },
        }));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
    setQuery("");
  };

  const handleCopyResponse = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "The response has been copied to your clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistory((prev) => {
      const newHistory = { ...prev };
      delete newHistory[chatId];
      return newHistory;
    });

    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setCurrentResponse("");
    }

    toast({
      title: "Chat Deleted",
      description: "The selected chat history has been removed.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleOpenChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setCurrentResponse("");
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setCurrentResponse("");
  };

  const currentMessages = currentChatId ? chatHistory[currentChatId]?.messages || [] : [];

  return (
    <Flex w="full" h="100vh">
      <ChatHistory
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onOpenChat={handleOpenChat}
        onDeleteChat={handleDeleteChat}
      />
      <ChatWindow
        query={query}
        setQuery={setQuery}
        currentMessages={currentMessages}
        currentResponse={currentResponse}
        loading={loading}
        onAskAI={handleAskAI}
        onCopyResponse={handleCopyResponse}
      />
    </Flex>
  );
}