// app/dashboard/page.tsx
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
} from "@chakra-ui/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Light & Dark Mode Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <Box>
      <Card bg={cardBg} borderRadius="lg" boxShadow="md" p={4}>
        <CardHeader>
          <Heading color={textColor} size="md">
            Overview
          </Heading>
        </CardHeader>
        <CardBody>
          <Text color={textColor}>
            Welcome back, {session.user?.email}! Here&#39;s your progress.
          </Text>
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={4}>
            <Card bg="teal.400" color="white" borderRadius="lg" p={4}>
              <Text fontSize="lg" fontWeight="bold">
                Completed Quizzes
              </Text>
              <Text fontSize="2xl">12</Text>
            </Card>
            <Card bg="blue.400" color="white" borderRadius="lg" p={4}>
              <Text fontSize="lg" fontWeight="bold">
                Average Score
              </Text>
              <Text fontSize="2xl">85%</Text>
            </Card>
            <Card bg="purple.400" color="white" borderRadius="lg" p={4}>
              <Text fontSize="lg" fontWeight="bold">
                Notes Created
              </Text>
              <Text fontSize="2xl">24</Text>
            </Card>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
}
