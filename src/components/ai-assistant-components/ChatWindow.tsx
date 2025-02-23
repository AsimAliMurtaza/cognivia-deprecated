import React from "react";
import {
  Box,
  Flex,
  HStack,
  Input,
  Button,
  Text,
  IconButton,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import { FaCopy, FaRobot } from "react-icons/fa";

interface ChatWindowProps {
  query: string;
  setQuery: (value: string) => void;
  currentMessages: { query: string; response: string }[];
  currentResponse: string;
  loading: boolean;
  onAskAI: () => void;
  onCopyResponse: (text: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  query,
  setQuery,
  currentMessages,
  currentResponse,
  loading,
  onAskAI,
  onCopyResponse,
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.800");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const messageBg = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Flex direction="column" flex={1} minH="500px" pl={2}>
      <Box
        flex={1}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="12px"
        bg={bgColor}
        overflowY="auto"
        maxH="420px"
        minH="420px"
      >
        {currentMessages.map((msg, index) => (
          <Box key={index} mb={4} p={6} bg={messageBg} borderRadius="12px">
            <Text fontSize="md" fontWeight="medium" color={textColor}>
              <strong>You:</strong> {msg.query}
            </Text>
            <ReactMarkdown>{msg.response}</ReactMarkdown>
            <IconButton
              aria-label="Copy response"
              icon={<FaCopy />}
              size="sm"
              mt={2}
              onClick={() => onCopyResponse(msg.response)}
            />
          </Box>
        ))}
        {loading && (
          <Box mb={4} p={4} bg={messageBg} borderRadius="12px">
            <Text fontSize="md" fontWeight="medium" color={textColor}>
              <strong>You:</strong> {query}
            </Text>
            <Text color={textColor}>
              {currentResponse}
              <Spinner size="sm" ml={2} />
            </Text>
          </Box>
        )}
      </Box>

      <HStack p={4} bg={inputBg} borderRadius="12px" mt={2}>
        <Input
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="md"
          flex={1}
          bg={bgColor}
          color={textColor}
          onKeyDown={(e) => e.key === "Enter" && onAskAI()}
        />
        <Button
          colorScheme="blue"
          onClick={onAskAI}
          isLoading={loading}
          leftIcon={<FaRobot />}
        >
          Ask
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatWindow;
