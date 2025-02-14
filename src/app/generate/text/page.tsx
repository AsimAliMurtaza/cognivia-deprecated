"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Textarea,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function TextQuizGeneration() {
  const [prompt, setPrompt] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");

  // ✅ Move useColorModeValue calls to the top
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const boxBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("teal.300", "teal.500");
  const inputBg = useColorModeValue("gray.100", "gray.600");
  const outputBg = useColorModeValue("blue.50", "gray.600");

  const handleGenerate = async () => {
    // Placeholder for actual quiz generation logic
    setGeneratedQuiz(`Generated quiz based on prompt: ${prompt}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Box minH="100vh" bg={bgColor} py={12} borderRadius={30}>
      <Container maxW={{ base: "90%", md: "2xl" }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={6} align="stretch">
            {/* Back Button */}
            <Link href="/dashboard/quizzes" style={{ textDecoration: "none" }}>
              <HStack
                spacing={2}
                color="teal.500"
                _hover={{ color: "teal.700" }}
              >
                <Icon as={ArrowLeft} boxSize={5} />
                <Text fontWeight="medium">Back</Text>
              </HStack>
            </Link>

            {/* Quiz Input Box */}
            <Box
              bg={boxBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px solid"
              borderColor={borderColor}
            >
              <VStack spacing={5} align="stretch">
                <Heading as="h1" size="md" color="teal.500">
                  Generate Quiz from Text
                </Heading>

                <Text color={textColor} fontSize="sm">
                  Enter your text prompt below, and our AI will generate a
                  customized quiz for you.
                </Text>

                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your prompt here..."
                  minH="150px"
                  size="sm"
                  borderColor="teal.200"
                  bg={inputBg} // ✅ Use predefined variable
                  _hover={{ borderColor: "teal.300" }}
                  _focus={{
                    borderColor: "teal.500",
                    boxShadow: "0 0 0 1px teal.500",
                  }}
                  color={textColor}
                />

                {/* Generate Button */}
                <MotionButton
                  colorScheme="teal"
                  size="md"
                  isDisabled={!prompt.trim()}
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  w="full"
                >
                  Generate Quiz
                </MotionButton>

                {/* Generated Quiz Output */}
                {generatedQuiz && (
                  <MotionBox
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    bg={outputBg} // ✅ Use predefined variable
                    p={4}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <VStack align="stretch" spacing={3}>
                      <Heading as="h3" size="sm" color="teal.500">
                        Generated Quiz
                      </Heading>
                      <Text color={textColor} fontSize="sm">
                        {generatedQuiz}
                      </Text>
                      <HStack spacing={3}>
                        <MotionButton
                          variant="outline"
                          colorScheme="teal"
                          size="sm"
                          onClick={handleGenerate}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          flex={1}
                        >
                          Regenerate
                        </MotionButton>
                        <MotionButton
                          colorScheme="teal"
                          size="sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          flex={1}
                        >
                          Start Quiz
                        </MotionButton>
                      </HStack>
                    </VStack>
                  </MotionBox>
                )}
              </VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}
