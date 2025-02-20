"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  Heading,
  useToast,
  IconButton,
  Flex,
  useColorModeValue,
  HStack,
  Spinner,
  useBreakpointValue,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaRobot, FaCopy, FaTrash, FaPlus } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiMenu } from "react-icons/fi";

// Generate a unique ID for each chat
const generateChatId = () => `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const MotionBox = motion(Box);

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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Color mode values
  const sidebarBg = useColorModeValue("white", "gray.800");
  const chatBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const inputBg = useColorModeValue("white", "gray.600");
  const borderColor = useColorModeValue("gray.200", "teal.100");
  const chatItemBg = useColorModeValue("gray.100", "gray.700");
  const chatItemHoverBg = useColorModeValue("gray.200", "gray.600");
  const chatMessageBg = useColorModeValue("gray.50", "gray.600");

  // Load chat history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);
      setChatHistory(parsedHistory);
    }
  }, []);

  // Save chat history to local storage
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

      // Create a new chat if none is selected
      if (!currentChatId) {
        const newChatId = generateChatId();
        const firstFewWords = query.split(" ").slice(0, 4).join(" ") + "...";
        
        setChatHistory(prev => ({
          ...prev,
          [newChatId]: {
            id: newChatId,
            title: firstFewWords,
            messages: [newMessage],
            timestamp: Date.now()
          }
        }));
        setCurrentChatId(newChatId);
      } else {
        // Update existing chat
        setChatHistory(prev => ({
          ...prev,
          [currentChatId]: {
            ...prev[currentChatId],
            messages: [...prev[currentChatId].messages, newMessage],
            timestamp: Date.now()
          }
        }));
      }
    } catch (error) {
      console.error("Error fetching AI response", error);
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

  const toggleHistorySidebar = () => {
    setSidebarOpen(!isSidebarOpen);
    if (isMobile) {
      if (!isSidebarOpen) onOpen();
      else onClose();
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChatHistory(prev => {
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
    if (isMobile) setSidebarOpen(false);
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setCurrentResponse("");
  };

  // Get current chat messages
  const currentMessages = currentChatId ? chatHistory[currentChatId]?.messages || [] : [];

  return (
    <Flex w="full" h="100vh" borderRadius={"20px"}>
      {/* Left Sidebar: Chat History */}
      {isMobile ? (
        <AnimatePresence>
          {(!isMobile || isSidebarOpen) && (
            <MotionBox
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              position="fixed"
              top={0}
              left={0}
              w="250px"
              h="100vh"
              bg={sidebarBg}
              boxShadow="lg"
              zIndex={20}
              borderRadius="0 12px 12px 0"
            >
              <Box p={4} display={"flex"} justifyContent={"space-between"} borderColor={borderColor}>
                <Heading size="md" color="teal.400" mb={4}>
                  Chat History
                </Heading>
                <IconButton
                  icon={isSidebarOpen ? <FiChevronLeft /> : <FiMenu />}
                  aria-label="Toggle Sidebar"
                  onClick={toggleHistorySidebar}
                  variant="ghost"
                  size="sm"
                  color={textColor}
                />
              </Box>
              <VStack align="start" spacing={4} p={4}>
                <Button
                  colorScheme="blue"
                  variant="solid"
                  onClick={handleNewChat}
                  mb={4}
                  leftIcon={<FaPlus />}
                >
                  New Chat
                </Button>
                <Box flex={1} overflowY="auto" w="100%">
                  {Object.entries(chatHistory)
                    .sort(([, a], [, b]) => b.timestamp - a.timestamp)
                    .map(([chatId, data]) => (
                      <Flex
                        key={chatId}
                        mb={2}
                        p={3}
                        bg={currentChatId === chatId ? chatItemHoverBg : chatItemBg}
                        borderRadius="md"
                        align="center"
                        justify="space-between"
                        cursor="pointer"
                        _hover={{ bg: chatItemHoverBg }}
                        onClick={() => handleOpenChat(chatId)}
                        w="100%"
                      >
                        <Text color={textColor} noOfLines={1}>
                          {data.title}
                        </Text>
                        <IconButton
                          aria-label="Delete chat"
                          icon={<FaTrash />}
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(chatId);
                          }}
                        />
                      </Flex>
                    ))}
                </Box>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>
      ) : (
        // Desktop sidebar
        <Flex
          direction="column"
          w="300px"
          h="92vh"
          mt={4}
          p={6}
          border="1px solid"
          borderColor={borderColor}
          bg={sidebarBg}
          borderRadius="12px"
          mr={4}
        >
          <Heading size="md" color={textColor} mb={4}>
            Chat History
          </Heading>
          <Button
            colorScheme="blue"
            variant="solid"
            onClick={handleNewChat}
            mb={4}
            leftIcon={<FaPlus />}
          >
            New Chat
          </Button>
          <Box flex={1} overflowY="auto">
            {Object.entries(chatHistory)
              .sort(([, a], [, b]) => b.timestamp - a.timestamp)
              .map(([chatId, data]) => (
                <Flex
                  key={chatId}
                  mb={2}
                  p={3}
                  bg={currentChatId === chatId ? chatItemHoverBg : chatItemBg}
                  borderRadius="md"
                  align="center"
                  justify="space-between"
                  cursor="pointer"
                  _hover={{ bg: chatItemHoverBg }}
                  onClick={() => handleOpenChat(chatId)}
                >
                  <Text color={textColor} noOfLines={1}>
                    {data.title}
                  </Text>
                  <IconButton
                    aria-label="Delete chat"
                    icon={<FaTrash />}
                    size="xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chatId);
                    }}
                  />
                </Flex>
              ))}
          </Box>
        </Flex>
      )}

      {/* Main Chat Window */}
      <Flex
        direction="column"
        flex={1}
        h="100vh"
        p={4}
        borderRadius={"20px"}
      >
        {isMobile && (
          <Button
            w="auto"
            aria-label="Open Sidebar"
            onClick={() => setSidebarOpen(true)}
            variant="ghost"
            size="sm"
            color={textColor}
            mb={4}
          >
            History
          </Button>
        )}

        <Box
          flex={1}
          overflowY="auto"
          p={4}
          borderRadius="12px"
          border="1px solid"
          borderColor={borderColor}
          bg={chatBg}
        >
          {currentMessages.map((msg, index) => (
            <Box
              key={index}
              mb={4}
              p={4}
              bg={chatMessageBg}
              borderRadius="12px"
            >
              <Text fontWeight="bold" color={textColor}>
                You: {msg.query}
              </Text>
              <ReactMarkdown>{msg.response}</ReactMarkdown>
              <IconButton
                aria-label="Copy response"
                icon={<FaCopy />}
                size="sm"
                mt={2}
                onClick={() => handleCopyResponse(msg.response)}
              />
            </Box>
          ))}
          {loading && (
            <Box mb={4} p={4} bg={chatMessageBg} borderRadius="12px">
              <Text fontWeight="bold" color={textColor}>
                You: {query}
              </Text>
              <Text color={textColor}>
                {currentResponse}
                <Spinner size="sm" ml={2} />
              </Text>
            </Box>
          )}
        </Box>

        <HStack
          p={4}
          bg={useColorModeValue("gray.100", "gray.800")}
          borderRadius="12px"
          mt={4}
        >
          <Input
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            size="md"
            bg={inputBg}
            focusBorderColor="blue.400"
            flex={1}
            onKeyPress={(e) => e.key === "Enter" && handleAskAI()}
          />
          <Button
            colorScheme="blue"
            onClick={handleAskAI}
            isLoading={loading}
            leftIcon={<FaRobot />}
          >
            Ask
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}