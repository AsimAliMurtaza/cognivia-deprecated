"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Grid,
  GridItem,
  Flex,
  HStack,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";
import FeatureCard from "@/components/FeatureCard";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const router = useRouter();
  const controls = useAnimation();
  const headingSize = useBreakpointValue({ base: "2xl", md: "4xl" });

  useEffect(() => {
    controls.start({ opacity: 1, y: 0 });
  }, [controls]);

  return (
    <Box
      bg="white"
      position="relative"
      overflow="hidden"
      bgGradient="linear(to-br, #E0F7FA, #F3E5F5)" // Soft pastel gradient
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage:
          "url('https://images.rawpixel.com/image_png_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTExL3Jhd3BpeGVsb2ZmaWNlMl93aGl0ZV9iYWNrZ3JvdW5kX3doaXRlX2Fic3RyYWN0X3ZlY3Rvcl9ub2lzZV9zbV8xOTM0MjllMS1iNjlhLTQ0ZGYtOWEzZi01ZWI3YjIyNDRjYWItbTNxbjJocGYucG5n.png')", // Subtle pattern
        opacity: 0.1,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Header />
      {/* Hero Section */}
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        overflow="hidden"
        bgGradient="linear(to-br, #E0F7FA, #F3E5F5)" // Soft pastel gradient
      >
        <Container
          maxW="container.lg"
          textAlign="center"
          position="relative"
          zIndex={1}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={controls}
            transition={{ duration: 0.7 }}
          >
            <VStack spacing={10}>
              <Heading
                size={headingSize}
                fontWeight="bold"
                // bgGradient="linear(to-r, #6EC3C4, #A5D8DD)"
                bgGradient="linear(to-r, blue.300, #A5D8DD)"
                bgClip="text"
                lineHeight="1.2"
              >
                AI-Powered Quizzes for Smarter Learning
              </Heading>
              <Text fontSize="xl" color="gray.600" maxW="2xl">
                Personalized, interactive, and adaptive quizzes designed for
                you.
              </Text>
              <HStack spacing={4}>
                <Button
                  onClick={() => router.push("/signup")}
                  size="lg"
                  bgGradient="linear(to-r, #A5D8DD, blue.300)"
                  color="white"
                  rounded="full"
                  px={8}
                  _hover={{
                    bgGradient: "linear(to-r, blue.300, #A5D8DD)",
                    transform: "scale(1.05)",
                    transition: "fade-in 1.2s",
                  }}
                >
                  Get Started
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  size="lg"
                  variant="outline"
                  color="#6EC3C4"
                  borderColor="#6EC3C4"
                  rounded="full"
                  px={8}
                  _hover={{ bg: "#E0F7FA", transform: "scale(1.05)" }}
                >
                  Login
                </Button>
              </HStack>
            </VStack>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        py={20}
        id="features"
        bg="gray.50"
        position="relative"
        zIndex={1}
      >
        <Container maxW="container.lg">
          <VStack spacing={8} textAlign="center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Heading
                size="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, blue.300, #A5D8DD)"
                bgClip="text"
              >
                Why Choose Us?
              </Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Discover the features that make Cognivia the ultimate learning
                tool.
              </Text>
            </motion.div>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={8}
              mt={8}
            >
              {[
                {
                  title: "AI-Powered Quizzes",
                  description:
                    "Automatically generated quizzes tailored to your learning needs.",
                },
                {
                  title: "Real-Time Feedback",
                  description:
                    "Get instant feedback and insights to improve your learning.",
                },
                {
                  title: "Gamified Learning",
                  description: "Earn badges, rank up, and challenge friends.",
                },
                {
                  title: "Adaptive Learning",
                  description:
                    "Smart AI adjusts difficulty based on performance.",
                },
                {
                  title: "Personalized Insights",
                  description: "Track progress with AI-driven reports.",
                },
                {
                  title: "Mobile Friendly",
                  description:
                    "Access quizzes anytime, anywhere from any device.",
                },
              ].map((feature, index) => (
                <GridItem key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FeatureCard
                      title={feature.title}
                      description={feature.description}
                    />
                  </motion.div>
                </GridItem>
              ))}
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box py={20} id="pricing" bg="white" position="relative" zIndex={1}>
        <Container maxW="container.lg" textAlign="center">
          <VStack spacing={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Heading
                size="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, #6EC3C4, blue.500)"
                bgClip="text"
              >
                Affordable Plans for Everyone
              </Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Choose a plan that fits your needs and start learning smarter
                today.
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                onClick={() => router.push("/pricing")}
                size="lg"
                bg="#6EC3C4"
                color="white"
                rounded="full"
                px={8}
                _hover={{ bg: "#5AA8A9", transform: "scale(1.05)" }}
              >
                View Pricing
              </Button>
            </motion.div>
          </VStack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box py={20} id="contact" bg="gray.50" position="relative" zIndex={1}>
        <Container maxW="container.lg" textAlign="center">
          <VStack spacing={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Heading
                size="xl"
                fontWeight="bold"
                bgGradient="linear(to-r, #6EC3C4, #A5D8DD)"
                bgClip="text"
              >
                Get in Touch
              </Heading>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Text fontSize="lg" color="gray.600" maxW="2xl">
                Have questions? Reach out to us anytime. We're here to help!
              </Text>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Button
                onClick={() => router.push("/contact")}
                size="lg"
                bg="#6EC3C4"
                color="white"
                rounded="full"
                px={8}
                _hover={{ bg: "#5AA8A9", transform: "scale(1.05)" }}
              >
                Contact Us
              </Button>
            </motion.div>
          </VStack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
