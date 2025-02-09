"use client";

import { useRouter } from "next/navigation";
import { Link as ScrollLink } from "react-scroll";
import {
  Box,
  Flex,
  Button,
  Heading,
  HStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import DarkModeToggle from "./DarkModeToggle";

export default function Header() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Dynamic colors for light & dark mode
  const bgColor = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const drawerBg = useColorModeValue("white", "gray.800");
  const hoverBg = useColorModeValue("#E0F7FA", "gray.700");
  const gradient = useColorModeValue(
    "linear(to-r, #6EC3C4, #A5D8DD)",
    "linear(to-r, cyan.400, blue.500)"
  );

  return (
    <Box
      as="nav"
      bg={bgColor}
      py={4}
      boxShadow="md"
      position="fixed"
      top="0"
      w="100%"
      zIndex="1000"
      borderBottom="1px solid"
      borderColor={borderColor}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={6}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Heading
          size="xl"
          bgGradient={gradient}
          bgClip="text"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => router.push("/")}
          transition="all 0.3s ease-in-out"
          _hover={{ transform: "scale(1.05)" }}
        >
          Cognivia
        </Heading>

        {/* Desktop Navigation */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          {["About Us", "Features", "Pricing", "Contact"].map((link, index) => (
            <ScrollLink
              key={index}
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
                transition="all 0.2s ease-in-out"
                _hover={{
                  color: "#6EC3C4",
                  transform: "translateY(-2px)",
                  textDecoration: "underline",
                }}
              >
                {link}
              </Button>
            </ScrollLink>
          ))}
        </HStack>

        {/* Auth Buttons - Desktop */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            borderColor="#6EC3C4"
            color="#6EC3C4"
            transition="all 0.3s ease-in-out"
            _hover={{
              bg: hoverBg,
              transform: "scale(1.05)",
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            bgGradient="linear(to-r, #6EC3C4, #5AA8A9)"
            color="white"
            transition="all 0.3s ease-in-out"
            _hover={{
              transform: "scale(1.05)",
            }}
          >
            Get Started
          </Button>
          <DarkModeToggle />
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "inline-flex", md: "none" }}
          icon={<HamburgerIcon color={textColor} />}
          variant="ghost"
          onClick={onOpen}
          aria-label="Open Menu"
          transition="all 0.2s ease-in-out"
          _hover={{ bg: hoverBg, transform: "scale(1.1)" }}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={drawerBg} boxShadow="lg">
          <DrawerCloseButton color={textColor} />
          <DrawerHeader>
            <Heading
              size="xl"
              bgGradient={gradient}
              bgClip="text"
              fontWeight="bold"
            >
              Cognivia
            </Heading>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={4} align="start">
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
                      fontSize="lg"
                      color={textColor}
                      w="full"
                      justifyContent="flex-start"
                      transition="all 0.2s ease-in-out"
                      _hover={{
                        color: "#6EC3C4",
                        bg: hoverBg,
                      }}
                    >
                      {link}
                    </Button>
                  </ScrollLink>
                )
              )}

              <Divider borderColor={borderColor} />

              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                color="#6EC3C4"
                borderColor="#6EC3C4"
                w="full"
                transition="all 0.3s ease-in-out"
                _hover={{
                  bg: hoverBg,
                  transform: "scale(1.02)",
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                bgGradient="linear(to-r, #6EC3C4, #5AA8A9)"
                color="white"
                w="full"
                transition="all 0.3s ease-in-out"
                _hover={{
                  transform: "scale(1.02)",
                }}
              >
                Get Started
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
