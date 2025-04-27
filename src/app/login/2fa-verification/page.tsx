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
  useColorModeValue,
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

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.900");

  const textColor = useColorModeValue("gray.700", "gray.200");
  const headingColor = useColorModeValue("teal.500", "blue.300");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const inputBorderColor = useColorModeValue("gray.300", "gray.600");
  const buttonBg = useColorModeValue("teal.500", "blue.400");
  const buttonHoverBg = useColorModeValue("teal.600", "blue.500");
  const linkColor = useColorModeValue("teal.500", "blue.400");

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
    <Container centerContent maxW="100vw" bg={bgColor} py={16} height="100vh">
      <Box
        bg={bgColor}
        color={textColor}
        borderRadius="30"
        boxShadow="md"
        maxW={{ base: "90vw", md: "500px" }}
        p={{ base: 6, md: 8 }}
      >
        <VStack spacing={8} align="stretch">
          <Heading size="xl" textAlign="center" color={headingColor}>
            Verify Your Account
          </Heading>
          <Text fontSize="lg" textAlign="center">
            Enter the 6-digit code sent to{" "}
            <Text as="span" fontWeight="semibold" color={headingColor}>
              {email}
            </Text>
          </Text>

          <Input
            placeholder="ـ ـ ـ ـ ـ ـ"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setOtp(value);
            }}
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            size="md"
            textAlign="center"
            fontSize="xl"
            letterSpacing="1rem"
            py={6}
            bg={inputBg}
            borderColor={inputBorderColor}
            borderRadius="full"
            _focus={{
              borderColor: headingColor,
              boxShadow: `0 0 0 1px ${headingColor}`,
            }}
          />

          <Button
            bg={buttonBg}
            color="white"
            _hover={{ bg: buttonHoverBg }}
            onClick={handleVerify}
            isLoading={loading}
            isDisabled={otp.length !== 6}
            size="md"
            borderRadius="full"
            fontWeight="semibold"
            aria-label="Verify and continue with OTP"
          >
            Verify & Continue
          </Button>

          <HStack justify="center" spacing={2}>
            <Text color={textColor}>Didn&apos;t receive a code?</Text>
            <Link color={linkColor} fontWeight="medium">
              Resend Code
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
        <Container centerContent py={10}>
          <Box>
            <Text>Loading verification...</Text>
          </Box>
        </Container>
      }
    >
      <TwoFAVerificationContent />
    </Suspense>
  );
}
