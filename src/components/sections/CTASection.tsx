"use client";

import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Stack,
  Image,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { useRouter } from "next/navigation";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

const CTASection = () => {
  const router = useRouter();

  const onClickHandler = async () => {
    router.push("/signup");
  };

  // Material You inspired colors
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const surfaceColor = useColorModeValue("white", "gray.800");
  const colorScheme = useColorModeValue("teal", "blue");

  return (
    <MotionBox
      as="section"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      py={24}
      bg={surfaceColor}
    >
      <Container maxW="container.xl">
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={{ base: 8, md: 16 }}
        >
          {/* Text Content */}
          <Stack
            direction="column"
            align={{ base: "center", md: "flex-start" }}
            textAlign={{ base: "center", md: "left" }}
            flex="2"
            spacing={6}
          >
            <Text fontSize="md" mt={-12} color={textColor} fontWeight="medium">
              LEARNERS AND STUDENTS
            </Text>

            <Heading
              fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
              fontWeight="bold"
              lineHeight="tall"
              color={headingColor}
            >
              Learn anything with{" "}
              <Box as="span" color={primaryColor}>
                <Typewriter
                  words={["Cognivia.", "Us."]}
                  loop={false}
                  cursor
                  cursorStyle="|"
                  typeSpeed={100}
                  deleteSpeed={70}
                  delaySpeed={1000}
                />
              </Box>
            </Heading>

            <Text
              fontSize={{ base: "lg", md: "xl" }}
              color={textColor}
              maxW={{ base: "100%", md: "80%" }}
            >
              Join thousands of learners who are mastering subjects faster with
              Cognivia&apos;s adaptive quizzes and personalized feedback.
            </Text>

            <MotionButton
              colorScheme={colorScheme}
              size="lg"
              borderRadius="full"
              py={6}
              fontSize="lg"
              fontWeight="medium"
              boxShadow="md"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClickHandler}
            >
              Start Learning Free
            </MotionButton>
          </Stack>

          {/* Image Content */}
          <Box flex="1" display={{ base: "none", md: "block" }}>
            <Image
              src="images/cognivia.svg" // Update with your Cognivia illustration
              alt="AI Learning Illustration"
              borderRadius="xl"
              boxSize="90%"
            />
          </Box>
        </Flex>
      </Container>
    </MotionBox>
  );
};

export default CTASection;
