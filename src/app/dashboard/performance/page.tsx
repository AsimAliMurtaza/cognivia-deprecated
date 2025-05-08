"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardHeader,
  CardBody,
  Grid,
  Progress,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function PerformancePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState<null | {
    totalQuizzes: number;
    averageScore: number;
    topTopics: { topic: string; count: number }[];
    recentScores: { topic: string; score: number; date: string }[];
  }>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/dashboard/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: session?.user?.id }),
      });
      const data = await res.json();
      setPerformanceData(data);
      setLoading(false);
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [session?.user?.id]);

  const cardBg = useColorModeValue("white", "gray.800");
  const sectionTitleColor = useColorModeValue("gray.700", "gray.200");

  return (
    <Box p={{ base: 4, md: 8 }} maxW="6xl" mx="auto" minH="80vh">
      <VStack spacing={8} align="stretch">
        {/* Performance Stats */}
        <Card bg={cardBg} borderRadius="xl" shadow="md">
          <CardHeader>
            <Heading size="lg" color={sectionTitleColor}>
              Your Learning Analytics
            </Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Skeleton height="100px" />
            ) : performanceData ? (
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
                <Stat>
                  <StatLabel>Total Quizzes Taken</StatLabel>
                  <StatNumber>{performanceData.totalQuizzes}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Average Score</StatLabel>
                  <StatNumber>{performanceData.averageScore}%</StatNumber>
                </Stat>
              </Grid>
            ) : (
              <Text>No performance data available.</Text>
            )}
          </CardBody>
        </Card>

        {/* Top Topics */}
        <Card bg={cardBg} borderRadius="xl" shadow="md">
          <CardHeader>
            <Heading size="md" color={sectionTitleColor}>
              Top Topics
            </Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <VStack spacing={4}>
                <Skeleton height="20px" w="100%" />
                <Skeleton height="20px" w="100%" />
                <Skeleton height="20px" w="100%" />
              </VStack>
            ) : performanceData?.topTopics?.length ? (
              <VStack spacing={4} align="stretch">
                {performanceData.topTopics.map((t) => (
                  <Box key={t.topic}>
                    <Text fontWeight="medium" mb={1}>
                      {t.topic}
                    </Text>
                    <Progress
                      value={(t.count / performanceData.totalQuizzes) * 100}
                      colorScheme="teal"
                    />
                  </Box>
                ))}
              </VStack>
            ) : (
              <Text>No top topics found.</Text>
            )}
          </CardBody>
        </Card>

        {/* Recent Scores */}
        <Card bg={cardBg} borderRadius="xl" shadow="md">
          <CardHeader>
            <Heading size="md" color={sectionTitleColor}>
              Recent Quiz Scores
            </Heading>
          </CardHeader>
          <CardBody>
            {loading ? (
              <VStack spacing={4}>
                <Skeleton height="24px" w="100%" />
                <Skeleton height="24px" w="100%" />
              </VStack>
            ) : performanceData?.recentScores?.length ? (
              <VStack spacing={4} align="stretch">
                {performanceData.recentScores.map((r, i) => (
                  <HStack key={i} justify="space-between" wrap="wrap">
                    <Text fontWeight="medium">{r.topic}</Text>
                    <Text fontSize="sm" color="gray.500">
                      {new Date(r.date).toLocaleDateString()}
                    </Text>
                    <Badge
                      colorScheme={
                        r.score >= 80
                          ? "green"
                          : r.score >= 50
                          ? "yellow"
                          : "red"
                      }
                      borderRadius="full"
                      px={2}
                    >
                      {r.score}%
                    </Badge>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text>No recent quiz scores.</Text>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
