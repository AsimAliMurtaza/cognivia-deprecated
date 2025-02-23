import React from "react";
import {
  Box,
  Heading,
  Text,
  IconButton,
  Tooltip,
  useColorModeValue,
  Code,
} from "@chakra-ui/react";
import { AiOutlineCopy } from "react-icons/ai";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

interface NotesDisplayProps {
  generatedNotes: string;
  onCopyNotes: (text: string) => void;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({
  generatedNotes,
  onCopyNotes,
}) => {
  const bg = useColorModeValue("gray.100", "gray.800");
  const headingColor = useColorModeValue("teal.700", "teal.300");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const hoverBg = useColorModeValue("gray.200", "gray.600");

  // Function to format text (Headings, Code, Paragraphs)
  const formatText = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("** ")) {
        return (
          <Heading key={index} size="md" color={headingColor} mt={3}>
            {line.replace("** ", "")}
          </Heading>
        );
      } else if (line.startsWith("`") && line.endsWith("`")) {
        return (
          <Code key={index} p={1} borderRadius="md" fontSize="sm" colorScheme="teal">
            {line.replace(/`/g, "")}
          </Code>
        );
      } else {
        return (
          <Text key={index} fontSize="md" color={textColor} mt={1} whiteSpace="pre-wrap">
            {line}
          </Text>
        );
      }
    });
  };

  return (
    <Box
      flex="2"
      bg={bg}
      borderRadius="lg"
      p={6}
      boxShadow="lg"
      border="1px solid"
      borderColor={borderColor}
      minH="450px"
      position="relative"
    >
      <Heading
        size="md"
        fontWeight="thin"
        mb={4}
        color={headingColor}
        textAlign="center"
      >
        {generatedNotes ? "Your Generated Notes" : "Generated Notes"}
      </Heading>

      {generatedNotes ? (
        <MotionBox
          p={5}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          h="350px" // Fixed height
          overflowY="auto" // Scrollable content
          css={{
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: hoverBg,
              borderRadius: "6px",
            },
          }}
        >
          {formatText(generatedNotes)}
        </MotionBox>
      ) : (
        <Text textAlign="center" fontSize="sm" color={textColor} mt={4}>
          No notes available yet.
        </Text>
      )}

      {/* Copy Button at the Bottom Right */}
      {generatedNotes && (
        <Tooltip label="Copy Text" hasArrow>
          <IconButton
            icon={<AiOutlineCopy />}
            size="sm"
            onClick={() => onCopyNotes(generatedNotes)}
            aria-label="Copy Text"
            _hover={{ bg: hoverBg }}
            bottom="0px"
            right="10px"
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default NotesDisplay;
