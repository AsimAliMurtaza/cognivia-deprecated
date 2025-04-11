"use client";
import React from "react";

import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FileText, Upload, ImageIcon } from "lucide-react";
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
  const bgColor = useColorModeValue(
    "rgba(255, 255, 255, 0.8)",
    "rgba(26, 32, 44, 0.8)"
  );
  const borderColor = useColorModeValue("teal.300", "purple.300");
  const iconColor = useColorModeValue("teal.500", "purple.300");
  const titleColor = useColorModeValue("teal.700", "purple.200");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <MotionBox
        bg={bgColor}
        p={6}
        borderRadius="lg"
        boxShadow="xl"
        border="1px solid"
        borderColor={borderColor}
        backdropFilter="blur(10px)"
        whileHover={{
          scale: 1.05,
          style: { boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.15)" },
        }}
        transition={{ duration: 0.3 }}
        cursor="pointer"
      >
        <VStack spacing={4} align="center">
          <Icon size={40} color={iconColor} />
          <Heading size="md" textAlign="center" color={titleColor}>
            {title}
          </Heading>
          <Text color={textColor} textAlign="center" fontSize="sm">
            {description}
          </Text>
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

  const bgGradient = useColorModeValue("gray.50", "gray.800");
  const headingColor = useColorModeValue("teal.800", "purple.300");
  const textColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Box minH="100vh" bgGradient={bgGradient} borderRadius="30px" py={16}>
      <Container maxW="6xl">
        <VStack
          spacing={12}
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" fontWeight="bold" color={headingColor}>
              AI-Powered Quiz Generation
            </Heading>
            <Text fontSize="xl" color={textColor} maxW="2xl">
              Create personalized quizzes effortlessly using our advanced AI
              technology. Choose your preferred method below to get started.
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
            <FeatureCard
              icon={FileText}
              title="Text Prompt"
              description="Generate a quiz by providing a text prompt on a topic."
              href="/generate/text"
            />
            <FeatureCard
              icon={Upload}
              title="Document Upload"
              description="Upload study materials and let AI create a comprehensive quiz."
              href="/generate/document"
            />
            <FeatureCard
              icon={ImageIcon}
              title="Image Upload"
              description="Transform images or diagrams into interactive quizzes."
              href="/generate/image"
            />
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  );
}
