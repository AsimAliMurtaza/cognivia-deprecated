"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
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
  Avatar,
  Divider,
  VStack,
  Code,
  useToast,
  Heading,
  CodeProps,
  HeadingProps,
  TextProps,
} from "@chakra-ui/react";
import { FaCopy, FaRobot, FaUser } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface ChatWindowProps {
  query: string;
  setQuery: (value: string) => void;
  currentMessages: Array<{ query: string; response: string }>;
  currentResponse: string;
  loading: boolean;
  onAskAI: () => void;
  onCopyResponse: (text: string) => void;
}

interface MarkdownComponentProps {
  children?: React.ReactNode;
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
  const surfaceColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const primaryColor = useColorModeValue("teal.600", "blue.300");
  const codeBg = useColorModeValue("teal.50", "blue.900");
  const dividerColor = useColorModeValue("gray.200", "gray.600");
  const askButtonColor = useColorModeValue("teal", "blue");
  const toast = useToast();

  const formatMarkdown = (text: string) => {
    const components = {
      code({ children, ...props }: MarkdownComponentProps) {
        return (
          <Code
            bg={codeBg}
            p={1}
            borderRadius="md"
            fontSize="0.9em"
            {...props as CodeProps}
          >
            {children}
          </Code>
        );
      },
      h1({ children, ...props }: MarkdownComponentProps) {
        return (
          <Heading
            as="h1"
            size="lg"
            color={primaryColor}
            my={4}
            {...props as HeadingProps}
          >
            {children}
          </Heading>
        );
      },
      h2({ children, ...props }: MarkdownComponentProps) {
        return (
          <Heading
            as="h2"
            size="md"
            color={primaryColor}
            my={3}
            {...props as HeadingProps}
          >
            {children}
          </Heading>
        );
      },
      h3({ children, ...props }: MarkdownComponentProps) {
        return (
          <Heading
            as="h3"
            size="sm"
            color={primaryColor}
            my={2}
            {...props as HeadingProps}
          >
            {children}
          </Heading>
        );
      },
      p({ children, ...props }: MarkdownComponentProps) {
        return (
          <Text my={2} lineHeight="tall" {...props as TextProps}>
            {children}
          </Text>
        );
      },
    };

    return (
      <ReactMarkdown components={components}>
        {text}
      </ReactMarkdown>
    );
  };

  const scrollbarStyles = {
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: subTextColor,
      borderRadius: "3px",
    },
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onAskAI();
    }
  };

  return (
    <Flex direction="column" h="90vh" gap={4}>
      <Box
        flex={1}
        borderRadius="xl"
        bg={surfaceColor}
        p={4}
        boxShadow="sm"
        overflowY="auto"
        css={scrollbarStyles}
      >
        {currentMessages.length === 0 && !loading ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            h="full"
            color={subTextColor}
          >
            <Avatar
              icon={<FaRobot />}
              size="xl"
              mb={4}
              bg={primaryColor}
              color="white"
            />
            <Text fontSize="xl" fontWeight="medium" mb={2}>
              Welcome to Cognivia AI
            </Text>
            <Text textAlign="center" maxW="md">
              Ask me anything about your learning materials or start a new
              conversation
            </Text>
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {currentMessages.map((msg, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <VStack align="stretch" spacing={2}>
                  <Flex align="center" gap={3}>
                    <Avatar
                      icon={<FaUser />}
                      size="sm"
                      bg="gray.500"
                      color="white"
                    />
                    <Text fontWeight="medium" color={textColor}>
                      You
                    </Text>
                  </Flex>
                  <Text color={textColor} pl={10}>
                    {msg.query}
                  </Text>

                  <Divider borderColor={dividerColor} my={2} />

                  <Flex align="center" gap={3}>
                    <Avatar
                      icon={<FaRobot />}
                      size="sm"
                      bg={primaryColor}
                      color="white"
                    />
                    <Text fontWeight="medium" color={textColor}>
                      Cognivia AI
                    </Text>
                    <IconButton
                      aria-label="Copy response"
                      icon={<FaCopy />}
                      size="sm"
                      variant="ghost"
                      ml="auto"
                      onClick={() => {
                        onCopyResponse(msg.response);
                        toast({
                          title: "Copied!",
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                        });
                      }}
                    />
                  </Flex>
                  <Box pl={10}>{formatMarkdown(msg.response)}</Box>
                </VStack>
              </MotionBox>
            ))}

            {loading && (
              <MotionBox
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <VStack align="stretch" spacing={2}>
                  <Flex align="center" gap={3}>
                    <Avatar
                      icon={<FaUser />}
                      size="sm"
                      bg="gray.500"
                      color="white"
                    />
                    <Text fontWeight="medium" color={textColor}>
                      You
                    </Text>
                  </Flex>
                  <Text color={textColor} pl={10}>
                    {query}
                  </Text>

                  <Divider borderColor={dividerColor} my={2} />

                  <Flex align="center" gap={3}>
                    <Avatar
                      icon={<FaRobot />}
                      size="sm"
                      bg={primaryColor}
                      color="white"
                    />
                    <Text fontWeight="medium" color={textColor}>
                      Cognivia AI
                    </Text>
                    <Spinner size="sm" ml="auto" />
                  </Flex>
                  <Text color={textColor} pl={10}>
                    {currentResponse}
                  </Text>
                </VStack>
              </MotionBox>
            )}
          </VStack>
        )}
      </Box>

      <HStack
        p={2}
        bg={inputBg}
        borderRadius="xl"
        boxShadow="sm"
        _focusWithin={{
          boxShadow: `0 0 0 2px ${primaryColor}`,
        }}
      >
        <Input
          placeholder="Ask a question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          size="lg"
          flex={1}
          bg={surfaceColor}
          color={textColor}
          onKeyDown={handleKeyDown}
          borderRadius="lg"
          borderColor={dividerColor}
          _focus={{
            borderColor: primaryColor,
            boxShadow: "none",
          }}
        />
        <Button
          colorScheme={askButtonColor}
          onClick={onAskAI}
          isLoading={loading}
          leftIcon={<FaRobot />}
          size="lg"
          borderRadius="full"
          px={6}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "md",
          }}
          transition="all 0.2s"
        >
          Ask
        </Button>
      </HStack>
    </Flex>
  );
};

export default ChatWindow;