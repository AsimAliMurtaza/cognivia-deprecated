"use client";

import {
  Box,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Text,
  Heading,
  useColorModeValue,
  useBreakpointValue,
  Icon,
  Button,
  Container,
  SimpleGrid,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdOutlineNotes } from "react-icons/md";
import { FaBrain } from "react-icons/fa";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}

const MotionCard = motion(Card);
const FeatureCard = ({
  title,
  description,
  icon,
  onClick,
}: FeatureCardProps) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.400"); // Slightly softer text
  const titleColor = useColorModeValue("teal.500", "blue.300"); // Slightly less intense
  const shadowColor = useColorModeValue("rgba(0,0,0,0.06)", "rgba(0,0,0,0.15)"); // Subtler shadow

  const cardWidth = useBreakpointValue({
    base: "100%",
    sm: "auto",
  });

  return (
    <MotionCard
      whileHover={{
        scale: 1.03, // Reduced scale for subtler effect
        boxShadow: `0px 8px 20px ${shadowColor}`, // Softer shadow
      }}
      whileTap={{ scale: 0.99 }} // Smaller tap effect
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
      w={cardWidth}
      bg={bgColor}
      _hover={{ bg: hoverBgColor }}
      minH="220px" // Slightly reduced height
      borderRadius="md" // More common border radius
      cursor="pointer"
      boxShadow={`sm`} // Lighter initial shadow
      onClick={onClick}
    >
      <CardHeader
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={5}
        pb={4}
      >
        <Icon as={icon} boxSize={8} color={titleColor} mb={2} />{" "}
        {/* Smaller icon */}
        <Heading
          size="sm"
          color={titleColor}
          fontWeight="semibold"
          textAlign="center"
        >
          {title}
        </Heading>
      </CardHeader>
      <CardBody p={5} pt={0} textAlign="center">
        <Text fontSize="sm" color={textColor} lineHeight="relaxed">
          {" "}
          {/* Smaller, more relaxed text */}
          {description}
        </Text>
      </CardBody>
    </MotionCard>
  );
};

export default function SmartNotesPage() {
  const router = useRouter();
  const bgColor = useColorModeValue("gray.100", "gray.900"); // Lighter background
  const heroGradient = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400"); // Consistent softer text
  const titleColor = useColorModeValue("teal.500", "blue.300"); // Consistent less intense title
  const btnColor = useColorModeValue("teal", "blue"); // Consistent button color

  return (
    <Box bg={bgColor} py={12}>
      {" "}
      {/* Reduced vertical padding */}
      <Container maxW="container.lg">
        {" "}
        {/* Slightly smaller container */}
        <Flex
          bg={heroGradient}
          borderRadius="xl" // More common border radius
          p={{ base: 6, md: 8 }} // Reduced padding
          mb={8} // Reduced margin
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={6} // Reduced gap
          boxShadow="md"
        >
          <Box
            maxW={{ base: "100%", md: "450px" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Heading
              size="xl" // Slightly smaller heading
              color={titleColor}
              fontWeight="bold" // Still bold, but size reduced
              letterSpacing="tight"
              mb={3} // Reduced margin
            >
              Smart Notes for Enhanced Learning
            </Heading>
            <Text
              fontSize="md"
              color={textColor}
              fontWeight="medium"
              mb={5}
              lineHeight="tall"
            >
              {" "}
              {/* Smaller, more relaxed text */}
              Generate insightful notes from any text and effortlessly manage
              your knowledge, streamlining your study process.
            </Text>
            <Button
              colorScheme={btnColor}
              size="md" // Smaller button
              onClick={() => router.push("/dashboard/notes/generate")}
              leftIcon={<Icon as={FaBrain} boxSize={5} />} // Smaller icon
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
            >
              Generate Notes
            </Button>
          </Box>
          <Icon
            as={MdOutlineNotes}
            boxSize="24"
            color={titleColor}
            opacity={0.7}
          />{" "}
          {/* Smaller icon */}
        </Flex>
        {/* Features Section */}
        <Heading
          as="h2"
          size="lg" // Smaller heading
          color={titleColor}
          fontWeight="semibold"
          mb={6} // Reduced margin
          textAlign="center"
        >
          Explore More
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {" "}
          {/* Reduced spacing */}
          <FeatureCard
            title="Centralized Note Management"
            description="Access, organize, and edit all your generated notes in one convenient place. Keep your learning materials within easy reach."
            icon={MdOutlineNotes}
            onClick={() => router.push("/dashboard/notes/view")}
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}
