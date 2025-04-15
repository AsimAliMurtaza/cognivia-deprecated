'use client';
import { useState } from 'react';
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
  useToast
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa';

// Sample quiz data
const quizData = [
  {
    question: "Which TCP variant is known for its enhancements in congestion detection and avoidance?",
    options: ["TCP Vegas", "TCP Reno", "TCP Tahoe", "TCP New Reno"],
    correctAnswer: "TCP Vegas",
  },
  {
    question: "What is the primary purpose of a DNS server?",
    options: ["To store website content", "To resolve domain names to IP addresses", "To manage network traffic", "To encrypt data"],
    correctAnswer: "To resolve domain names to IP addresses",
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const router = useRouter();
  const { type } = useParams();
  const toast = useToast();

  // Color Mode Compatible Styles
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.100, blue.100)",
    "linear(to-br, gray.800, gray.700)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const optionBg = useColorModeValue("gray.100", "gray.700");
  const optionHoverBg = useColorModeValue("gray.200", "gray.600");

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (selectedAnswers[currentQuestion]) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      toast({
        title: "Select an answer first!",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handlePrevious = () => {
    setCurrentQuestion(currentQuestion - 1);
  };

  const handleSubmit = () => {
    localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    localStorage.setItem('quizData', JSON.stringify(quizData));
    router.push(`/dashboard/quizzes/conduction/${type}/results`);
  };

  const progress = ((currentQuestion + 1) / quizData.length) * 100;

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
            fontFamily="Poppins, sans-serif"
          >
            Quiz Time!
          </Heading>

          <Progress value={progress} size="sm" colorScheme="teal" borderRadius="full" />

          <Text fontSize="lg" fontWeight="semibold" color={textColor}>
            {quizData[currentQuestion].question}
          </Text>

          <VStack spacing={3}>
            {quizData[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestion] === option;

              return (
                <Button
                  key={index}
                  as={motion.button}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(option)}
                  w="full"
                  justifyContent="start"
                  px={6}
                  py={5}
                  bg={isSelected ? "teal.500" : optionBg}
                  color={isSelected ? "white" : textColor}
                  fontWeight="medium"
                  borderRadius="xl"
                  boxShadow={isSelected ? "lg" : "base"}
                  leftIcon={isSelected ? <Icon as={FaCheckCircle} /> : undefined}
                  _hover={{
                    bg: isSelected ? "teal.600" : optionHoverBg,
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
              <Button
                onClick={handleSubmit}
                colorScheme="green"
                variant="solid"
              >
                Submit
              </Button>
            )}
          </Flex>
        </VStack>
      </Box>
    </Flex>
  );
}
