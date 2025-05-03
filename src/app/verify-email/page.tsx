"use client";

import {
  Box,
  Spinner,
  Text,
  Heading,
  Center,
  VStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

type StatusType = "verifying" | "success" | "error";

function VerifyEmailContent() {
  const token = useSearchParams().get("token");
  const router = useRouter();
  const [status, setStatus] = useState<StatusType>("verifying");

  const boxBg = useColorModeValue("white", "gray.800");
  const pageBg = useColorModeValue("gray.100", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");

  useEffect(() => {
    if (token) {
      fetch("/api/auth/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setStatus("success");
            setTimeout(() => router.push("/login"), 2500);
          } else {
            setStatus("error");
          }
        })
        .catch(() => setStatus("error"));
    }
  }, [token, router]);

  return (
    <Center minH="100vh" bg={pageBg} transition="background 0.2s ease">
      <Box
        p={10}
        rounded="2xl"
        bg={boxBg}
        shadow="xl"
        textAlign="center"
        maxW="sm"
        w="full"
        transition="all 0.2s ease"
      >
        <VStack spacing={6}>
          {status === "verifying" && (
            <>
              <Spinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                color="blue.400"
              />
              <Heading size="md">Verifying Email...</Heading>
              <Text color={textColor}>
                Please wait while we verify your email.
              </Text>
            </>
          )}

          {status === "success" && (
            <>
              <Icon as={CheckCircleIcon} w={10} h={10} color="green.400" />
              <Heading size="md">Email Verified!</Heading>
              <Text color={textColor}>Redirecting to login page...</Text>
            </>
          )}

          {status === "error" && (
            <>
              <Icon as={WarningIcon} w={10} h={10} color="red.400" />
              <Heading size="md">Verification Failed</Heading>
              <Text color={textColor}>
                Invalid or expired token. Please try again.
              </Text>
            </>
          )}
        </VStack>
      </Box>
    </Center>
  );
}

export default function VerifyEmail() {
  const pageBg = useColorModeValue("gray.100", "gray.900");
  const boxBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Suspense
      fallback={
        <Center minH="100vh" bg={pageBg}>
          <Box
            p={10}
            rounded="2xl"
            bg={boxBg}
            shadow="lg"
            textAlign="center"
            maxW="sm"
            w="full"
          >
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.400" />
            <Text mt={4} color={textColor}>
              Loading verification...
            </Text>
          </Box>
        </Center>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
