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
  Icon,
} from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuizStore } from "@/hooks/useQuizStore";
import { FaCheckCircle } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

const TextQuizGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  // 🎨 Material You inspired colors with teal/blue theming
  const bg = useColorModeValue("gray.50", "gray.900");
  const surface = useColorModeValue("white", "gray.800");
  const primary = useColorModeValue("teal.600", "blue.400");
  const buttonBg = useColorModeValue("teal", "blue");
  const onSurface = useColorModeValue("gray.700", "gray.300");
  const secondary = useColorModeValue("gray.500", "gray.400");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const border = useColorModeValue("gray.200", "gray.600");
  const accent = useColorModeValue("teal.500", "blue.500");
  const success = useColorModeValue("green.500", "green.400");

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
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, userID: session?.user?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        if (response.status === 402 && errorData.redirectToPricing) {
          router.push("/dashboard/pricing");
        } else {
          throw new Error(errorData?.error || "Failed to generate quiz");
        }
      }

      const data = await response.json();
      if (data.questions && data.options && data.answers) {
        setGeneratedQuiz(
          data.questions
            .map((question: string, index: number) => {
              interface QuizData {
                questions: string[];
                options: string[][];
                answers: string[];
              }

              const optionsText = (data as QuizData).options[index]
                ? (data as QuizData).options[index]
                    .map(
                      (option: string, optionIndex: number) =>
                        `${String.fromCharCode(65 + optionIndex)} ${option} \n`
                    )
                    .join("   ") // Display options horizontally with more spacing
                : "No options available.";
              return `${index + 1}. ${question}\n   ${optionsText}`;
            })
            .join("\n\n")
        );
        console.log("Quiz ID :", data.quizId); // Log the quiz ID
        useQuizStore.setState({
          quizData: {
            _id: data.quizId,
            topic: prompt,
            questions: data.questions,
            options: data.options,
            answers: data.answers,
            userID: session?.user?.id as string,
          },
        });
      }
      setLoading(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error generating quiz",
        description: (error as Error).message || "Please try again later",
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
      transition: { duration: 0.4, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  const gridTransition = {
    type: "spring",
    stiffness: 80,
    damping: 20,
  };

  return (
    <Box minH="100vh" bg={bg} py={4} px={{ base: 6, md: 4 }}>
      <Container maxW="container.xl">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <MotionBox variants={itemVariants} mb={6}>
            <Button
              as={Link}
              href="/dashboard/quizzes"
              leftIcon={<ArrowLeft size={20} />}
              variant="ghost"
              color={onSurface}
              size="md"
              borderRadius="full"
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
              _focus={{ boxShadow: "outline" }}
            >
              Back to Quizzes
            </Button>
          </MotionBox>

          <MotionGrid
            templateColumns={{
              base: "1fr",
              md: generatedQuiz || loading ? "1fr 1fr" : "1fr",
            }}
            gap={8}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={gridTransition}
          >
            {/* Input Card */}
            <MotionGridItem colSpan={1} variants={itemVariants}>
              <MotionCard
                bg={surface}
                borderRadius="xl"
                overflow="hidden"
                boxShadow="md"
                h="full"
              >
                <CardHeader pb={3}>
                  <Heading
                    as="h1"
                    size="xl"
                    fontWeight="semibold"
                    color={primary}
                    letterSpacing="tight"
                  >
                    Generate a Quiz from Text
                  </Heading>
                  <Text color={secondary} fontSize="md" mt={2}>
                    Provide any text, and our AI will craft a tailored quiz for
                    you.
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <MotionBox variants={itemVariants}>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter text here (e.g., a chapter from a book, lecture notes)..."
                        minH="200px"
                        size="lg"
                        borderColor={border}
                        bg={inputBg}
                        color={onSurface}
                        borderRadius="lg"
                        fontSize="md"
                        _hover={{ borderColor: accent }}
                        _focus={{
                          borderColor: accent,
                          boxShadow: `0 0 0 1px ${accent}`,
                        }}
                      />
                    </MotionBox>
                    <MotionBox variants={itemVariants}>
                      <MotionButton
                        colorScheme={buttonBg}
                        size="lg"
                        onClick={handleGenerate}
                        isDisabled={!prompt.trim() || loading}
                        isLoading={loading}
                        loadingText="Generating..."
                        width="full"
                        py={6}
                        borderRadius="full"
                        fontWeight="medium"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Generate Quiz
                      </MotionButton>
                    </MotionBox>
                  </VStack>
                </CardBody>
              </MotionCard>
            </MotionGridItem>

            {/* Output Card */}
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
                    bg={surface}
                    borderRadius="xl"
                    boxShadow="md"
                    h="full"
                  >
                    <CardHeader>
                      <Heading
                        as="h2"
                        size="lg"
                        fontWeight="semibold"
                        color={primary}
                        letterSpacing="tight"
                      >
                        {loading ? "Generating Quiz..." : "Generated Quiz"}
                      </Heading>
                    </CardHeader>
                    <Divider borderColor={border} />
                    <CardBody>
                      {loading ? (
                        <VStack spacing={6} py={12} align="center">
                          <Spinner size="xl" color={accent} thickness="4px" />
                          <Text color={secondary} fontSize="lg">
                            The AI is working its magic...
                          </Text>
                        </VStack>
                      ) : (
                        <VStack align="stretch" spacing={6}>
                          <Box
                            bg={inputBg}
                            p={6}
                            borderRadius="xl"
                            borderWidth="1px"
                            borderColor={border}
                            minH="250px"
                            maxH="400px"
                            overflowY="auto"
                            color={onSurface}
                            boxShadow="inner"
                          >
                            <HStack align="start" spacing={3}>
                              <Icon
                                as={FaCheckCircle}
                                boxSize={5}
                                color={success}
                                mt={1}
                              />
                              <Text
                                fontSize="md"
                                lineHeight="tall"
                                whiteSpace="pre-wrap"
                              >
                                <Text as="span" fontWeight="semibold">
                                  Your quiz is ready!
                                </Text>{" "}
                                Review the questions below. Click &quot;Start
                                Quiz&quot; when you&apos;re ready.
                              </Text>
                            </HStack>
                            <Divider
                              my={4}
                              borderColor={border}
                              opacity={0.5}
                            />
                            <Text
                              fontSize="sm"
                              lineHeight="relaxed"
                              whiteSpace="pre-wrap"
                            >
                              {generatedQuiz}
                            </Text>
                          </Box>
                          <HStack spacing={4} justify="end">
                            <MotionButton
                              variant="outline"
                              colorScheme={buttonBg}
                              size="md"
                              onClick={handleGenerate}
                              borderRadius="full"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                            >
                              Regenerate
                            </MotionButton>
                            <MotionButton
                              colorScheme={buttonBg}
                              size="md"
                              borderRadius="full"
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
        </MotionBox>
      </Container>
    </Box>
  );
};

export default TextQuizGeneration;
