'use client';
import { useState } from 'react';
import { Box, Button, Flex, Text, VStack, Heading, Progress, Icon, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaArrowRight, FaCheckCircle } from 'react-icons/fa'; // Icons for navigation and correct answers
import { useParams } from 'next/navigation';

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
  // Add more questions here
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const router = useRouter();
  const { type } = useParams();  // Get the dynamic route parameter (type)
  
  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #E0F7FA 0%, #80DEEA 100%)",
    "linear-gradient(135deg, #102a43 0%, #243b53 100%)"
  );


  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answer;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    localStorage.setItem('quizData', JSON.stringify(quizData));
    router.push('/result');
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
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition="all 0.5s ease-in-out"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="lg"
        maxW="md"
        w="full"
      >
        <VStack spacing={6} align="stretch">
          <Heading fontSize="2xl" fontWeight="bold" color="teal.600" textAlign="center" fontFamily="Poppins, sans-serif">
            Quiz
          </Heading>
          <Progress value={progress} size="sm" colorScheme="teal" borderRadius="full" />
          <Text fontSize="xl" fontWeight="semibold" color="gray.700">
            {quizData[currentQuestion].question}
          </Text>
          {quizData[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              as={motion.button}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="outline"
              colorScheme="teal"
              w="full"
              onClick={() => handleAnswerSelect(option)}
              isActive={selectedAnswers[currentQuestion] === option}
              leftIcon={<Icon as={FaCheckCircle} />}
            >
              {option}
            </Button>
          ))}
          <Flex justify="space-between" mt={4}>
            <Button
              leftIcon={<Icon as={FaArrowLeft} />}
              onClick={handlePrevious}
              isDisabled={currentQuestion === 0}
              colorScheme="teal"
              variant="outline"
            >
              Previous
            </Button>
            {currentQuestion < quizData.length - 1 ? (
              <Button
                rightIcon={<Icon as={FaArrowRight} />}
                onClick={handleNext}
                colorScheme="teal"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                colorScheme="teal"
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