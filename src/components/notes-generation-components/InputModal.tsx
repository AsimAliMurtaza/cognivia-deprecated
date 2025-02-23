import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Textarea,
  Input,
  Button,
  useColorModeValue,
  VStack,
  FormLabel,
} from "@chakra-ui/react";

interface InputModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: "prompt" | "youtube" | "file" | null;
  promptText: string;
  setPromptText: (text: string) => void;
  youtubeLink: string;
  setYoutubeLink: (link: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  onGenerate: () => void;
  loading: boolean;
}

const InputModal: React.FC<InputModalProps> = ({
  isOpen,
  onClose,
  sourceType,
  promptText,
  setPromptText,
  youtubeLink,
  setYoutubeLink,
  file,
  setFile,
  onGenerate,
  loading,
}) => {
  const modalBg = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.300");
  const borderColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" bg={modalBg} p={4}>
        <ModalHeader textAlign="center" color={textColor} fontSize="lg">
          Provide Your Input
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {sourceType === "prompt" && (
              <>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  Enter Your Prompt
                </FormLabel>
                <Textarea
                  placeholder="Write your prompt here..."
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  bg={inputBg}
                  borderColor={borderColor}
                  _focus={{ borderColor: "teal.400", boxShadow: "md" }}
                  minHeight="150px"
                />
              </>
            )}

            {sourceType === "youtube" && (
              <>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  YouTube Video Link
                </FormLabel>
                <Input
                  placeholder="Enter YouTube link..."
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  bg={inputBg}
                  borderColor={borderColor}
                  _focus={{ borderColor: "teal.400", boxShadow: "md" }}
                />
              </>
            )}

            {sourceType === "file" && (
              <>
                <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                  Upload a File
                </FormLabel>
                <Input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  bg={inputBg}
                  borderColor={borderColor}
                  _focus={{ borderColor: "teal.400", boxShadow: "md" }}
                  p={1}
                />
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={onGenerate}
            isLoading={loading}
            isDisabled={!promptText && !youtubeLink && !file}
            w="full"
          >
            Generate Notes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InputModal;
