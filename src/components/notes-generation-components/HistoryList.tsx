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
  const bg = useColorModeValue("gray.100", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("teal.700", "teal.300");
  const dateColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.200", "gray.600");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Box
      flex="1"
      maxW={{ base: "100%", md: "300px" }}
      borderRadius="2xl"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      overflowY="auto"
      boxShadow="lg"
      bg={bg}
      minH="450px"
      h="350px" // Fixed height
    >
      <Heading
        size="md"
        fontWeight="thin"
        mb={4}
        color={textColor}
        textAlign="center"
      >
        Notes History
      </Heading>
      <VStack spacing={4} align="stretch">
        {chatHistory.length > 0 ? (
          chatHistory.map((chat, index) => (
            <MotionCard
              key={index}
              borderRadius="lg"
              boxShadow="md"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              cursor="pointer"
              bg={cardBg}
              _hover={{ bg: hoverBg }}
            >
              <CardHeader
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => onChatClick(chat)}
                p={3}
              >
                <Box>
                  <Heading size="xs" color={dateColor}>
                    {chat.date}
                  </Heading>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color={textColor}
                    noOfLines={1}
                  >
                    {chat.content}
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
          ))
        ) : (
          <Text textAlign="center" fontSize="sm" color={dateColor} mt={4}>
            No chat history available.
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default HistoryList;
