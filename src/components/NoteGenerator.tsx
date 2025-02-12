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
  CardBody,
  CardHeader,
  HStack,
  Spinner,
  useToast,
  IconButton,
  Flex,
  Grid,
} from "@chakra-ui/react";
import {
  AiOutlineFileText,
  AiOutlineYoutube,
  AiOutlineFileImage,
  AiOutlinePlus,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";

// Framer Motion components
const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionButton = motion(Button);
const MotionModalContent = motion(ModalContent);

export default function SmartNotesGenerator() {
  const [promptText, setPromptText] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [file, setFile] = useState(null);
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [sourceType, setSourceType] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isInputOpen,
    onOpen: openInputModal,
    onClose: closeInputModal,
  } = useDisclosure();

  const toast = useToast();

  const handleOptionSelect = (type) => {
    setSourceType(type);
    closeInputModal();
    openInputModal();
  };

  const getFormattedDate = () => new Date().toISOString().split("T")[0];

  const handleGenerateNotes = async () => {
    setLoading(true);
    let notes = "";

    try {
      switch (sourceType) {
        case "prompt":
          notes = await mockAPICall(promptText);
          break;
        case "youtube":
          notes = await mockAPICall(
            `Generate notes from YouTube link: ${youtubeLink}`
          );
          break;
        case "file":
          notes = await mockAPICall(`Generate notes from file: ${file?.name}`);
          break;
        default:
          notes = "Invalid source type";
      }

      setGeneratedNotes(notes);
      setChatHistory([...chatHistory, { sourceType, content: notes }]);
      setInputDisabled(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate notes.",
        status: "error",
      });
    } finally {
      setLoading(false);
      closeInputModal();
    }
  };

  const handleNewNote = () => {
    setGeneratedNotes("");
    setPromptText("");
    setYoutubeLink("");
    setFile(null);
    setInputDisabled(false);
    onOpen();
  };

  const mockAPICall = (input) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(input);
      }, 2000);
    });
  };

  return (
    <Box p={6} maxW="1200px" mx="auto">
      <Heading
        size="lg"
        fontWeight="thin"
        textAlign="left"
        mb={8}
        color="teal.500"
      >
        Smart Notes Generator
      </Heading>

      <MotionButton
        colorScheme="teal"
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
      <Flex direction="row" gap={6} h="60vh">
        {/* Left Pane: Notes History */}
        <Box
          flex="1"
          bg="gray.50"
          maxWidth="250px"
          borderRadius="2xl"
          p={4}
          overflowY="auto"
          boxShadow="lg"
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
                size="sm"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <CardHeader>
                  <Heading size="sm" color="teal.600">
                    {getFormattedDate()}
                  </Heading>
                  <Text fontWeight="thin" fontSize="md" color="teal.600">
                    {generatedNotes.slice(0, 15) + "..."}
                  </Text>
                </CardHeader>
              </MotionCard>
            ))}
          </VStack>
        </Box>

        {/* Right Pane: Generated Notes */}
        <Box flex="2" bg="gray.50" borderRadius="lg" p={4} boxShadow="md">
          <Heading size="md" mb={4} color="teal.600">
            {generatedNotes.slice(0, 15) + "..."}
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
              <Text whiteSpace="pre-wrap">{generatedNotes}</Text>
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
          >
            <ModalHeader textAlign="center" color="teal.600">
              Select Note Generation Method
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid
                templateColumns="repeat(auto-fit, minmax(200px, 1fr))"
                gap={6}
              >
                <MotionCard
                  onClick={() => handleOptionSelect("prompt")}
                  cursor="pointer"
                  borderRadius="lg"
                  boxShadow="md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CardHeader textAlign="center">
                    <AiOutlineFileText size={40} color="teal.500" />
                    <Text mt={2} fontWeight="semibold" color="teal.600">
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
                >
                  <CardHeader textAlign="center">
                    <AiOutlineYoutube size={40} color="teal.500" />
                    <Text mt={2} fontWeight="semibold" color="teal.600">
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
                >
                  <CardHeader textAlign="center">
                    <AiOutlineFileImage size={40} color="teal.500" />
                    <Text mt={2} fontWeight="semibold" color="teal.600">
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
          >
            <ModalHeader textAlign="center" color="teal.600">
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
                  onChange={(e) => setFile(e.target.files[0])}
                  isDisabled={inputDisabled}
                  borderRadius="md"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <MotionButton
                colorScheme="teal"
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
