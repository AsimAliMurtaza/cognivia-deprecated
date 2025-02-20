import React from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

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
  return (
    <Flex direction="column" w="300px" h="92vh" mt={4} p={6} bg="white" borderRadius="12px" mr={4}>
      <Heading size="md" mb={4}>
        Chat History
      </Heading>
      <Button colorScheme="blue" variant="solid" onClick={onNewChat} mb={4} leftIcon={<FaPlus />}>
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
              bg={currentChatId === chatId ? "gray.200" : "gray.100"}
              borderRadius="md"
              align="center"
              justify="space-between"
              cursor="pointer"
              _hover={{ bg: "gray.200" }}
              onClick={() => onOpenChat(chatId)}
            >
              <Text noOfLines={1}>{data.title}</Text>
              <IconButton
                aria-label="Delete chat"
                icon={<FaTrash />}
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chatId);
                }}
              />
            </Flex>
          ))}
      </Box>
    </Flex>
  );
};

export default ChatHistory;