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
  Button,
  Card,
  CardHeader,
  Text,
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
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader textAlign="center" color="teal.600">
          Select Note Generation Method
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Grid templateColumns="repeat(3, 1fr)" gap={6}>
            <MotionCard
              onClick={() => onOptionSelect("prompt")}
              cursor="pointer"
              borderRadius="lg"
              boxShadow="md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              bg="white"
            >
              <CardHeader textAlign="center">
                <AiOutlineFileText size={40} color="teal" />
                <Text mt={2} fontWeight="semibold">
                  Write a Prompt
                </Text>
              </CardHeader>
            </MotionCard>
            <MotionCard
              onClick={() => onOptionSelect("youtube")}
              cursor="pointer"
              borderRadius="lg"
              boxShadow="md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              bg="white"
            >
              <CardHeader textAlign="center">
                <AiOutlineYoutube size={40} color="teal" />
                <Text mt={2} fontWeight="semibold">
                  Enter YouTube Link
                </Text>
              </CardHeader>
            </MotionCard>
            <MotionCard
              onClick={() => onOptionSelect("file")}
              cursor="pointer"
              borderRadius="lg"
              boxShadow="md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              bg="white"
            >
              <CardHeader textAlign="center">
                <AiOutlineFileImage size={40} color="teal" />
                <Text mt={2} fontWeight="semibold">
                  Upload Image/Doc
                </Text>
              </CardHeader>
            </MotionCard>
          </Grid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SelectionModal;