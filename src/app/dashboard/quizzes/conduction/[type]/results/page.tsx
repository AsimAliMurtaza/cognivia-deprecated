'use client';
import {
  Box, Button, Flex, Heading, Text, VStack,
  CircularProgress, CircularProgressLabel, Icon,
  useColorModeValue
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ResultPage() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // 🎨 Color mode compatible styles
  const bgGradient = useColorModeValue("linear(to-br, teal.50, teal.100)", "linear(to-br, gray.800, gray.700)");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const resultPassColor = useColorModeValue("green.500", "green.300");
  const resultFailColor = useColorModeValue("red.500", "red.300");
  const headingColor = useColorModeValue("teal.600", "teal.300");

  useEffect(() => {
    const selectedAnswers = JSON.parse(localStorage.getItem("selectedAnswers") || "[]");
    const quizData = JSON.parse(localStorage.getItem("quizData") || "[]");

    let correctCount = 0;
    quizData.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const total = quizData.length;
    const calculatedPercentage = (correctCount / total) * 100;

    setCorrectAnswers(correctCount);
    setTotalQuestions(total);
    setPercentage(calculatedPercentage);
    setScore(correctCount);

    // ✅ Send result to API
    fetch('/api/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'demo_user',
        score: correctCount,
        total,
        percentage: calculatedPercentage,
      }),
    }).then(res => {
      if (!res.ok) {
        console.error("Failed to submit result");
      }
    }).catch(err => console.error("API error:", err));
  }, []);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bgGradient={bgGradient}
      p={4}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition="0.5s ease-in-out"
        bg={cardBg}
        p={8}
        borderRadius="2xl"
        boxShadow="xl"
        maxW="lg"
        w="full"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Heading color={headingColor} fontSize="2xl">
            Quiz Results
          </Heading>

          <CircularProgress
            value={percentage}
            size="120px"
            color="teal.400"
            thickness="10px"
          >
            <CircularProgressLabel fontWeight="bold" fontSize="lg">
              {Math.round(percentage)}%
            </CircularProgressLabel>
          </CircularProgress>

          <Text fontSize="lg" color={textColor}>
            You answered <strong>{correctAnswers}</strong> out of <strong>{totalQuestions}</strong> questions correctly.
          </Text>

          {percentage >= 70 ? (
            <Flex align="center" color={resultPassColor} fontWeight="semibold">
              <Icon as={FaCheckCircle} mr={2} /> Great job! You passed the quiz.
            </Flex>
          ) : (
            <Flex align="center" color={resultFailColor} fontWeight="semibold">
              <Icon as={FaTimesCircle} mr={2} /> You can do better! Try again.
            </Flex>
          )}

          <Flex pt={4} justify="center">
            <Button colorScheme="teal" onClick={() => router.push("/dashboard")}>
              Go to Home
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}
