"use client";

import React, { useState, useEffect } from "react";
import {
  Flex,
  useToast,
  useColorModeValue,
  IconButton,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import ChatHistory from "@/components/ai-assistant-components/ChatHistory";
import ChatWindow from "@/components/ai-assistant-components/ChatWindow";
import { useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

const generateChatId = () =>
  `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export default function AIAssistant() {
  const { data: session } = useSession();
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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const surfaceColor = useColorModeValue("white", "gray.800");
  const dividerColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
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
      const responseData = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ prompt: query }),
      }).then((res) => res.json());

      setCurrentResponse(responseData?.response || "No response.");

      const newMessage = {
        query,
        response: responseData?.response || "No response.",
      };

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
      console.error("Gemini API Error:", error);
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
    onClose();
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setCurrentResponse("");
  };

  const currentMessages = currentChatId
    ? chatHistory[currentChatId]?.messages || []
    : [];

  return (
    <Flex direction="column" minH="90vh">
      <Flex align="center">
        {isMobile && (
          <IconButton
            icon={<FiMenu />}
            aria-label="Open Chat History"
            onClick={onOpen}
            variant="ghost"
            ml="auto"
          />
        )}
      </Flex>

      <Flex flex={1} overflow="hidden">
        {/* Mobile Drawer */}
        {isMobile && (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg={surfaceColor}>
              <ModalHeader>
                <Flex align="center" gap={3}></Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody p={0}>
                <ChatHistory
                  chatHistory={chatHistory}
                  currentChatId={currentChatId}
                  onNewChat={handleNewChat}
                  onOpenChat={handleOpenChat}
                  onDeleteChat={handleDeleteChat}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            w="300px"
            borderColor={dividerColor}
            overflowY="auto"
          >
            <ChatHistory
              chatHistory={chatHistory}
              currentChatId={currentChatId}
              onNewChat={handleNewChat}
              onOpenChat={handleOpenChat}
              onDeleteChat={handleDeleteChat}
            />
          </Box>
        )}

        {/* Main Chat Area */}
        <Box flex={1} overflowY="auto">
          <ChatWindow
            query={query}
            setQuery={setQuery}
            currentMessages={currentMessages}
            currentResponse={currentResponse}
            loading={loading}
            onAskAI={handleAskAI}
            onCopyResponse={handleCopyResponse}
          />
        </Box>
      </Flex>
    </Flex>
  );
}
