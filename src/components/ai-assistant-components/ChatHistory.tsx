"use client";

import React from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
  Box,
  Avatar,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface ChatHistoryProps {
  chatHistory: Record<
    string,
    {
      id: string;
      title: string;
      messages: { query: string; response: string }[];
      timestamp: number;
    }
  >;
  currentChatId: string | null;
  onNewChat: () => void;
  onOpenChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chatHistory,
  currentChatId,
  onNewChat,
  onOpenChat,
  onDeleteChat,
}) => {
  const surfaceColor = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const activeBg = useColorModeValue("teal.50", "blue.900");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const primaryColor = useColorModeValue("teal.600", "blue.300");
  const dividerColor = useColorModeValue("gray.200", "gray.600");
  const askButtonColor = useColorModeValue("teal", "blue");

  return (
    <VStack
      borderRadius="xl"
      spacing={4}
      p={4}
      h="90vh"
      bg={surfaceColor}
      align="stretch"
    >
      <Flex justify="space-between" align="center">
        <Heading size="md" fontWeight="semibold" color={textColor}>
          Conversations
        </Heading>
        <Badge colorScheme="blue" variant="subtle">
          {Object.keys(chatHistory).length}
        </Badge>
      </Flex>

      <Divider borderColor={dividerColor} />

      <Button
        colorScheme={askButtonColor}
        onClick={onNewChat}
        leftIcon={<FaPlus />}
        size="md"
        borderRadius="full"
        _hover={{
          transform: "translateY(-2px)",
          boxShadow: "md",
        }}
        transition="all 0.2s"
      >
        New Chat
      </Button>

      <VStack spacing={2} align="stretch" overflowY="auto">
        {Object.entries(chatHistory)
          .sort(([, a], [, b]) => b.timestamp - a.timestamp)
          .map(([chatId, data]) => (
            <MotionBox
              key={chatId}
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Flex
                p={3}
                borderRadius="lg"
                align="center"
                justify="space-between"
                cursor="pointer"
                bg={currentChatId === chatId ? activeBg : "transparent"}
                _hover={{ bg: hoverBg }}
                transition="background 0.2s ease"
                onClick={() => onOpenChat(chatId)}
              >
                <Flex align="center" gap={3} overflow="hidden">
                  <Avatar
                    size="sm"
                    name={data.title}
                    bg={primaryColor}
                    color="white"
                  />
                  <Box overflow="hidden">
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={textColor}
                      noOfLines={1}
                    >
                      {data.title}
                    </Text>
                    <Text fontSize="xs" color={subTextColor} noOfLines={1}>
                      {new Date(data.timestamp).toLocaleString()}
                    </Text>
                  </Box>
                </Flex>
                <IconButton
                  aria-label="Delete chat"
                  icon={<FaTrash />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chatId);
                  }}
                />
              </Flex>
            </MotionBox>
          ))}
      </VStack>
    </VStack>
  );
};

export default ChatHistory;
