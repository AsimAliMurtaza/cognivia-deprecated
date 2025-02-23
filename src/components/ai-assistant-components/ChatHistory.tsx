import React from "react";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
  VStack,
  useColorModeValue,
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
  const bg = useColorModeValue("gray.100", "gray.800");
  const hoverBg = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const buttonBg = useColorModeValue("blue.500", "blue.300");
  const buttonHoverBg = useColorModeValue("blue.600", "blue.400");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Flex
      direction="column"
      w={{ base: "full", md: "280px" }}
      p={4}
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius={{ base: "lg", md: "lg" }}

      boxShadow={{ md: "md" }}
      overflowY="auto"
      maxH="500px"
    >
      <Heading
        size="sm"
        fontWeight="thin"
        mb={4}
        textAlign="center"
        color={textColor}
      >
        Chat History
      </Heading>
      <Button
        bg={buttonBg}
        color="white"
        _hover={{ bg: buttonHoverBg }}
        onClick={onNewChat}
        mb={4}
        leftIcon={<FaPlus />}
        w="full"
      >
        New Chat
      </Button>
      <VStack spacing={2} align="stretch" overflowY="auto">
        {Object.entries(chatHistory)
          .sort(([, a], [, b]) => b.timestamp - a.timestamp)
          .map(([chatId, data]) => (
            <Flex
              key={chatId}
              p={4}
              bg={currentChatId === chatId ? hoverBg : bg}
              borderRadius="md"
              align="center"
              justify="space-between"
              cursor="pointer"
              _hover={{ bg: hoverBg }}
              transition="background 0.2s ease-in-out"
              border="1px solid"
              borderColor={borderColor}
              onClick={() => onOpenChat(chatId)}
            >
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={textColor}
                noOfLines={1}
              >
                {data.title}
              </Text>
              <IconButton
                aria-label="Delete chat"
                icon={<FaTrash />}
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chatId);
                }}
              />
            </Flex>
          ))}
      </VStack>
    </Flex>
  );
};

export default ChatHistory;
