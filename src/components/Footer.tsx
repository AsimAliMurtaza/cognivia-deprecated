"use client";

import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box textAlign="center" py={6} color="gray.600" bg="gray.100" borderTopRadius="xl">
      &copy; {new Date().getFullYear()} Cognivia. All rights reserved.
    </Box>
  );
}
