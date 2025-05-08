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
  Flex,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function SuccessContent() {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const highlightBg = useColorModeValue("blue.50", "blue.900");

  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  interface SessionData {
    userEmail: string;
    productPlan: string;
    amount: number;
    currency: string;
    status: string;
    creditsAdded?: number;
    subscriptionPeriod?: string;
  }

  const [data, setData] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch(
          `/api/stripe/checkout/success?session_id=${sessionId}`
        );
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
      <Center minH="70vh" px={6}>
        <Stack align="center" spacing={4}>
          <Spinner size="xl" color={accentColor} thickness="3px" />
          <Text fontSize="lg" color={textColor}>
            Verifying your payment...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Center minH="100vh" px={6}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        maxW="2xl"
        w="full"
      >
        <Box
          bg={cardBg}
          boxShadow="xl"
          py={4}
          rounded="3xl"
          overflow="hidden"
          borderWidth="1px"
          borderColor={borderColor}
        >
          {/* Header with accent */}
          <Box bg={accentColor} py={4} px-8>
            <Flex align="center" justify="center">
              <Icon as={CheckCircleIcon} w={8} h={8} color="white" mr={3} />
              <Heading as="h2" size="lg" color="white">
                Payment Successful!
              </Heading>
            </Flex>
          </Box>

          {/* Content */}
          <Box p-8>
            <Text fontSize="lg" color={textColor} mb={6} textAlign="center">
              Thank you for your purchase,{" "}
              <Text as="span" fontWeight="bold">
                {data?.userEmail}
              </Text>
              . Your account has been updated.
            </Text>

            {/* Details Card */}
            <Box
              bg={highlightBg}
              p={6}
              mb={6}
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Stack spacing={4}>
                <Flex justify="space-between">
                  <Text fontWeight="medium">Product:</Text>
                  <Text fontWeight="bold">{data?.productPlan}</Text>
                </Flex>

                <Flex justify="space-between">
                  <Text fontWeight="medium">Amount:</Text>
                  <Text fontWeight="bold">
                    ${data?.amount ? (data.amount / 100).toFixed(2) : "0.00"}{" "}
                    {data?.currency?.toUpperCase() || ""}
                  </Text>
                </Flex>

                {data?.creditsAdded && (
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Credits Added:</Text>
                    <Badge colorScheme="green" fontSize="md" px={2} py={1}>
                      +{data.creditsAdded}
                    </Badge>
                  </Flex>
                )}

                {data?.subscriptionPeriod && (
                  <Flex justify="space-between">
                    <Text fontWeight="medium">Subscription:</Text>
                    <Badge colorScheme="blue" fontSize="md" px={2} py={1}>
                      {data.subscriptionPeriod}
                    </Badge>
                  </Flex>
                )}

                <Flex justify="space-between">
                  <Text fontWeight="medium">Status:</Text>
                  <Badge
                    colorScheme={
                      data?.status === "complete" ? "green" : "yellow"
                    }
                    fontSize="md"
                    px={2}
                    py={1}
                  >
                    {data?.status}
                  </Badge>
                </Flex>
              </Stack>
            </Box>

            <Divider my={6} borderColor={borderColor} />

            {/* Action Buttons */}
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              justify="center"
            >
              <Button
                colorScheme="blue"
                size="md"
                px={8}
                rounded="full"
                onClick={handleDashboardClick}
                _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
                transition="all 0.2s"
              >
                Go to Dashboard
              </Button>
              <Button
                as={Link}
                href="/dashboard/transactions"
                variant="outline"
                colorScheme="blue"
                size="md"
                px={8}
                rounded="full"
                _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
                transition="all 0.2s"
              >
                View Transactions
              </Button>
            </Stack>
          </Box>
        </Box>

        {/* Additional Help */}
        <Text mt={8} textAlign="center" color={textColor} fontSize="sm">
          Need help?{" "}
          <Link href="/support" passHref>
            <Text
              as="span"
              color={accentColor}
              fontWeight="medium"
              cursor="pointer"
            >
              Contact our support team
            </Text>
          </Link>
        </Text>
      </MotionBox>
    </Center>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <Center minH="100vh" px={6}>
          <Stack align="center" spacing={4}>
            <Spinner size="xl" color="blue.500" thickness="3px" />
            <Text
              fontSize="lg"
              color={useColorModeValue("gray.700", "gray.200")}
            >
              Loading your payment details...
            </Text>
          </Stack>
        </Center>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
