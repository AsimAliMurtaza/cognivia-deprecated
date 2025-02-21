// app/dashboard/notes/page.tsx
"use client";
import { Box, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function SmartNotesPage() {
  const router = useRouter();

  return (
    <Box pt="20px">
      <Button onClick={() => router.push("/dashboard/notes/generate")}>
        Generate Notes
      </Button>
      <Button onClick={() => router.push("/dashboard/notes/view")}>
        View Notes
      </Button>
    </Box>
  );
}
