// app/dashboard/notes/page.tsx
"use client";
import SmartNotesGenerator from "@/pages/NoteGenerator";
import { Box } from "@chakra-ui/react";

export default function SmartNotesPage() {
  return (
    <Box>
      <SmartNotesGenerator />;
    </Box>
  );
}
