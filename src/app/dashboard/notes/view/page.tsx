"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Spinner,
  Heading,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";

interface Note {
  userID: string;
  noteID: string;
  content: string;
}

export default function NoteViewer() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const bg = useColorModeValue("gray.100", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const noteBg = useColorModeValue("gray.50", "gray.700");
  const noteTextColor = useColorModeValue("gray.700", "gray.300");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <Box
      minW={{ base: "90%", md: "600px" }}
      mx="auto"
      mt={10}
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      bg={bg}
      border="1px solid"
      borderColor={borderColor}
      maxH="100vh"
      overflowY="auto"
    >
      <Heading
        size="lg"
        color={useColorModeValue("teal.600", "teal.300")}
        mb={4}
        textAlign="center"
        fontWeight="bold"
      >
        Your Notes
      </Heading>

      {loading ? (
        <VStack spacing={4}>
          <Spinner size="lg" color="teal.400" />
          <Text fontSize="md" color={textColor}>
            Loading notes...
          </Text>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Box
                key={note.noteID}
                p={4}
                bg={noteBg}
                borderRadius="md"
                boxShadow="md"
                border="1px solid"
                borderColor={borderColor}
                transition="all 0.2s ease-in-out"
                _hover={{ transform: "scale(1.02)", shadow: "xl" }}
              >
                <Text fontSize="sm" color="teal.400" fontWeight="bold">
                  Note ID: {note.noteID}
                </Text>
                <Divider my={2} />
                <Text fontSize="md" color={noteTextColor} whiteSpace="pre-wrap">
                  {note.content}
                </Text>
              </Box>
            ))
          ) : (
            <Text fontSize="md" color="gray.500" textAlign="center">
              No notes available.
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}
