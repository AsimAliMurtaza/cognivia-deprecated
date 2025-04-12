"use client";

import {
  Button,
  Heading,
  Text,
  VStack,
  Flex,
  useColorModeValue,
  Box,
  Icon,
  BoxProps,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaExclamationTriangle, FaArrowLeft, FaHome } from "react-icons/fa";

const MotionBox = motion(Box);

export default function SignInErrorPage() {
  const router = useRouter();

  // Material You inspired colors with teal/blue theming
  const cardBg = useColorModeValue("white", "gray.800");
  const errorColor = useColorModeValue("red.500", "red.300");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const outlineButtonHoverBg = useColorModeValue("gray.100", "gray.700");
  const errorIconBg = useColorModeValue("red.50", "red.900");
  const buttonColorScheme = useColorModeValue("teal", "blue");
  const flexColor = useColorModeValue("gray.50", "gray.900");

  const handleLoginRedirect = () => router.push("/login");
  const handleHomeRedirect = () => router.push("/");

  const buttonHoverStyles: BoxProps["_hover"] = {
    transform: "translateY(-2px)",
    boxShadow: "md",
  };

  return (
    <Flex minH="100vh" bg={flexColor} justify="center" align="center" p={4}>
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          as="article"
          p={8}
          borderRadius="2xl"
          boxShadow="lg"
          bg={cardBg}
          textAlign="center"
          maxW="md"
          w="full"
        >
          <VStack spacing={6}>
            <Box
              p={4}
              borderRadius="full"
              bg={errorIconBg}
              display="inline-flex"
            >
              <Icon
                as={FaExclamationTriangle}
                boxSize={8}
                color={errorColor}
                aria-hidden="true"
              />
            </Box>

            <Heading as="h1" size="xl" color={textColor} fontWeight="semibold">
              Sign-In Error
            </Heading>

            <Text fontSize="md" color={secondaryText} lineHeight="tall">
              Oops! We couldn&apos;t sign you in. Please check your credentials and
              try again.
            </Text>

            <VStack spacing={4} w="full" pt={4}>
              <Button
                onClick={handleLoginRedirect}
                colorScheme={buttonColorScheme}
                leftIcon={<FaArrowLeft />}
                w="full"
                size="lg"
                borderRadius="full"
                _hover={buttonHoverStyles}
                transition="all 0.2s"
                aria-label="Return to login page"
              >
                Back to Login
              </Button>

              <Button
                onClick={handleHomeRedirect}
                variant="outline"
                colorScheme={buttonColorScheme}
                leftIcon={<FaHome />}
                w="full"
                size="lg"
                borderRadius="full"
                _hover={{
                  ...buttonHoverStyles,
                  bg: outlineButtonHoverBg,
                }}
                transition="all 0.2s"
                aria-label="Go to home page"
              >
                Go to Home
              </Button>
            </VStack>
          </VStack>
        </Box>
      </MotionBox>
    </Flex>
  );
}
