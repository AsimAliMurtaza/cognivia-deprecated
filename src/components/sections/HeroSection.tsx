"use client";

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  // Dynamic Colors
  const bg = useColorModeValue("linear(to-br, #E0F7FA, #F3E5F5)", "gray.900"); // Dark mode = solid bg
  const textColor = useColorModeValue("gray.700", "gray.200");
  const buttonBg = useColorModeValue(
    "linear(to-r, #A5D8DD, blue.400)",
    "blue.600"
  );
  const buttonHoverBg = useColorModeValue(
    "linear(to-r, blue.400, #A5D8DD)",
    "blue.500"
  );
  const outlineButtonColor = useColorModeValue("#6EC3C4", "blue.300");
  const outlineHoverBg = useColorModeValue("#E0F7FA", "gray.700");

  return (
    <>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
        bg={bg}
      >
        <Container
          maxW="container.lg"
          textAlign="center"
          position="relative"
          zIndex={1}
        >
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
              <Text fontSize="xl" color={textColor} maxW="2xl">
                Personalized, interactive, and adaptive quizzes designed just
                for you. Upgrade your learning experience with AI-powered
                insights.
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
                    bgGradient={buttonBg}
                    color="white"
                    rounded="full"
                    px={8}
                    _hover={{
                      bgGradient: buttonHoverBg,
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
                    color={outlineButtonColor}
                    borderColor={outlineButtonColor}
                    rounded="full"
                    px={8}
                    _hover={{
                      bg: outlineHoverBg,
                      transform: "scale(1.08)",
                      transition: "all 0.3s",
                    }}
                  >
                    Login
                  </Button>
                </motion.div>
              </HStack>
            </VStack>
          </motion.div>
        </Container>
      </Box>
    </>
  );
}
