"use client";

import { Box, Container, VStack, Heading, Text, Grid, GridItem, Icon } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaBrain, FaClock, FaTrophy, FaChartLine, FaBookOpen, FaMobileAlt } from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Quizzes",
      description: "Automatically generated quizzes tailored to your learning needs.",
      icon: FaBrain,
    },
    {
      title: "Real-Time Feedback",
      description: "Get instant feedback and insights to improve your learning.",
      icon: FaClock,
    },
    {
      title: "Gamified Learning",
      description: "Earn badges, rank up, and challenge friends.",
      icon: FaTrophy,
    },
    {
      title: "Adaptive Learning",
      description: "Smart AI adjusts difficulty based on performance.",
      icon: FaChartLine,
    },
    {
      title: "Personalized Insights",
      description: "Track progress with AI-driven reports.",
      icon: FaBookOpen,
    },
    {
      title: "Mobile Friendly",
      description: "Access quizzes anytime, anywhere from any device.",
      icon: FaMobileAlt,
    },
  ];

  return (
    <Box py={20} id="features" bg="gray.50" position="relative" zIndex={1} minH="100vh">
      <Container maxW="container.lg">
        <VStack spacing={8} textAlign="center">
          {/* Title */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
            <Heading size="xl" fontWeight="bold" bgGradient="linear(to-r, blue.300, #A5D8DD)" bgClip="text">
              Why Choose Cognivia?
            </Heading>
          </motion.div>

          {/* Subtitle */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} viewport={{ once: true }}>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Discover the features that make Cognivia the ultimate learning tool.
            </Text>
          </motion.div>

          {/* Features Grid */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8} mt={8}>
            {features.map((feature, index) => (
              <GridItem key={index}>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                  <Box minH="200" p={6} bg="white" borderRadius="xl" boxShadow="md" textAlign="center" _hover={{ transform: "scale(1.05)", transition: "0.3s" }}>
                    <Icon as={feature.icon} boxSize={12} color="blue.400" mb={4} />
                    <Heading size="md" color="gray.700" mb={2}>
                      {feature.title}
                    </Heading>
                    <Text fontSize="sm" color="gray.600">
                      {feature.description}
                    </Text>
                  </Box>
                </motion.div>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>
    </Box>
  );
}
