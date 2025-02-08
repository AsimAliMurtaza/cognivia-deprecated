"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
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
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function Header() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      as="nav"
      bg="white"
      py={4}
      boxShadow="sm"
      position="fixed"
      top="0"
      w={"100%"}
      zIndex="100"
      borderBottom="1px solid"
      borderColor="gray.100"
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Heading
          size="xl"
          bgGradient="linear(to-r, blue.300, #A5D8DD)"
          bgClip="text"
          fontWeight="bold"
          cursor="pointer"
          onClick={() => router.push("/")}
          transition="all 0.2s"
          _hover={{ transform: "scale(1.05)" }}
        >
          whatever name fits
        </Heading>

        {/* Desktop Navigation */}
        <HStack spacing={6} display={{ base: "none", md: "flex" }}>
          {["About Us", "Features", "Pricing", "Contact"].map((link, index) => (
            <Link key={index} href={`#${link.toLowerCase().replace(" ", "")}`} passHref>
              <Button
                variant="ghost"
                fontSize="lg"
                fontWeight="medium"
                color="gray.700"
                transition="all 0.2s"
                _hover={{
                  color: "#6EC3C4",
                  transform: "translateY(-2px)",
                }}
              >
                {link}
              </Button>
            </Link>
          ))}
        </HStack>

        {/* Auth Buttons - Desktop */}
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Button
            onClick={() => router.push("/login")}
            variant="outline"
            color="#6EC3C4"
            borderColor="#6EC3C4"
            _hover={{
              bg: "#E0F7FA",
              transform: "scale(1.05)",
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => router.push("/signup")}
            bg="#6EC3C4"
            color="white"
            _hover={{
              bg: "#5AA8A9",
              transform: "scale(1.05)",
            }}
          >
            Get Started
          </Button>
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "inline-flex", md: "none" }}
          icon={<HamburgerIcon color="gray.600" />}
          variant="ghost"
          onClick={onOpen}
          aria-label="Open Menu"
          _hover={{ bg: "#E0F7FA" }}
        />
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="white">
          <DrawerCloseButton color="gray.600" />
          <DrawerHeader>
            <Heading
              size="xl"
              bgGradient="linear(to-r, #6EC3C4, #A5D8DD)"
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
                  <Link
                    key={index}
                    href={`#${link.toLowerCase().replace(" ", "")}`}
                    passHref
                  >
                    <Button
                      variant="ghost"
                      fontSize="lg"
                      color="gray.700"
                      onClick={onClose}
                      w="full"
                      justifyContent="flex-start"
                      _hover={{
                        color: "#6EC3C4",
                        bg: "#E0F7FA",
                      }}
                    >
                      {link}
                    </Button>
                  </Link>
                )
              )}
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                color="#6EC3C4"
                borderColor="#6EC3C4"
                w="full"
                _hover={{
                  bg: "#E0F7FA",
                  transform: "scale(1.02)",
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => router.push("/signup")}
                bg="#6EC3C4"
                color="white"
                w="full"
                _hover={{
                  bg: "#5AA8A9",
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