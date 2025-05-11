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
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
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
  const hasSaved = useRef(false); // 🛡️ prevent double-saving

  const bg = useColorModeValue("gray.100", "gray.900");
  const surface = useColorModeValue("white", "gray.800");
  const primary = useColorModeValue("teal.500", "teal.300");
  const onSurface = useColorModeValue("gray.700", "gray.300");
  const success = useColorModeValue("green.500", "teal.300");
  const error = useColorModeValue("red.500", "red.300");
  const info = useColorModeValue("teal.500", "teal.300");
  const subTextColor = useColorModeValue("gray.500", "gray.600");

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

    // Save result only once when the component mounts and has the necessary data
    if (!hasSaved.current && scoreParam && totalParam) {
      saveResult(user, quiz, scoreParam, totalParam, calcPercentage);
      hasSaved.current = true;
    }
  }, [searchParams, quizID, userID]); // Re-run effect when searchParams or hasSavedResult changes

  const saveResult = async (
    userID: string,
    quizID: string,
    score: number,
    total: number,
    percentage: number
  ) => {
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID, quizID, score, total, percentage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save result:", errorData);
        toast({
          title: "Error saving result",
          description:
            errorData.message || "Something went wrong while saving.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Result saved",
          description: "Your quiz result has been saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error saving result:", error);
      toast({
        title: "Error saving result",
        description: "An unexpected error occurred while saving.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="90vh"
      w="95vw"
      bg={bg}
      p={8}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        bg={surface}
        p={6}
        borderRadius="xl"
        boxShadow="lg"
        w="full"
        h="full"
        maxW="container.xl"
        maxH="container.lg"
        animation={`fadeIn 0.5s ease-out`}
        display="flex"
        flexDirection="column"
      >
        <Heading
          as="h2"
          size="lg"
          color={primary}
          fontWeight="extrabold"
          letterSpacing="tight"
          textAlign="center"
          mb={6}
        >
          Quiz Results
        </Heading>

        <Grid
          templateColumns={{ base: "1fr", md: "1.2fr 0.8fr" }}
          gap={8}
          flexGrow={1}
        >
          <GridItem
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Box position="relative" display="inline-flex">
              <CircularProgress
                value={percentage}
                size="200px"
                color={primary}
                thickness="10px"
                borderRadius="full"
              >
                <CircularProgressLabel
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  fontWeight="900"
                  fontSize="4xl"
                  color={onSurface}
                >
                  {Math.round(percentage)}%
                </CircularProgressLabel>
              </CircularProgress>
            </Box>

            <VStack spacing={4} mt={6} textAlign="center">
              <Text fontSize="xl" color={onSurface} fontWeight="semibold">
                You scored
                <Text as="strong" color={primary} ml={1}>
                  {score}
                </Text>
                out of
                <Text as="strong" color={primary} ml={1}>
                  {totalQuestions}
                </Text>
                questions.
              </Text>

              {percentage >= 70 ? (
                <Flex
                  align="center"
                  color={success}
                  fontWeight="bold"
                  fontSize="lg"
                >
                  <Icon as={FaCheckCircle} boxSize={7} mr={2} />
                  <Text>Congratulations! You passed.</Text>
                </Flex>
              ) : (
                <Flex
                  align="center"
                  color={error}
                  fontWeight="bold"
                  fontSize="lg"
                >
                  <Icon as={FaTimesCircle} boxSize={7} mr={2} />
                  <Text>Better luck next time. Keep learning!</Text>
                </Flex>
              )}
            </VStack>
          </GridItem>

          <GridItem
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack spacing={8} align="start">
              <Heading size="md" color={info} fontWeight="bold">
                Details
              </Heading>
              <Box
                borderWidth="1px"
                borderColor="gray.300"
                borderRadius="md"
                p={6}
                w="full"
              >
                <VStack spacing={3} align="start">
                  <Flex align="center">
                    <Text fontWeight="semibold" color={onSurface} fontSize="lg">
                      Correct Answers:
                    </Text>
                    <Text
                      ml={2}
                      color={success}
                      fontWeight="medium"
                      fontSize="lg"
                    >
                      {correctAnswers}
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex align="center">
                    <Text fontWeight="semibold" color={onSurface} fontSize="lg">
                      Wrong Answers:
                    </Text>
                    <Text
                      ml={2}
                      color={error}
                      fontWeight="medium"
                      fontSize="lg"
                    >
                      {wrongAnswers}
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex align="center">
                    <Text fontWeight="semibold" color={onSurface} fontSize="lg">
                      Attempted Questions:
                    </Text>
                    <Text
                      ml={2}
                      color={primary}
                      fontWeight="medium"
                      fontSize="lg"
                    >
                      {attemptedQuestions}
                    </Text>
                  </Flex>
                  <Divider />
                  <Flex align="center">
                    <Text fontWeight="semibold" color={onSurface} fontSize="lg">
                      Remaining Time:
                    </Text>
                    <Text
                      ml={2}
                      color={primary}
                      fontWeight="medium"
                      fontSize="lg"
                    >
                      {remainingTime}
                    </Text>
                  </Flex>
                </VStack>
              </Box>
            </VStack>
            <Box
              mt={6}
              borderWidth="1px"
              borderColor="gray.300"
              borderRadius="md"
              p={6}
              w="full"
              bg={useColorModeValue("gray.50", "gray.700")}
            >
              <Text
                fontSize="md"
                fontStyle="italic"
                color={subTextColor}
                textAlign="center"
              >
                &quot;{motivationalQuote}&quot;
              </Text>
            </Box>
          </GridItem>
        </Grid>

        <Flex justify="center" mt={10}>
          <Button
            colorScheme="teal"
            size="lg"
            borderRadius="full"
            boxShadow="md"
            _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            onClick={() => router.push("/dashboard")}
            fontSize="lg"
            fontWeight="semibold"
            px={8}
            py={5}
          >
            Go to Dashboard
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default ResultPage;
