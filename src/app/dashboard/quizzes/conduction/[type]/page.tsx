"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  Heading,
  Progress,
  Icon,
  useColorModeValue,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useQuizStore } from "@/hooks/useQuizStore";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 600 seconds = 10 minutes
  const [submitted, setSubmitted] = useState(false);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // New state
  const [attemptedQuestionsCount, setAttemptedQuestionsCount] = useState(0); // New state

  const router = useRouter();
  const { type } = useParams();
  const toast = useToast();
  const quizDataa = useQuizStore((state) => state.quizData);
  const [quizData, setQuizData] = useState<
    {
      question: string;
      options: string[];
      correctIndex: number;
      isTaken?: boolean;
    }[]
  >([]);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const optionBg = useColorModeValue("gray.100", "gray.700");
  const optionHoverBg = useColorModeValue("gray.200", "gray.600");
  const flexColor = useColorModeValue("gray.50", "gray.900");
  const progressCircleColor = useColorModeValue("teal.500", "teal.300");

  const letterToIndex = (letter: string) => letter.charCodeAt(0) - 65;

  useEffect(() => {
    if (quizDataa) {
      const mappedQuizData = quizDataa.questions.map((q, i) => ({
        question: q,
        options: quizDataa.options[i],
        correctIndex: letterToIndex(quizDataa.answers[i]),
      }));
      setQuizData(mappedQuizData);
      setSelectedAnswers(Array(mappedQuizData.length).fill(-1));
      setAnswered(Array(mappedQuizData.length).fill(false));
    }
  }, [quizDataa]);

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);

    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    const current = quizData[currentQuestion];
    const previouslyCorrect =
      selectedAnswers[currentQuestion] === current.correctIndex;
    const isCurrentlyCorrect = index === current.correctIndex;
    const wasAnswered = answered[currentQuestion];

    if (isCurrentlyCorrect && !previouslyCorrect && wasAnswered) {
      setScore((prevScore) => prevScore + 1);
      setWrongAnswersCount((prevWrong) => (prevWrong > 0 ? prevWrong - 1 : 0));
      setCorrectAnswersCount((prevCorrect) => prevCorrect + 1);
    } else if (!isCurrentlyCorrect && previouslyCorrect && wasAnswered) {
      setScore((prevScore) => prevScore - 1);
      setWrongAnswersCount((prevWrong) => prevWrong + 1);
      setCorrectAnswersCount((prevCorrect) => prevCorrect - 1);
    } else if (isCurrentlyCorrect && !wasAnswered) {
      setScore((prevScore) => prevScore + 1);
      setCorrectAnswersCount((prevCorrect) => prevCorrect + 1);
    } else if (!isCurrentlyCorrect && !wasAnswered) {
      setWrongAnswersCount((prevWrong) => prevWrong + 1);
    }

    if (!wasAnswered) {
      setAttemptedQuestionsCount((prevAttempted) => prevAttempted + 1);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return; // Don't run timer if time's up

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-submit when timer hits zero
  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleNext = () => {
    if (!answered[currentQuestion]) {
      toast({
        title: "Select an answer first!",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    setCurrentQuestion((prev) => prev + 1);
  };

  const handlePrevious = () => setCurrentQuestion((prev) => prev - 1);

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    console.log(correctAnswersCount, wrongAnswersCount, attemptedQuestionsCount);
    const finalCorrectAnswers = quizData.reduce((count, question, index) => {
      if (selectedAnswers[index] === question.correctIndex) {
        return count + 1;
      }
      return count;
    }, 0);

    const finalAttemptedQuestions = selectedAnswers.filter(
      (answer) => answer !== -1
    ).length;

    const queryParams = new URLSearchParams({
      score: score.toString(),
      totalQuestions: quizData.length.toString(),
      quizID: quizDataa?._id || "",
      userID: quizDataa?.userID || "",
      remainingTime: formatTime(timeLeft),
      wrongAnswers: (finalAttemptedQuestions - finalCorrectAnswers).toString(), // More accurate wrong answer count
      correctAnswers: finalCorrectAnswers.toString(), // Send correct answers
      attemptedQuestions: finalAttemptedQuestions.toString(), // Send attempted questions
      isTaken: true.toString(),
    });
    router.push(
      `/dashboard/quizzes/conduction/${type}/results?${queryParams.toString()}`
    );
  }, [
    submitted,
    score,
    quizData.length,
    quizDataa?._id || "",
    quizDataa?.userID || "",
    router,
    type,
    timeLeft,
    selectedAnswers,
    quizData,
  ]);

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const timeProgress = (timeLeft / 600) * 100; // Assuming initial timeLeft is 600
  const current = quizData[currentQuestion];
  const userAnswerIndex = selectedAnswers[currentQuestion];

  if (!quizDataa) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text>Loading...</Text>
      </Flex>
    );
  }
  if (quizData.length === 0) {
    return (
      <Flex align="center" justify="center" minH="100vh">
        <Text>No questions available.</Text>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={flexColor}
      p={4}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition="0.5s ease"
        bg={cardBg}
        p={{ base: 4, md: 6, lg: 8 }}
        borderRadius="2xl"
        boxShadow="2xl"
        w="full"
        maxW={{ base: "100%", sm: "95%", md: "90%", lg: "1200px" }}
      >
        <Grid templateColumns={{ base: "1fr", md: "300px 1fr" }} gap={6}>
          <GridItem>
            <VStack spacing={4} align="center">
              <Heading fontSize="xl" fontWeight="bold" color="teal.500">
                Time Remaining
              </Heading>
              <CircularProgress
                value={timeProgress}
                size="120px"
                thickness="8px"
                color={progressCircleColor}
                borderRadius="full"
              >
                <CircularProgressLabel>
                  {formatTime(timeLeft)}
                </CircularProgressLabel>
              </CircularProgress>
              <Text fontSize="sm" color="gray.500">
                Question {currentQuestion + 1} of {quizData.length}
              </Text>
              <Progress
                value={progress}
                size="sm"
                colorScheme="teal"
                borderRadius="full"
                w="full"
              />
            </VStack>
          </GridItem>
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Heading
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color="teal.500"
                textAlign="left"
              >
                Question {currentQuestion + 1}
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                fontWeight="semibold"
                color={textColor}
                wordBreak="break-word"
              >
                {current.question}
              </Text>

              <VStack spacing={3} align="stretch">
                {current.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                  const isSelected = userAnswerIndex === index;
                  const isCorrectAnswer = index === current.correctIndex;
                  const hasAnswered = answered[currentQuestion];

                  let bgColor = optionBg;
                  let textColorOption = textColor;

                  if (hasAnswered) {
                    if (isSelected && isCorrectAnswer) {
                      bgColor = "green.400";
                      textColorOption = "white";
                    } else if (isSelected && !isCorrectAnswer) {
                      bgColor = "red.400";
                      textColorOption = "white";
                    } else if (isCorrectAnswer) {
                      bgColor = "green.200";
                      textColorOption = "black";
                    }
                  } else if (isSelected) {
                    bgColor = "teal.500";
                    textColorOption = "white";
                  }

                  return (
                    <Button
                      key={index}
                      as={motion.button}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => !hasAnswered && handleAnswerSelect(index)}
                      w="full"
                      justifyContent="flex-start"
                      textAlign="left"
                      px={4}
                      py={3}
                      bg={bgColor}
                      color={textColorOption}
                      fontWeight="medium"
                      borderRadius="lg"
                      boxShadow={isSelected ? "md" : "sm"}
                      leftIcon={
                        isSelected && hasAnswered ? (
                          <Icon as={FaCheckCircle} />
                        ) : undefined
                      }
                      _hover={{
                        bg: !hasAnswered
                          ? isSelected
                            ? "teal.600"
                            : optionHoverBg
                          : bgColor,
                      }}
                      whiteSpace="normal"
                      height="auto"
                      minH="60px"
                    >
                      <Flex align="center" w="full">
                        <Text color={textColorOption}>{optionLetter}</Text>
                        <Text wordBreak="break-word" ml={2} textAlign="left">
                          {option}
                        </Text>
                      </Flex>
                    </Button>
                  );
                })}
              </VStack>

              <Flex
                justify="space-between"
                mt={4}
                flexDirection={{ base: "column-reverse", sm: "row" }}
                gap={{ base: 3, sm: 0 }}
              >
                <Button
                  leftIcon={<FaArrowLeft />}
                  onClick={handlePrevious}
                  isDisabled={currentQuestion === 0}
                  colorScheme="teal"
                  variant="ghost"
                  size={{ base: "sm", md: "md" }}
                >
                  Previous
                </Button>

                {currentQuestion < quizData.length - 1 ? (
                  <Button
                    rightIcon={<FaArrowRight />}
                    onClick={handleNext}
                    colorScheme="teal"
                    size={{ base: "sm", md: "md" }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    colorScheme="green"
                    size={{ base: "sm", md: "md" }}
                  >
                    Submit
                  </Button>
                )}
              </Flex>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </Flex>
  );
}
