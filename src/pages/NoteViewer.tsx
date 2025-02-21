"use client";

import { useState, useEffect } from "react";
import { Box, Text, VStack, Spinner, Heading } from "@chakra-ui/react";

interface Note {
  userID: string;
  noteID: string;
  content: string;
}

export default function NoteViewer() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

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
    <Box maxW="600px" mx="auto" mt={10} p={5} borderRadius="lg" boxShadow="md" bg="gray.700">
      <Heading size="lg" color="teal.300" mb={4} textAlign="center">
        Your Notes
      </Heading>

      {loading ? (
        <VStack>
          <Spinner size="lg" color="teal.400" />
          <Text color="gray.300">Loading notes...</Text>
        </VStack>
      ) : (
        <VStack spacing={4} align="stretch">
          {notes.length > 0 ? (
            notes.map((note) => (
              <Box key={note.noteID} p={4} bg="gray.600" borderRadius="md" boxShadow="sm">
                <Text color="teal.200" fontWeight="bold">
                  Note ID: {note.noteID}
                </Text>
                <Text color="gray.200">{note.content}</Text>
              </Box>
            ))
          ) : (
            <Text color="gray.400" textAlign="center">
              No notes available.
            </Text>
          )}
        </VStack>
      )}
    </Box>
  );
}
