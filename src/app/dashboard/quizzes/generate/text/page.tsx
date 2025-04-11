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
  useColorModeValue,
  Spinner,
  useToast,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

export default function TextQuizGeneration() {
  const [prompt, setPrompt] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  // Material You inspired colors with teal/blue theming
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("teal", "blue");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const secondaryText = useColorModeValue("gray.600", "gray.300");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const accentColor = useColorModeValue("teal.500", "blue.400");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter some text to generate a quiz",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setGeneratedQuiz("");
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/ask?query=${encodeURIComponent(prompt)}`
      );
      if (!response.ok) {
        throw new Error("Failed to generate quiz");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let fullText = "";
      while (true) {
        const { value, done } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        // Update state progressively for streaming effect
        setGeneratedQuiz((prev) => prev + chunk);
        console.log(fullText);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error generating quiz",
        description: "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setGeneratedQuiz("");
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // const cardVariants = {
  //   hover: { y: -2, boxShadow: "lg" },
  //   tap: { y: 1 },
  // };

  const gridTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW={{ base: "95%", md: "4xl", lg: "6xl" }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={6} align="stretch">
            <MotionBox variants={itemVariants}>
              <Button
                as={Link}
                href="/dashboard/quizzes"
                leftIcon={<ArrowLeft size={20} />}
                variant="ghost"
                colorScheme={primaryColor}
                size="sm"
                px={2}
                _hover={{ bg: "transparent", textDecoration: "underline" }}
              >
                Back to quizzes
              </Button>
            </MotionBox>

            <MotionGrid
              templateColumns={{
                base: "1fr",
                md: generatedQuiz || loading ? "1fr 1fr" : "1fr",
              }}
              gap={6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={gridTransition}
            >
              {/* Input Card - Always shown */}
              <MotionGridItem
                colSpan={1}
                initial={{ x: 0 }}
                animate={{
                  x: (generatedQuiz || loading) ? 0 : 0,
                }}
                transition={gridTransition}
              >
                <MotionCard
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  whileTap="tap"
                  bg={cardBg}
                  borderRadius="xl"
                  overflow="hidden"
                  boxShadow="sm"
                  h="full"
                >
                  <CardHeader pb={0}>
                    <Heading
                      as="h1"
                      size="lg"
                      fontWeight="semibold"
                      color={accentColor}
                    >
                      Generate Quiz from Text
                    </Heading>
                    <Text color={secondaryText} fontSize="sm" mt={2}>
                      Enter your text below and our AI will create a customized quiz
                    </Text>
                  </CardHeader>

                  <CardBody>
                    <VStack spacing={5} align="stretch">
                      <MotionBox variants={itemVariants}>
                        <Textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Example: Create a 5-question quiz about React hooks..."
                          minH="180px"
                          size="md"
                          borderColor={borderColor}
                          bg={inputBg}
                          _hover={{ borderColor: accentColor }}
                          _focus={{
                            borderColor: accentColor,
                            boxShadow: `0 0 0 1px ${accentColor}`,
                          }}
                          color={textColor}
                          borderRadius="lg"
                          fontSize="md"
                        />
                      </MotionBox>

                      <MotionBox variants={itemVariants}>
                        <MotionButton
                          colorScheme={primaryColor}
                          size="md"
                          onClick={handleGenerate}
                          isDisabled={!prompt.trim() || loading}
                          isLoading={loading}
                          loadingText="Generating..."
                          width="full"
                          py={6}
                          borderRadius="lg"
                          fontWeight="medium"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          Generate Quiz
                        </MotionButton>
                      </MotionBox>
                    </VStack>
                  </CardBody>
                </MotionCard>
              </MotionGridItem>

              {/* Output Card - Only shown when generating or has content */}
              <AnimatePresence>
                {(generatedQuiz || loading) && (
                  <MotionGridItem
                    colSpan={1}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={gridTransition}
                  >
                    <MotionCard
                      bg={cardBg}
                      borderRadius="xl"
                      boxShadow="sm"
                      h="full"
                    >
                      <CardHeader>
                        <Heading
                          as="h2"
                          size="md"
                          fontWeight="semibold"
                          color={accentColor}
                        >
                          {loading ? "Generating Quiz..." : "Your Generated Quiz"}
                        </Heading>
                      </CardHeader>
                      <Divider borderColor={borderColor} />
                      <CardBody>
                        {loading ? (
                          <VStack spacing={4} py={8} minH="200px">
                            <Spinner
                              size="xl"
                              color={accentColor}
                              thickness="3px"
                            />
                            <Text color={secondaryText}>
                              AI is creating your quiz...
                            </Text>
                          </VStack>
                        ) : (
                          <VStack align="stretch" spacing={4}>
                            <Box
                              bg={inputBg}
                              p={4}
                              borderRadius="lg"
                              borderWidth="1px"
                              borderColor={borderColor}
                              minH="200px"
                            >
                              <Text
                                color={textColor}
                                whiteSpace="pre-wrap"
                                fontSize="md"
                                lineHeight="tall"
                              >
                                {generatedQuiz}
                              </Text>
                            </Box>

                            <HStack spacing={3} mt={4}>
                              <MotionButton
                                variant="outline"
                                colorScheme={primaryColor}
                                size="md"
                                onClick={handleGenerate}
                                flex={1}
                                borderRadius="lg"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                Regenerate
                              </MotionButton>
                              <MotionButton
                                colorScheme={primaryColor}
                                size="md"
                                flex={1}
                                borderRadius="lg"
                                onClick={() => {
                                  const type = "text";
                                  router.push(
                                    `/dashboard/quizzes/conduction/${type}`
                                  );
                                }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                                Start Quiz
                              </MotionButton>
                            </HStack>
                          </VStack>
                        )}
                      </CardBody>
                    </MotionCard>
                  </MotionGridItem>
                )}
              </AnimatePresence>
            </MotionGrid>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
}