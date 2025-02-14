"use client"

import { useState } from "react"
import { Box, Button, Container, Heading, Text, VStack, HStack, Icon, Input } from "@chakra-ui/react"
import { ArrowLeft, Upload } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function DocumentQuizGeneration() {
  const [file, setFile] = useState<File | null>(null)
  const [generatedQuiz, setGeneratedQuiz] = useState("")
  const [isCardPressed, setIsCardPressed] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleGenerate = async () => {
    if (!file) return
    setGeneratedQuiz(`Generated quiz based on document: ${file.name}`)
  }

  return (
    <Box minH="100vh" bgGradient="linear(to-b, teal.50, blue.50)" py={12}>
      <Container maxW="lg">
        <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <VStack spacing={6} align="stretch">
            <Link href="/dashboard" style={{ textDecoration: "none" }}>
              <HStack spacing={2} color="teal.500">
                <Icon as={ArrowLeft} boxSize={4} />
                <Text>Back</Text>
              </HStack>
            </Link>

            <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
              <VStack spacing={5} align="stretch">
                <Heading as="h1" size="md" textAlign="center" color="teal.600">
                  Generate Quiz from Document
                </Heading>

                <Box
                  borderWidth={2}
                  borderStyle="dashed"
                  borderRadius="md"
                  p={6}
                  textAlign="center"
                  borderColor="gray.300"
                  position="relative"
                  cursor="pointer"
                  _hover={{ borderColor: "teal.500", bg: "teal.50" }}
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
                    <Text fontWeight="medium">Click to upload or drag and drop</Text>
                    <Text fontSize="sm" color="gray.500">
                      PDF, DOC, DOCX, or TXT files
                    </Text>
                  </VStack>
                </Box>

                {file && (
                  <HStack p={2} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm">{file.name}</Text>
                  </HStack>
                )}

                <MotionButton
                  colorScheme="teal"
                  size="md"
                  isDisabled={!file}
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate Quiz
                </MotionButton>

                {generatedQuiz && (
                  <MotionBox bg="gray.50" p={4} borderRadius="md" textAlign="center">
                    <VStack align="stretch" spacing={3}>
                      <Heading as="h3" size="sm" color="teal.700">
                        Generated Quiz
                      </Heading>
                      <Text fontSize="sm" color="gray.600">{generatedQuiz}</Text>
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
