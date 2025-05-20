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
  GridItem,
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
  Select,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { ArrowLeft, Coins } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuizStore } from "@/hooks/useQuizStore";
import { FaCheckCircle } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionCard = motion(Card);
const MotionGrid = motion(Grid);
const MotionGridItem = motion(GridItem);

const difficultyOptions = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

const questionCountOptions = [
  { value: 5, label: "5 Questions" },
  { value: 10, label: "10 Questions" },
  { value: 15, label: "15 Questions" },
  { value: 20, label: "20 Questions" },
];

const TextQuizGeneration = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [credits, setCredits] = useState<number | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionCount, setQuestionCount] = useState(10);

  const toast = useToast();
  const router = useRouter();
  const { data: session } = useSession();

  // Modern color scheme
  // const bg = useColorModeValue("gray.50", "gray.900");
  // const surface = useColorModeValue("white", "gray.800");
  // const primary = useColorModeValue("#4F46E5", "#7C73E6"); // Indigo/violet
  // const primary = useColorModeValue("#4F46E5", "#7C73E6"); // Indigo/violet
  // const buttonBg = useColorModeValue("#4F46E5", "#7C73E6");
  // const onSurface = useColorModeValue("gray.700", "gray.200");
  // const secondary = useColorModeValue("gray.500", "gray.400");
  // const inputBg = useColorModeValue("gray.50", "gray.700");
  // const border = useColorModeValue("gray.200", "gray.600");
  // const accent = useColorModeValue("#4F46E5", "#7C73E6");
  // const success = useColorModeValue("#10B981", "#34D399");
  // const badgeBg = useColorModeValue("#E0E7FF", "#3730A3");
  // const badgeColor = useColorModeValue("#4F46E5", "#E0E7FF");
  // const selectBg = useColorModeValue("white", "gray.700");

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
  const selectBg = useColorModeValue("white", "gray.700");
  const buttonColor = useColorModeValue("teal", "blue.400");

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
        body: JSON.stringify({
          prompt,
          userID: session?.user?.id,
          difficulty,
          questionCount,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 402 && errorData.redirectToPricing) {
          router.push("/dashboard/pricing");
          return;
        }
        throw new Error(errorData?.error || "Failed to generate quiz");
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
        useQuizStore.setState({
          quizData: {
            _id: data.quizId,
            topic: prompt,
            questions: data.questions,
            options: data.options,
            answers: data.answers,
            userID: session?.user?.id as string,
            difficulty,
            questionCount,
          },
        });

        setCredits((prev) => (prev !== null ? prev - 10 : prev));
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
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
      },
    },
  };

  return (
    <Box minH="100vh" bg={bg} py={8} px={{ base: 4, md: 8 }}>
      <Container maxW="7xl">
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Flex justify="space-between" align="center" mb={8}>
            <MotionButton
              leftIcon={<ArrowLeft size={20} />}
              variant="ghost"
              color={onSurface}
              size="md"
              borderRadius="full"
              _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
              _focus={{ boxShadow: "outline" }}
              variants={itemVariants}
              onClick={() => router.back()}
            >
              Back
            </MotionButton>

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
                  boxShadow="sm"
                >
                  <Icon as={Coins} boxSize={5} />
                  {credits !== null ? credits : "N/A"} Credits
                </Badge>
              )}
            </MotionBox>
          </Flex>

          <MotionGrid
            templateColumns={{ base: "1fr", md: "1fr 2fr" }}
            gap={8}
            variants={containerVariants}
          >
            {/* Left Side - Settings Panel */}
            <MotionGridItem variants={itemVariants}>
              <MotionCard
                bg={surface}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="lg"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <CardHeader pb={4}>
                  <Text color={secondary} fontSize="sm" mt={1}>
                    Customize your quiz parameters
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel color={onSurface}>Difficulty Level</FormLabel>
                      <Select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        bg={selectBg}
                        borderColor={border}
                        focusBorderColor={accent}
                        borderRadius="lg"
                      >
                        {difficultyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel color={onSurface}>
                        Number of Questions
                      </FormLabel>
                      <Select
                        value={questionCount}
                        onChange={(e) =>
                          setQuestionCount(Number(e.target.value))
                        }
                        bg={selectBg}
                        borderColor={border}
                        focusBorderColor={accent}
                        borderRadius="lg"
                      >
                        {questionCountOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <Box pt={4}>
                      <Text fontSize="sm" color={secondary}>
                        <Text as="span" fontWeight="bold">
                          Cost:
                        </Text>{" "}
                        10 Credits
                      </Text>
                    </Box>
                  </VStack>
                </CardBody>
              </MotionCard>
            </MotionGridItem>

            {/* Right Side - Input Panel */}
            <MotionGridItem variants={itemVariants}>
              <MotionCard
                bg={surface}
                borderRadius="2xl"
                overflow="hidden"
                boxShadow="lg"
                variants={cardVariants}
                whileHover={{ y: -5 }}
              >
                <CardHeader pb={4}>
                  <Text color={secondary} fontSize="sm" mt={1}>
                    Enter your content below to create a customized quiz
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <FormControl>
                      <FormLabel color={onSurface}>Content</FormLabel>
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Paste your text, lecture notes, or any content here..."
                        minH="120px"
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
                    </FormControl>

                    <MotionButton
                      size="lg"
                      onClick={handleGenerate}
                      isDisabled={
                        !prompt.trim() ||
                        loading ||
                        (credits !== null && credits < 10)
                      }
                      isLoading={loading}
                      loadingText="Generating..."
                      width="full"
                      bg={buttonColor}
                      color="white"
                      py={7}
                      borderRadius="xl"
                      fontWeight="semibold"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Generate Quiz
                    </MotionButton>
                  </VStack>
                </CardBody>
              </MotionCard>
            </MotionGridItem>
          </MotionGrid>

          {/* Quiz Preview Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
            <ModalOverlay backdropFilter="blur(8px)" bg="blackAlpha.600" />
            <ModalContent
              bg={surface}
              borderRadius="2xl"
              overflow="hidden"
              as={MotionBox}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
            >
              <ModalHeader>
                <Heading size="lg" color={primary}>
                  Your Generated Quiz
                </Heading>
                <Text fontSize="sm" color={secondary} mt={1}>
                  {difficultyOptions.find((d) => d.value === difficulty)?.label}{" "}
                  • {questionCount} Questions
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
                    borderRadius="xl"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Regenerate
                  </MotionButton>
                  <MotionButton
                    colorScheme={buttonBg}
                    bg={buttonBg}
                    variant="solid"
                    onClick={() => {
                      onClose();
                      const type = "text";
                      router.push(`/dashboard/quizzes/conduction/${type}`);
                    }}
                    borderRadius="xl"
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
                    }}
                    whileTap={{ scale: 0.97 }}
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
