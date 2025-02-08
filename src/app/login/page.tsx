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
  useToast,
  Container,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const toast = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (res?.ok) {
      router.push("/dashboard");
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      justify="center"
      align="center"
      minH="100vh"
      bg="gray.100"
      bgGradient="linear(to-br, #E0F7FA, #F3E5F5)"
    >
      <Container maxW="2xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Flex
            bg="gray.50"
            boxShadow="lg"
            overflow="hidden"
            direction={{ base: "column", md: "row" }}
            w="auto"
            h="auto"
            borderRadius="20px"
          >
            {/* Left Section - Content */}
            <Box
              flex={1}
              bg="gray.100"
              p={8}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              textAlign="center"
              color="gray.700"
            >
              <Heading size="lg" fontWeight="medium" mb={2}>
                Welcome to Cognivia
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Sign in to continue
              </Text>
            </Box>

            {/* Right Section - Login Form */}
            <Box flex={1} p={8}>
              <Heading size="md" fontWeight="lg" mb={6} color={"gray.700"}>
                Sign in to your account
              </Heading>
              <VStack spacing={4} align="stretch">
                <FormControl id="signIn-email" isRequired>
                  <FormLabel fontSize="sm" color="gray.700">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    bg="white"
                    color="black"
                    border="1px solid #ccc"
                    onChange={handleInputChange}
                    name="email"
                    _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
                  />
                </FormControl>

                <FormControl id="signIn-password" isRequired>
                  <FormLabel fontSize="sm" color="gray.700">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    bg="white"
                    color="black"
                    border="1px solid #ccc"
                    onChange={handleInputChange}
                    name="password"
                    _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
                  />
                </FormControl>

                {error && (
                  <FormHelperText color="red.500" textAlign="center">
                    {error}
                  </FormHelperText>
                )}

                <Button
                  onClick={handleLogin}
                  bg="blue.500"
                  _hover={{ bg: "blue.600" }}
                  isLoading={loading}
                  w="full"
                  size="md"
                >
                  Login
                </Button>

                <Text
                  fontSize="sm"
                  color="blue.500"
                  cursor="pointer"
                  textAlign="center"
                  _hover={{ textDecoration: "underline" }}
                >
                  Forgot password?
                </Text>

                <Divider my={4} />

                <VStack spacing={3} w="full">
                  <Button
                    variant="outline"
                    color="blue.500"
                    w="full"
                    border="1px solid"
                    leftIcon={<FcGoogle />}
                    _hover={{ bg: "gray.50" }}
                    onClick={() => signIn("google")}
                  >
                    Continue with Google
                  </Button>
                  <Button
                    variant="outline"
                    w="full"
                    color="gray.900"
                    leftIcon={<FaGithub />}
                    _hover={{ bg: "gray.50" }}
                    border="1px solid"
                    onClick={() => signIn("github")}
                  >
                    Continue with GitHub
                  </Button>
                </VStack>

                <Text fontSize="sm" mt={6} textAlign="center" color="gray.600">
                  Don't have an account?{" "}
                  <Button
                    variant="link"
                    color="blue.500"
                    _hover={{ textDecoration: "underline" }}
                    onClick={() => router.push("/signup")}
                  >
                    Create one
                  </Button>
                </Text>
              </VStack>
            </Box>
          </Flex>
        </motion.div>
      </Container>
    </Flex>
  );
}
