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
} from "@chakra-ui/react";
import { AiOutlineDelete } from "react-icons/ai";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

interface HistoryListProps {
  chatHistory: {
    sourceType: string | null;
    content: string;
    date: string;
  }[];
  onChatClick: (chat: { sourceType: string | null; content: string; date: string }) => void;
  onDeleteChat: (index: number) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ chatHistory, onChatClick, onDeleteChat }) => {
  return (
    <Box
      flex="1"
      maxWidth={{ base: "100%", md: "250px" }}
      borderRadius="2xl"
      p={4}
      overflowY="auto"
      boxShadow="lg"
      bg="gray.50"
    >
      <Heading size="md" mb={4} color="teal.600">
        Notes History
      </Heading>
      <VStack spacing={4} align="stretch">
        {chatHistory.map((chat, index) => (
          <MotionCard
            key={index}
            borderRadius="lg"
            boxShadow="md"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            cursor="pointer"
            bg="white"
          >
            <CardHeader
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => onChatClick(chat)}
            >
              <Box>
                <Heading size="sm" color="teal.600">
                  {chat.date}
                </Heading>
                <Text fontWeight="thin" fontSize="md" color="teal.600">
                  {chat.content.slice(0, 15) + "..."}
                </Text>
              </Box>
              <Tooltip label="Delete Chat">
                <IconButton
                  icon={<AiOutlineDelete />}
                  size="sm"
                  colorScheme="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(index);
                  }}
                  aria-label="Delete Chat"
                />
              </Tooltip>
            </CardHeader>
          </MotionCard>
        ))}
      </VStack>
    </Box>
  );
};

export default HistoryList;