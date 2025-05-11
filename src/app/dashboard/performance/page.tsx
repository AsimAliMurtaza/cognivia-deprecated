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
  CircularProgress,
  CircularProgressLabel,
  SkeletonCircle,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MotionProgress = motion(Progress);

const ScoreBadge = ({ score }: { score: number }) => {
  let colorScheme = "gray";
  if (score >= 80) colorScheme = "green";
  else if (score >= 60) colorScheme = "blue";
  else if (score >= 40) colorScheme = "yellow";
  else colorScheme = "red";

  return (
    <Badge colorScheme={colorScheme} borderRadius="full" px={2}>
      {score}%
    </Badge>
  );
};

const AnimatedProgressBar = ({
  value,
  label,
}: {
  value: number;
  label: string;
}) => {
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <VStack align="stretch" spacing={1}>
      <Text fontSize="sm" color={textColor}>
        {label} ({Math.round(value * 100)}%)
      </Text>
      <MotionProgress
        value={value * 100}
        colorScheme="teal"
        height="8px"
        borderRadius="md"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
    </VStack>
  );
};

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
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Box p={{ base: 4, md: 8 }} maxW="6xl" mx="auto" minH="80vh">
      <VStack spacing={10} align="stretch">
        <Heading size="xl" color={sectionTitleColor} fontWeight="semibold">
          Your Learning Performance
        </Heading>

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(2, 1fr)",
          }}
          gap={6}
        >
          {/* Overall Performance */}
          <Card bg={cardBg} borderRadius="xl" shadow="md" h="full">
            <CardHeader>
              <Heading size="md" color={sectionTitleColor}>
                Overall Progress
              </Heading>
            </CardHeader>
            <CardBody
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              py={8}
            >
              {loading ? (
                <SkeletonCircle size="80px" mb={4} />
              ) : performanceData ? (
                <CircularProgress
                  value={performanceData.averageScore}
                  size="120px"
                  color={
                    performanceData.averageScore >= 80
                      ? "green.400"
                      : performanceData.averageScore >= 60
                      ? "blue.400"
                      : performanceData.averageScore >= 40
                      ? "yellow.400"
                      : "red.400"
                  }
                >
                  <CircularProgressLabel>
                    {performanceData.averageScore}%
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                <Text color={textColor}>No performance data.</Text>
              )}
              <Stat mt={4} textAlign="center">
                <StatLabel color={textColor}>Total Quizzes</StatLabel>
                <StatNumber>
                  {loading ? (
                    <Skeleton w="40px" />
                  ) : (
                    performanceData?.totalQuizzes
                  )}
                </StatNumber>
              </Stat>
            </CardBody>
          </Card>

          {/* Top Topics */}
          <Card bg={cardBg} borderRadius="xl" shadow="md" h="full">
            <CardHeader>
              <Heading size="md" color={sectionTitleColor}>
                Top Topics
              </Heading>
            </CardHeader>
            <CardBody>
              {loading ? (
                <VStack spacing={3}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} height="25px" />
                  ))}
                </VStack>
              ) : performanceData?.topTopics?.length ? (
                <VStack spacing={4} align="stretch">
                  {performanceData.topTopics.map((t) => (
                    <AnimatedProgressBar
                      key={t.topic}
                      label={t.topic}
                      value={
                        performanceData.totalQuizzes > 0
                          ? t.count / performanceData.totalQuizzes
                          : 0
                      }
                    />
                  ))}
                  {performanceData.topTopics.length === 0 && (
                    <Text color={textColor}>No top topics found.</Text>
                  )}
                </VStack>
              ) : (
                <Text color={textColor}>No top topics data.</Text>
              )}
            </CardBody>
          </Card>

          {/* Recent Scores */}
          <Card bg={cardBg} borderRadius="xl" shadow="md" h="full">
            <CardHeader>
              <Heading size="md" color={sectionTitleColor}>
                Recent Quiz Scores
              </Heading>
            </CardHeader>
            <CardBody>
              {loading ? (
                <VStack spacing={3}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} height="20px" />
                  ))}
                </VStack>
              ) : performanceData?.recentScores?.length ? (
                <VStack spacing={4} align="stretch">
                  {performanceData.recentScores.map((r) => (
                    <HStack key={r.topic + r.date} justify="space-between">
                      <Text fontWeight="medium" color={textColor}>
                        {r.topic}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(r.date).toLocaleDateString()}
                      </Text>
                      <ScoreBadge score={r.score} />
                    </HStack>
                  ))}
                  {performanceData.recentScores.length === 0 && (
                    <Text color={textColor}>No recent scores.</Text>
                  )}
                </VStack>
              ) : (
                <Text color={textColor}>No recent scores data.</Text>
              )}
            </CardBody>
          </Card>
        </Grid>
      </VStack>
    </Box>
  );
}
