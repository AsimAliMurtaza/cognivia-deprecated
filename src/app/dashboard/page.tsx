"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Grid,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  useBreakpointValue,
  Icon,
  VStack,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import { FaCheckCircle, FaChartLine, FaStickyNote } from "react-icons/fa";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MotionCard = motion(Card);

// 🧠 Helper function to extract note title
const extractNoteTitle = (prompt: string): string => {
  // Match text between ":" and "(" to extract actual topic
  const match = prompt.match(/:\s*(.+?)\s*(?:\(|$)/);
  return match ? match[1].trim() : prompt;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    quizzesCount: number;
    averageScore: number;
    notesCount: number;
    recentQuizzes: { topic: string; createdAt: string }[];
    recentNotes: { prompt: string; createdAt: string }[];
    takenQuizCount: number;
  } | null>(null);

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const secondaryText = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("teal.500", "blue.400");
  const boxColor = useColorModeValue("gray.50", "gray.800");
  const bgGradientColors = useColorModeValue(
    "linear(to-br, teal.400, teal.500)",
    "linear(to-br, blue.400, blue.500)"
  );
  const bgGradientColorsfour = useColorModeValue(
    "linear(to-br, teal.300, teal.500)",
    "linear(to-tl, blue.400, blue.500)"
  );
  const bgGradientColorstwo = useColorModeValue(
    "linear(to-tr, teal.300, teal.400)",
    "linear(to-br, blue.300, blue.400)"
  );
  const bgGradientColorsthree = useColorModeValue(
    "linear(to-bl, teal.200, teal.300)",
    "linear(to-br, blue.200, blue.300)"
  );

  const gridColumns = useBreakpointValue({
    base: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: session.user?.id }),
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <Box minH="100vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!dashboardData) return null;

  const { quizzesCount, averageScore, notesCount, recentNotes, recentQuizzes, takenQuizCount } = dashboardData;

  const stats = [
    {
      icon: FaCheckCircle,
      title: "Quizzes Created",
      value: quizzesCount.toString(),
      bgGradient: bgGradientColors,
    },
    {
      icon: FaCheckCircle,
      title: "Cpmpleted Quizzes",
      value: takenQuizCount.toString(),
      bgGradient: bgGradientColorsfour,
    },
    {
      icon: FaChartLine,
      title: "Average Score",
      value: `${averageScore}%`,
      bgGradient: bgGradientColorstwo,
    },
    {
      icon: FaStickyNote,
      title: "Notes Created",
      value: notesCount.toString(),
      bgGradient: bgGradientColorsthree,
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <VStack spacing={6} align="stretch" maxW="7xl" mx="auto">
        {/* Overview */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="sm"
        >
          <CardHeader pb={0}>
            <Heading as="h1" size="lg" fontWeight="semibold" color={accentColor} mb={2}>
              Overview
            </Heading>
            <Text color={secondaryText} fontSize="md">
              Welcome back, {session?.user?.name || session?.user?.email}! Here&apos;s your progress.
            </Text>
          </CardHeader>
        </MotionCard>

        {/* Stats */}
        <Grid templateColumns={gridColumns} gap={6}>
          {stats.map((stat, index) => (
            <MotionCard
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              bgGradient={stat.bgGradient}
              color="white"
              borderRadius="2xl"
              p={6}
              boxShadow="sm"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardBody>
                <VStack align="flex-start" spacing={4}>
                  <HStack>
                    <Icon as={stat.icon} boxSize={6} opacity={0.9} />
                    <Text fontSize="lg" fontWeight="medium" letterSpacing="wide">
                      {stat.title}
                    </Text>
                  </HStack>
                  <Text fontSize="3xl" fontWeight="bold" lineHeight="1">
                    {stat.value}
                  </Text>
                </VStack>
              </CardBody>
            </MotionCard>
          ))}
        </Grid>

        {/* Recent Activity */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="sm"
        >
          <CardHeader>
            <Heading as="h2" size="md" fontWeight="semibold" color={accentColor}>
              Recent Activity
            </Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
              {/* Recent Quizzes */}
              <Box>
                <Text fontWeight="medium" color={secondaryText} mb={2}>
                  Recent Quizzes
                </Text>
                {recentQuizzes.length === 0 ? (
                  <Text fontSize="sm" color="gray.500">
                    No recent quizzes
                  </Text>
                ) : (
                  recentQuizzes.map((quiz, i) => (
                    <Box
                      key={i}
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      mb={2}
                      _dark={{ borderColor: "gray.700" }}
                      bg={boxColor}
                    >
                      <HStack justify="space-between">
                        <Text fontWeight="medium">{quiz.topic}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                    </Box>
                  ))
                )}
              </Box>

              {/* Recent Notes */}
              <Box>
                <Text fontWeight="medium" color={secondaryText} mb={2}>
                  Recent Notes
                </Text>
                {recentNotes.length === 0 ? (
                  <Text fontSize="sm" color="gray.500">
                    No recent notes
                  </Text>
                ) : (
                  recentNotes.map((note, i) => (
                    <Box
                      key={i}
                      p={3}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="lg"
                      mb={2}
                      _dark={{ borderColor: "gray.700" }}
                      bg={boxColor}
                    >
                      <HStack justify="space-between">
                        <Text fontWeight="medium">{extractNoteTitle(note.prompt)}</Text>
                        <Text fontSize="xs" color="gray.500">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </Text>
                      </HStack>
                    </Box>
                  ))
                )}
              </Box>
            </Grid>
          </CardBody>
        </MotionCard>
      </VStack>
    </Box>
  );
}
