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
  Flex,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FaCheckCircle, FaChartLine, FaStickyNote } from "react-icons/fa";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Light & Dark Mode Colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  // Responsive layout
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <Box>
      <Card
        bg={cardBg}
        borderRadius="2xl" // Rounded corners
        boxShadow="lg" // Subtle shadow
        p={6}
      >
        <CardHeader>
          <Heading color={textColor} size="lg" mb={2}>
            Overview
          </Heading>
          <Text color={textColor} fontSize="md" opacity={0.8}>
            Welcome back, {session.user?.email}! Here&#39;s your progress.
          </Text>
        </CardHeader>
        <CardBody>
          <Grid
            templateColumns={isMobile ? "1fr" : "repeat(3, 1fr)"} // Stack on mobile, grid on desktop
            gap={6}
            mt={4}
          >
            {/* Completed Quizzes Card */}
            <Card
              bgGradient="linear(to-br, teal.400, teal.500)" // Gradient background
              color="white"
              borderRadius="2xl" // Rounded corners
              p={6}
              boxShadow="md" // Subtle shadow
              _hover={{ transform: "scale(1.02)", transition: "all 0.2s" }} // Hover effect
            >
              <Flex align="center" mb={4}>
                <Box
                  as={FaCheckCircle}
                  size="24px"
                  color="white"
                  mr={3}
                  opacity={0.8}
                />
                <Text fontSize="lg" fontWeight="bold">
                  Completed Quizzes
                </Text>
              </Flex>
              <Text fontSize="3xl" fontWeight="bold">
                12
              </Text>
            </Card>

            {/* Average Score Card */}
            <Card
              bgGradient="linear(to-br, blue.400, blue.500)" // Gradient background
              color="white"
              borderRadius="2xl" // Rounded corners
              p={6}
              boxShadow="md" // Subtle shadow
              _hover={{ transform: "scale(1.02)", transition: "all 0.2s" }} // Hover effect
            >
              <Flex align="center" mb={4}>
                <Box
                  as={FaChartLine}
                  size="24px"
                  color="white"
                  mr={3}
                  opacity={0.8}
                />
                <Text fontSize="lg" fontWeight="bold">
                  Average Score
                </Text>
              </Flex>
              <Text fontSize="3xl" fontWeight="bold">
                85%
              </Text>
            </Card>

            {/* Notes Created Card */}
            <Card
              bgGradient="linear(to-br, purple.400, purple.500)" // Gradient background
              color="white"
              borderRadius="2xl" // Rounded corners
              p={6}
              boxShadow="md" // Subtle shadow
              _hover={{ transform: "scale(1.02)", transition: "all 0.2s" }} // Hover effect
            >
              <Flex align="center" mb={4}>
                <Box
                  as={FaStickyNote}
                  size="24px"
                  color="white"
                  mr={3}
                  opacity={0.8}
                />
                <Text fontSize="lg" fontWeight="bold">
                  Notes Created
                </Text>
              </Flex>
              <Text fontSize="3xl" fontWeight="bold">
                24
              </Text>
            </Card>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
}
