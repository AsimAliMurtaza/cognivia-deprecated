import React from "react";
import { Box, Heading, Text, IconButton, Tooltip, Flex } from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface NotesDisplayProps {
  generatedNotes: string;
  onCopyNotes: (text: string) => void;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({ generatedNotes, onCopyNotes }) => {
  return (
    <Box flex="2" bg="gray.50" borderRadius="lg" p={4} boxShadow="md">
      <Heading size="md" mb={4} color="teal.600">
        {generatedNotes ? generatedNotes.slice(0, 15) + "..." : "Generated Notes"}
      </Heading>
      {generatedNotes && (
        <MotionBox
          borderRadius="lg"
          bg="white"
          p={4}
          boxShadow="sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text whiteSpace="pre-wrap">{generatedNotes}</Text>
            <Tooltip label="Copy Text">
              <IconButton
                icon={<AiOutlineCopy />}
                size="sm"
                colorScheme="teal"
                onClick={() => onCopyNotes(generatedNotes)}
                aria-label="Copy Text"
              />
            </Tooltip>
          </Flex>
        </MotionBox>
      )}
    </Box>
  );
};

export default NotesDisplay;