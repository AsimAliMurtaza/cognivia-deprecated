"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  useToast,
  Container,
  useColorModeValue,
  Input,
  IconButton,
  HStack,
  Textarea,
  Button,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  VStack,
  Flex,
  Badge,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EditIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { useSession } from "next-auth/react";

interface Note {
  _id: string;
  userID: string;
  prompt: string;
  generated_quiz: string;
  createdAt: string;
}

export default function ViewNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [page, setPage] = useState(0);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const limit = 6;
  const toast = useToast();

  // Material You inspired colors
  const primaryColor = useColorModeValue("teal.500", "blue.200");
  const primaryContainer = useColorModeValue("teal.100", "blue.900");
  const surfaceColor = useColorModeValue("white", "gray.800");
  const surfaceVariant = useColorModeValue("gray.50", "gray.700");
  const onSurfaceColor = useColorModeValue("gray.800", "gray.100");
  const outlineColor = useColorModeValue("gray.200", "gray.600");

  const userID = session?.user?.id || null; // Get user ID from session

  const fetchNotes = useCallback(async () => {
    if (!userID) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `/api/notes?userId=${encodeURIComponent(userID)}&skip=${
          page * limit
        }&limit=${limit}`
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to fetch notes");
      }
      const data = await res.json();

      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        setTotalNotes(data.total);
      } else {
        throw new Error("Invalid notes data structure");
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Fetch Error",
        description: (error as Error).message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  }, [userID, page, limit, toast]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotes();
    }
  }, [session, fetchNotes]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const exportToPDF = async (note: Note) => {
    try {
      // Dynamically import html2pdf when needed
      const html2pdf = (await import("html2pdf.js")).default;

      const wrapper = document.createElement("div");
      wrapper.innerHTML = `
        <style>
          body { font-family: 'Roboto', sans-serif; padding: 24px; line-height: 1.6; }
          .header { margin-bottom: 24px; }
          .title { color: #6750A4; font-size: 22px; font-weight: 500; margin-bottom: 8px; }
          .meta { font-size: 14px; color: #49454F; margin-bottom: 16px; }
          .content { font-size: 16px; line-height: 1.8; }
          strong { color: #6750A4; }
          ul { padding-left: 24px; }
          li { margin-bottom: 8px; }
        </style>
        <div class="header">
          <h1 class="title">${note.prompt}</h1>
          <div class="meta">Created on ${formatDate(note.createdAt)}</div>
        </div>
        <div class="content">${note.generated_quiz
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/^- (.*)$/gm, "<ul><li>$1</li></ul>")
          .replace(/\n{2,}/g, "<br/><br/>")
          .replace(/\n/g, "<br/>")}</div>`;

      html2pdf()
        .from(wrapper)
        .set({
          margin: [0.5, 0.5],
          filename: `${note.prompt
            .substring(0, 30)
            .replace(/\s+/g, "_")}_notes.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save();
    } catch (error) {
      console.error("PDF export failed:", error);
      toast({
        title: "Export failed",
        description: "Could not generate PDF",
        status: "error",
      });
    }
  };

  // 🧠 Helper function to extract note title
  const extractNoteTitle = (prompt: string): string => {
    // Match text between ":" and "(" to extract actual topic
    const match = prompt.match(/:\s*(.+?)\s*(?:\(|$)/);
    return match ? match[1].trim() : prompt;
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({
          title: "Note deleted",
          status: "success",
          variant: "subtle",
          position: "top",
        });
        onClose();
        fetchNotes();
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Delete failed",
        description: (error as Error).message,
        status: "error",
        variant: "subtle",
        position: "top",
      });
    }
  };

  const updateNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedContent: editedContent }),
      });
      if (res.ok) {
        toast({
          title: "Note updated",
          status: "success",
          variant: "subtle",
          position: "top",
        });

        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n._id === id ? { ...n, generated_quiz: editedContent } : n
          )
        );

        setSelectedNote((prevNote) =>
          prevNote && prevNote._id === id
            ? { ...prevNote, generated_quiz: editedContent }
            : prevNote
        );

        setEditingNoteId(null);
      } else {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
      toast({
        title: "Update failed",
        description: (error as Error).message,
        status: "error",
        variant: "subtle",
        position: "top",
      });
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack spacing={6} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading
            size="xl"
            color={primaryColor}
            fontWeight="medium"
            letterSpacing="tight"
          >
            My Notes
          </Heading>
          <Badge
            colorScheme="purple"
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
          >
            {totalNotes} total
          </Badge>
        </Flex>

        <Input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="filled"
          size="lg"
          borderRadius="full"
          bg={surfaceVariant}
          borderColor="transparent"
          _hover={{ bg: surfaceVariant }}
          _focus={{
            bg: surfaceVariant,
            borderColor: primaryColor,
            boxShadow: `0 0 0 1px ${primaryColor}`,
          }}
          px={6}
        />

        {loading ? (
          <Flex justify="center" py={12}>
            <Spinner size="xl" color={primaryColor} thickness="3px" />
          </Flex>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={5}>
            {notes
              .filter((note) =>
                note.prompt.toLowerCase().includes(search.toLowerCase())
              )
              .map((note) => (
                <Card
                  key={note._id}
                  bg={surfaceColor}
                  borderRadius="xl"
                  boxShadow="sm"
                  border="1px solid"
                  borderColor={outlineColor}
                  transition="all 0.2s"
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "md",
                  }}
                  cursor="pointer"
                  onClick={() => {
                    setSelectedNote(note);
                    setEditedContent(note.generated_quiz);
                    onOpen();
                  }}
                >
                  <CardBody p={6}>
                    <VStack spacing={3} align="stretch">
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color={onSurfaceColor}
                        noOfLines={2}
                      >
                        {extractNoteTitle(note.prompt)}
                      </Text>
                      <Text fontSize="sm" color="gray.500" fontFamily="mono">
                        {formatDate(note.createdAt)}
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
          </SimpleGrid>
        )}

        <Flex justify="center" mt={8}>
          <HStack spacing={4}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              isDisabled={page === 0}
              variant="outline"
              borderRadius="full"
              px={6}
            >
              Previous
            </Button>
            <Text fontSize="sm" color="gray.500">
              Page {page + 1} of {Math.ceil(totalNotes / limit)}
            </Text>
            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={() => setPage((p) => p + 1)}
              isDisabled={(page + 1) * limit >= totalNotes}
              variant="outline"
              borderRadius="full"
              px={6}
            >
              Next
            </Button>
          </HStack>
        </Flex>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent bg={surfaceColor} borderRadius="2xl" overflow="hidden">
          <ModalHeader
            bg={primaryContainer}
            color={primaryColor}
            py={4}
            borderBottom="1px solid"
            borderColor={outlineColor}
          >
            <Text fontWeight="medium" fontSize="xl">
              {extractNoteTitle(selectedNote?.prompt || "")}
            </Text>
            <Text fontSize="sm" color={onSurfaceColor} mt={1}>
              Created on {selectedNote && formatDate(selectedNote.createdAt)}
            </Text>
          </ModalHeader>
          <ModalCloseButton top={4} right={4} color={onSurfaceColor} />
          <ModalBody p={0}>
            <Card variant="unstyled" borderRadius={0} bg={surfaceVariant}>
              <CardBody p={6}>
                {editingNoteId === selectedNote?._id ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={12}
                    color={onSurfaceColor}
                    bg={surfaceColor}
                    borderRadius="lg"
                    borderColor={outlineColor}
                    _focus={{
                      borderColor: primaryColor,
                      boxShadow: `0 0 0 1px ${primaryColor}`,
                    }}
                    p={4}
                    fontFamily="mono"
                    fontSize="sm"
                  />
                ) : (
                  <Box
                    color={onSurfaceColor}
                    fontSize="md"
                    lineHeight="1.8"
                    fontFamily="body"
                  >
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw, rehypeHighlight]}
                      remarkPlugins={[remarkGfm]}
                    >
                      {selectedNote?.generated_quiz || ""}
                    </ReactMarkdown>
                  </Box>
                )}
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter
            bg={surfaceColor}
            borderTop="1px solid"
            borderColor={outlineColor}
            py={4}
          >
            <HStack spacing={3}>
              {editingNoteId === selectedNote?._id ? (
                <>
                  <Button
                    colorScheme="purple"
                    leftIcon={<CheckIcon />}
                    onClick={() => updateNote(selectedNote._id)}
                    borderRadius="full"
                    px={6}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<CloseIcon />}
                    onClick={() => setEditingNoteId(null)}
                    borderRadius="full"
                    px={6}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <IconButton
                    icon={<EditIcon />}
                    aria-label="Edit"
                    onClick={() =>
                      selectedNote && setEditingNoteId(selectedNote._id)
                    }
                    colorScheme="purple"
                    variant="outline"
                    borderRadius="full"
                  />
                  <IconButton
                    icon={<DownloadIcon />}
                    aria-label="Download"
                    onClick={() => {
                      if (selectedNote) {
                        exportToPDF(selectedNote).catch(console.error);
                      }
                    }}
                    colorScheme="teal"
                    variant="outline"
                    borderRadius="full"
                  />
                  <IconButton
                    icon={<DeleteIcon />}
                    aria-label="Delete"
                    onClick={() => selectedNote && deleteNote(selectedNote._id)}
                    colorScheme="red"
                    variant="outline"
                    borderRadius="full"
                  />
                </>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
