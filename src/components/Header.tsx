"use client";

import { useRouter } from "next/navigation";
import { Link as ScrollLink } from "react-scroll";
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import DarkModeToggle from "./DarkModeToggle";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Header() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Dynamic colors for light & dark mode
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const hoverColor = useColorModeValue("blue.500", "blue.300");
  const colorScheme = useColorModeValue("teal", "blue");

  return (
    <Box
      position="fixed"
      w="100vw"
      top={0}
      zIndex={100}
      bg={bgColor}
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" py={4}>
          {/* Logo */}
          <Heading
            as="h1"
            size="lg"
            color={useColorModeValue("teal.500", "blue.300")}
            cursor="pointer"
            onClick={() => router.push("/")}
          >
            Cognivia
          </Heading>

          {/* Desktop Navigation */}
          <Flex display={{ base: "none", md: "flex" }} align="center">
            {["About Us", "Features", "Pricing", "Contact"].map(
              (link, index) => (
                <MotionBox key={index} whileTap={{ scale: 0.95 }} mx={4}>
                  <ScrollLink
                    to={link.toLowerCase().replace(" ", "")}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    spy={true}
                  >
                    <Button
                      variant="ghost"
                      fontSize="lg"
                      fontWeight="medium"
                      color={textColor}
                      borderRadius="full"
                      _hover={{ color: hoverColor, textDecoration: "none" }}
                    >
                      {link}
                    </Button>
                  </ScrollLink>
                </MotionBox>
              )
            )}
          </Flex>

          {/* Buttons (Auth & Dark Mode Toggle) */}
          <Flex align="center" gap={4}>
            <DarkModeToggle />

            {/* Auth Buttons - Desktop */}
            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
              <Button
                onClick={() => router.push("/login")}
                variant="solid"
                borderColor={hoverColor}
                borderRadius="full"
                colorScheme={colorScheme}
                size="lg"
              >
                Sign In
              </Button>
            </HStack>

            {/* Mobile Menu Button */}
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Open Menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              fontSize="xl"
              borderRadius="full"
              onClick={onOpen}
            />
          </Flex>
        </Flex>
      </Container>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor}>
          <DrawerCloseButton />
          <VStack spacing={4} mt={16} align="stretch" px={4}>
            {["About Us", "Features", "Pricing", "Contact"].map(
              (link, index) => (
                <ScrollLink
                  key={index}
                  to={link.toLowerCase().replace(" ", "")}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  spy={true}
                  onClick={onClose}
                >
                  <Button
                    variant="ghost"
                    fontSize="xl"
                    fontWeight="medium"
                    color={textColor}
                    w="full"
                    justifyContent="flex-start"
                    _hover={{ color: hoverColor }}
                  >
                    {link}
                  </Button>
                </ScrollLink>
              )
            )}

            <Box py={2}>
              <Button
                onClick={() => {
                  onClose();
                  router.push("/login");
                }}
                variant="outline"
                color={hoverColor}
                borderColor={hoverColor}
                w="full"
                borderRadius="full"
                _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
              >
                Login
              </Button>
            </Box>
            <Button
              onClick={() => {
                onClose();
                router.push("/signup");
              }}
              colorScheme="blue"
              w="full"
              borderRadius="full"
            >
              Get Started
            </Button>
          </VStack>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
