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
import { FaBolt, FaArrowLeft } from "react-icons/fa";
import { useSession } from "next-auth/react";

const subscriptionPlans = [
  {
    name: "Basic",
    price: "$9.99/mo",
    features: [
      "200 Credits",
      "20 Quizzes",
      "50 Requests Per Day for Cognitive AI",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$16.66/mo",
    features: [
      "400 Credits",
      "40 Quizzes",
      "100 Requests Per Day for Cognitive AI",
    ],
    highlighted: true,
    cta: "Continue to Billing Details",
  },
  {
    name: "Premium",
    price: "$25.00/mo",
    features: [
      "All Pro Features",
      "700 Credits",
      "70 Quizzes",
      "Unlimited Requests Per Day for Cognitive AI",
    ],
    cta: "Get Premium",
  },
];

const creditPacks = [
  { name: "100 Credits", price: "$5", cta: "Buy 100 Credits" },
  { name: "500 Credits", price: "$20", cta: "Buy 500 Credits" },
  { name: "1000 Credits", price: "$35", cta: "Buy 1000 Credits" },
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
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const surfaceColor = useColorModeValue("white", "gray.800");
  const onSurfaceColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const secondaryContainer = useColorModeValue("blue.100", "blue.900");
  const onSecondaryContainer = useColorModeValue("blue.900", "blue.100");

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
    <Container maxW="7xl" py={10} px={{ base: 4, md: 8 }}>
      {/* Back button */}
      <Button
        as={Link}
        href="/dashboard"
        leftIcon={<FaArrowLeft />}
        variant="ghost"
        color={onSurfaceColor}
        size="md"
        borderRadius="full"
        mb={8}
        px={4}
        _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
      >
        Back to Dashboard
      </Button>

      {/* Hero section */}
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading
          as="h1"
          size={{ base: "2xl", md: "3xl" }}
          fontWeight="bold"
          color={onSurfaceColor}
        >
          Elevate your career with{" "}
          <Text as="span" color={primaryColor}>
            Enhancy
          </Text>
        </Heading>
        <Text fontSize={{ base: "lg", md: "xl" }} color="gray.500">
          Choose the perfect plan for your professional growth
        </Text>
      </VStack>

      {/* Subscription Plans */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={16}>
        {subscriptionPlans.map((plan, index) => (
          <Card
            key={index}
            bg={surfaceColor}
            borderWidth={1}
            borderColor={plan.highlighted ? primaryColor : "transparent"}
            borderRadius="2xl"
            boxShadow={plan.highlighted ? "xl" : "md"}
            position="relative"
            transition="all 0.3s ease"
            _hover={{
              transform: "translateY(-8px)",
              boxShadow: "2xl",
            }}
            overflow="hidden"
          >
            {plan.highlighted && (
              <Box
                bg={primaryColor}
                color="white"
                px={4}
                py={2}
                textAlign="center"
                fontWeight="bold"
                fontSize="sm"
                position="absolute"
                top={0}
                left={0}
                right={0}
              >
                Most Popular
              </Box>
            )}

            <CardHeader pt={plan.highlighted ? 12 : 6}>
              <VStack spacing={1} align="flex-start">
                <Text
                  fontSize="2xl"
                  fontWeight="bold"
                  color={plan.highlighted ? primaryColor : onSurfaceColor}
                >
                  {plan.name}
                </Text>
                <Text
                  fontSize="4xl"
                  fontWeight="extrabold"
                  color={onSurfaceColor}
                >
                  {plan.price}
                </Text>
              </VStack>
            </CardHeader>

            <Divider borderColor="gray.200" />

            <CardBody>
              <List spacing={3}>
                {plan.features.map((feature, i) => (
                  <ListItem key={i}>
                    <HStack align="flex-start">
                      <ListIcon
                        as={CheckCircleIcon}
                        color={plan.highlighted ? primaryColor : "green.500"}
                        mt={1}
                      />
                      <Text color={onSurfaceColor}>{feature}</Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </CardBody>

            <CardFooter>
              <Button
                colorScheme={plan.highlighted ? "blue" : "gray"}
                size="lg"
                w="full"
                borderRadius="full"
                onClick={() => handleSelectPlan(plan.name)}
                variant={plan.highlighted ? "solid" : "outline"}
                height="56px"
                fontSize="lg"
                fontWeight="semibold"
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      {/* Credit Packs */}
      <Box textAlign="center" mb={8}>
        <Heading
          as="h2"
          size={{ base: "lg", md: "xl" }}
          mb={4}
          color={onSurfaceColor}
        >
          Need more flexibility?
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.500" mb={8}>
          Purchase credit packs and use them whenever you need
        </Text>

        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          spacing={6}
          maxW="6xl"
          mx="auto"
        >
          {creditPacks.map((pack, idx) => (
            <Card
              key={idx}
              bg={surfaceColor}
              borderRadius="2xl"
              boxShadow="md"
              transition="all 0.3s ease"
              _hover={{
                transform: "translateY(-4px)",
                boxShadow: "lg",
              }}
            >
              <CardBody>
                <VStack spacing={6} py={6}>
                  <Flex
                    align="center"
                    justify="center"
                    bg={secondaryContainer}
                    color={onSecondaryContainer}
                    w={16}
                    h={16}
                    borderRadius="full"
                  >
                    <Icon as={FaBolt} boxSize={6} />
                  </Flex>
                  <Text fontSize="xl" fontWeight="bold" color={onSurfaceColor}>
                    {pack.name}
                  </Text>
                  <Text
                    fontSize="3xl"
                    color={primaryColor}
                    fontWeight="extrabold"
                  >
                    {pack.price}
                  </Text>
                  <Button
                    variant="outline"
                    colorScheme="blue"
                    size="md"
                    w="full"
                    borderRadius="full"
                    onClick={() => handleSelectPlan(pack.name)}
                    height="48px"
                  >
                    {pack.cta}
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Box>
    </Container>
  );
}
