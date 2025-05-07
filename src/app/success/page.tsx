"use client";

import {
  Box,
  Button,
  Center,
  Heading,
  Icon,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function SuccessContent() {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  interface SessionData {
    userEmail: string;
    productName: string;
    amount: number;
    currency: string;
    status: string;
  }

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(`/api/stripe/checkout/success?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }
        const sessionData = await response.json();
        setData(sessionData);
      } catch (error) {
        console.error("Error fetching session data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <Center py={20} px={6}>
        <Spinner size="xl" />
        <Text mt={4}>Loading payment details...</Text>
      </Center>
    );
  }

  return (
    <Center py={20} px={6}>
      <Box
        maxW="lg"
        w="full"
        bg={cardBg}
        boxShadow="2xl"
        rounded="2xl"
        p={10}
        textAlign="center"
      >
        <Icon as={CheckCircleIcon} w={20} h={20} color="green.400" mb={4} />
        <Heading as="h2" size="xl" mb={4}>
          Payment Successful!
        </Heading>
        <Text fontSize="lg" color={textColor} mb={6}>
          Thank you for your purchase, {data?.userEmail}. Your account has been updated.
        </Text>
        <Text fontWeight="bold">Product: {data?.productName}</Text>
        <Text>
          Amount: ${(data?.amount ? (data.amount / 100).toFixed(2) : "0.00")}{" "}
          {data?.currency?.toUpperCase() || ""}
        </Text>
        <Text>Status: {data?.status}</Text>
        <Stack direction="column" spacing={4} align="center" mt={6}>
          <Button
            colorScheme="blue"
            variant="solid"
            size="md"
            px={6}
            onClick={handleDashboardClick}
          >
            Go to Dashboard
          </Button>
          <Button
            as={Link}
            href="/dashboard/transactions"
            variant="link"
            colorScheme="blue"
            size="sm"
          >
            View Subscription & Credits
          </Button>
        </Stack>
      </Box>
    </Center>
  );
}

// ✅ Suspense wrapper with fallback spinner
export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <Center py={20} px={6}>
          <Spinner size="xl" />
          <Text mt={4}>Loading...</Text>
        </Center>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
