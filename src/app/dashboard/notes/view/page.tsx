// app/dashboard/notes/page.tsx
"use client";
import NoteViewer from "@/pages/NoteViewer";
import { Box, Button } from "@chakra-ui/react";

export default function ViewNotesPage() {
  return (
    <Box pt="20px">
      <NoteViewer />
    </Box>
  );
}
