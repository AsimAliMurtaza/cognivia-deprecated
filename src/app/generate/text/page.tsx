"use client"

import { useState } from "react"
import { Box, Button, Container, Heading, Text, Textarea, VStack, HStack, Icon } from "@chakra-ui/react"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function TextQuizGeneration() {
  const [prompt, setPrompt] = useState("")
  const [generatedQuiz, setGeneratedQuiz] = useState("")
  const [isCardPressed, setIsCardPressed] = useState(false)

  const handleGenerate = async () => {
    // Placeholder for actual quiz generation logic
    setGeneratedQuiz(`Generated quiz based on prompt: ${prompt}`)
  }

  const handleCardPress = () => {
    setIsCardPressed(true)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Box minH="100vh" bg="blue.50" py={12}>
      <Container maxW="2xl">
        <MotionBox variants={containerVariants} initial="hidden" animate="visible">
          <VStack spacing={6} align="stretch">
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <HStack spacing={2} color="teal.500" _hover={{ color: "teal.700" }}>
                <Icon as={ArrowLeft} boxSize={5} />
                <Text fontWeight="medium">Back</Text>
              </HStack>
            </Link>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor="teal.300">
              <VStack spacing={5} align="stretch">
                <Heading as="h1" size="md" color="teal.700">
                  Generate Quiz from Text
                </Heading>

                <Text color="gray.600" fontSize="sm">
                  Enter your text prompt below, and our AI will generate a customized quiz for you.
                </Text>

                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Type your prompt here..."
                  minH="150px"
                  size="sm"
                  borderColor="teal.200"
                  _hover={{ borderColor: "teal.300" }}
                  _focus={{ borderColor: "teal.500", boxShadow: "0 0 0 1px teal.500" }}
                  onClick={handleCardPress}
                />

                <MotionButton
                  colorScheme="teal"
                  size="md"
                  isDisabled={!prompt.trim()}
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Generate Quiz
                </MotionButton>

                {generatedQuiz && (
                  <MotionBox
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    bg="blue.50"
                    p={4}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="teal.200"
                  >
                    <VStack align="stretch" spacing={3}>
                      <Heading as="h3" size="sm" color="teal.700">
                        Generated Quiz
                      </Heading>
                      <Text color="gray.700" fontSize="sm">
                        {generatedQuiz}
                      </Text>
                      <HStack spacing={3}>
                        <MotionButton
                          variant="outline"
                          colorScheme="teal"
                          size="sm"
                          onClick={handleGenerate}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Regenerate
                        </MotionButton>
                        <MotionButton colorScheme="teal" size="sm" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          Start Quiz
                        </MotionButton>
                      </HStack>
                    </VStack>
                  </MotionBox>
                )}
              </VStack>
            </Box>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  )
}
