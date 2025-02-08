"use client";

import { Box, Button, Heading, Text, VStack, Flex, useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SignInErrorPage() {
  const router = useRouter();

  // Soft pastel colors
  const cardBg = useColorModeValue("white", "white");
  const buttonBg = useColorModeValue("#6EC3C4", "#5AA8A9"); // Soft teal
  const buttonHoverBg = useColorModeValue("#5AA8A9", "#4A8C8D"); // Darker teal
  const errorColor = useColorModeValue("red.500", "red.300");

  return (
    <Flex
      minH="100vh"
      bgGradient="linear(to-br, #E0F7FA, #F3E5F5)" // Soft pastel gradient
      justify="center"
      align="center"
      p={4}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack
          spacing={6}
          p={8}
          borderRadius="2xl"
          boxShadow="2xl"
          bg={cardBg}
          textAlign="center"
          maxW="400px"
          w="full"
        >
          <Heading size="xl" color={errorColor} fontWeight="bold">
            Sign-In Error
          </Heading>
          <Text fontSize="md" color="gray.600">
            Oops! Something went wrong with your sign-in. Please check your
            credentials and try again.
          </Text>

          <VStack spacing={4} w="full">
            <Button
              onClick={() => router.push("/login")}
              bg={buttonBg}
              color="white"
              _hover={{ bg: buttonHoverBg, transform: "scale(1.05)" }}
              _active={{ bg: "#4A8C8D" }}
              w="full"
              size="lg"
              transition="all 0.2s"
            >
              Back to Login
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              color={buttonBg}
              borderColor={buttonBg}
              _hover={{ bg: "#E0F7FA", transform: "scale(1.05)" }}
              _active={{ bg: "#D1E8E8" }}
              w="full"
              size="lg"
              transition="all 0.2s"
            >
              Go to Home
            </Button>
          </VStack>
        </VStack>
      </motion.div>
    </Flex>
  );
}