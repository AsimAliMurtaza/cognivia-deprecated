"use client";

import { Box, Container, VStack, Heading, Text, HStack, Button } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
      bgGradient="linear(to-br, #E0F7FA, #F3E5F5)" // Soft pastel gradient
    >
      <Container maxW="container.lg" textAlign="center" position="relative" zIndex={1}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <VStack spacing={8}>
            {/* Title */}
            <Heading
              size="2xl"
              fontWeight="bold"
              bgGradient="linear(to-r, blue.400, #A5D8DD)"
              bgClip="text"
              lineHeight="1.2"
            >
              AI-Powered Quizzes for Smarter Learning
            </Heading>

            {/* Subtitle */}
            <Text fontSize="xl" color="gray.700" maxW="2xl">
              Personalized, interactive, and adaptive quizzes designed just for you.
              Upgrade your learning experience with AI-powered insights.
            </Text>

            {/* Call-to-Action Buttons */}
            <HStack spacing={6}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => router.push("/signup")}
                  size="lg"
                  bgGradient="linear(to-r, #A5D8DD, blue.400)"
                  color="white"
                  rounded="full"
                  px={8}
                  _hover={{
                    bgGradient: "linear(to-r, blue.400, #A5D8DD)",
                    transform: "scale(1.08)",
                    transition: "all 0.3s",
                  }}
                >
                  Get Started
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  variant="outline"
                  color="#6EC3C4"
                  borderColor="#6EC3C4"
                  rounded="full"
                  px={8}
                  _hover={{ bg: "#E0F7FA", transform: "scale(1.08)", transition: "all 0.3s" }}
                >
                  Login
                </Button>
              </motion.div>
            </HStack>
          </VStack>
        </motion.div>
      </Container>
    </Box>
  );
}
