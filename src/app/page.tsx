"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Image,
  Grid,
  GridItem,
  Flex,
  Link,
  HStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";

export default function LandingPage() {
  const router = useRouter();

  return (
    <Box bg="#FAF3E0">
      {" "}
      {/* Soft Cream Background */}
      {/* Navbar */}
      <Box
        as="nav"
        bg="white"
        py={4}
        boxShadow="md"
        position="sticky"
        top="0"
        zIndex="100"
      >
        <Container maxW="container.lg">
          <Flex justify="space-between" align="center">
            {/* Logo */}
            <Heading size="lg" color="#B39EB5" fontWeight="bold">
              QuizAI
            </Heading>

            {/* Navigation Links */}
            <HStack spacing={6}>
              <Link href="#about" fontSize="lg" color="gray.700">
                About Us
              </Link>
              <Link href="#features" fontSize="lg" color="gray.700">
                Features
              </Link>
              <Link href="#pricing" fontSize="lg" color="gray.700">
                Pricing
              </Link>
              <Link href="#contact" fontSize="lg" color="gray.700">
                Contact
              </Link>
            </HStack>

            {/* Auth Buttons */}
            <HStack spacing={4}>
              <Button
                onClick={() => router.push("/login")}
                variant="ghost"
                colorScheme="purple"
              >
                Login
              </Button>
              <Button onClick={() => router.push("/signup")} colorScheme="blue">
                Get Started
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>
      {/* Hero Section */}
      <Box
        position="relative"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Container maxW="container.lg" textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              align="center"
              justify="space-between"
            >
              {/* Left Side - Text */}
              <Box flex="1" textAlign={{ base: "center", md: "left" }}>
                <Heading size="2xl" fontWeight="bold" color="#B39EB5">
                  AI-Powered Quizzes for Smarter Learning
                </Heading>
                <Text fontSize="lg" color="gray.600" mt={4}>
                  Personalized, interactive, and adaptive quizzes designed for
                  you.
                </Text>
                <HStack
                  spacing={4}
                  mt={6}
                  justify={{ base: "center", md: "start" }}
                >
                  <Button
                    onClick={() => router.push("/signup")}
                    size="lg"
                    bg="#AEC6CF"
                    color="white"
                  >
                    Get Started
                  </Button>
                  <Button
                    onClick={() => router.push("/login")}
                    size="lg"
                    variant="outline"
                    color="#B39EB5"
                  >
                    Login
                  </Button>
                </HStack>
              </Box>

              {/* Right Side - Image */}
              <Box flex="1">
                <Image
                  src="https://png.pngtree.com/background/20220714/original/pngtree-creative-synthesis-education-background-picture-image_1617742.jpg"
                  alt="Hero Background"
                  position="center"
                  w="100"
                  h="100"
                />
              </Box>
            </Flex>
          </motion.div>
        </Container>
      </Box>
      {/* Features Section */}
      <Box bg="white" py={16} id="features">
        <Container maxW="container.lg">
          <Heading size="xl" textAlign="center" color="#B39EB5">
            Why Choose QuizAI?
          </Heading>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={6}
            mt={8}
          >
            <FeatureCard
              title="AI-Powered Quizzes"
              description="Automatically generated quizzes tailored to your learning needs."
            />
            <FeatureCard
              title="Real-Time Feedback"
              description="Get instant feedback and insights to improve your learning."
            />
            <FeatureCard
              title="Gamified Learning"
              description="Earn badges, rank up, and challenge friends."
            />
            <FeatureCard
              title="Adaptive Learning"
              description="Smart AI adjusts difficulty based on performance."
            />
            <FeatureCard
              title="Personalized Insights"
              description="Track progress with AI-driven reports."
            />
            <FeatureCard
              title="Mobile Friendly"
              description="Access quizzes anytime, anywhere from any device."
            />
          </Grid>
        </Container>
      </Box>
      {/* Pricing Section */}
      <Box bg="#FFDAB9" py={16} id="pricing" textAlign="center">
        <Heading size="xl" color="gray.800">
          Affordable Plans for Everyone
        </Heading>
        <Text fontSize="lg" color="gray.600" mt={4}>
          Choose a plan that fits your needs.
        </Text>
        <Button
          onClick={() => router.push("/pricing")}
          mt={6}
          size="lg"
          colorScheme="blue"
        >
          View Pricing
        </Button>
      </Box>
      {/* Contact Section */}
      <Box bg="#C5E1A5" py={16} id="contact" textAlign="center">
        <Heading size="xl" color="gray.800">
          Get in Touch
        </Heading>
        <Text fontSize="lg" color="gray.600" mt={4}>
          Have questions? Reach out to us anytime.
        </Text>
        <Button
          onClick={() => router.push("/contact")}
          mt={6}
          size="lg"
          colorScheme="purple"
        >
          Contact Us
        </Button>
      </Box>
      <Footer />
    </Box>
  );
}
