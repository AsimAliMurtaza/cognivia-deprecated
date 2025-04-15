"use client";

import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Grid,
  GridItem,
  Button,
  Card,
  Text,
  useColorModeValue,
  VStack,
  Avatar,
  Flex,
  Box,
  Divider,
} from "@chakra-ui/react";
import { FiFileText, FiYoutube, FiImage } from "react-icons/fi";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (type: "prompt" | "youtube" | "file") => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isOpen,
  onClose,
  onOptionSelect,
}) => {
  const surfaceColor = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("teal.600", "blue.300");
  const secondaryColor = useColorModeValue("teal.500", "blue.400");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const options = [
    {
      type: "prompt",
      label: "Write Prompt",
      description: "Describe what you need",
      icon: <FiFileText size={24} />,
    },
    {
      type: "youtube",
      label: "YouTube Link",
      description: "Summarize a video",
      icon: <FiYoutube size={24} />,
    },
    {
      type: "file",
      label: "Upload File",
      description: "PDF, DOC, or image",
      icon: <FiImage size={24} />,
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent borderRadius="2xl" bg={surfaceColor}>
        <ModalHeader>
          <Flex align="center" gap={3}>
            <Avatar bg={primaryColor} color="white" name="Generate Notes" />
            <Box>
              <Text fontSize="xl" fontWeight="semibold" color={textColor}>
                Generate Notes
              </Text>
              <Text fontSize="sm" color={subTextColor}>
                Choose your input method
              </Text>
            </Box>
          </Flex>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            {options.map(({ type, label, description, icon }) => (
              <GridItem key={type}>
                <MotionCard
                  onClick={() => onOptionSelect(type as "prompt" | "youtube" | "file")}
                  cursor="pointer"
                  borderRadius="xl"
                  boxShadow="sm"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  p={4}
                  h="full"
                >
                  <VStack spacing={3} align="center" textAlign="center">
                    <Avatar
                      icon={icon}
                      bg={secondaryColor}
                      color="white"
                      size="md"
                    />
                    <Text fontWeight="semibold" color={textColor}>
                      {label}
                    </Text>
                    <Text fontSize="sm" color={subTextColor}>
                      {description}
                    </Text>
                  </VStack>
                </MotionCard>
              </GridItem>
            ))}
          </Grid>
        </ModalBody>
        <Divider borderColor={borderColor} />
        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            borderRadius="lg"
            px={6}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectionModal;