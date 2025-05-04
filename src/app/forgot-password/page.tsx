"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const bg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const buttonColor = useColorModeValue("teal", "blue");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setLoading(false);

    toast({
      title: res.ok ? "Success" : "Error",
      description: data.message,
      status: res.ok ? "success" : "error",
      duration: 4000,
      isClosable: true,
    });
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
        Forgot Password
      </Heading>
      <Text fontSize="sm" color="gray.500" textAlign="center" mb={6}>
        Enter your email and we&apos;ll send you a reset link.
      </Text>
      <form onSubmit={handleSubmit}>
        <FormControl id="email" mb={6} isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            placeholder="your@email.com"
            bg={inputBg}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          Send Reset Link
        </Button>
      </form>
      <Text fontSize="xs" textAlign="center" mt={8} color="gray.400">
        &copy; {new Date().getFullYear()} Cognivia. All rights reserved.
      </Text>
    </Box>
  );
}
