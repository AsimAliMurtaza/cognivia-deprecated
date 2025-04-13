"use client";

import React, { useEffect, useState } from "react";
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
  Divider,
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
  VStack,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EditIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
  CopyIcon,
  CheckIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import html2pdf from "html2pdf.js";

export default function ViewNotesPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [totalNotes, setTotalNotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [page, setPage] = useState(0);
  const [selectedNote, setSelectedNote] = useState<any | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const limit = 6;
  const toast = useToast();

  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const contentBg = useColorModeValue("gray.50", "gray.700");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/notes?skip=${page * limit}&limit=${limit}`
      );
      const data = await res.json();
      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
        setTotalNotes(data.total);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      toast({
        title: "Error",
        description: "Unable to fetch notes from server.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [page]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  };

  const exportToPDF = (note: any) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <style>
        body { font-family: 'Arial', sans-serif; padding: 40px; line-height: 1.6; font-size: 14px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #2c7a7b; font-size: 24px; margin-bottom: 10px; }
        .meta { font-size: 12px; color: #666; margin-bottom: 20px; text-align: center; }
        .section-title { font-weight: bold; font-size: 16px; color: #2c7a7b; margin-top: 20px; margin-bottom: 10px; }
        .content { white-space: pre-wrap; }
      </style>
      <body>
        <div class="header"><h1>${note.prompt}</h1></div>
        <div class="meta"><strong>Generated on:</strong> ${formatDate(note.createdAt)}</div>
        <div class="section-title">Generated Notes:</div>
        <div class="content">${note.generated_quiz.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/^- (.*)$/gm, "<ul><li>$1</li></ul>").replace(/\n{2,}/g, "<br/><br/>").replace(/\n/g, "<br/>")}</div>
      </body>`;
    html2pdf().from(wrapper).set({
      margin: [0.5, 0.5],
      filename: `${note.prompt.replace(/\s+/g, "_")}_notes.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    }).save();
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/notes/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast({ title: "Deleted", description: "Note deleted.", status: "success" });
        fetchNotes();
        onClose();
      }
    } catch {
      toast({ title: "Error", description: "Delete failed.", status: "error" });
    }
  };

  const updateNote = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updatedContent: editedContent }),
      });
      if (res.ok) {
        toast({ title: "Saved", description: "Note updated.", status: "success" });
  
        // Update local notes array
        setNotes((prevNotes) =>
          prevNotes.map((n) =>
            n._id === id ? { ...n, generated_quiz: editedContent } : n
          )
        );
  
        // Update modal content immediately
        setSelectedNote((prevNote: any) =>
          prevNote && prevNote._id === id
            ? { ...prevNote, generated_quiz: editedContent }
            : prevNote
        );
  
        setEditingNoteId(null);
      }
    } catch {
      toast({ title: "Error", description: "Update failed.", status: "error" });
    }
  };
  

  return (
    <Container maxW="7xl" py={10}>
      <Heading size="2xl" color={titleColor} mb={6} textAlign="center">
        Your Saved Notes
      </Heading>
      <Input
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={6}
        variant="filled"
        size="lg"
        bg={bgCard}
        borderColor={borderColor}
      />

      {loading ? (
        <Box textAlign="center" py={10}><Spinner size="xl" color="teal.500" /></Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {notes
            .filter((note) => note.prompt.toLowerCase().includes(search.toLowerCase()))
            .map((note) => (
              <Box
                key={note._id}
                bg={bgCard}
                borderRadius="2xl"
                boxShadow="lg"
                p={6}
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                onClick={() => { setSelectedNote(note); setEditedContent(note.generated_quiz); onOpen(); }}
              >
                <Text fontSize="lg" fontWeight="bold" color={titleColor} noOfLines={2}>
                  {note.prompt}
                </Text>
                <Text fontSize="sm" color="gray.500">{formatDate(note.createdAt)}</Text>
              </Box>
            ))}
        </SimpleGrid>
      )}

      <HStack mt={10} justify="center">
        <Button leftIcon={<ArrowLeftIcon />} onClick={() => setPage((p) => Math.max(0, p - 1))} isDisabled={page === 0}>
          Previous
        </Button>
        <Text>Page {page + 1} of {Math.ceil(totalNotes / limit)}</Text>
        <Button rightIcon={<ArrowRightIcon />} onClick={() => setPage((p) => p + 1)} isDisabled={(page + 1) * limit >= totalNotes}>
          Next
        </Button>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent bg={bgCard} borderRadius="2xl">
          <ModalHeader color={titleColor} fontSize="xl">
            <Text as="i" fontWeight="bold">{selectedNote?.prompt}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Card variant="outline" bg={contentBg} borderColor={borderColor} p={6}>
              <CardBody>
                {editingNoteId === selectedNote?._id ? (
                  <Textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={12}
                    color={textColor}
                    whiteSpace="pre-wrap"
                  />
                ) : (
                  <Box color={textColor} fontSize="sm">
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
          <ModalFooter>
            <HStack spacing={3}>
              {editingNoteId === selectedNote?._id ? (
                <>
                  <Button colorScheme="green" leftIcon={<CheckIcon />} onClick={() => updateNote(selectedNote._id)}>Save</Button>
                  <Button colorScheme="gray" leftIcon={<CloseIcon />} onClick={() => setEditingNoteId(null)}>Cancel</Button>
                </>
              ) : (
                <>
                  <IconButton icon={<EditIcon />} aria-label="Edit" onClick={() => setEditingNoteId(selectedNote._id)} colorScheme="blue" />
                  <IconButton icon={<DownloadIcon />} aria-label="Download" onClick={() => exportToPDF(selectedNote)} colorScheme="green" />
                  <IconButton icon={<DeleteIcon />} aria-label="Delete" onClick={() => deleteNote(selectedNote._id)} colorScheme="red" />
                </>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}