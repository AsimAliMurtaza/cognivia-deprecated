"use client";

import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Divider,
  useToast,
  Heading,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Link,
  Container,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Flex,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { FaBolt, FaArrowLeft, FaStar } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

const MotionCard = motion(Card);
const MotionButton = motion(Button);

const subscriptionPlans = [
  {
    name: "Basic",
    price: "$9.99/mo",
    features: ["200 Credits", "20 Quizzes", "50 Requests/Day"],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$16.66/mo",
    features: ["400 Credits", "40 Quizzes", "100 Requests/Day"],
    highlighted: true,
    cta: "Upgrade to Pro",
  },
  {
    name: "Premium",
    price: "$25.00/mo",
    features: ["700 Credits", "70 Quizzes", "Unlimited Requests/Day"],
    cta: "Go Premium",
  },
];

const creditPacks = [
  { name: "100 Credits", price: "$5", cta: "Buy Credits" },
  { name: "500 Credits", price: "$20", cta: "Buy Credits" },
  { name: "1000 Credits", price: "$35", cta: "Buy Credits" },
];

const priceMap: Record<
  string,
  {
    name: string;
    priceId: string;
    type: "subscription" | "credit_pack";
    metadata?: Record<string, string | number | boolean | undefined>;
  }
> = {
  Basic: {
    name: "Basic",
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID!,
    type: "subscription",
    metadata: { plan: "Basic" },
  },
  Pro: {
    name: "Pro",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    type: "subscription",
    metadata: { plan: "Pro" },
  },
  Premium: {
    name: "Premium",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    type: "subscription",
    metadata: { plan: "Premium" },
  },
  "100 Credits": {
    name: "100 Credits",
    priceId: process.env.NEXT_PUBLIC_STRIPE_100_CREDITS_PRICE_ID!,
    type: "credit_pack",
    metadata: { credits: 100 },
  },
  "500 Credits": {
    name: "500 Credits",
    priceId: process.env.NEXT_PUBLIC_STRIPE_500_CREDITS_PRICE_ID!,
    type: "credit_pack",
    metadata: { credits: 500 },
  },
  "1000 Credits": {
    name: "1000 Credits",
    priceId: process.env.NEXT_PUBLIC_STRIPE_1000_CREDITS_PRICE_ID!,
    type: "credit_pack",
    metadata: { credits: 1000 },
  },
};

