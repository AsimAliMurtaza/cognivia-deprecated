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
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const ResultPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [userID, setUserID] = useState("demo_user");
  const [quizID, setQuizID] = useState("demo_quiz");
  const [percentage, setPercentage] = useState(0);

  const hasSaved = useRef(false); // 🛡️ prevent double-saving

  const bg = useColorModeValue("gray.50", "gray.900");
  const surface = useColorModeValue("white", "gray.800");
  const primary = useColorModeValue("teal.600", "teal.300");
  const onSurface = useColorModeValue("gray.700", "gray.300");
  const success = useColorModeValue("green.500", "green.300");
  const error = useColorModeValue("red.500", "red.300");

  useEffect(() => {
    const scoreParam = parseInt(searchParams.get("score") || "0");
    const totalParam = parseInt(searchParams.get("totalQuestions") || "0");
    const user = searchParams.get("userID") || "demo_user";
    const quiz = searchParams.get("quizID") || "demo_quiz";
    const calcPercentage = totalParam > 0 ? (scoreParam / totalParam) * 100 : 0;

    setScore(scoreParam);
    setTotalQuestions(totalParam);
    setUserID(user);
    setQuizID(quiz);
    setPercentage(calcPercentage);
    console.log(userID);
    console.log(quizID);

    if (!hasSaved.current && scoreParam && totalParam) {
      saveResult(user, quiz, scoreParam, totalParam, calcPercentage);
      hasSaved.current = true;
    }
  }, [searchParams, quizID, userID]);

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

      if (!response.ok) throw new Error("Failed to save result");
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bg={bg}
      p={6}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        bg={surface}
        p={8}
        borderRadius="xl" // More rounded corners
        boxShadow="md"
        maxW="md" // Slightly narrower for better focus
        w="full"
        textAlign="center"
        animation={`fadeIn 0.4s ease-out`}
      >
        <VStack spacing={8}>
          <Heading
            as="h2"
            size="xl"
            color={primary}
            fontWeight="semibold"
            letterSpacing="tight"
          >
            Quiz Results
          </Heading>

          <Box position="relative" display="inline-flex">
            <CircularProgress
              value={percentage}
              size="160px" // Larger progress circle
              color={primary}
              thickness="12px"
              borderRadius="full"
            >
              <CircularProgressLabel
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                fontWeight="extrabold"
                fontSize="3xl"
                color={onSurface}
              >
                {Math.round(percentage)}%
              </CircularProgressLabel>
            </CircularProgress>
          </Box>

          <VStack spacing={3} align="center">
            <Text fontSize="xl" color={onSurface} fontWeight="medium">
              You scored
              <Text as="strong" color={primary} ml={1}>
                {score} {""}
              </Text>
              out of
              <Text as="strong" color={primary} ml={1}>
                {totalQuestions} {""}
              </Text>
              questions.
            </Text>

            {percentage >= 70 ? (
              <Flex align="center" color={success} fontWeight="semibold">
                <Icon as={FaCheckCircle} boxSize={6} mr={2} />
                <Text fontWeight="semibold">Congratulations! You passed.</Text>
              </Flex>
            ) : (
              <Flex align="center" color={error} fontWeight="semibold">
                <Icon as={FaTimesCircle} boxSize={6} mr={2} />
                <Text fontWeight="semibold">
                  Better luck next time. Keep learning!
                </Text>
              </Flex>
            )}
          </VStack>

          <Button
            colorScheme="teal"
            size="lg"
            borderRadius="full"
            boxShadow="md"
            _hover={{ boxShadow: "lg" }}
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ResultPage;
