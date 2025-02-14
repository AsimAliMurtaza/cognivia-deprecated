"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Button,
  Text,
  Image,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Flex,
  Divider,
  Heading,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiLogOut, FiSun, FiMoon } from "react-icons/fi";

interface ProfileDialogProps {
  isSidebarOpen: boolean;
}

export default function ProfileDialog({ isSidebarOpen }: ProfileDialogProps) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  // Color mode styles
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <>
      {/* Profile & Theme Toggle */}
      <Divider mb={4} />

      <Flex w="full" direction="column" align="center">
        {/* Profile Button */}
        <Tooltip
          label="My Profile"
          placement="right"
          isDisabled={isSidebarOpen}
        >
          <Button
            variant="ghost"
            w="full"
            justifyContent={isSidebarOpen ? "flex-start" : "center"}
            color={textColor}
            onClick={onOpen}
            display="flex"
            alignItems="center"
            gap={isSidebarOpen ? 3 : 0}
            px={isSidebarOpen ? 3 : 2}
            _hover={{ bg: hoverBg }}
          >
            <Image
              src={
                session?.user?.image ||
                "https://www.shutterstock.com/image-vector/user-account-avatar-icon-pictogram-600nw-1860375778.jpg"
              }
              borderRadius="full"
              border="2px solid"
              h="30px"
              w="30px"
              borderColor={borderColor}
            />
            {isSidebarOpen && <Text>My Profile</Text>}
          </Button>
        </Tooltip>
      </Flex>

      {/* Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="lg" boxShadow="xl" bg={bgColor}>
          <ModalHeader textAlign="center">
            <Heading size="md" bgClip="text" color={textColor}>
              My Profile
            </Heading>
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Flex direction="column" align="center" gap={4}>
              {/* Profile Picture */}
              <Image
                src={
                  session?.user?.image ||
                  "https://www.shutterstock.com/image-vector/user-account-avatar-icon-pictogram-600nw-1860375778.jpg"
                }
                boxSize="100px"
                borderRadius="full"
                boxShadow="md"
                border="2px solid"
                borderColor={borderColor}
              />

              {/* User Details */}
              <VStack spacing={1} textAlign="center">
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  {session?.user?.name || "Guest User"}
                </Text>
                <Text
                  fontSize="md"
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  {session?.user?.email || "No email provided"}
                </Text>
              </VStack>

              <Divider />

              {/* Profile Actions */}
              <VStack spacing={3} w="full">
                <Button
                  w="full"
                  variant="outline"
                  borderColor={borderColor}
                  color={textColor}
                  _hover={{
                    bg: hoverBg,
                    transform: "scale(1.05)",
                  }}
                  _active={{ transform: "scale(0.95)" }}
                  onClick={() => router.push("/profile")}
                >
                  Edit Profile
                </Button>
                <Button
                  leftIcon={<FiLogOut />}
                  variant="ghost"
                  w="full"
                  justifyContent="center"
                  color="red.500"
                  _hover={{
                    bg: hoverBg,
                    transform: "scale(1.05)",
                  }}
                  _active={{ transform: "scale(0.95)" }}
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign Out
                </Button>
              </VStack>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onClose}
              w="full"
              color={textColor}
              _hover={{
                bg: hoverBg,
                transform: "scale(1.05)",
              }}
              _active={{ transform: "scale(0.95)" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
