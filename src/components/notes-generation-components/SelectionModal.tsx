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
} from "@chakra-ui/react";
import { AiOutlineFileText, AiOutlineYoutube, AiOutlineFileImage } from "react-icons/ai";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

interface SelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOptionSelect: (type: "prompt" | "youtube" | "file") => void;
}

const SelectionModal: React.FC<SelectionModalProps> = ({ isOpen, onClose, onOptionSelect }) => {
  const modalBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.300");
  const cardBg = useColorModeValue("gray.100", "gray.700");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" bg={modalBg} p={4}>
        <ModalHeader textAlign="center" color={textColor} fontSize="lg">
          Select Note Generation Method
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            {[
              { type: "prompt", label: "Write a Prompt", icon: <AiOutlineFileText size={40} /> },
              { type: "youtube", label: "Enter YouTube Link", icon: <AiOutlineYoutube size={40} /> },
              { type: "file", label: "Upload Image/Doc", icon: <AiOutlineFileImage size={40} /> },
            ].map(({ type, label, icon }) => (
              <GridItem key={type}>
                <MotionCard
                  onClick={() => onOptionSelect(type as "prompt" | "youtube" | "file")}
                  cursor="pointer"
                  borderRadius="lg"
                  boxShadow="md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  p={4}
                >
                  <VStack spacing={2}>
                    {icon}
                    <Text fontSize="sm" fontWeight="medium" textAlign="center" color={textColor}>
                      {label}
                    </Text>
                  </VStack>
                </MotionCard>
              </GridItem>
            ))}
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onClose} w="full">
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectionModal;