export default function SubscriptionPage() {
  const toast = useToast();
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;

  // Material You inspired colors
  const primaryColor = useColorModeValue("teal.500", "blue.300");
  const surfaceColor = useColorModeValue("white", "gray.800");
  const onSurfaceColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const secondaryContainer = useColorModeValue("teal.100", "blue.900");
  const onSecondaryContainer = useColorModeValue("teal.900", "blue.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const btnCOlor = useColorModeValue("teal", "blue");

  const handleSelectPlan = async (planName: string) => {
    const plan = priceMap[planName];
    if (!plan) {
      toast({ title: "Invalid plan", status: "error", duration: 2000 });
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: plan.type,
          priceId: plan.priceId,
          userId: userId,
          email: userEmail,
          metadata: plan.metadata,
          productName: plan.name,
        }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout session failed");
      }
    } catch (err) {
      toast({
        title: "Error initiating checkout",
        status: "error",
        duration: 3000,
      });
      console.error(err);
    }
  };

  return (
    <Container maxW="5xl" py={12} px={{ base: 4, md: 8 }}>
      {" "}
      {/* Reduced max width */}
      {/* Back button */}
      <Link href="/dashboard" style={{ textDecoration: "none" }}>
        <MotionButton
          as="a"
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          color={onSurfaceColor}
          size="md"
          borderRadius="full"
          mb={6}
          px={4}
          _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Back to Dashboard
        </MotionButton>
      </Link>
      {/* Hero section */}
      <VStack spacing={5} textAlign="center" mb={10}>
        {" "}
        {/* Reduced spacing */}
        <Heading
          as="h1"
          size={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          color={onSurfaceColor}
          lineHeight="shorter"
        >
          Unlock Premium Features with Enhancy
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.500">
          Choose a subscription plan or purchase credits to enhance your
          experience.
        </Text>
      </VStack>
      {/* Subscription Plans */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={12}>
        {" "}
        {/* Increased spacing */}
        {subscriptionPlans.map((plan, index) => (
          <MotionCard
            key={index}
            bg={surfaceColor}
            borderWidth={1}
            borderColor={plan.highlighted ? primaryColor : borderColor}
            borderRadius="xl"
            boxShadow={plan.highlighted ? "xl" : "md"}
            position="relative"
            _hover={{
              transform: "translateY(-6px)",
              boxShadow: "lg",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            overflow="hidden"
          >
            {plan.highlighted && (
              <Flex
                bg={primaryColor}
                color="white"
                px={4}
                py={2}
                textAlign="center"
                fontWeight="semibold"
                fontSize="sm"
                position="absolute"
                top={0}
                left={0}
                right={0}
                alignItems="center"
                justifyContent="center"
              >
                <Icon as={FaStar} mr={2} /> Most Popular
              </Flex>
            )}

            <CardHeader pt={plan.highlighted ? 10 : 6} pb={4}>
              {" "}
              {/* Adjusted padding */}
              <VStack spacing={1} align="center">
                {" "}
                {/* Centered plan name and price */}
                <Text
                  fontSize="xl"
                  fontWeight="semibold"
                  color={plan.highlighted ? primaryColor : onSurfaceColor}
                >
                  {plan.name}
                </Text>
                <Text
                  fontSize="3xl"
                  fontWeight="extrabold"
                  color={onSurfaceColor}
                  lineHeight="shorter"
                >
                  {plan.price}
                </Text>
                <Text color="gray.500">per month</Text>
              </VStack>
            </CardHeader>

            <Divider borderColor={borderColor} />

            <CardBody py={6}>
              {" "}
              {/* Increased padding */}
              <List spacing={3}>
                {plan.features.map((feature, i) => (
                  <ListItem key={i}>
                    <HStack align="center">
                      {" "}
                      {/* Centered icon and text */}
                      <ListIcon
                        as={CheckCircleIcon}
                        color={plan.highlighted ? primaryColor : "green.500"}
                      />
                      <Text color={onSurfaceColor}>{feature}</Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </CardBody>

            <CardFooter>
              <MotionButton
                colorScheme={plan.highlighted ? btnCOlor : "gray"}
                size="lg"
                w="full"
                borderRadius="full"
                onClick={() => handleSelectPlan(plan.name)}
                variant={plan.highlighted ? "solid" : "outline"}
                height="48px"
                fontSize="md"
                fontWeight="semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
              </MotionButton>
            </CardFooter>
          </MotionCard>
        ))}
      </SimpleGrid>
      {/* Credit Packs */}
      <Box textAlign="center" mb={10}>
        <Heading
          as="h2"
          size={{ base: "md", md: "lg" }}
          mb={3}
          color={onSurfaceColor}
        >
          Flexible Credit Packs
        </Heading>
        <Text fontSize="md" color="gray.500" mb={6}>
          Top up your credits and enjoy Enhancy on your terms.
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={6}
          maxW="4xl"
          mx="auto"
        >
          {creditPacks.map((pack, idx) => (
            <MotionCard
              key={idx}
              bg={surfaceColor}
              borderRadius="xl"
              boxShadow="md"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "lg",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <CardBody py={8}>
                {" "}
                {/* Increased padding */}
                <VStack spacing={5} align="center">
                  <Flex
                    align="center"
                    justify="center"
                    bg={secondaryContainer}
                    color={onSecondaryContainer}
                    w={14}
                    h={14}
                    borderRadius="full"
                  >
                    <Icon as={FaBolt} boxSize={5} />
                  </Flex>
                  <Text fontSize="lg" fontWeight="bold" color={onSurfaceColor}>
                    {pack.name}
                  </Text>
                  <Text
                    fontSize="2xl"
                    color={primaryColor}
                    fontWeight="extrabold"
                    lineHeight="shorter"
                  >
                    {pack.price}
                  </Text>
                  <MotionButton
                    variant="outline"
                    colorScheme={btnCOlor}
                    size="md"
                    w="full"
                    borderRadius="full"
                    onClick={() => handleSelectPlan(pack.name)}
                    height="40px"
                    fontSize="sm"
                    fontWeight="semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {pack.cta}
                  </MotionButton>
                </VStack>
              </CardBody>
            </MotionCard>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
