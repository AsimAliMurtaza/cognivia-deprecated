"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Box,
  VStack,
  Heading,
  Text,
  Divider,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>(""); // Added error state
  const router = useRouter();

  // Correctly typed handleInputChange function
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  // Handle login with error handling
  const handleLogin = async () => {
    setLoading(true);
    setError(""); // Reset error state before attempting login

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
    } else if (res?.ok) {
      router.push("/dashboard");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="#FAF3E0" // Soft Cream Background
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <VStack
          spacing={4}
          p={16}
          borderRadius="lg"
          boxShadow="xl"
          bg="white"
          w="full"
          height={{ base: "100vh", md: "auto" }}
        >
          <Heading size="lg" color="#B39EB5">
            Welcome Back!
          </Heading>
          <Text fontSize="md" color="gray.600">
            Log in to continue
          </Text>

          <FormControl id="signIn-email" isRequired>
            <FormLabel
              sx={{
                color: error ? "red.500" : "black",
              }}
            >
              Email
            </FormLabel>
            <Input
              type="email"
              name="email"
              variant="filled"
              textColor={error ? "red.500" : "black"}
              borderColor={error ? "red.500" : "gray.200"}
              value={email}
              onChange={handleInputChange}
              isInvalid={!!error}
              placeholder="Enter your email address"
            />
          </FormControl>

          <FormControl id="signIn-password" isRequired>
            <FormLabel
              sx={{
                color: error ? "red.500" : "black",
              }}
            >
              Password
            </FormLabel>
            <Input
              type="password"
              name="password"
              variant="filled"
              textColor={error ? "red.500" : "black"}
              borderColor={error ? "red.500" : "gray.200"}
              value={password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
          </FormControl>

          {error && (
            <FormHelperText color="red.500" textAlign="center">
              {error}
            </FormHelperText>
          )}

          <Button
            onClick={handleLogin}
            bg="#AEC6CF"
            color="white"
            _hover={{ bg: "#91B4C1" }}
            isLoading={loading}
            w="full"
          >
            Login
          </Button>

          <Divider />

          <Text fontSize="sm" color="gray.500">
            Or login with
          </Text>

          <VStack spacing={3} w="full">
            <Button
              bg="#C5E1A5"
              color="black"
              _hover={{ bg: "#A8D39F" }}
              onClick={() => signIn("google")}
              w="full"
            >
              Login with Google
            </Button>
            <Button
              bg="gray.300"
              color="black"
              _hover={{ bg: "gray.400" }}
              onClick={() => signIn("github")}
              w="full"
            >
              Login with GitHub
            </Button>
          </VStack>

          <Text fontSize="sm" color="gray.600">
            Don't have an account?{" "}
            <Button
              variant="link"
              color="#B39EB5"
              onClick={() => router.push("/signup")}
            >
              Sign Up
            </Button>
          </Text>
        </VStack>
      </motion.div>
    </Box>
  );
}
