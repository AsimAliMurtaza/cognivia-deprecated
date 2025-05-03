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
  Divider,
} from "@chakra-ui/react";
import NotesDisplay from "@/components/notes-generation-components/NotesDisplay";
import SelectionModal from "@/components/notes-generation-components/SelectionModal";
import InputModal from "@/components/notes-generation-components/InputModal";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const buttonColor = useColorModeValue("teal", "blue");

  const handleOptionSelect = (type: "prompt" | "youtube" | "file") => {
    setSourceType(type);
    onClose();
    openInputModal();
  };

  const handleGenerateNotes = async () => {
    setLoading(true);
    let notes = "";
    let finalPrompt = "";

    switch (sourceType) {
      case "prompt":
        finalPrompt = `Generate Detailed Notes on the following topic: ${promptText}`;
        break;
      case "youtube":
        finalPrompt = `Generate Detailed Notes on the following topic: based on the content of this YouTube link: ${youtubeLink}`;
        break;
      case "file":
        finalPrompt = `Generate Detailed Notes on the following topic: based on the content of this file: ${file?.name}`;
        // In a real application, you'd likely need to upload and process the file content on the server.
        break;
      default:
        toast({
          title: "Error",
          description: "Invalid source type.",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setLoading(false);
        closeInputModal();
        return;
    }

    try {
      const responseData = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      }).then((res) => res.json());

      notes = responseData?.response || "No notes generated.";
      setGeneratedNotes(notes);
      setChatHistory([
        ...chatHistory,
        {
          sourceType,
          content: notes,
          date: new Date().toISOString().split("T")[0],
        },
      ]);

      if (session?.user?.id) {
        const saveResponse = await fetch("/api/save-notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({
            userId: session.user.id,
            prompt: finalPrompt, // Send the prompt for saving
            content: notes, // Send the generated notes (which will be 'generated_quiz' in your schema)
          }),
        });

        if (saveResponse.ok) {
          toast({
            title: "Notes Saved",
            description: "The generated notes have been saved.",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        } else {
          const errorData = await saveResponse.json();
          toast({
            title: "Error Saving Notes",
            description: errorData?.error || "Failed to save notes.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Authentication Required",
          description: "Please log in to save notes.",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
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


  // const handleChatClick = (chat: {
  //   sourceType: string | null;
  //   content: string;
  //   date: string;
  // }) => {
  //   setGeneratedNotes(chat.content);
  // };

  // const handleDeleteChat = (index: number) => {
  //   const updatedHistory = chatHistory.filter((_, i) => i !== index);
  //   setChatHistory(updatedHistory);
  //   if (generatedNotes === chatHistory[index].content) {
  //     setGeneratedNotes("");
  //   }
  // };

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
    <Box maxW="1400px" mx="auto" p="6" minH="calc(100vh - 80px)">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        wrap="wrap"
        gap={4}
      >
        <Heading size="xl" fontWeight="semibold" color={primaryColor}>
          Smart Notes
        </Heading>
        <Button
          colorScheme={buttonColor}
          size="lg"
          borderRadius="full"
          onClick={onOpen}
          _hover={{
            transform: "translateY(-2px)",
            boxShadow: "md",
          }}
          transition="all 0.2s"
        >
          Create
        </Button>
      </Flex>

      <Divider mb={4} borderColor={useColorModeValue("gray.200", "gray.600")} />

      <Flex direction={{ base: "column", lg: "row" }} gap={6} minH="70vh">
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