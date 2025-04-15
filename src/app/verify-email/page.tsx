'use client';

import {
  Box,
  Spinner,
  Text,
  Heading,
  Center,
  VStack,
  Icon,
} from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type StatusType = 'verifying' | 'success' | 'error';

function VerifyEmailContent() {
  const token = useSearchParams().get('token');
  const router = useRouter();
  const [status, setStatus] = useState<StatusType>('verifying');

  useEffect(() => {
    if (token) {
      fetch('/api/auth/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');
            setTimeout(() => router.push('/login'), 2500);
          } else {
            setStatus('error');
          }
        })
        .catch(() => setStatus('error'));
    }
  }, [token, router]);

  return (
    <Center minH="100vh" bg="gray.100">
      <Box
        p={10}
        rounded="2xl"
        bg="white"
        shadow="lg"
        textAlign="center"
        maxW="sm"
      >
        <VStack spacing={6}>
          {status === 'verifying' && (
            <>
              <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
              <Heading size="md">Verifying Email...</Heading>
              <Text color="gray.600">Please wait while we verify your email.</Text>
            </>
          )}

          {status === 'success' && (
            <>
              <Icon as={CheckCircleIcon} w={10} h={10} color="green.400" />
              <Heading size="md">Email Verified!</Heading>
              <Text color="gray.600">Redirecting to login page...</Text>
            </>
          )}

          {status === 'error' && (
            <>
              <Icon as={WarningIcon} w={10} h={10} color="red.400" />
              <Heading size="md">Verification Failed</Heading>
              <Text color="gray.600">Invalid or expired token. Please try again.</Text>
            </>
          )}
        </VStack>
      </Box>
    </Center>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={
      <Center minH="100vh" bg="gray.100">
        <Box p={10} rounded="2xl" bg="white" shadow="lg" textAlign="center" maxW="sm">
          <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          <Text mt={4}>Loading verification...</Text>
        </Box>
      </Center>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}