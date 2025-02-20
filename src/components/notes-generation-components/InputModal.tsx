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
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader textAlign="center">Provide Your Input</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {sourceType === "prompt" && (
            <Textarea
              placeholder="Write your prompt here..."
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              minHeight="150px"
            />
          )}
          {sourceType === "youtube" && (
            <Input
              placeholder="Enter YouTube link..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
            />
          )}
          {sourceType === "file" && (
            <Input
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="teal"
            onClick={onGenerate}
            isLoading={loading}
            isDisabled={!promptText && !youtubeLink && !file}
          >
            Generate Notes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InputModal;