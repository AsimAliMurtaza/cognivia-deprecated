"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 100, damping: 10 }}
    >
      <Box
        maxW="sm"
        p={6}
        borderRadius="xl"
        boxShadow="md"
        bg="white"
        _hover={{ boxShadow: "xl" }}
      >
        <Heading size="md" color="blue.600">{title}</Heading>
        <Text color="gray.700" mt={2}>{description}</Text>
      </Box>
    </motion.div>
  );
}
