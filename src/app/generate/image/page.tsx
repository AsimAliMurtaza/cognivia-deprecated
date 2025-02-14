
"use client";

import { useState } from "react";

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
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { ArrowLeft, Upload } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function ImageQuizGeneration() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [isCardPressed, setIsCardPressed] = useState(false);

  // ✅ Move useColorModeValue calls to the top
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const boxBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("teal.300", "teal.500");
  const inputBg = useColorModeValue("gray.100", "gray.600");
  const outputBg = useColorModeValue("blue.50", "gray.600");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!image) return;
    setGeneratedQuiz(`Generated quiz based on image: ${image.name}`);
  };

  const handleCardPress = (e: React.MouseEvent) => {
    console.log(isCardPressed);
    e.stopPropagation();
    setIsCardPressed(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  
  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW={{ base: "90%", md: "3xl" }}>
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={8} align="stretch">
            {/* Back Button */}
            <Link href="/dashboard/quizzes" passHref>
              <HStack
                spacing={2}
                color="teal.500"
                _hover={{ color: "teal.700" }}
                cursor="pointer"
              >
                <Icon as={ArrowLeft} boxSize={4} />
                <Text fontWeight="medium">Back</Text>
              </HStack>
            </Link>

            {/* Quiz Generation Card */}
            <Box
              bg={boxBg}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px solid"
              borderColor={borderColor}
            >

              <VStack spacing={6} align="stretch">
                <Heading as="h1" size="md" color="teal.500">
                  Generate Quiz from Image
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
                  _hover={{ borderColor: "teal.500" }}
                  onClick={handleCardPress}
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
                    accept="image/*"
                    onChange={handleImageChange}
                    cursor="pointer"
                  />
                  <VStack spacing={2}>
                    <Icon as={Upload} boxSize={10} color="gray.400" />
                    <Text fontWeight="medium" color={textColor}>
                      Click to upload or drag and drop
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      PNG, JPG, or GIF files
                    </Text>
                  </VStack>
                </Box>

                {/* Image Preview */}
                {preview && (
                  <Box borderRadius="md" overflow="hidden">
                    <Image
                      src={preview || "/placeholder.svg"}
                      alt="Preview"
                      objectFit="cover"
                      width="100%"
                    />
                  </Box>
                )}

                {/* Generate Button */}
                <MotionButton
                  colorScheme="teal"
                  size="md"
                  isDisabled={!image}
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
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    bg={outputBg} // ✅ Use predefined variable here

                    p={4}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <VStack align="stretch" spacing={3}>
                      <Heading as="h3" size="sm" color="teal.500">
                        Generated Quiz
                      </Heading>
                      <Text color={textColor} fontSize="sm">
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
                          flex={1}
                        >
                          Regenerate
                        </MotionButton>
                        <MotionButton
                          colorScheme="teal"
                          size="sm"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          flex={1}
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
  );
}
