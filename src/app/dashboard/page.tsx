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
} from "@chakra-ui/react";
import { FaCheckCircle, FaChartLine, FaStickyNote } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // Material You inspired colors with teal/blue theming
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const secondaryText = useColorModeValue("gray.600", "gray.300");
  const accentColor = useColorModeValue("teal.500", "blue.400");
  const bgGradientColors = useColorModeValue(
    "linear(to-br, teal.400, teal.500)",
    "linear(to-br, blue.400, blue.500)"
  );

  const bgGradientColorstwo = useColorModeValue(
    "linear(to-br, teal.300, teal.400)",
    "linear(to-br, blue.300, blue.400)"
  );

  const bgGradientColorsthree = useColorModeValue(
    "linear(to-br, teal.200, teal.300)",
    "linear(to-br, blue.200, blue.300)"
  );

  // Responsive layout
  const gridColumns = useBreakpointValue({
    base: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  });

  if (!session) {
    router.push("/login");
    return null;
  }

  // Stats data
  const stats = [
    {
      icon: FaCheckCircle,
      title: "Completed Quizzes",
      value: "12",
      bgGradient: bgGradientColors,
    },
    {
      icon: FaChartLine,
      title: "Average Score",
      value: "85%",
      bgGradient: bgGradientColorstwo,
    },
    {
      icon: FaStickyNote,
      title: "Notes Created",
      value: "24",
      bgGradient: bgGradientColorsthree,
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <VStack spacing={6} align="stretch" maxW="7xl" mx="auto">
        {/* Header Card */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="sm"
          overflow="hidden"
        >
          <CardHeader pb={0}>
            <Heading
              as="h1"
              size="lg"
              fontWeight="semibold"
              color={accentColor}
              mb={2}
            >
              Overview
            </Heading>
            <Text color={secondaryText} fontSize="md">
              Welcome back, {session.user?.name || session.user?.email}! Here&apos;s
              your progress.
            </Text>
          </CardHeader>
        </MotionCard>

        {/* Stats Grid */}
        <Grid templateColumns={gridColumns} gap={6} mt={2}>
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
                    <Icon
                      as={stat.icon}
                      boxSize={6}
                      color="white"
                      opacity={0.9}
                    />
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      letterSpacing="wide"
                    >
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

        {/* Additional Content Sections */}
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          bg={cardBg}
          borderRadius="2xl"
          boxShadow="sm"
        >
          <CardHeader>
            <Heading
              as="h2"
              size="md"
              fontWeight="semibold"
              color={accentColor}
            >
              Recent Activity
            </Heading>
          </CardHeader>
          <CardBody>
            <Text color={secondaryText}>
              Your recent quiz attempts and notes will appear here.
            </Text>
          </CardBody>
        </MotionCard>
      </VStack>
    </Box>
  );
}
