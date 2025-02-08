"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Text,
  Divider,
  useToast,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSignup = async () => {
    if (!email || !password) {
      setError("All fields are required!");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      toast({
        title: "Account created!",
        description: "You can now log in.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/login");
    } else {
      setError("Signup failed! Try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgGradient="linear(to-br, #E0F7FA, #F3E5F5)"
      bg="gray.100"
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bg="white"
          borderRadius="20px"
          boxShadow="lg"
          maxW="900px"
          p={8}
          w="auto"
          h="auto"
        >
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
            {/* Left Side Content */}
            <GridItem
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              <Heading size="lg" fontWeight="thin" color="gray.700">
                Welcome to
              </Heading>
              <Heading size="2xl" fontWeight="thin" color="gray.700" mb={4}>
                Cognivia
              </Heading>
              <Text fontSize="sm" color="gray.500" mt={4}>
                Create an account to get started.
              </Text>
              <Button
                color="blue.500"
                _hover={{ color: "blue.900" }}
                onClick={() => router.push("/")}
              >
                <FiArrowLeft
                  style={{
                    marginRight: "8px",
                    marginBottom: "2px",
                    fontSize: "2em",
                  }}
                />
              </Button>
            </GridItem>

            {/* Right Side - Sign Up Form */}
            <GridItem>
              <VStack spacing={5} align="stretch">
                {error && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {error}
                  </Text>
                )}
                :
                {
                  <Heading size="md" fontWeight="lg" mb={4} color={"gray.700"}>
                    Create your account
                  </Heading>
                }
                <FormControl id="signUp-email" isRequired>
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
                <FormControl id="signUp-password" isRequired>
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
                <Button
                  onClick={handleSignup}
                  bg="blue.500"
                  color="white"
                  _hover={{ bg: "blue.600" }}
                  isLoading={loading}
                  w="full"
                >
                  Sign Up
                </Button>
                <Divider />
                <Text fontSize="sm" textAlign="center" color="gray.600">
                  Already have an account?{" "}
                  <Button
                    variant="link"
                    color="blue.500"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
      </motion.div>
    </Box>
  );
}
