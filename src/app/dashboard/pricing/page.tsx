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
  Badge,
  SimpleGrid,
  Icon,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { FaBolt } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";

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
  { priceId: string; type: "subscription" | "credit_pack"; metadata?: Record<string, string | number> }
> = {
  Basic: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID!,
    type: "subscription",
    metadata: { plan: "Basic" },
  },
  Pro: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!,
    type: "subscription",
    metadata: { plan: "Pro" },
  },
  Premium: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    type: "subscription",
    metadata: { plan: "Premium" },
  },

  "100 Credits": {
    priceId: process.env.NEXT_PUBLIC_STRIPE_100_CREDITS_PRICE_ID!,
    type: "credit_pack",
    metadata: { credits: 100 },
  },
  "500 Credits": {
    priceId: process.env.NEXT_PUBLIC_STRIPE_500_CREDITS_PRICE_ID!,
    type: "credit_pack",
    metadata: { credits: 500 },
  },
  "1000 Credits": {
    priceId: process.env.NEXT_PUBLIC_STRIPE_1000_CREDITS_PRICE_ID!,
    type: "credit_pack",
    metadata: { credits: 1000 },
  },
};

export default function SubscriptionPage() {
  const toast = useToast();
  const bgCard = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const { data: session } = useSession();
  // Then use session.user.id and session.user.email
    // to get the user ID and email from the session.
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;
    

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
          userId: userId, // Replace with actual user ID
          email: userEmail, // Replace with actual user email
          metadata: plan.metadata,
          productName: planName,
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
    <Box px={[4, 8]} py={10} maxW="7xl" mx="auto">
      {/* Heading */}
      <Button
        as={Link}
        href="/dashboard"
        leftIcon={<ArrowLeft size={20} />}
        variant="ghost"
        color={useColorModeValue("gray.800", "white")}
        size="md"
        borderRadius="full"
        _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
        _focus={{ boxShadow: "outline" }}
      >
        Back to Dashboard
      </Button>
      <VStack spacing={2} textAlign="center" mb={10}>
        <Heading as="h1" size="2xl" fontWeight="bold">
          Invest in your career with{" "}
          <Text as="span" color="blue.500">
            Enhancy
          </Text>
        </Heading>
        <Text fontSize="lg" color="gray.600">
          One plan, endless possibilities
        </Text>
      </VStack>

      {/* Subscription Plans */}
      <SimpleGrid columns={[1, 2, 3]} spacing={8}>
        {subscriptionPlans.map((plan, index) => (
          <Box
            key={index}
            bg={plan.highlighted ? "blue.50" : bgCard}
            borderWidth={2}
            borderColor={plan.highlighted ? "blue.400" : border}
            borderRadius="2xl"
            shadow={plan.highlighted ? "lg" : "base"}
            p={6}
            position="relative"
            transition="all 0.2s ease"
            _hover={{ shadow: "xl", transform: "translateY(-4px)" }}
          >
            {plan.highlighted && (
              <Badge colorScheme="blue" position="absolute" top={4} right={4}>
                Most Popular
              </Badge>
            )}
            <VStack align="stretch" spacing={5}>
              <Box>
                <Text fontSize="2xl" fontWeight="bold">
                  {plan.name}
                </Text>
                <Text fontSize="3xl" fontWeight="extrabold">
                  {plan.price}
                </Text>
              </Box>

              <Divider />

              <List spacing={3}>
                {plan.features.map((feature, i) => (
                  <ListItem key={i}>
                    <HStack align="start">
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      <Text>{feature}</Text>
                    </HStack>
                  </ListItem>
                ))}
              </List>

              <Button
                colorScheme={plan.highlighted ? "blue" : "gray"}
                size="lg"
                mt={2}
                onClick={() => handleSelectPlan(plan.name)}
              >
                {plan.cta}
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>

      {/* Credit Packs */}
      <Box mt={16} textAlign="center">
        <Heading as="h2" size="lg" mb={4}>
          Prefer pay-as-you-go?
        </Heading>
        <Text fontSize="md" color="gray.600" mb={8}>
          Buy credits and use them anytime to generate resumes, cover letters,
          or quizzes.
        </Text>

        <SimpleGrid columns={[1, 2, 3]} spacing={6} maxW="5xl" mx="auto">
          {creditPacks.map((pack, idx) => (
            <Box
              key={idx}
              borderWidth={1}
              borderColor={border}
              borderRadius="xl"
              p={6}
              shadow="sm"
              bg={bgCard}
              transition="all 0.2s ease"
              _hover={{ shadow: "md", transform: "translateY(-2px)" }}
            >
              <VStack spacing={4}>
                <Icon as={FaBolt} boxSize={6} color="yellow.400" />
                <Text fontSize="xl" fontWeight="bold">
                  {pack.name}
                </Text>
                <Text fontSize="2xl" color="blue.500" fontWeight="extrabold">
                  {pack.price}
                </Text>
                <Button
                  variant="outline"
                  colorScheme="blue"
                  size="md"
                  onClick={() => handleSelectPlan(pack.name)}
                >
                  {pack.cta}
                </Button>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </Box>
  );
}
