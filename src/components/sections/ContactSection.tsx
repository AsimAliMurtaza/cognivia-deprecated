"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";

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

  return (
    <Box py={20} id="contact" bg="gray.50" position="relative" zIndex={1}>
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
              bgGradient="linear(to-r, #6EC3C4, #A5D8DD)"
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
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Have questions? Reach out to us anytime. We're here to help!
            </Text>
          </motion.div>
        </VStack>

        {/* Contact Form & Social Links */}
        <VStack spacing={8} mt={10} align="center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Box
              bg="white"
              p={8}
              borderRadius="lg"
              boxShadow="lg"
              maxW="100vw"
              w="auto"
            >
              <FormControl mb={4} isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  focusBorderColor="blue.400"
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  focusBorderColor="blue.400"
                />
              </FormControl>

              <FormControl mb={4} isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea
                  placeholder="Your Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  focusBorderColor="blue.400"
                />
              </FormControl>

              <Button
                colorScheme="blue"
                w="full"
                size="lg"
                isLoading={loading}
                onClick={handleSubmit}
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
