import React from "react";
import { Box, Flex, HStack, Input, Button, Text, IconButton, Spinner } from "@chakra-ui/react";
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
  return (
    <Flex direction="column" flex={1} h="100vh" p={4}>
      <Box flex={1} overflowY="auto" p={4} borderRadius="12px" bg="white">
        {currentMessages.map((msg, index) => (
          <Box key={index} mb={4} p={4} bg="gray.50" borderRadius="12px">
            <Text fontWeight="bold">You: {msg.query}</Text>
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
          <Box mb={4} p={4} bg="gray.50" borderRadius="12px">
            <Text fontWeight="bold">You: {query}</Text>
            <Text>
              {currentResponse}
              <Spinner size="sm" ml={2} />
            </Text>
          </Box>
        )}
      </Box>
      <HStack p={4} bg="gray.100" borderRadius="12px" mt={4}>
        <Input
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="md"
          flex={1}
          onKeyPress={(e) => e.key === "Enter" && onAskAI()}
        />
        <Button colorScheme="blue" onClick={onAskAI} isLoading={loading} leftIcon={<FaRobot />}>
          Ask
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatWindow;