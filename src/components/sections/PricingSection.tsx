"use client";

import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const pricingPlans = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Limited AI Assistance",
      "5 Quizzes per Month",
      "Basic Analytics",
    ],
    buttonLabel: "Get Started",
    colorScheme: "gray",
  },
  {
    name: "Pro",
    price: "$9.99/month",
    features: [
      "Unlimited AI Assistance",
      "Unlimited Quizzes",
      "Advanced Analytics",
      "Priority Support",
    ],
    buttonLabel: "Upgrade to Pro",
    colorScheme: "blue",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: [
      "All Pro Features",
      "Team Collaboration",
      "Dedicated Support",
      "API Access",
    ],
    buttonLabel: "Contact Us",
    colorScheme: "teal",
  },
];

export default function PricingSection() {
  const router = useRouter();

  // Dynamic Colors for Light & Dark Mode
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingGradient = useColorModeValue(
    "linear(to-r, #6EC3C4, blue.500)",
    "linear(to-r, cyan.300, blue.400)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const cardTextColor = useColorModeValue("gray.800", "gray.200");

  return (
    <Box
      minH="100vh"
      py={20}
      id="pricing"
      bg={bgColor}
      position="relative"
      zIndex={1}
    >
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
              bgGradient={headingGradient}
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
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Choose a plan that fits your needs and start learning smarter
              today.
            </Text>
          </motion.div>
        </VStack>

        {/* Pricing Cards */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={6}
          mt={12}
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                bg={cardBg}
                p={6}
                borderRadius="lg"
                boxShadow="lg"
                textAlign="center"
                transition="all 0.3s ease-in-out"
                _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
              >
                <CardHeader>
                  <Heading size="lg" color={`${plan.colorScheme}.400`}>
                    {plan.name}
                  </Heading>
                  <Text fontSize="2xl" fontWeight="bold" color={cardTextColor}>
                    {plan.price}
                  </Text>
                </CardHeader>
                <CardBody>
                  <VStack spacing={3}>
                    {plan.features.map((feature, idx) => (
                      <Text key={idx} color={textColor}>
                        ✅ {feature}
                      </Text>
                    ))}
                  </VStack>
                </CardBody>
                <CardFooter>
                  <Button
                    colorScheme={plan.colorScheme}
                    size="md"
                    w="full"
                    rounded="full"
                    onClick={() => router.push("/pricing")}
                  >
                    {plan.buttonLabel}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
