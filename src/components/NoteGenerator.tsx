"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Textarea,
  Heading,
  VStack,
  Text,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Card,
  CardHeader,
  Spinner,
  useToast,
  IconButton,
  Flex,
  Grid,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  AiOutlineFileText,
  AiOutlineYoutube,
  AiOutlineFileImage,
  AiOutlinePlus,
  AiOutlineDelete,
  AiOutlineCopy,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

// Framer Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionModalContent = motion(ModalContent);

type SourceType = "prompt" | "youtube" | "file" | null;

interface Chat {
  sourceType: SourceType;
  content: string;
  date: string;
}

export default function SmartNotesGenerator() {
  const [promptText, setPromptText] = useState<string>("");
  const [youtubeLink, setYoutubeLink] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [sourceType, setSourceType] = useState<SourceType>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isInputOpen,
    onOpen: openInputModal,
    onClose: closeInputModal,
  } = useDisclosure();

  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("teal.600", "teal.200");
  const buttonColorScheme = useColorModeValue("teal", "blue");

  const handleOptionSelect = (type: SourceType) => {
    setSourceType(type);
    onClose(); // Close the selection modal immediately after choosing an option
    openInputModal();
  };

  const getFormattedDate = () => new Date().toISOString().split("T")[0];

  const handleGenerateNotes = async () => {
    setLoading(true);
    let notes = "";

    try {
      switch (sourceType) {
        case "prompt":
          notes = (await mockAPICall(promptText)) as string;
          break;
        case "youtube":
          notes = (await mockAPICall(
            `Generate notes from YouTube link: ${youtubeLink}`
          )) as string;
          break;
        case "file":
          notes = (await mockAPICall(
            `Generate notes from file: ${file?.name}`
          )) as string;
          break;
        default:
          notes = "Invalid source type";
      }

      setGeneratedNotes(notes);
      setChatHistory([
        ...chatHistory,
        { sourceType, content: notes, date: getFormattedDate() },
      ]);
      resetInputs();
    } catch (error) {
      console.error("Error generating notes:", error); // Log the error
      toast({
        title: "Error",
        description: "Failed to generate notes.",
        status: "error",
      });
    } finally {
      setLoading(false);
      closeInputModal(); // Close the input modal after generating notes
    }
  };

  const resetInputs = () => {
    setPromptText("");
    setYoutubeLink("");
    setFile(null);
    setInputDisabled(false);
    setSourceType(null);
  };

  const mockAPICall = async (input: string): Promise<string> => {
    try {
      const response = await fetch(
        `http://localhost:5000/ask?query=${encodeURIComponent(input)}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to generate notes");

      // Read the response as a stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("Failed to read response");

      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += new TextDecoder().decode(value);
      }

      return result;
    } catch (error) {
      console.error("Error:", error);
      return "Failed to generate notes.";
    }
  };

  const handleChatClick = (chat: Chat) => {
    setGeneratedNotes(chat.content);
  };

  const handleDeleteChat = (index: number) => {
    const updatedHistory = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updatedHistory);
    if (generatedNotes === chatHistory[index].content) {
      setGeneratedNotes("");
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading size="lg" fontWeight="thin" textAlign="left" color={textColor}>
          Smart Notes Generator
        </Heading>
      </Flex>

      <MotionButton
        colorScheme={buttonColorScheme}
        onClick={onOpen}
        leftIcon={<AiOutlinePlus />}
        size="md"
        mb={8}
        justifyContent="left"
        display="block"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Start Generating Notes
      </MotionButton>

      {/* Main Layout: Left (History) and Right (Generated Notes) */}
      <Flex direction={{ base: "column", md: "row" }} gap={6} h="60vh">
        {/* Left Pane: Notes History */}
        <Box
          flex="1"
          bg={bgColor}
          maxWidth={{ base: "100%", md: "250px" }}
          borderRadius="2xl"
          p={4}
          overflowY="auto"
          boxShadow="lg"
        >
          <Heading size="md" mb={4} color={textColor}>
            Notes History
          </Heading>
          <VStack spacing={4} align="stretch">
            {chatHistory.map((chat, index) => (
              <MotionCard
                key={index}
                borderRadius="lg"
                boxShadow="md"
                size="sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                cursor="pointer"
                bg={cardBgColor}
              >
                <CardHeader
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box onClick={() => handleChatClick(chat)}>
                    <Heading size="sm" color={textColor}>
                      {chat.date}
                    </Heading>
                    <Text fontWeight="thin" fontSize="md" color={textColor}>
                      {chat.content.slice(0, 15) + "..."}
                    </Text>
                  </Box>
                  <Tooltip label="Delete Chat">
                    <IconButton
                      icon={<AiOutlineDelete />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteChat(index)}
                      aria-label="Delete Chat"
                    />
                  </Tooltip>
                </CardHeader>
              </MotionCard>
            ))}
          </VStack>
        </Box>

        {/* Right Pane: Generated Notes */}
        <Box flex="2" bg={bgColor} borderRadius="lg" p={4} boxShadow="md">
          <Heading size="md" mb={4} color={textColor}>
            {generatedNotes
              ? generatedNotes.slice(0, 15) + "..."
              : "Generated Notes"}
          </Heading>
          {generatedNotes && (
            <MotionBox
              borderRadius="lg"
              bg={cardBgColor}
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
                    colorScheme={buttonColorScheme}
                    onClick={() => handleCopyText(generatedNotes)}
                    aria-label="Copy Text"
                  />
                </Tooltip>
              </Flex>
            </MotionBox>
          )}
        </Box>
      </Flex>

      {/* Initial Modal for Option Selection */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <AnimatePresence>
          <MotionModalContent
            borderRadius="lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            bg={cardBgColor}
          >
            <ModalHeader textAlign="center" color={textColor}>
              Select Note Generation Method
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "repeat(auto-fit, minmax(200px, 1fr))",
                }}
                gap={6}
              >
                <MotionCard
                  onClick={() => handleOptionSelect("prompt")}
                  cursor="pointer"
                  borderRadius="lg"
                  boxShadow="md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  bg={cardBgColor}
                >
                  <CardHeader textAlign="center">
                    <AiOutlineFileText size={40} color={textColor} />
                    <Text mt={2} fontWeight="semibold" color={textColor}>
                      Write a Prompt
                    </Text>
                  </CardHeader>
                </MotionCard>

                <MotionCard
                  onClick={() => handleOptionSelect("youtube")}
                  cursor="pointer"
                  borderRadius="lg"
                  boxShadow="md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  bg={cardBgColor}
                >
                  <CardHeader textAlign="center">
                    <AiOutlineYoutube size={40} color={textColor} />
                    <Text mt={2} fontWeight="semibold" color={textColor}>
                      Enter YouTube Link
                    </Text>
                  </CardHeader>
                </MotionCard>

                <MotionCard
                  onClick={() => handleOptionSelect("file")}
                  cursor="pointer"
                  borderRadius="lg"
                  boxShadow="md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  bg={cardBgColor}
                >
                  <CardHeader textAlign="center">
                    <AiOutlineFileImage size={40} color={textColor} />
                    <Text mt={2} fontWeight="semibold" color={textColor}>
                      Upload Image/Doc
                    </Text>
                  </CardHeader>
                </MotionCard>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="red" onClick={onClose}>
                Cancel
              </Button>
            </ModalFooter>
          </MotionModalContent>
        </AnimatePresence>
      </Modal>

      {/* Input Modal for Selected Option */}
      <Modal isOpen={isInputOpen} onClose={closeInputModal} isCentered>
        <ModalOverlay />
        <AnimatePresence>
          <MotionModalContent
            borderRadius="lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            bg={cardBgColor}
          >
            <ModalHeader textAlign="center" color={textColor}>
              Provide Your Input
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {sourceType === "prompt" && (
                <Textarea
                  placeholder="Write your prompt here..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  minHeight="150px"
                  isDisabled={inputDisabled}
                  borderRadius="md"
                />
              )}

              {sourceType === "youtube" && (
                <Input
                  placeholder="Enter YouTube link..."
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  isDisabled={inputDisabled}
                  borderRadius="md"
                />
              )}

              {sourceType === "file" && (
                <Input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  isDisabled={inputDisabled}
                  borderRadius="md"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <MotionButton
                colorScheme={buttonColorScheme}
                onClick={handleGenerateNotes}
                isDisabled={
                  inputDisabled || (!promptText && !youtubeLink && !file)
                }
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {loading ? <Spinner size="sm" /> : "Generate Notes"}
              </MotionButton>
            </ModalFooter>
          </MotionModalContent>
        </AnimatePresence>
      </Modal>
    </Box>
  );
}
