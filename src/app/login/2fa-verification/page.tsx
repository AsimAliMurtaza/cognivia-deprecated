"use client";
import { useState, Suspense } from "react";
import {
  Box,
  Button,
  Container,
  Input,
  Text,
  Heading,
  VStack,
  useToast,
  HStack,
  Link,
} from "@chakra-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

function TwoFAVerificationContent() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  // const [resendLoading, setResendLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // const handleResendOTP = async () => {
  //   if (!email) {
  //     toast({ title: "Session expired", status: "error" });
  //     router.push("/login");
  //     return;
  //   }

  //   setResendLoading(true);
  //   try {
  //     const res = await fetch("/api/auth/2fa/resend", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email }),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Failed to resend OTP");
  //     }

  //     toast({
  //       title: "OTP resent",
  //       description: "A new OTP has been sent to your email",
  //       status: "success",
  //     });
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description:
  //         error instanceof Error ? error.message : "Failed to resend OTP",
  //       status: "error",
  //     });
  //   } finally {
  //     setResendLoading(false);
  //   }
  // };

  const handleVerify = async () => {
    if (!email) {
      toast({ title: "Session expired", status: "error" });
      router.push("/login");
      return;
    }

    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a 6-digit code",
        status: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      // Verify OTP first
      const verifyRes = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json();
        throw new Error(errorData.error || "OTP verification failed");
      }

      // Complete the sign-in process
      const signInResult = await signIn("credentials", {
        email,
        otp,
        password: "__OTP__", // dummy to satisfy structure
        redirect: false,
        callbackUrl,
      });

      if (signInResult?.error) {
        throw new Error(
          signInResult.error === "CredentialsSignin"
            ? "Invalid credentials"
            : signInResult.error
        );
      }

      if (signInResult?.url) {
        router.push(signInResult.url);
      } else {
        router.push(callbackUrl);
      }

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
    <Container centerContent maxW="container.sm">
      <Box
        mt={20}
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        w="full"
      >
        <VStack spacing={6} align="stretch">
          <Heading size="lg" textAlign="center">
            Two-Factor Authentication
          </Heading>
          <Text textAlign="center">
            Enter the 6-digit code sent to{" "}
            <Text as="span" fontWeight="bold">
              {email}
            </Text>
          </Text>

          <Input
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            size="lg"
            textAlign="center"
            fontSize="2xl"
            letterSpacing="0.5rem"
            py={6}
          />

          <Button
            colorScheme="blue"
            onClick={handleVerify}
            isLoading={loading}
            isDisabled={otp.length !== 6}
            size="lg"
          >
            Verify & Continue
          </Button>

          <HStack justify="center" mt={4}>
            <Text>Didn&apos;t receive code?</Text>
            <Link color="blue.500">
              Resend OTP
            </Link>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
}

export default function TwoFAVerification() {
  return (
    <Suspense
      fallback={
        <Container centerContent>
          <Box mt={20} p={8}>
            <Text>Loading verification...</Text>
          </Box>
        </Container>
      }
    >
      <TwoFAVerificationContent />
    </Suspense>
  );
}
