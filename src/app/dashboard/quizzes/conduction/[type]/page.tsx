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
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [answered, setAnswered] = useState<boolean[]>([]);
  const [score, setScore] = useState(0);
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
  const flexColor = useColorModeValue("gray.50", "gray.900");

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

  if (!quizDataa) return <Text>Loading...</Text>;
  if (quizData.length === 0) return <Text>No questions available.</Text>;

  const handleAnswerSelect = (index: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = index;
    setSelectedAnswers(newAnswers);

    const newAnswered = [...answered];
    newAnswered[currentQuestion] = true;
    setAnswered(newAnswered);

    const current = quizData[currentQuestion];
    if (index === current.correctIndex) {
      setScore((prevScore) => prevScore + 1);
    } else if (selectedAnswers[currentQuestion] === current.correctIndex) {
      setScore((prevScore) => prevScore - 1);
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
    const queryParams = new URLSearchParams({
      score: score.toString(),
      totalQuestions: quizData.length.toString(),
      quizID: quizDataa._id,
      userID: quizDataa.userID,
    });

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
        maxW={{ base: "100%", sm: "90%", md: "80%", lg: "700px" }}
      >
        <VStack spacing={6} align="stretch">
          <Heading
            fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
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
                  <Text w="full" wordBreak="break-word" textAlign="left" px={2}>
                    {option}
                  </Text>
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

          {currentQuestion === quizData.length - 1 && (
            <Box textAlign="center" mt={4}>
              <Text fontSize="lg" fontWeight="bold" color="teal.500">
                Total Score: {score} / {quizData.length}
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </Flex>
  );
}
