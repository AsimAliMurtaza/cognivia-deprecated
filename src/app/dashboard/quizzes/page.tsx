"use client";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { FileText, Upload, Image as ImageIcon, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const MotionBox = motion(Box);

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
}: FeatureCardProps) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const secondaryColor = useColorModeValue("teal.300", "blue.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <MotionBox
        bg={cardBg}
        p={6} // Reduced padding
        borderRadius="xl" // Slightly less rounded
        boxShadow="sm" // Softer initial shadow
        border="1px solid"
        borderColor={borderColor}
        whileHover={{
          y: -3, // Subtler lift
          boxShadow: "md", // Slightly stronger hover shadow
          borderColor: primaryColor,
        }}
        whileTap={{ scale: 0.99 }} // Less intense tap
        transition={{ type: "spring", stiffness: 300, damping: 18 }} // Smoother spring
        cursor="pointer"
        h="full"
        display="flex"
        flexDirection="column"
        justifyContent="space-between" // Distribute content vertically
      >
        <VStack spacing={4} align="center">
          <Flex
            align="center"
            justify="center"
            w={12} // Smaller icon container
            h={12} // Smaller icon container
            borderRadius="md" // Less rounded
            bg={`${primaryColor}15`} // Slightly stronger background
            color={primaryColor}
          >
            <Icon size={24} /> {/* Smaller icon */}
          </Flex>
          <Heading
            size="sm" // Smaller heading
            textAlign="center"
            color={textColor}
            fontWeight="semibold"
          >
            {title}
          </Heading>
          <Text
            color={useColorModeValue("gray.600", "gray.400")}
            textAlign="center"
            fontSize="xs" // Smaller description
            lineHeight="relaxed" // More relaxed line height
          >
            {description}
          </Text>
        </VStack>
        <Box mt={4} w="full">
          <Box
            h={1}
            w="30%" // Slightly smaller indicator
            mx="auto"
            bg={secondaryColor}
            borderRadius="full"
            opacity={0.6} // Slightly less opaque
          />
        </Box>
      </MotionBox>
    </Link>
  );
};

export default function QuizGenerationModule() {
  const containerVariants = {
    hidden: { opacity: 0, y: 10 }, // Subtler initial position
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Faster transition
        staggerChildren: 0.15, // Quicker stagger
      },
    },
  };

  const bgColor = useColorModeValue("gray.100", "gray.900"); // Lighter background
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box minH="100vh" bg={bgColor} py={10}>
      {" "}
      {/* Reduced vertical padding */}
      <Container maxW="5xl">
        {" "}
        {/* Slightly smaller container */}
        <VStack
          spacing={10} // Adjusted spacing
          align="center"
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={3} textAlign="center" maxW="2xl">
            {" "}
            <Heading
              as="h1"
              size="xl" // Slightly smaller main heading
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
            >
              Generate Engaging Quizzes Effortlessly
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }} // Adjusted font sizes
              color={useColorModeValue("gray.600", "gray.400")}
              lineHeight="relaxed" // More relaxed line height
            >
              Unleash the power of AI to create interactive quizzes from various
              sources. Choose a method below and start building your
              personalized assessments in no time.
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 4, md: 6 }} // Adjusted spacing
            w="full"
          >
            <FeatureCard
              icon={FileText}
              title="Text Input"
              description="Describe your quiz topic or paste text content to generate questions."
              href="/dashboard/quizzes/generate/text"
            />
            <FeatureCard
              icon={Upload}
              title="Document Upload"
              description="Upload your PDFs, DOCX files, or plain text to automatically create quizzes."
              href="/dashboard/quizzes/generate/document"
            />
            <FeatureCard
              icon={ImageIcon}
              title="Image to Quiz"
              description="Upload images containing text or diagrams to extract content for quiz generation."
              href="/dashboard/quizzes/generate/image"
            />
          </SimpleGrid>
          <Divider opacity={0.4} /> {/* Subtler divider */}
          <Heading
            as="h2"
            size="lg" // Slightly smaller section heading
            fontWeight="semibold"
            color={textColor}
            textAlign="center"
          >
            Manage Your Quizzes
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 1 }}
            spacing={{ base: 4, md: 6 }}
            w="full"
          >
            <FeatureCard
              icon={ListChecks}
              title="Manage & Organize"
              description="View, edit, and organize all the quizzes you've created in one central location."
              href="/dashboard/quizzes/manage"
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
