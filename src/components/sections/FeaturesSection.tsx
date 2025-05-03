"use client";

import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Grid,
  GridItem,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  FaBrain,
  FaClock,
  FaBookOpen,
  FaMobileAlt,
} from "react-icons/fa";

export default function FeaturesSection() {
  const features = [
    {
      title: "AI-Powered Quizzes",
      description:
        "Automatically generated quizzes tailored to your learning needs with our advanced algorithms.",
      icon: FaBrain,
    },
    {
      title: "Real-Time Feedback",
      description:
        "Get instant feedback and actionable insights to accelerate your learning process.",
      icon: FaClock,
    },
    // {
    //   title: "Gamified Learning",
    //   description: "Earn badges, unlock achievements, and climb leaderboards.",
    //   icon: FaTrophy,
    // },
    // {
    //   title: "Adaptive Learning",
    //   description:
    //     "Smart AI adjusts difficulty dynamically based on your performance.",
    //   icon: FaChartLine,
    // },
    {
      title: "Personalized Insights",
      description:
        "Detailed analytics and reports to track your learning journey.",
      icon: FaBookOpen,
    },
    {
      title: "Mobile Friendly",
      description:
        "Seamless experience across all your devices, anytime, anywhere.",
      icon: FaMobileAlt,
    },
  ];

  // Material You inspired colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const subTextColor = useColorModeValue("gray.600", "gray.300");
  const primaryColor = useColorModeValue("teal.500", "blue.300");

  return (
    <Box
      py={20}
      id="features"
      bg={bgColor}
      position="relative"
      zIndex={1}
      display="flex"
      alignItems="center"
    >
      <Container maxW="container.lg">
        <VStack spacing={12} textAlign="center">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <VStack spacing={4}>
              <Heading
                as="h2"
                size="2xl"
                fontWeight="bold"
                color={textColor}
                lineHeight="1.2"
              >
                What we offer?
              </Heading>
              <Text
                fontSize={{ base: "lg", md: "xl" }}
                color={subTextColor}
                maxW="2xl"
              >
                Discover how Cognivia transforms your learning experience with
                AI-powered tools
              </Text>
            </VStack>
          </motion.div>

          {/* Features Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
            width="full"
          >
            {features.map((feature, index) => (
              <GridItem key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  <Box
                    p={8}
                    borderRadius="2xl"
                    minHeight="250px"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    transition="all 0.2s ease"
                  >
                    <Box
                      p={4}
                      mb={4}
                      bg={`${primaryColor}20`} // 20% opacity
                      borderRadius="full"
                      display="inline-flex"
                    >
                      <Icon
                        as={feature.icon}
                        boxSize={12}
                        color={primaryColor}
                      />
                    </Box>
                    <Heading
                      as="h3"
                      size="md"
                      color={textColor}
                      mb={3}
                      fontWeight="semibold"
                    >
                      {feature.title}
                    </Heading>
                    <Text fontSize="md" color={subTextColor} lineHeight="tall">
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
