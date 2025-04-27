"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  CardHeader,
  CardBody,
  Grid,
  Progress,
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

  if (loading) {
    return (
      <Box minH="80vh" display="flex" justifyContent="center" alignItems="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!performanceData) return null;

  const { totalQuizzes, averageScore, topTopics, recentScores } = performanceData;

  return (
    <Box p={{ base: 4, md: 8 }} maxW="6xl" mx="auto">
      <VStack spacing={8} align="stretch">
        <Card>
          <CardHeader>
            <Heading size="md">Your Learning Analytics</Heading>
          </CardHeader>
          <CardBody>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
              <Stat>
                <StatLabel>Total Quizzes Taken</StatLabel>
                <StatNumber>{totalQuizzes}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Average Score</StatLabel>
                <StatNumber>{averageScore}%</StatNumber>
              </Stat>
            </Grid>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="sm">Top Topics</Heading>
          </CardHeader>
          <CardBody>
            {topTopics.length === 0 ? (
              <Text>No topic data available.</Text>
            ) : (
              <VStack spacing={3} align="stretch">
                {topTopics.map((t) => (
                  <Box key={t.topic}>
                    <Text fontWeight="medium">{t.topic}</Text>
                    <Progress value={(t.count / totalQuizzes) * 100} colorScheme="teal" />
                  </Box>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="sm">Recent Quiz Scores</Heading>
          </CardHeader>
          <CardBody>
            {recentScores.length === 0 ? (
              <Text>No recent quiz scores.</Text>
            ) : (
              <VStack spacing={4} align="stretch">
                {recentScores.map((r, i) => (
                  <HStack key={i} justify="space-between">
                    <Text>
                      <strong>{r.topic}</strong>
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      {new Date(r.date).toLocaleDateString()}
                    </Text>
                    <Text>{r.score}%</Text>
                  </HStack>
                ))}
              </VStack>
            )}
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
