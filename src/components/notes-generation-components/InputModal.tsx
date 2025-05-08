"use client";

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Input,
  Button,
  useColorModeValue,
  VStack,
  FormControl,
  Box,
  Flex,
  Avatar,
  Text,
} from "@chakra-ui/react";
import { FiUpload, FiLink, FiEdit2 } from "react-icons/fi";

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: "prompt" | "youtube" | "file" | null;
  promptText: string;
  setPromptText: (text: string) => void;
  youtubeLink: string;
  setYoutubeLink: (link: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  onGenerate: () => void;
  loading: boolean;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  sourceType,
  promptText,
  setPromptText,
  youtubeLink,
  setYoutubeLink,
  file,
  setFile,
  onGenerate,
  loading,
}) => {
  const surfaceColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const primaryColor = useColorModeValue("teal.600", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const getModalTitle = () => {
    switch (sourceType) {
      case "prompt":
        return "Write Your Prompt";
      case "youtube":
        return "Enter YouTube Link";
      case "file":
        return "Upload Your File";
      default:
        return "Provide Input";
    }
  };

  const getIcon = () => {
    switch (sourceType) {
      case "prompt":
        return <FiEdit2 size={24} />;
      case "youtube":
        return <FiLink size={24} />;
      case "file":
        return <FiUpload size={24} />;
      default:
        return <FiEdit2 size={24} />;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" bg={surfaceColor}>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Avatar icon={getIcon()} bg={primaryColor} color="white" />
            <Box>
              <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                {getModalTitle()}
              </Text>
              <Text fontSize="sm" color={subTextColor}>
                {sourceType === "prompt"
                  ? "Describe what you need"
                  : sourceType === "youtube"
                  ? "Paste a YouTube video URL"
                  : "Upload a document or image"}
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4}>
            {sourceType === "prompt" && (
              <FormControl>
                <Textarea
                  placeholder="Example: Summarize the key points about machine learning..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  bg={inputBg}
                  borderColor={borderColor}
                  borderRadius="lg"
                  minH="200px"
                  _focus={{
                    borderColor: primaryColor,
                    boxShadow: `0 0 0 1px ${primaryColor}`,
                  }}
                />
              </FormControl>
            )}

            {sourceType === "youtube" && (
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  bg={inputBg}
                  borderColor={borderColor}
                  borderRadius="lg"
                  _focus={{
                    borderColor: primaryColor,
                    boxShadow: `0 0 0 1px ${primaryColor}`,
                  }}
                />
              </FormControl>
            )}

            {sourceType === "file" && (
              <FormControl>
                <Box
                  border="2px dashed"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={6}
                  textAlign="center"
                  bg={inputBg}
                  _hover={{ borderColor: primaryColor }}
                >
                  <Input
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    position="absolute"
                    opacity={0}
                    width="100%"
                    height="100%"
                    top={0}
                    left={0}
                    cursor="pointer"
                  />
                  <VStack spacing={2}>
                    <FiUpload size={32} />
                    <Text fontWeight="medium" color={textColor}>
                      {file ? file.name : "Click to upload or drag and drop"}
                    </Text>
                    <Text fontSize="sm" color={subTextColor}>
                      Supports PDF, DOC, TXT, and images
                    </Text>
                  </VStack>
                </Box>
              </FormControl>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            borderRadius="full"
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={onGenerate}
            isLoading={loading}
            isDisabled={
              (sourceType === "prompt" && !promptText) ||
              (sourceType === "youtube" && !youtubeLink) ||
              (sourceType === "file" && !file)
            }
            borderRadius="full"
            px={6}
          >
            Generate Notes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InputModal;
