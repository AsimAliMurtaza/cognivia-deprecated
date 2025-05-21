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

const extractNoteTitle = (prompt: string): string => {
  const match = prompt.match(/:\s*(.+?)\s*(?:\(|$)/);
  return match ? match[1].trim() : prompt;
};

interface DashboardStatProps {
  icon: React.ElementType;
  title: string;
  value: string;
  bgGradient: string;
}

const DashboardStatCard = ({
  icon,
  title,
  value,
  bgGradient,
}: DashboardStatProps) => {
  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      bgGradient={bgGradient}
      color="white"
      borderRadius="xl"
      p={6}
      boxShadow="md"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      <CardBody>
        <VStack align="flex-start" spacing={3}>
          <HStack>
            <Icon as={icon} boxSize={5} opacity={0.8} />
            <Text fontSize="md" fontWeight="medium" letterSpacing="wide">
              {title}
            </Text>
          </HStack>
          <Text fontSize="2xl" fontWeight="bold" lineHeight="1">
            {value}
          </Text>
        </VStack>
      </CardBody>
    </MotionCard>
  );
};

interface RecentActivityItemProps {
  title: string;
  date: string;
}

const RecentActivityItem = ({ title, date }: RecentActivityItemProps) => {
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const boxBg = useColorModeValue("gray.100", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      p={3}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="md"
      bg={boxBg}
    >
      <HStack justify="space-between">
        <Text fontWeight="medium">{title}</Text>
        <Text fontSize="sm" color={secondaryText}>
          {date}
        </Text>
      </HStack>
    </Box>
  );
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
    lg: "repeat(4, 1fr)", // Adjusted to 4 columns for stats
  });

  const recentActivityColumns = useBreakpointValue({
    base: "1fr",
    md: "repeat(2, 1fr)",
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
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!dashboardData) return null;

  const {
    quizzesCount,
    averageScore,
    notesCount,
    recentNotes,
    recentQuizzes,
    takenQuizCount,
  } = dashboardData;

  const statsData = [
    {
      icon: FaCheckCircle,
      title: "Total Classes",
      value: quizzesCount.toString(),
      bgGradient: bgGradientColors,
    },
  ];

  return (
    <Box bg={bgColor} minH="100vh" p={{ base: 4, md: 8 }}>
      <VStack spacing={8} align="stretch" maxW="7xl" mx="auto">
        {/* Overview */}
        <MotionCard
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          bg={cardBg}
          borderRadius="xl"
          boxShadow="sm"
        >
          <CardHeader pb={2}>
            <Heading
              as="h1"
              size="xl"
              fontWeight="semibold"
              color={accentColor}
            >
             Archive
            </Heading>
            <Text color={secondaryText} fontSize="md">
              Welcome back, {session?.user?.name || session?.user?.email}!
            </Text>
          </CardHeader>
        </MotionCard>
        <Text fontSize="lg" fontWeight="semibold" color={secondaryText}>
          Archive coming soon...
        </Text>
      </VStack>
    </Box>
  );
}
