"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Button,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  VStack,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Flex,
  Divider,
  Select,
  Spinner,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons";

interface Quiz {
  _id: string;
  topic: string;
  questions: string[];
  options: string[][];
  answers: string[];
  createdAt: string;
  userId: string;
  isTaken?: boolean;
}

interface QuestionWithVisibility extends Quiz {
  areAnswersVisible: boolean[];
}

export default function ManageQuizzesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] =
    useState<QuestionWithVisibility | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isAlertDialogOpen,
    onOpen: onAlertDialogOpen,
    onClose: onAlertDialogClose,
  } = useDisclosure();
  const cancelRef = useRef(null);
  const [quizToDeleteId, setQuizToDeleteId] = useState<string | null>(null);
  const toast = useToast();
  const [filter, setFilter] = useState<"all" | "taken" | "notTaken">("all");
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);

  const bg = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const headingColor = useColorModeValue("teal.700", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const boxShadow = useColorModeValue("md", "md-dark");
  const cardColor = useColorModeValue("lg", "lg-dark");
  const boxColor = useColorModeValue("white", "gray.700");

  const fetchUserQuizzes = useCallback(
    async (userID: string) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/quizzes/user/${userID}`);
        const data = await res.json();
        if (res.ok) {
          setQuizzes(data.quizzes || []);
        } else {
          throw new Error(data?.message || "Failed to fetch quizzes.");
        }
      } catch (err) {
        toast({
          title: "Error loading quizzes",
          description: (err as Error).message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated" && session?.user?.id) {
      fetchUserQuizzes(session?.user?.id);
    }
  }, [status, router, session?.user?.id, fetchUserQuizzes]);

  useEffect(() => {
    if (filter === "all") {
      setFilteredQuizzes(quizzes);
    } else if (filter === "taken") {
      setFilteredQuizzes(quizzes.filter((quiz) => quiz.isTaken));
    } else if (filter === "notTaken") {
      setFilteredQuizzes(quizzes.filter((quiz) => !quiz.isTaken));
    }
  }, [quizzes, filter]);

  const handleCardClick = (quiz: Quiz) => {
    setSelectedQuiz({
      ...quiz,
      areAnswersVisible: quiz.questions.map(() => false),
    });
    onOpen();
  };

  const handleDeleteClick = (quizId: string) => {
    setQuizToDeleteId(quizId);
    onAlertDialogOpen();
  };

  const confirmDeleteQuiz = async () => {
    if (!quizToDeleteId) return;

    try {
      const res = await fetch(
        `/api/quizzes/${quizToDeleteId}?userID=${session?.user?.id}`,
        { method: "DELETE" }
      );

      const result = await res.json();
      if (res.ok) {
        setQuizzes((prev) =>
          prev.filter((quiz) => quiz._id !== quizToDeleteId)
        );
        toast({
          title: "Quiz deleted",
          description: "Successfully deleted quiz.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(result?.message || "Failed to delete quiz.");
      }
    } catch (err) {
      toast({
        title: "Error deleting quiz",
        description: (err as Error).message || "Unexpected error.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setQuizToDeleteId(null);
      onAlertDialogClose();
    }
  };

  const toggleAnswerVisibility = (index: number) => {
    if (selectedQuiz) {
      const newVisibility = [...selectedQuiz.areAnswersVisible];
      newVisibility[index] = !newVisibility[index];
      setSelectedQuiz({ ...selectedQuiz, areAnswersVisible: newVisibility });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg={bg}>
        <Spinner size="xl" color="teal.500" />
      </Flex>
    );
  }

  return (
    <Box bg={bg} minH="100vh">
      <Container maxW="6xl">
        <Heading
          as="h1"
          size="xl"
          fontWeight="semibold"
          color={headingColor}
          mb={8}
        >
          Manage Your Quizzes
        </Heading>

        <Flex mb={4} alignItems="center">
          <Text mr={2} fontWeight="semibold" color={textColor}>
            Filter Quizzes:
          </Text>
          <Select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as "all" | "taken" | "notTaken")
            }
            bg={cardBg}
            color={textColor}
            borderColor={borderColor}
          >
            <option value="all">All Quizzes</option>
            <option value="taken">Taken Quizzes</option>
            <option value="notTaken">Not Taken Quizzes</option>
          </Select>
        </Flex>

        {filteredQuizzes.length > 0 ? (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
            {filteredQuizzes.map((quiz) => (
              <Card
                key={quiz._id}
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="xl"
                boxShadow={boxShadow}
                cursor="pointer"
                transition="transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out"
                _hover={{
                  transform: "scale(1.02)",
                  boxShadow: cardColor,
                }}
                onClick={() => handleCardClick(quiz)}
              >
                <CardHeader pb={2}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="md" fontWeight="medium" color={textColor}>
                      {quiz.topic.length > 50
                        ? `${quiz.topic.slice(0, 50)}...`
                        : quiz.topic}
                    </Heading>
                    {quiz.isTaken ? (
                      <Tag size="sm" colorScheme="green" borderRadius="full">
                        <TagLabel>Taken</TagLabel>
                      </Tag>
                    ) : (
                      <Tag size="sm" colorScheme="orange" borderRadius="full">
                        <TagLabel>Not Taken</TagLabel>
                      </Tag>
                    )}
                  </Flex>
                </CardHeader>
                <CardBody pt={0}>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Text fontSize="sm" color="gray.500">
                      Created on:{" "}
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </Text>
                    <Flex>
                      {/* {!quiz.isTaken && (
                        <Button
                          size="sm"
                          colorScheme="teal"
                          mr={2}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartQuiz(quiz);
                          }}
                        >
                          Start Quiz
                        </Button>
                      )} */}
                      <IconButton
                        icon={<DeleteIcon />}
                        aria-label="Delete quiz"
                        colorScheme="red"
                        size="sm"
                        variant="ghost"
                        borderRadius="full"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(quiz._id);
                        }}
                        ml={2}
                      />
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <Text fontSize="lg" color="gray.600">
            {loading
              ? "Loading quizzes..."
              : "You haven't created any quizzes yet."}
          </Text>
        )}

        {/* Quiz Detail Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
          <ModalContent
            bg={cardBg}
            color={textColor}
            borderRadius="md"
            boxShadow={boxShadow}
          >
            <ModalCloseButton />
            <ModalBody>
              {selectedQuiz && (
                <VStack spacing={6} align="start">
                  <Heading size="lg" fontWeight="medium" color={headingColor}>
                    Topic: {selectedQuiz.topic}
                  </Heading>
                  <Divider />
                  <Heading size="md" fontWeight="semibold" color={headingColor}>
                    Questions:
                  </Heading>
                  <VStack spacing={4} align="start" w="full">
                    {selectedQuiz.questions.map((question, index) => (
                      <Box
                        key={index}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="md"
                        p={4}
                        w="full"
                        bg={boxColor}
                      >
                        <Text fontWeight="semibold" mb={2} color={textColor}>
                          Q{index + 1}: {question}
                        </Text>
                        <VStack align="start" ml={4}>
                          <Text fontWeight="medium" color="gray.600">
                            Options:
                          </Text>
                          {selectedQuiz.options[index]?.map((option, i) => (
                            <Text key={i} color={textColor}>
                              {String.fromCharCode(65 + i)}) {option}
                            </Text>
                          ))}
                        </VStack>
                        <Flex mt={2} align="center">
                          <Text fontWeight="medium" color="green.500" mr={2}>
                            Answer:{" "}
                            {selectedQuiz.areAnswersVisible[index]
                              ? selectedQuiz.answers[index]
                              : "********"}
                          </Text>
                          <IconButton
                            icon={<ViewIcon />}
                            aria-label={
                              selectedQuiz.areAnswersVisible[index]
                                ? "Hide Answer"
                                : "Show Answer"
                            }
                            size="sm"
                            colorScheme={
                              selectedQuiz.areAnswersVisible[index]
                                ? "gray"
                                : "teal"
                            }
                            onClick={() => toggleAnswerVisibility(index)}
                            borderRadius="full"
                            variant="ghost"
                          />
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                  <Divider />
                  <Text fontSize="sm" color="gray.500">
                    Created on:{" "}
                    {new Date(selectedQuiz.createdAt).toLocaleString()}
                  </Text>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation */}
        <AlertDialog
          isOpen={isAlertDialogOpen}
          leastDestructiveRef={cancelRef}
          onClose={onAlertDialogClose}
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent
            bg={cardBg}
            color={textColor}
            borderRadius="md"
            boxShadow={boxShadow}
          >
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="semibold"
              color={headingColor}
            >
              Delete Quiz
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this quiz? This action is
              irreversible.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertDialogClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                ml={3}
                onClick={confirmDeleteQuiz}
                fontWeight="semibold"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Container>
    </Box>
  );
}
