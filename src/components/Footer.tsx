"use client";

import { Box, Text, HStack, IconButton, Divider } from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <Box
      textAlign="center"
      py={6}
      color="gray.700"
      bgGradient="linear(to-r, #E0F7FA, #F3E5F5)"
      borderTopRadius="xl"
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
          color="blue.600"
          _hover={{ color: "blue.800", transform: "scale(1.1)" }}
        />
        <IconButton
          as="a"
          href="https://twitter.com"
          aria-label="Twitter"
          icon={<FaTwitter />}
          variant="ghost"
          size="lg"
          color="blue.400"
          _hover={{ color: "blue.600", transform: "scale(1.1)" }}
        />
        <IconButton
          as="a"
          href="https://linkedin.com"
          aria-label="LinkedIn"
          icon={<FaLinkedin />}
          variant="ghost"
          size="lg"
          color="blue.700"
          _hover={{ color: "blue.900", transform: "scale(1.1)" }}
        />
        <IconButton
          as="a"
          href="https://instagram.com"
          aria-label="Instagram"
          icon={<FaInstagram />}
          variant="ghost"
          size="lg"
          color="pink.500"
          _hover={{ color: "pink.700", transform: "scale(1.1)" }}
        />
      </HStack>

      <Divider borderColor="gray.300" maxW="80%" />

      {/* Copyright Text */}
      <Text fontSize="sm" mt={4} fontWeight="medium">
        &copy; {new Date().getFullYear()} <b>Cognivia</b>. All rights reserved.
      </Text>
    </Box>
  );
}
