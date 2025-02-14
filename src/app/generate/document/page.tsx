"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Input,
  useColorModeValue,
} from "@chakra-ui/react"
import { ArrowLeft, Upload } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function DocumentQuizGeneration() {
  const [file, setFile] = useState<File | null>(null)
  const [generatedQuiz, setGeneratedQuiz] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleGenerate = async () => {
    if (!file) return
    setGeneratedQuiz(`Generated quiz based on document: ${file.name}`)
  }

  // Dynamic color mode support
  const bgColor = useColorModeValue("gray.50", "gray.800")
  const cardBg = useColorModeValue("white", "gray.700")
  const textColor = useColorModeValue("gray.800", "gray.100")
  const borderColor = useColorModeValue("gray.300", "teal.500")
  const hoverBg = useColorModeValue("teal.50", "teal.700")
  const inputBg = useColorModeValue("gray.100", "gray.600")

  return (
    <Box minH="100vh" bgColor={bgColor} py={12}>
      <Container maxW={{ base: "90%", md: "lg" }}>
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <VStack spacing={6} align="stretch">
            {/* Back Button */}
            <Link href="/dashboard/quizzes" passHref>
              <HStack spacing={2} color="teal.500" _hover={{ color: "teal.700" }} cursor="pointer">
                <Icon as={ArrowLeft} boxSize={4} />
                <Text fontWeight="medium">Back</Text>
              </HStack>
            </Link>

            {/* Quiz Generation Card */}
            <Box bg={cardBg} p={6} borderRadius="lg" boxShadow="md" border="1px solid" borderColor={borderColor}>
              <VStack spacing={5} align="stretch">
                <Heading as="h1" size="md" textAlign="center" color="teal.500">
                  Generate Quiz from Document
                </Heading>

                {/* File Upload Section */}
                <Box
                  borderWidth={2}
                  borderStyle="dashed"
                  borderRadius="md"
                  p={6}
                  textAlign="center"
                  borderColor={borderColor}
                  position="relative"
                  cursor="pointer"
                  _hover={{ borderColor: "teal.500", bg: hoverBg }}
                  bg={inputBg}
                >
                  <Input
                    type="file"
                    height="100%"
                    width="100%"
                    position="absolute"
                    top="0"
                    left="0"
                    opacity="0"
                    aria-hidden="true"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    cursor="pointer"
                  />
                  <VStack spacing={2}>
                    <Icon as={Upload} boxSize={8} color="gray.400" />
                    <Text fontWeight="medium" color={textColor}>
                      Click to upload or drag and drop
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      PDF, DOC, DOCX, or TXT files
                    </Text>
                  </VStack>
                </Box>

                {/* File Preview */}
                {file && (
                  <HStack p={3} bg={useColorModeValue("gray.100", "gray.600")} borderRadius="md" justify="space-between">
                    <Text fontSize="sm" color={textColor}>
                      {file.name}
                    </Text>
                  </HStack>
                )}

                {/* Generate Button */}
                <MotionButton
                  colorScheme="teal"
                  size="md"
                  isDisabled={!file}
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  w="full"
                >
                  Generate Quiz
                </MotionButton>

                {/* Generated Quiz Output */}
                {generatedQuiz && (
                  <MotionBox
                    bg={useColorModeValue("blue.50", "gray.600")}
                    p={4}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={borderColor}
                    textAlign="center"
                  >
                    <VStack align="stretch" spacing={3}>
                      <Heading as="h3" size="sm" color="teal.500">
                        Generated Quiz
                      </Heading>
                      <Text fontSize="sm" color={textColor}>
                        {generatedQuiz}
                      </Text>
                      <HStack spacing={3} justify="center">
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
                        <MotionButton
                          colorScheme="teal"
                          size="sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
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
