"use client"

import { useState } from "react"
import { Box, Button, Container, Heading, Text, VStack, HStack, Icon, Input, Image } from "@chakra-ui/react"
import { ArrowLeft, Upload } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const MotionBox = motion(Box)
const MotionButton = motion(Button)

export default function ImageQuizGeneration() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [generatedQuiz, setGeneratedQuiz] = useState("")
  const [isCardPressed, setIsCardPressed] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!image) return
    setGeneratedQuiz(`Generated quiz based on image: ${image.name}`)
  }

  const handleCardPress = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevents unintended selections when clicking inside the card
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
    <Box minH="100vh" bg={isCardPressed ? "white" : "azure"} py={12}>
      <Container maxW="3xl">
        <MotionBox variants={containerVariants} initial="hidden" animate="visible">
          <VStack spacing={8} align="stretch">
            {/* Preventing file selection when clicking the back link */}
            <Link href="/dashboard" passHref>
              <HStack spacing={2} color="teal.500" cursor="pointer">
                <Icon as={ArrowLeft} boxSize={4} />
                <Text>Back</Text>
              </HStack>
            </Link>

            {/* Smaller Card */}
            <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
              <VStack spacing={6} align="stretch">
                <Heading as="h1" size="lg">
                  Generate Quiz from Image
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
                  _hover={{ borderColor: "teal.500" }}
                  onClick={handleCardPress}
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
                    accept="image/*"
                    onChange={handleImageChange}
                    cursor="pointer"
                  />
                  <VStack spacing={2}>
                    <Icon as={Upload} boxSize={10} color="gray.400" />
                    <Text fontWeight="medium">Click to upload or drag and drop</Text>
                    <Text fontSize="sm" color="gray.500">
                      PNG, JPG, or GIF files
                    </Text>
                  </VStack>
                </Box>

                {preview && (
                  <Box borderRadius="md" overflow="hidden">
                    <Image src={preview || "/placeholder.svg"} alt="Preview" objectFit="cover" width="100%" />
                  </Box>
                )}

                <MotionButton
                  colorScheme="teal"
                  size="lg"
                  isDisabled={!image}
                  onClick={handleGenerate}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Generate Quiz
                </MotionButton>

                {generatedQuiz && (
                  <MotionBox
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    bg="gray.50"
                    p={6}
                    borderRadius="md"
                  >
                    <VStack align="stretch" spacing={4}>
                      <Heading as="h3" size="md">
                        Generated Quiz
                      </Heading>
                      <Text color="gray.600">{generatedQuiz}</Text>
                      <HStack spacing={4}>
                        <MotionButton
                          variant="outline"
                          colorScheme="teal"
                          onClick={handleGenerate}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Regenerate
                        </MotionButton>
                        <MotionButton colorScheme="teal" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
