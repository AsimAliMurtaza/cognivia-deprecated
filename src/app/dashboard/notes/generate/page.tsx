"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  useDisclosure,
  useToast,
  Button,
  useColorModeValue,
  Divider,
  Badge,
  Icon,
  Spinner,
} from "@chakra-ui/react";
import { ArrowLeft, Coins } from "lucide-react";
import NotesDisplay from "@/components/notes-generation-components/NotesDisplay";
import SelectionModal from "@/components/notes-generation-components/SelectionModal";
import InputModal from "@/components/notes-generation-components/InputModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SmartNotesGenerator() {
  const [promptText, setPromptText] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generatedNotes, setGeneratedNotes] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sourceType: string | null; content: string; date: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
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
  const router = useRouter();
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  };
  const onSurface = useColorModeValue("gray.800", "white");
  const MotionBox = motion(Box);

  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const buttonColor = useColorModeValue("teal", "blue");
  const badgeBg = useColorModeValue("teal.100", "teal.800");
  const badgeColor = useColorModeValue("teal.800", "teal.100");

  const fetchCredits = async () => {
    try {
      if (!session?.user?.id) return;

      setCreditsLoading(true);
      const response = await fetch("/api/credits/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }

      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
      toast({
        title: "Error",
        description: "Could not load credits information",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCreditsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [session?.user?.id]);

  const handleOptionSelect = (type: "prompt" | "youtube" | "file") => {
    setSourceType(type);
    onClose();
    openInputModal();
  };

  const handleGenerateNotes = async () => {
    // Check if user has enough credits (assuming 10 credits per note generation)
    if (credits !== null && credits < 10) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 10 credits to generate notes",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

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
      const response = await fetch("/api/generate-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          user_id: session?.user?.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402 && errorData.redirectToPricing) {
          router.push("/dashboard/pricing");
          return;
        }
        throw new Error(errorData?.error || "Failed to generate notes");
      }

      const responseData = await response.json();
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

      // Update credits locally immediately
      setCredits((prev) => (prev !== null ? prev - 10 : prev));

      // Refresh credits from server to confirm
      await fetchCredits();

      if (session?.user?.id) {
        const saveResponse = await fetch("/api/save-notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          body: JSON.stringify({
            userId: session.user.id,
            prompt: finalPrompt,
            content: notes,
          }),
        });

        if (!saveResponse.ok) {
          const errorData = await saveResponse.json();
          toast({
            title: "Error Saving Notes",
            description: errorData?.error || "Failed to save notes.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
        }
      }
    } catch (error) {
      console.error("API Error:", error);
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to generate notes.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      closeInputModal();
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
    <Box maxW="1400px" mx="auto" p="6" minH="calc(100vh - 80px)">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        mb={6}
        wrap="wrap"
        gap={4}
      >
        <MotionBox variants={itemVariants}>
          <Button
            leftIcon={<ArrowLeft size={20} />}
            variant="ghost"
            color={onSurface}
            size="md"
            borderRadius="full"
            onClick={() => router.back()}
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
            _focus={{ boxShadow: "outline" }}
          >
            Back
          </Button>
        </MotionBox>
        <Heading size="xl" fontWeight="semibold" color={primaryColor}>
          Smart Notes
        </Heading>
        <Flex align="center" gap={4}>
          {creditsLoading ? (
            <Spinner size="sm" />
          ) : (
            <Badge
              display="flex"
              alignItems="center"
              gap={2}
              px={4}
              py={2}
              borderRadius="full"
              bg={badgeBg}
              color={badgeColor}
              fontSize="md"
              fontWeight="semibold"
            >
              <Icon as={Coins} boxSize={5} />
              {credits !== null ? credits : "N/A"} Credits
            </Badge>
          )}
          <Button
            colorScheme={buttonColor}
            size="md"
            borderRadius="full"
            onClick={onOpen}
            isDisabled={credits !== null && credits < 10}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "md",
            }}
            transition="all 0.2s"
          >
            Create (10 Credits)
          </Button>
        </Flex>
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
        credits={credits}
      />
    </Box>
  );
}
