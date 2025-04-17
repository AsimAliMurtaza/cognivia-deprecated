"use client";
import { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useQuizStore } from "@/hooks/useQuizStore";

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // Track selected answers
  const [answered, setAnswered] = useState<boolean[]>([]); // Track if question is answered
  const [score, setScore] = useState(0); // Track score
  const router = useRouter();
  const { type } = useParams();
  const toast = useToast();
  const quizDataa = useQuizStore((state) => state.quizData);
  const [quizData, setQuizData] = useState<
    {
      question: string;
      options: string[];
      correctIndex: number;
    }[]
  >([]);

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const optionBg = useColorModeValue("gray.100", "gray.700");
  const optionHoverBg = useColorModeValue("gray.200", "gray.600");

  // Helper function to map options to their indices
  const letterToIndex = (letter: string) => letter.charCodeAt(0) - 65;

  useEffect(() => {
    if (quizDataa) {
      // Map quiz data to questions with options and correct answer index
      const mappedQuizData = quizDataa.questions.map((q, i) => ({
        question: q,
        options: quizDataa.options[i],
        correctIndex: letterToIndex(quizDataa.answers[i]),
      }));
      setQuizData(mappedQuizData);
      // Initialize selectedAnswers and answered arrays
      setSelectedAnswers(Array(mappedQuizData.length).fill(-1)); // -1 means no answer selected
      setAnswered(Array(mappedQuizData.length).fill(false)); // false means question not answered
    }
  }, [quizDataa]);

  if (!quizDataa) return <Text>Loading...</Text>;
  if (quizData.length === 0) return <Text>No questions available.</Text>;

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);

    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    // Dynamically update the score if the answer is correct
    const current = quizData[currentQuestion];
    if (index === current.correctIndex) {
      setScore((prevScore) => prevScore + 1);
    } else if (selectedAnswers[currentQuestion] === current.correctIndex) {
      setScore((prevScore) => prevScore - 1); // Deduct score if user changes from correct answer
    }
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

  const handleSubmit = () => {
    // Format the query parameters
    const queryParams = new URLSearchParams({
      score: score.toString(),
      totalQuestions: quizData.length.toString(),
      quizID: quizDataa._id, // Assuming quizDataa has an _id field
      userID: quizDataa.userID, // Assuming quizDataa has a userID field
    });

    // Navigate to the results page with query parameters
    router.push(
      `/dashboard/quizzes/conduction/${type}/results?${queryParams.toString()}`
    );
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  const current = quizData[currentQuestion];
  const userAnswerIndex = selectedAnswers[currentQuestion];

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      minH="100vh"
      bgGradient={cardBg}
      p={4}
    >
      <Box
        as={motion.div}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition="0.5s ease"
        bg={cardBg}
        p={{ base: 6, md: 8 }}
        borderRadius="2xl"
        boxShadow="2xl"
        maxW="lg"
        w="full"
      >
        <VStack spacing={6} align="stretch">
          <Heading
            fontSize={{ base: "2xl", md: "3xl" }}
            fontWeight="bold"
            color="teal.500"
            textAlign="center"
          >
            Quiz Time!
          </Heading>

          <Progress
            value={progress}
            size="sm"
            colorScheme="teal"
            borderRadius="full"
          />

          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            {current.question}
          </Text>
          <VStack spacing={3}>
            {current.options.map((option, index) => {
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
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !hasAnswered && handleAnswerSelect(index)}
                  w="full"
                  justifyContent="start"
                  px={6}
                  py={5}
                  bg={bgColor}
                  color={textColorOption}
                  fontWeight="medium"
                  borderRadius="xl"
                  boxShadow={isSelected ? "lg" : "base"}
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
                >
                  {option}
                </Button>
              );
            })}
          </VStack>

          <Flex justify="space-between" mt={4}>
            <Button
              leftIcon={<FaArrowLeft />}
              onClick={handlePrevious}
              isDisabled={currentQuestion === 0}
              colorScheme="teal"
              variant="ghost"
            >
              Previous
            </Button>

            {currentQuestion < quizData.length - 1 ? (
              <Button
                rightIcon={<FaArrowRight />}
                onClick={handleNext}
                colorScheme="teal"
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} colorScheme="green">
                Submit
              </Button>
            )}
          </Flex>

          {/* Score Display */}
          {currentQuestion === quizData.length - 1 && (
            <Box textAlign="center" mt={6}>
              <Text fontSize="xl" fontWeight="bold" color="teal.500">
                Total Score: {score} / {quizData.length}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
