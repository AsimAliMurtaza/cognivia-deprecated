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
        p={8}
        borderRadius="2xl"
        boxShadow="md"
        border="1px solid"
        borderColor={borderColor}
        whileHover={{
          y: -5,
          boxShadow: "lg",
          borderColor: primaryColor,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        cursor="pointer"
        h="full"
      >
        <VStack spacing={5} align="center" h="full">
          <Flex
            align="center"
            justify="center"
            w={16}
            h={16}
            borderRadius="xl"
            bg={`${primaryColor}10`}
            color={primaryColor}
          >
            <Icon size={28} />
          </Flex>
          <Heading
            size="md"
            textAlign="center"
            color={textColor}
            fontWeight="semibold"
          >
            {title}
          </Heading>
          <Text
            color={useColorModeValue("gray.600", "gray.400")}
            textAlign="center"
            fontSize="sm"
            lineHeight="tall"
          >
            {description}
          </Text>
          <Box mt="auto" w="full">
            <Box
              h={1}
              w="40%"
              mx="auto"
              bg={secondaryColor}
              borderRadius="full"
              opacity={0.7}
            />
          </Box>
        </VStack>
      </MotionBox>
    </Link>
  );
};

export default function QuizGenerationModule() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const bgColor = useColorModeValue("gray.50", "gray.900");
  const primaryColor = useColorModeValue("teal.600", "blue.400");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="6xl">
        <VStack
          spacing={12}
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={5} textAlign="center" maxW="3xl">
            <Box
              bg={`${primaryColor}10`}
              px={4}
              py={2}
              borderRadius="full"
              display="inline-flex"
            ></Box>
            <Heading
              as="h1"
              size="2xl"
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
            >
              Create Smart Quizzes in Seconds
            </Heading>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={useColorModeValue("gray.600", "gray.400")}
              lineHeight="tall"
            >
              Transform any content into interactive quizzes using our advanced
              AI technology. Choose your preferred method below to get started.
            </Text>
          </VStack>
          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={{ base: 6, md: 8 }}
            w="full"
          >
            <FeatureCard
              icon={FileText}
              title="Text Prompt"
              description="Generate quizzes instantly by describing your topic or pasting content"
              href="/dashboard/quizzes/generate/text"
            />
            <FeatureCard
              icon={Upload}
              title="Document Upload"
              description="Upload PDFs, Word docs or text files for automatic quiz creation"
              href="/dashboard/quizzes/generate/document"
            />
            <FeatureCard
              icon={ImageIcon}
              title="Image Upload"
              description="Extract text from images or diagrams to create quizzes"
              href="/dashboard/quizzes/generate/image"
            />
          </SimpleGrid>
          <Divider my={8} /> {/* Horizontal separator */}
          <SimpleGrid
            columns={{ base: 1, md: 1 }}
            spacing={{ base: 6, md: 8 }}
            w="full"
          >
            <FeatureCard
              icon={ListChecks}
              title="Manage Quizzes"
              description="View, edit, and organize your created quizzes"
              href="/dashboard/quizzes/manage"
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
