// components/TwoFactorAuthModal.tsx
"use client";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function TwoFactorAuthModal({
  isOpen,
  onClose,
  email,
  onVerify,
}: {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: () => void;
}) {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token: otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');

      toast({
        title: 'Verified!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onVerify();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Verification failed',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Two-Factor Authentication</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Text>We've sent a 6-digit code to your email</Text>
            <Input
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleVerify}
            isLoading={isLoading}
          >
            Verify
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}