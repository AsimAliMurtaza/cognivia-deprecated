"use client";

import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  useDisclosure,
  useToast,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import HistoryList from "@/components/notes-generation-components/HistoryList";
import NotesDisplay from "@/components/notes-generation-components/NotesDisplay";
import SelectionModal from "@/components/notes-generation-components/SelectionModal";
import InputModal from "@/components/notes-generation-components/InputModal";

export default function SmartNotesGenerator() {
  const [promptText, setPromptText] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sourceType: string | null; content: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [sourceType, setSourceType] = useState<
    "prompt" | "youtube" | "file" | null
  >(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isInputOpen,
    onOpen: openInputModal,
    onClose: closeInputModal,
  } = useDisclosure();
  const toast = useToast();

  const handleOptionSelect = (type: "prompt" | "youtube" | "file") => {
    setSourceType(type);
    onClose();
    openInputModal();
  };

  const handleGenerateNotes = async () => {
    setLoading(true);
    let notes = "";

    try {
      const result = await generateNotes(
        promptText || youtubeLink || file?.name || ""
      );
      notes = result;

      setGeneratedNotes(notes);
      setChatHistory([
        ...chatHistory,
        {
          sourceType,
          content: notes,
          date: new Date().toISOString().split("T")[0],
        },
      ]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to generate notes.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      closeInputModal();
    }
  };

  const generateNotes = async (input: string): Promise<string> => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/ask?query=${encodeURIComponent(input)}`,

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
  const handleChatClick = (chat: {
    sourceType: string | null;
    content: string;
    date: string;
  }) => {
    setGeneratedNotes(chat.content);
  };

  const handleDeleteChat = (index: number) => {
    const updatedHistory = chatHistory.filter((_, i) => i !== index);
    setChatHistory(updatedHistory);
    if (generatedNotes === chatHistory[index].content) {
      setGeneratedNotes("");
    }
  };

  const handleCopyNotes = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Text copied to clipboard.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  // Color Mode Support
  const headerColor = useColorModeValue("teal.600", "teal.300");
  const buttonColor = useColorModeValue("teal.400", "teal.200");

  return (
    <Box
      p={{ base: 4, md: 6 }}
      maxW="1200px"
      mx="auto"
      maxH="100vh"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        wrap="wrap"
      >
        <Heading size="lg" fontWeight="medium" color={headerColor}>
          Smart Notes Generator
        </Heading>
        <Button
          color={buttonColor}
          fontSize="sm"
          fontWeight="medium"
          variant="ghost"
          onClick={onOpen}
        >
          Start Generating Notes
        </Button>
      </Flex>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={6}
        h={{ base: "auto", md: "60vh" }}
      >
        <HistoryList
          chatHistory={chatHistory}
          onChatClick={handleChatClick}
          onDeleteChat={handleDeleteChat}
        />
        <NotesDisplay
          generatedNotes={generatedNotes}
          onCopyNotes={handleCopyNotes}
        />
      </Flex>
      <SelectionModal
        isOpen={isOpen}
        onClose={onClose}
        onOptionSelect={handleOptionSelect}
      />
      <InputModal
        isOpen={isInputOpen}
        onClose={closeInputModal}
        sourceType={sourceType}
        promptText={promptText}
        setPromptText={setPromptText}
        youtubeLink={youtubeLink}
        setYoutubeLink={setYoutubeLink}
        file={file}
        setFile={setFile}
        onGenerate={handleGenerateNotes}
        loading={loading}
      />
    </Box>
  );
}
