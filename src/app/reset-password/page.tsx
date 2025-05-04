"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  Heading,
  Text,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useSearchParams, useRouter } from "next/navigation";
import { FormEvent, useState, useEffect, Suspense, useCallback } from "react";

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toast = useToast();

  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const bg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const buttonColor = useColorModeValue("teal", "blue");

  // Safe memoized callback to extract token from search params
  const extractToken = useCallback(() => {
    const foundToken = searchParams.get("token");
    if (foundToken) {
      setToken(foundToken);
    }
  }, [searchParams]);

  useEffect(() => {
    extractToken();
  }, [extractToken]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirm) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!token) {
      toast({
        title: "Error",
        description: "Invalid reset password link.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast({
        title: "Error",
        description: "Unexpected error occurred",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt={10}
      p={6}
      borderRadius="2xl"
      bg={bg}
      boxShadow="lg"
    >
      <Heading fontSize="2xl" mb={2} textAlign="center">
        Reset Your Password
      </Heading>
      <Text fontSize="sm" color="gray.500" textAlign="center" mb={6}>
        Enter and confirm your new password below.
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl id="password" mb={4} isRequired>
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            bg={inputBg}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            rounded="lg"
            shadow="sm"
          />
        </FormControl>
        <FormControl id="confirm" mb={6} isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            bg={inputBg}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            rounded="lg"
            shadow="sm"
          />
        </FormControl>
        <Button
          type="submit"
          colorScheme={buttonColor}
          w="full"
          isLoading={loading}
          rounded="lg"
          shadow="md"
        >
          Change Password
        </Button>
      </form>
      <Text fontSize="xs" textAlign="center" mt={8} color="gray.400">
        &copy; {new Date().getFullYear()} Cognivia. All rights reserved.
      </Text>
    </Box>
  );
};

const ResetPasswordPage = () => (
  <Suspense
    fallback={
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" color="teal.400" />
        <Text mt={4}>Loading reset form...</Text>
      </Box>
    }
  >
    <ResetPasswordContent />
  </Suspense>
);

export default ResetPasswordPage;
