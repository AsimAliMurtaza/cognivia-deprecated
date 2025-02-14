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
import { FaRobot, FaCopy, FaTrash, FaPlus, FaBars } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiMenu } from "react-icons/fi";

// Function to get today's date in YYYY-MM-DD format
const getFormattedDate = () => new Date().toISOString().split("T")[0];

// Framer Motion components
const MotionBox = motion(Box);

export default function AIAssistant() {
  const [query, setQuery] = useState<string>("");
  const [currentChat, setCurrentChat] = useState<
    { query: string; response: string }[]
  >([]);
  const [chatHistory, setChatHistory] = useState<
    Record<
      string,
      { title: string; messages: { query: string; response: string }[] }
    >
  >({});
  const [loading, setLoading] = useState<boolean>(false);
  const [currentResponse, setCurrentResponse] = useState<string>("");
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar closed by default on mobile
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Responsive behavior
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
      setChatHistory(JSON.parse(savedHistory));
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

      // Stream the response
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        fullResponse += chunk;
        setCurrentResponse((prev) => prev + chunk); // Update UI incrementally
      }

      // Append new message to chat
      const newMessage = { query, response: fullResponse };
      setCurrentChat((prev) => [...prev, newMessage]);

      // Store chat history
      const dateKey = getFormattedDate();
      const firstFewWords = query.split(" ").slice(0, 4).join(" ") + "...";

      setChatHistory((prevHistory) => {
        const updatedHistory = { ...prevHistory };
        if (!updatedHistory[dateKey]) {
          updatedHistory[dateKey] = { title: firstFewWords, messages: [] };
        }
        updatedHistory[dateKey].messages.push(newMessage);

        return updatedHistory;
      });
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
    console.log(isOpen);
    setSidebarOpen(!isSidebarOpen);
    if (isMobile) {
      if (!isSidebarOpen) onOpen();
      else onClose();
    }
  };

  const handleDeleteChat = (dateKey: string) => {
    const updatedHistory = { ...chatHistory };
    delete updatedHistory[dateKey];
    setChatHistory(updatedHistory);
    setCurrentChat([]);
    toast({
      title: "Chat Deleted",
      description: "The selected chat history has been removed.",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleOpenChat = (dateKey: string) => {
    setCurrentChat(chatHistory[dateKey].messages);
    if (isMobile) setSidebarOpen(false); // Close sidebar on mobile after opening a chat
  };

  const handleNewChat = () => {
    setCurrentChat([]);
    setCurrentResponse("");
  };

  return (
      <Flex w="full" h="100vh" borderRadius={"20px"}>
        {/* Left Sidebar: Chat History */}
        {isMobile ? (
          // Mobile: Overlay sidebar with animations
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
                borderRadius="0 12px 12px 0" // Rounded corners
              >
                <Box
                  p={4}
                  display={"flex"}
                  justifyContent={"space-between"}
                  borderColor={borderColor}
                >
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
                  <Box flex={1} overflowY="auto">
                    {Object.entries(chatHistory)
                      .sort(([dateA], [dateB]) => (dateA > dateB ? -1 : 1))
                      .map(([date, data]) => (
                        <Flex
                          key={date}
                          mb={2}
                          p={3}
                          bg={chatItemBg}
                          borderRadius="md"
                          align="center"
                          justify="space-between"
                          cursor="pointer"
                          _hover={{ bg: chatItemHoverBg }}
                          onClick={() => handleOpenChat(date)}
                        >
                          <Text color={textColor}>
                            {date} - {data.title}
                          </Text>
                          <IconButton
                            aria-label="Delete chat"
                            icon={<FaTrash />}
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(date);
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
          // Desktop: Fixed sidebar
          <Flex
            direction="column"
            w="auto"
            h="92vh"
            mt={4}
            p={6}
            border="1px solid"
            borderColor={borderColor}
            bg={sidebarBg}
            borderRadius="12px 12px 12px 12px" // Rounded corners
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
                .sort(([dateA], [dateB]) => (dateA > dateB ? -1 : 1))
                .map(([date, data]) => (
                  <Flex
                    key={date}
                    mb={2}
                    p={3}
                    bg={chatItemBg}
                    borderRadius="md"
                    align="center"
                    justify="space-between"
                    cursor="pointer"
                    _hover={{ bg: chatItemHoverBg }}
                    onClick={() => handleOpenChat(date)}
                  >
                    <Text color={textColor}>
                      {date} - {data.title}
                    </Text>
                    <IconButton
                      aria-label="Delete chat"
                      icon={<FaTrash />}
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteChat(date);
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
          w={isMobile ? "full" : "90%"}
          h="100vh"
          p={4}
          borderRadius={"20px"}
        >
          {/* Burger Menu for Mobile */}
          {isMobile && (
            <Button
              w={"auto"}
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
            borderRadius="12px" // Rounded corners
            border="1px solid"
            borderColor={borderColor}
            bg={chatBg}
          >
            {currentChat.map((msg, index) => (
              <Box
                key={index}
                mb={4}
                p={4}
                bg={chatMessageBg}
                borderRadius="12px" // Rounded corners
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
                  {loading && <Spinner size="sm" ml={2} />}
                </Text>
              </Box>
            )}
          </Box>

          {/* Chat Input at Bottom */}
          <HStack
            p={4}
            bg={useColorModeValue("gray.100", "gray.800")}
            borderRadius="12px" // Rounded corners
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
