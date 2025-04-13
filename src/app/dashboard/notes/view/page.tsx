"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
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
  Collapse,
} from "@chakra-ui/react";
import {
  DeleteIcon,
  EditIcon,
  CheckIcon,
  CloseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DownloadIcon,
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
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const limit = 6;

  const toast = useToast();

  const bgCard = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const titleColor = useColorModeValue("teal.600", "teal.300");
  const textColor = useColorModeValue("gray.800", "gray.200");

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
    } catch (error) {
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

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/notes/${noteId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast({
          title: "Deleted",
          description: "Note deleted successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchNotes();
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const startEditing = (noteId: string, content: string) => {
    setEditingNoteId(noteId);
    setEditedContent(content);
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditedContent("");
  };

  const saveEdit = async (noteId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedContent: editedContent }),
      });

      if (res.ok) {
        toast({
          title: "Saved",
          description: "Note updated successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        cancelEditing();
        fetchNotes();
      } else {
        throw new Error("Failed to update note");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update note.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const exportToPDF = (note: any) => {
    const wrapper = document.createElement("div");
  
    wrapper.innerHTML = `
      <style>
        body {
          font-family: 'Arial', sans-serif;
          color: #333;
          padding: 40px;
          line-height: 1.6;
          font-size: 14px;
        }
  
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
  
        .header h1 {
          color: #2c7a7b;
          font-size: 24px;
          margin-bottom: 10px;
        }
  
        .meta {
          font-size: 12px;
          color: #666;
          margin-bottom: 20px;
          text-align: center;
        }
  
        .section-title {
          font-weight: bold;
          font-size: 16px;
          color: #2c7a7b;
          margin-top: 20px;
          margin-bottom: 10px;
        }
  
        .content {
          white-space: pre-wrap;
        }
  
        ul {
          padding-left: 20px;
        }
  
        ul li {
          margin-bottom: 4px;
        }
  
        strong {
          font-weight: bold;
        }
      </style>
  
      <body>
        <div class="header">
          <h1>${note.prompt}</h1>
        </div>
  
        <div class="meta">
          <strong>Generated on:</strong> ${formatDate(note.createdAt)}
        </div>
  
        <div class="section-title">Generated Notes:</div>
        <div class="content">
          ${note.generated_quiz
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/^- (.*)$/gm, "<ul><li>$1</li></ul>")
            .replace(/\n{2,}/g, "<br/><br/>")
            .replace(/\n/g, "<br/>")}
        </div>
      </body>
    `;
  
    html2pdf()
      .from(wrapper)
      .set({
        margin: [0.5, 0.5],
        filename: `${note.prompt.replace(/\s+/g, "_")}_notes.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  return (
    <Container maxW="7xl" py={10}>
      <Heading size="2xl" color={titleColor} mb={6} textAlign="center">
        Your Saved Notes
      </Heading>

      <Input
        placeholder="Search notes by prompt..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        mb={6}
        variant="filled"
        size="lg"
        bg={bgCard}
        borderColor={borderColor}
      />

      {loading ? (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" color="teal.500" />
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {notes
            .filter((note) =>
              note.prompt.toLowerCase().includes(search.toLowerCase())
            )
            .map((note) => {
              const isExpanded = note._id === expandedNoteId;
              return (
                <Box
                  key={note._id}
                  bg={bgCard}
                  borderRadius="2xl"
                  boxShadow="lg"
                  p={6}
                  border="1px solid"
                  borderColor={borderColor}
                  cursor="pointer"
                  onClick={() =>
                    setExpandedNoteId(isExpanded ? null : note._id)
                  }
                >
                  <HStack justify="space-between" mb={3}>
                    <Box>
                      <Text
                        fontSize="xl"
                        fontWeight="bold"
                        fontStyle="italic"
                        color={titleColor}
                        noOfLines={2}
                      >
                        {note.prompt}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDate(note.createdAt)}
                      </Text>
                    </Box>

                    {isExpanded && (
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Export PDF"
                          icon={<DownloadIcon />}
                          colorScheme="green"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            exportToPDF(note);
                          }}
                        />
                        <IconButton
                          aria-label="Edit Note"
                          icon={<EditIcon />}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(note._id, note.generated_quiz);
                          }}
                        />
                        <IconButton
                          aria-label="Delete Note"
                          icon={<DeleteIcon />}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note._id);
                          }}
                        />
                      </HStack>
                    )}
                  </HStack>

                  <Collapse in={isExpanded} animateOpacity>
                    <Divider my={3} />

                    {editingNoteId === note._id ? (
                      <>
                        <Textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          color={textColor}
                          mb={4}
                          whiteSpace="pre-wrap"
                          rows={10}
                        />
                        <HStack>
                          <Button
                            leftIcon={<CheckIcon />}
                            colorScheme="green"
                            onClick={() => saveEdit(note._id)}
                          >
                            Save
                          </Button>
                          <Button
                            leftIcon={<CloseIcon />}
                            colorScheme="gray"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </HStack>
                      </>
                    ) : (
                      <Box color={textColor} fontSize="sm">
                        <ReactMarkdown
                          rehypePlugins={[rehypeRaw, rehypeHighlight]}
                          remarkPlugins={[remarkGfm]}
                        >
                          {note.generated_quiz}
                        </ReactMarkdown>
                      </Box>
                    )}
                  </Collapse>
                </Box>
              );
            })}
        </SimpleGrid>
      )}

      <HStack mt={10} justify="center">
        <Button
          leftIcon={<ArrowLeftIcon />}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          isDisabled={page === 0}
        >
          Previous
        </Button>
        <Text>
          Page {page + 1} of {Math.ceil(totalNotes / limit)}
        </Text>
        <Button
          rightIcon={<ArrowRightIcon />}
          onClick={() => setPage((p) => p + 1)}
          isDisabled={(page + 1) * limit >= totalNotes}
        >
          Next
        </Button>
      </HStack>
    </Container>
  );
}
