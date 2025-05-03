"use client";

import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Spinner,
  useToast,
  Center,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { UnlockIcon } from "@chakra-ui/icons";

function UnblockAccountContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleUnblock = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/account/unblock", {
        method: "POST",
        body: JSON.stringify({ token }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus("success");
      setMessage(data.message);
      toast({
        title: "Account Unblocked!",
        description: "Redirecting to login...",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setTimeout(() => router.push("/login"), 3000);
    } catch (error: unknown) {
      const errMsg =
        error instanceof Error ? error.message : "Something went wrong.";
      setStatus("error");
      setMessage(errMsg);
      toast({
        title: "Error",
        description: errMsg,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const toastBg = useColorModeValue("gray.100", "gray.900");
  const colorSchemebg = useColorModeValue("teal", "blue");
  const iconColor = useColorModeValue("teal.500", "blue.400");

  return (
    <Center minH="100vh" bg={toastBg} px={4}>
      <Box
        w="full"
        maxW="md"
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="xl"
        bg={bg}
        borderColor={border}
        textAlign="center"
        transition="all 0.2s ease"
      >
        <VStack spacing={6}>
          <Icon as={UnlockIcon} w={8} h={8} color={iconColor} />
          <Heading fontSize="2xl">Unblock Your Cognivia Account</Heading>
          <Text fontSize="md" color={textColor}>
            We detected unusual activity on your account. Click below to
            securely restore access.
          </Text>

          {status === "idle" && (
            <Button
              colorScheme={colorSchemebg}
              onClick={handleUnblock}
              size="md"
              px={8}
            >
              Unblock My Account
            </Button>
          )}

          {status === "loading" && <Spinner size="lg" color="teal.500" />}

          {(status === "success" || status === "error") && (
            <Text
              color={status === "success" ? "green.500" : "red.400"}
              fontWeight="medium"
            >
              {message}
            </Text>
          )}
        </VStack>
      </Box>
    </Center>
  );
}

export default function UnblockAccountPage() {
  return (
    <Suspense
      fallback={
        <Center minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
          <VStack spacing={4}>
            <Spinner size="xl" color="teal.500" />
            <Text color={useColorModeValue("gray.600", "gray.300")}>
              Loading Unblock Page...
            </Text>
          </VStack>
        </Center>
      }
    >
      <UnblockAccountContent />
    </Suspense>
  );
}
