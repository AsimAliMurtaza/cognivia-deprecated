"use client";
import {
  Box,
  Flex,
  Card,
  CardBody,
  CardHeader,
  Text,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SmartNotesPage() {
  const router = useRouter();
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const hoverBgColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("gray.800", "gray.100");

  return (
    <Box display="flex" flexDir="column" alignItems="center" py={10}>
      {/* Page Header */}
      <Heading size="xl" color="teal.400" mb={2}>
        Smart Notes
      </Heading>
      <Text fontSize="md" color={textColor} textAlign="center" mb={8} px={4}>
        Streamline your learning with AI-powered note generation and easy
        access to your saved notes.
      </Text>

      {/* Cards Section */}
      <Flex gap={6} wrap="wrap" justify="center">
        {/* Generate Notes Card */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            w={{ base: "80%", sm: "300px" }}
            bg={bgColor}
            _hover={{ bg: hoverBgColor }}
            minH="180px"
            boxShadow="lg"
            borderRadius="lg"
            cursor="pointer"
            onClick={() => router.push("/dashboard/notes/generate")}
          >
            <CardHeader textAlign="center">
              <Heading size="md" color="teal.500">
                Generate Notes
              </Heading>
            </CardHeader>
            <CardBody textAlign="center">
              <Text fontSize="sm">
                Use AI to generate structured and concise notes from any
                content.
              </Text>
            </CardBody>
          </Card>
        </motion.div>

        {/* View Notes Card */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <Card
            w={{ base: "80%", sm: "300px" }}
            bg={bgColor}
            _hover={{ bg: hoverBgColor }}
            boxShadow="lg"
            borderRadius="lg"
            cursor="pointer"
            minH="180px"
            onClick={() => router.push("/dashboard/notes/view")}
          >
            <CardHeader textAlign="center">
              <Heading size="md" color="teal.500">
                View Notes
              </Heading>
            </CardHeader>
            <CardBody textAlign="center">
              <Text fontSize="sm">
                Access and manage your saved notes efficiently, anytime.
              </Text>
            </CardBody>
          </Card>
        </motion.div>
      </Flex>
    </Box>
  );
}
