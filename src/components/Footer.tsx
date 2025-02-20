"use client";

import {
  Box,
  Text,
  HStack,
  IconButton,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  // Dynamic Colors for Light & Dark Mode
  const bgGradient = useColorModeValue(
    "linear(to-r, #E0F7FA, #F3E5F5)",
    "gray.900"
  );
  const textColor = useColorModeValue("gray.700", "gray.300");
  const dividerColor = useColorModeValue("gray.300", "gray.500");

  return (
    <Box
      textAlign="center"
      py={6}
      color={textColor}
      bg={bgGradient}
      boxShadow="md"
    >
      {/* Social Media Links */}
      <HStack justify="center" spacing={4}>
        <IconButton
          as="a"
          href="https://facebook.com"
          aria-label="Facebook"
          icon={<FaFacebook />}
          variant="ghost"
          size="lg"
          color={useColorModeValue("blue.600", "blue.400")}
          _hover={{
            color: useColorModeValue("blue.800", "blue.500"),
            transform: "scale(1.1)",
          }}
        />
        <IconButton
          as="a"
          href="https://twitter.com"
          aria-label="Twitter"
          icon={<FaTwitter />}
          variant="ghost"
          size="lg"
          color={useColorModeValue("blue.400", "blue.300")}
          _hover={{
            color: useColorModeValue("blue.600", "blue.500"),
            transform: "scale(1.1)",
          }}
        />
        <IconButton
          as="a"
          href="https://linkedin.com"
          aria-label="LinkedIn"
          icon={<FaLinkedin />}
          variant="ghost"
          size="lg"
          color={useColorModeValue("blue.700", "blue.400")}
          _hover={{
            color: useColorModeValue("blue.900", "blue.500"),
            transform: "scale(1.1)",
          }}
        />
        <IconButton
          as="a"
          href="https://instagram.com"
          aria-label="Instagram"
          icon={<FaInstagram />}
          variant="ghost"
          size="lg"
          color={useColorModeValue("pink.500", "pink.400")}
          _hover={{
            color: useColorModeValue("pink.700", "pink.500"),
            transform: "scale(1.1)",
          }}
        />
      </HStack>

      <Divider borderColor={dividerColor} maxW="80%" mx="auto" my={3} />

      {/* Copyright Text */}
      <Text fontSize="sm" fontWeight="medium">
        &copy; {new Date().getFullYear()} <b>Cognivia</b>. All rights reserved.
      </Text>
    </Box>
  );
}
