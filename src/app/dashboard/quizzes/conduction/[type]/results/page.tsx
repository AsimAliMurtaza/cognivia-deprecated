"use client";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  VStack,
  CircularProgress,
  CircularProgressLabel,
  Icon,
  useColorModeValue,
  Grid,
  GridItem,
  Divider,
  useToast,
  HStack,
  Badge,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHome,
} from "react-icons/fa";
import { motion } from "framer-motion";

const motivationalQuotes = [
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "The future belongs to those who believe in the beauty of their dreams.",
  "Strive for progress, not perfection.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The journey of a thousand miles begins with a single step.",
  "Don't watch the clock; do what it does. Keep going.",
  "Our greatest glory is not in never failing, but in rising up every time we fail.",
];

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [remainingTime, setRemainingTime] = useState("N/A");
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [attemptedQuestions, setAttemptedQuestions] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [userID, setUserID] = useState("");
  const [quizID, setQuizID] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const hasSaved = useRef(false);

  // Color values
  const bg = useColorModeValue("gray.50", "gray.900");
  const surface = useColorModeValue("white", "gray.800");
  const primary = useColorModeValue("teal.500", "blue.300");
  const onSurface = useColorModeValue("gray.700", "gray.300");
  const success = useColorModeValue("green.500", "blue.300");
  const error = useColorModeValue("red.500", "red.300");
  const info = useColorModeValue("blue.500", "blue.300");
  const subTextColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("teal.500", "blue.300");

  useEffect(() => {
    const scoreParam = parseInt(searchParams.get("score") || "0");
    const totalParam = parseInt(searchParams.get("totalQuestions") || "0");
    const timeParam = searchParams.get("remainingTime") || "N/A";
    const wrongParam = parseInt(searchParams.get("wrongAnswers") || "0");
    const correctParam = parseInt(searchParams.get("correctAnswers") || "0");
    const attemptedParam = parseInt(
      searchParams.get("attemptedQuestions") || "0"
    );
    const calcPercentage = totalParam > 0 ? (scoreParam / totalParam) * 100 : 0;
    const user = searchParams.get("userID") || "demo_user";
    const quiz = searchParams.get("quizID") || "demo_quiz";

    setScore(scoreParam);
    setTotalQuestions(totalParam);
    setRemainingTime(timeParam);
    setWrongAnswers(wrongParam);
    setCorrectAnswers(correctParam);
    setAttemptedQuestions(attemptedParam);
    setPercentage(calcPercentage);
    setUserID(user);
    setQuizID(quiz);
    setMotivationalQuote(
      motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    );

    console.log(quizID, userID);

    if (!hasSaved.current && scoreParam && totalParam) {
      saveResult(user, quiz, scoreParam, totalParam, calcPercentage);
      hasSaved.current = true;
    }
  }, [searchParams]);

  const saveResult = async (
    userID: string,
    quizID: string,
    score: number,
    total: number,
    percentage: number
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, quizID, score, total, percentage }),
      });

      if (!response.ok) {
        throw new Error("Failed to save result");
      }
      toast({
        title: "Result saved",
        description: "Your quiz result has been saved successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error saving result:", error);
      toast({
        title: "Error saving result",
        description: "An unexpected error occurred while saving.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPerformanceVerdict = () => {
    if (percentage >= 90) return "Outstanding!";
    if (percentage >= 80) return "Excellent work!";
    if (percentage >= 70) return "Good job!";
    if (percentage >= 50) return "Not bad!";
    return "Keep practicing!";
  };

  const getPerformanceColor = () => {
    if (percentage >= 80) return success;
    if (percentage >= 60) return primary;
    return error;
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      w="full"
      bg={bg}
      p={{ base: 2, md: 6 }}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        bg={surface}
        p={{ base: 2, md: 6 }}
        borderRadius="xl"
        boxShadow="xl"
        w="full"
        maxW="4xl"
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Box textAlign="center">
            <Heading
              as="h1"
              size="lg"
              fontWeight="bold"
              bg={headingColor}
              bgClip="text"
              mb={2}
            >
              Quiz Results
            </Heading>
            <Text fontSize="lg" color={subTextColor}>
              Here&apos;s how you performed
            </Text>
          </Box>

          {/* Main Content */}
          <Grid
            templateColumns={{ base: "1fr", md: "1fr 1fr" }}
            gap={8}
            alignItems="center"
          >
            {/* Score Visualization */}
            <GridItem>
              <VStack spacing={6}>
                <Box position="relative" textAlign="center">
                  <CircularProgress
                    value={percentage}
                    size="180px"
                    color={getPerformanceColor()}
                    thickness="12px"
                    capIsRound
                  >
                    <CircularProgressLabel
                      fontSize="3xl"
                      fontWeight="bold"
                      color={onSurface}
                    >
                      {Math.round(percentage)}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text
                    mt={4}
                    fontSize="lg"
                    fontWeight="semibold"
                    color={getPerformanceColor()}
                  >
                    {getPerformanceVerdict()}
                  </Text>
                </Box>

                <Box textAlign="center">
                  <Text fontSize="xl" fontWeight="medium" color={onSurface}>
                    You scored{" "}
                    <Badge
                      colorScheme={percentage >= 70 ? "green" : "red"}
                      fontSize="lg"
                      px={2}
                      py={1}
                    >
                      {score}/{totalQuestions}
                    </Badge>
                  </Text>
                  <Text mt={2} color={subTextColor}>
                    {percentage >= 70
                      ? "You passed the quiz!"
                      : "Keep learning and try again!"}
                  </Text>
                </Box>
              </VStack>
            </GridItem>

            {/* Detailed Stats */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                <Box
                  borderWidth="1px"
                  borderColor={borderColor}
                  borderRadius="lg"
                  p={6}
                >
                  <Heading size="md" mb={4} color={info}>
                    Detailed Breakdown
                  </Heading>
                  <VStack
                    spacing={3}
                    align="stretch"
                    divider={<Divider borderColor={borderColor} />}
                  >
                    <Flex justify="space-between">
                      <HStack>
                        <Icon as={FaCheckCircle} color={success} />
                        <Text>Correct Answers</Text>
                      </HStack>
                      <Text fontWeight="bold">{correctAnswers}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <HStack>
                        <Icon as={FaTimesCircle} color={error} />
                        <Text>Wrong Answers</Text>
                      </HStack>
                      <Text fontWeight="bold">{wrongAnswers}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Attempted Questions</Text>
                      <Text fontWeight="bold">{attemptedQuestions}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text>Time Remaining</Text>
                      <Text fontWeight="bold">{remainingTime}</Text>
                    </Flex>
                  </VStack>
                </Box>

                {/* Motivational Quote */}
                <Box
                  bg={useColorModeValue(`${primary}10`, `${primary}20`)}
                  borderRadius="lg"
                  p={4}
                  borderLeftWidth="4px"
                  borderLeftColor={primary}
                >
                  <Text fontStyle="italic" color={onSurface}>
                    &quot;{motivationalQuote}&quot;
                  </Text>
                </Box>
              </VStack>
            </GridItem>
          </Grid>

          {/* Action Buttons */}
          <Stack
            direction={{ base: "column", sm: "row" }}
            spacing={4}
            justify="center"
            mt={8}
          >
            <Button
              leftIcon={<FaHome />}
              colorScheme="teal"
              variant="solid"
              size="md"
              borderRadius="full"
              onClick={() => router.push("/dashboard")}
              isLoading={isLoading}
            >
              Dashboard
            </Button>
          </Stack>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ResultPage;
