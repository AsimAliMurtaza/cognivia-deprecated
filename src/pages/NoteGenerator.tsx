"use client";

import React, { useState } from "react";
import { Box, Flex, Heading, useDisclosure, useToast } from "@chakra-ui/react";
import HistoryList from "../components/notes-generation-components/HistoryList";
import NotesDisplay from "../components/notes-generation-components/NotesDisplay";
import SelectionModal from "../components/notes-generation-components/SelectionModal";
import InputModal from "../components/notes-generation-components/InputModal";

export default function SmartNotesGenerator() {
  const [promptText, setPromptText] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sourceType: string | null; content: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [sourceType, setSourceType] = useState<"prompt" | "youtube" | "file" | null>(null);

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
      const result = await mockAPICall(promptText || youtubeLink || file?.name || "");
      notes = result;

      setGeneratedNotes(notes);
      setChatHistory([
        ...chatHistory,
        { sourceType, content: notes, date: new Date().toISOString().split("T")[0] },
      ]);
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

  const mockAPICall = async (input: string): Promise<string> => {
    return new Promise((resolve) => setTimeout(() => resolve(`Generated notes for: ${input}`), 2000));
  };

  const handleChatClick = (chat: { sourceType: string | null; content: string; date: string }) => {
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

  return (
    <Box p={6} maxW="1200px" mx="auto" borderRadius="20px">
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Heading size="lg" fontWeight="thin" color="teal.600">
          Smart Notes Generator
        </Heading>
        <Heading size="sm" onClick={onOpen} cursor="pointer" color="teal.400">
          Start Generating Notes
        </Heading>
      </Flex>
      <Flex direction={{ base: "column", md: "row" }} gap={6} h="60vh">
        <HistoryList
          chatHistory={chatHistory}
          onChatClick={handleChatClick}
          onDeleteChat={handleDeleteChat}
        />
        <NotesDisplay generatedNotes={generatedNotes} onCopyNotes={handleCopyNotes} />
      </Flex>
      <SelectionModal isOpen={isOpen} onClose={onClose} onOptionSelect={handleOptionSelect} />
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