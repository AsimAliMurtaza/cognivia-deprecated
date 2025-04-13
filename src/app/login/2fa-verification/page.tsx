"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  Text,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function TwoFAVerification() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const handleVerify = async () => {
    if (!email) {
      toast({ title: "Session expired", status: "error" });
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP with your API endpoint
      const verifyRes = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "OTP verification failed");
      }

      // 2. Complete the sign-in (no password needed now)
      const signInResult = await signIn("credentials", {
        email,
        otp, // Only send OTP (password was already verified)
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      // 3. Successful login
      router.push("/dashboard");
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Verification failed",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container centerContent>
      <Box mt={20} p={8} borderWidth={1} borderRadius="lg" boxShadow="lg">
        <VStack spacing={4}>
          <Heading size="md">Enter your OTP</Heading>
          <Text>We've sent a 6-digit code to {email}</Text>
          <Input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <Button
            colorScheme="teal"
            onClick={handleVerify}
            isLoading={loading}
            isDisabled={otp.length !== 6}
          >
            Verify
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}
