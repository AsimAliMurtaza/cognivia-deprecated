"use client";

import React from "react";
import {
  Box,
  Heading,
  VStack,
  Card,
  CardHeader,
  IconButton,
  Tooltip,
  Text,
  useColorModeValue,
  Avatar,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { motion } from "framer-motion";
import { FiFileText, FiYoutube, FiImage } from "react-icons/fi";

const MotionCard = motion(Card);

interface HistoryListProps {
  chatHistory: {
    sourceType: string | null;
    content: string;
    date: string;
  }[];
  onChatClick: (chat: {
    sourceType: string | null;
    content: string;
    date: string;
  }) => void;
  onDeleteChat: (index: number) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
  chatHistory,
  onChatClick,
  onDeleteChat,
}) => {
  const surfaceColor = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("teal.600", "blue.300");
  const secondaryColor = useColorModeValue("teal.500", "blue.400");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const getIcon = (sourceType: string | null) => {
    switch (sourceType) {
      case "prompt":
        return <FiFileText />;
      case "youtube":
        return <FiYoutube />;
      case "file":
        return <FiImage />;
      default:
        return <FiFileText />;
    }
  };

  return (
    <Box
      flex="1"
      maxW={{ base: "100%", lg: "350px" }}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      overflowY="auto"
      boxShadow="lg"
      bg={surfaceColor}
      minH="500px"
    >
      <Heading
        size="lg"
        fontWeight="semibold"
        mb={4}
        color={primaryColor}
        textAlign="center"
      >
        Notes History
      </Heading>

      <Divider mb={4} borderColor={borderColor} />

      <VStack spacing={3} align="stretch">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <MotionCard
              key={index}
              borderRadius="xl"
              boxShadow="sm"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              cursor="pointer"
              bg="transparent"
              border="1px solid"
              borderColor={borderColor}
              _hover={{ bg: hoverBg }}
              onClick={() => onChatClick(chat)}
            >
              <CardHeader
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
              >
                <Flex align="center" gap={3}>
                  <Avatar
                    size="sm"
                    icon={getIcon(chat.sourceType)}
                    bg={secondaryColor}
                    color="white"
                  />
                  <Box>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={textColor}
                      noOfLines={1}
                    >
                      {chat.content.substring(0, 40)}...
                    </Text>
                    <Text fontSize="xs" color={subTextColor}>
                      {chat.date}
                    </Text>
                  </Box>
                </Flex>
                <Tooltip label="Delete Note" hasArrow>
                  <IconButton
                    icon={<AiOutlineDelete />}
                    size="sm"
                    variant="ghost"
                    colorScheme="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(index);
                    }}
                    aria-label="Delete Note"
                  />
                </Tooltip>
              </CardHeader>
            </MotionCard>
          ))
        ) : (
          <Box textAlign="center" py={8}>
            <Text fontSize="md" color={subTextColor}>
              No notes history available
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default HistoryList;
