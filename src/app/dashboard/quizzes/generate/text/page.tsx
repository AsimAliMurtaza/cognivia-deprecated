"use client";

import { useEffect, useState } from "react";
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
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { ArrowLeft, Coins } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuizStore } from "@/hooks/useQuizStore";
import { FaCheckCircle } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionCard = motion(Card);

const TextQuizGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);

  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

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
  const badgeBg = useColorModeValue("teal.100", "teal.800");
  const badgeColor = useColorModeValue("teal.800", "teal.100");

  const fetchCredits = async () => {
    try {
      if (!session?.user?.id) return;
      
      setCreditsLoading(true);
      const response = await fetch("/api/credits/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }

      const data = await response.json();
      setCredits(data.credits);
    } catch (error) {
      console.error("Error fetching credits:", error);
      toast({
        title: "Error",
        description: "Could not load credits information",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setCreditsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [session?.user?.id, toast]);

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

    // Check if user has enough credits
    if (credits !== null && credits < 10) {
      toast({
        title: "Insufficient credits",
        description: "You need at least 10 credits to generate a quiz",
        status: "error",
        duration: 5000,
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
          Authorization: `Bearer ${session?.user?.accessToken}`,
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
        const formattedQuiz = data.questions
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
                      `${String.fromCharCode(65 + optionIndex)}. ${option}`
                  )
                  .join("\n")
              : "No options available.";
            return `${index + 1}. ${question}\n${optionsText}`;
          })
          .join("\n\n");

        setGeneratedQuiz(formattedQuiz);
        console.log("Quiz ID :", data.quizId);
        useQuizStore.setState({
          quizData: {
            _id: data.quizId,
            topic: prompt,
            questions: data.questions,
            options: data.options,
            answers: data.answers,
            userID: session?.user?.id as string,
            isTaken: data.isTaken,
          },
        });

        // Update credits locally immediately
        setCredits(prev => (prev !== null ? prev - 10 : prev));
        
        // Refresh credits from server to confirm
        await fetchCredits();
        
        onOpen();
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

  return (
    <Box minH="100vh" bg={bg} py={4} px={{ base: 6, md: 4 }}>
      <Container maxW="container.xl">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Flex justify="space-between" align="center" mb={6}>
            <MotionBox variants={itemVariants}>
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

            <MotionBox variants={itemVariants}>
              {creditsLoading ? (
                <Spinner size="sm" color={accent} />
              ) : (
                <Badge
                  display="flex"
                  alignItems="center"
                  gap={2}
                  px={4}
                  py={2}
                  borderRadius="full"
                  bg={badgeBg}
                  color={badgeColor}
                  fontSize="md"
                  fontWeight="semibold"
                >
                  <Icon as={Coins} boxSize={5} />
                  {credits !== null ? credits : "N/A"} Credits
                </Badge>
              )}
            </MotionBox>
          </Flex>
          <Grid templateColumns="1fr" gap={8}>
            {/* Input Card */}
            <MotionCard
              bg={surface}
              borderRadius="xl"
              overflow="hidden"
              boxShadow="md"
              variants={itemVariants}
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
                  you. (Costs 10 credits per generation)
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
                      isDisabled={!prompt.trim() || loading || (credits !== null && credits < 10)}
                      isLoading={loading}
                      loadingText="Generating..."
                      width="full"
                      py={6}
                      borderRadius="full"
                      fontWeight="medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Generate Quiz (10 Credits)
                    </MotionButton>
                  </MotionBox>
                </VStack>
              </CardBody>
            </MotionCard>
          </Grid>

          {/* Quiz Preview Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
            <ModalOverlay backdropFilter="blur(5px)" />
            <ModalContent bg={surface} borderRadius="2xl" overflow="hidden">
              <ModalHeader>
                <Heading size="lg" color={primary}>
                  Your Generated Quiz
                </Heading>
                <Text fontSize="sm" color={secondary} mt={1}>
                  Review your quiz before starting
                </Text>
              </ModalHeader>
              <ModalCloseButton />
              <Divider borderColor={border} />
              <ModalBody py={6}>
                <VStack align="stretch" spacing={4}>
                  <HStack align="start" spacing={3}>
                    <Icon
                      as={FaCheckCircle}
                      boxSize={5}
                      color={success}
                      mt={1}
                    />
                    <Text fontSize="md" lineHeight="tall">
                      <Text as="span" fontWeight="semibold">
                        Your quiz is ready!
                      </Text>{" "}
                      Review the questions below.
                    </Text>
                  </HStack>
                  <Box
                    bg={inputBg}
                    p={6}
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor={border}
                    maxH="60vh"
                    overflowY="auto"
                    color={onSurface}
                  >
                    <Text
                      fontSize="sm"
                      lineHeight="relaxed"
                      whiteSpace="pre-wrap"
                    >
                      {generatedQuiz}
                    </Text>
                  </Box>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack spacing={4}>
                  <MotionButton
                    variant="outline"
                    colorScheme={buttonBg}
                    onClick={async () => {
                      onClose();
                      await handleGenerate();
                    }}
                    isDisabled={credits !== null && credits < 10}
                    borderRadius="full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Regenerate (10 Credits)
                  </MotionButton>
                  <MotionButton
                    colorScheme={buttonBg}
                    onClick={() => {
                      onClose();
                      const type = "text";
                      router.push(`/dashboard/quizzes/conduction/${type}`);
                    }}
                    borderRadius="full"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start Quiz
                  </MotionButton>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default TextQuizGeneration;