"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import {
  Box,
  Heading,
  Text,
  IconButton,
  Tooltip,
  useColorModeValue,
  Flex,
  Divider,
  Code,
  Link,
  UnorderedList,
  OrderedList,
  ListItem,
  BoxProps,
} from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface NotesDisplayProps {
  generatedNotes: string;
  onCopyNotes: (text: string) => void;
}

type MarkdownComponentProps = {
  children?: React.ReactNode;
  inline?: boolean;
};

const NotesDisplay: React.FC<NotesDisplayProps> = ({
  generatedNotes,
  onCopyNotes,
}) => {
  const surfaceColor = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("teal.600", "blue.300");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const codeBg = useColorModeValue("teal.50", "blue.900");
  const linkColor = useColorModeValue("blue.600", "blue.300");
  const bgColor = useColorModeValue("teal.50", "blue.900");

  const components = {
    h1: ({ children, ...props }: MarkdownComponentProps) => (
      <Heading as="h1" size="xl" color={primaryColor} mt={8} mb={4} {...props}>
        {children}
      </Heading>
    ),
    h2: ({ children, ...props }: MarkdownComponentProps) => (
      <Heading as="h2" size="lg" color={primaryColor} mt={6} mb={3} {...props}>
        {children}
      </Heading>
    ),
    h3: ({ children, ...props }: MarkdownComponentProps) => (
      <Heading as="h3" size="md" color={primaryColor} mt={5} mb={2} {...props}>
        {children}
      </Heading>
    ),
    p: ({ children, ...props }: MarkdownComponentProps) => (
      <Text fontSize="md" color={textColor} my={3} {...props}>
        {children}
      </Text>
    ),
    a: ({ children, ...props }: MarkdownComponentProps) => (
      <Link color={linkColor} isExternal {...props}>
        {children}
      </Link>
    ),
    ul: ({ children, ...props }: MarkdownComponentProps) => (
      <UnorderedList spacing={1} my={3} pl={5} {...props}>
        {children}
      </UnorderedList>
    ),
    ol: ({ children, ...props }: MarkdownComponentProps) => (
      <OrderedList spacing={1} my={3} pl={5} {...props}>
        {children}
      </OrderedList>
    ),
    li: ({ children, ...props }: MarkdownComponentProps) => (
      <ListItem pb={1} {...props}>
        {children}
      </ListItem>
    ),
    code: ({ inline, children, ...props }: MarkdownComponentProps) =>
      inline ? (
        <Code
          p={1}
          borderRadius="md"
          bg={codeBg}
          color={textColor}
          fontSize="0.9em"
          {...props}
        >
          {children}
        </Code>
      ) : (
        <Box
          as="pre"
          p={3}
          borderRadius="md"
          bg={codeBg}
          overflowX="auto"
          my={4}
          {...props}
        >
          <Code
            display="block"
            whiteSpace="pre"
            color={textColor}
            fontSize="0.9em"
          >
            {children}
          </Code>
        </Box>
      ),
    blockquote: ({ children, ...props }: MarkdownComponentProps) => (
      <Box
        borderLeft="4px solid"
        borderColor={primaryColor}
        pl={4}
        py={1}
        my={3}
        bg={bgColor}
        {...props}
      >
        {children}
      </Box>
    ),
  };

  const scrollbarStyles: BoxProps["css"] = {
    "&::-webkit-scrollbar": {
      width: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: subTextColor,
      borderRadius: "3px",
    },
  };

  return (
    <Box
      flex="2"
      bg={surfaceColor}
      borderRadius="2xl"
      p={6}
      boxShadow="lg"
      border="1px solid"
      borderColor={borderColor}
      minH="500px"
      position="relative"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="lg" fontWeight="semibold" color={primaryColor}>
          {generatedNotes ? "Generated Notes" : "Notes Preview"}
        </Heading>
        <Flex gap={3} align="center">
          {generatedNotes && (
            <Tooltip label="Copy to clipboard" hasArrow>
              <IconButton
                icon={<AiOutlineCopy />}
                aria-label="Copy notes"
                onClick={() => onCopyNotes(generatedNotes)}
                variant="ghost"
                colorScheme="blue"
                size="sm"
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>

      <Divider mb={4} borderColor={borderColor} />

      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        overflowY="auto"
        maxH="400px"
        pr={2}
        css={scrollbarStyles}
      >
        <ReactMarkdown components={components}>{generatedNotes}</ReactMarkdown>
      </MotionBox>
    </Box>
  );
};

export default NotesDisplay;