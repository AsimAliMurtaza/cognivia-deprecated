"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!name || !email || !message) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    // Simulating form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you soon.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setName("");
      setEmail("");
      setMessage("");
      setLoading(false);
    }, 2000);
  };

  // Dynamic Colors for Light & Dark Mode
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const cardBg = useColorModeValue("white", "gray.700");
  const inputBg = useColorModeValue("gray.100", "gray.600");
  const inputBorder = useColorModeValue("gray.300", "gray.500");

  return (
    <Box py={20} id="contact" bg={bgColor} position="relative" zIndex={1}>
      <Container maxW="container.lg">
        <VStack spacing={8} textAlign="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Heading
              size="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, teal.400, blue.400)"
              bgClip="text"
            >
              Get in Touch
            </Heading>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Text fontSize="lg" color={textColor} maxW="2xl">
              Have questions? Reach out to us anytime. We're here to help!
            </Text>
          </motion.div>
        </VStack>

        {/* Contact Form */}
        <VStack spacing={8} mt={10} align="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Box
              bg={cardBg}
              p={8}
              borderRadius="lg"
              boxShadow="lg"
              maxW="100vw"
              w="auto"
            >
              <FormControl mb={4} isRequired>
                <FormLabel color={textColor}>Name</FormLabel>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  focusBorderColor="blue.400"
                  bg={inputBg}
                  borderColor={inputBorder}
                  color={textColor}
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  focusBorderColor="blue.400"
                  bg={inputBg}
                  borderColor={inputBorder}
                  color={textColor}
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel color={textColor}>Message</FormLabel>
                <Textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  focusBorderColor="blue.400"
                  bg={inputBg}
                  borderColor={inputBorder}
                  color={textColor}
                />
              </FormControl>

              <Button
                colorScheme="blue"
                w="full"
                size="lg"
                isLoading={loading}
                onClick={handleSubmit}
                _hover={{ transform: "scale(1.05)" }}
              >
                Send Message
              </Button>
            </Box>
          </motion.div>
        </VStack>
      </Container>
    </Box>
  );
}
