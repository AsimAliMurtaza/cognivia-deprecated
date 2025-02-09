"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Box,
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
  useColorModeValue,
  color,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";

interface ProfileDialogProps {
  isSidebarOpen: boolean;
}

export default function ProfileDialog({ isSidebarOpen }: ProfileDialogProps) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const primaryColor = "gray.700";
  const secondaryColor = "gray.900";
  const modalBg = useColorModeValue("white", "white");

  return (
    <>
      {/* My Profile Button */}
      <Tooltip label="My Profile" placement="right" isDisabled={isSidebarOpen}>
        <Divider mb={18} />

        <Button
          variant="ghost"
          w="full"
          justifyContent={isSidebarOpen ? "flex-start" : "center"}
          color="gray.700"
          onClick={onOpen}
          display="flex"
          alignItems="center"
          gap={isSidebarOpen ? 3 : 0}
          px={isSidebarOpen ? 3 : 2}
        >
          <Image
            src={session?.user?.image || "/user.png"}
            borderRadius="full"
            border="2px solid"
            h="25px"
            w="25px"
            borderColor={primaryColor}
          />
          {isSidebarOpen && <Text>My Profile</Text>}
        </Button>
      </Tooltip>

      {/* Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="2xl" bg={modalBg}>
          <ModalHeader textAlign="center">
            <Heading
              size="md"
              bgGradient={`linear(to-r, ${primaryColor}, ${secondaryColor})`}
              bgClip="text"
            >
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
                borderColor={primaryColor}
              />

              {/* User Details */}
              <VStack spacing={1}>
                <Text fontSize="lg" fontWeight="bold" color="gray.700">
                  {session?.user?.name || "Guest User"}
                </Text>
                <Text fontSize="md" color="gray.600">
                  {session?.user?.email || "No email provided"}
                </Text>
              </VStack>

              <Divider />

              {/* Profile Actions */}
              <VStack spacing={3} w="full">
                <Button
                  w="full"
                  variant="outline"
                  bg={primaryColor}
                  color={"white"}
                  _hover={{
                    bg: "gray.100",
                    transform: "scale(1.05)",
                    color: "black",
                  }}
                  _active={{ bg: "#4A8C8D" }}
                  onClick={() => router.push("/profile")}
                  transition="all 0.2s"
                >
                  Edit Profile
                </Button>
                <Button
                  leftIcon={<FiLogOut />}
                  variant="ghost"
                  w="full"
                  justifyContent="center"
                  color="gray.700"
                  _hover={{
                    bg: "gray.200",
                    transform: "scale(1.05)",
                    color: "red.500",
                  }}
                  _active={{ bg: "#4A8C8D" }}
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
              _hover={{
                bg: "gray.200",
                transform: "scale(1.05)",
                color: "black",
              }}
              bg="gray.300"
              color={"black"}
              _active={{ bg: "#4A8C8D" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
