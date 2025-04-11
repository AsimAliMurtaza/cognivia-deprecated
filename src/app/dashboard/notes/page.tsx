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
  useBreakpointValue,
  Icon,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MdNoteAdd, MdOutlineNotes } from "react-icons/md";

const MotionCard = motion(Card);

export default function SmartNotesPage() {
  const router = useRouter();

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const titleColor = useColorModeValue("teal.600", "blue.400");
  const shadowColor = useColorModeValue("rgba(0,0,0,0.08)", "rgba(0,0,0,0.2)");

  const cardWidth = useBreakpointValue({
    base: "100%",
    sm: "350px",
    md: "300px",
    lg: "360px",
  });

  return (
    <Box display="flex" flexDir="column" alignItems="center" py={10} px={4}>
      {/* Page Header */}
      <Heading
        size="2xl"
        color={titleColor}
        mb={2}
        fontWeight="semibold"
        letterSpacing="tight"
      >
        Smart Notes
      </Heading>
      <Text
        fontSize="lg"
        color={textColor}
        textAlign="center"
        maxW="600px"
        mb={10}
        fontWeight="medium"
      >
        Streamline your learning with AI-powered note generation and seamless
        access to your saved notes.
      </Text>

      {/* Cards Section */}
      <Flex gap={6} wrap="wrap" justify="center">
        {/* Generate Notes */}
        <MotionCard
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          w={cardWidth}
          bg={bgColor}
          _hover={{ bg: hoverBgColor }}
          minH="220px"
          borderRadius="2xl"
          cursor="pointer"
          boxShadow={`0 4px 20px ${shadowColor}`}
          onClick={() => router.push("/dashboard/notes/generate")}
        >
          <CardHeader
            textAlign="center"
            pt={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            gap={2}
          >
            <Icon as={MdNoteAdd} boxSize={8} color={titleColor} />
            <Heading size="md" color={titleColor}>
              Generate Notes
            </Heading>
          </CardHeader>
          <CardBody textAlign="center" px={6} pb={6}>
            <Text fontSize="md" color={textColor}>
              Use AI to instantly convert raw content into organized, structured
              study notes.
            </Text>
          </CardBody>
        </MotionCard>

        {/* View Notes */}
        <MotionCard
          whileHover={{
            scale: 1.03,
            boxShadow: "0px 8px 24px rgba(0,0,0,0.15)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          w={cardWidth}
          bg={bgColor}
          _hover={{ bg: hoverBgColor }}
          minH="220px"
          borderRadius="2xl"
          cursor="pointer"
          boxShadow={`0 4px 20px ${shadowColor}`}
          onClick={() => router.push("/dashboard/notes/view")}
        >
          <CardHeader
            textAlign="center"
            pt={6}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDir="column"
            gap={2}
          >
            <Icon as={MdOutlineNotes} boxSize={8} color={titleColor} />
            <Heading size="md" color={titleColor}>
              View Notes
            </Heading>
          </CardHeader>
          <CardBody textAlign="center" px={6} pb={6}>
            <Text fontSize="md" color={textColor}>
              Access your saved notes, edit them, and keep track of what you&apos;ve
              learned.
            </Text>
          </CardBody>
        </MotionCard>
      </Flex>
    </Box>
  );
}
