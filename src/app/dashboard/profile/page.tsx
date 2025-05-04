"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Box,
  Avatar,
  Button,
  Container,
  VStack,
  HStack,
  Input,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
  Text,
  Divider,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Card,
  Grid,
  CardHeader,
  CardBody,
  CircularProgress,
  Heading,
  Select,
  Spinner,
} from "@chakra-ui/react";
import {
  FiCamera,
  FiSave,
  FiLock,
  FiTrash2,
  FiMail,
  FiUser,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { uploadImage } from "@/lib/uploadImage";

const MotionBox = motion(Box);
const MotionCard = motion(Card);

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const toast = useToast();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isPasswordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose,
  } = useDisclosure();

  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
  const [name, setName] = useState(session?.user?.name);
  const [email] = useState(session?.user?.email || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(65);
  const [gender, setGender] = useState(session?.user?.gender);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toggling, setToggling] = useState(false);

  const cardBg = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const dangerColor = useColorModeValue("red.500", "red.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const colorSchemeColor = useColorModeValue("teal", "blue");
  const redColorScheme = useColorModeValue("red.50", "red.900");
  const inputColor = useColorModeValue("gray.100", "gray.600");

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  if (status === "loading") {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minH="100vh"
      >
        <CircularProgress isIndeterminate color={primaryColor} />
      </Box>
    );
  }
  if (!session) {
    router.push("/login");
    return null;
  }

  const toggle2FA = async () => {
    try {
      setToggling(true);
      const res = await fetch("/api/settings/2fa", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is2FAEnabled: !is2FAEnabled }),
      });

      if (!res.ok) throw new Error("Failed to update 2FA setting");

      setIs2FAEnabled(!is2FAEnabled);
      toast({
        title: `2FA ${!is2FAEnabled ? "enabled" : "disabled"} successfully`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Error updating 2FA setting",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setToggling(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 2MB",
        status: "error",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        status: "error",
      });
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(0);

      // 1. Show preview while uploading
      const previewUrl = URL.createObjectURL(file);
      setImage(previewUrl);
      setImageFile(file);

      // 2. Upload to Firebase with progress tracking
      const firebaseUrl = await uploadImage(file, (progress) => {
        setUploadProgress(Math.round(progress * 100));
      });

      // 3. Update state with Firebase URL
      setImage(firebaseUrl);

      toast({
        title: "Image uploaded successfully",
        status: "success",
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload image",
        status: "error",
      });
      setImage(session?.user?.image || ""); // Reset to previous image
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, image, gender }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      // Update the session with new data
      await update({
        name: data.name,
        image: data.image,
        gender: data.gender,
      });

      setProfileCompletion(Math.min(profileCompletion + 10, 100));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error updating your profile.",

        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/user/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to change password");
      }

      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onPasswordClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Password Change Failed",
        description: "There was an error changing your password.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate API call
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to delete account");
      }
      // Optionally, you can clear the session here
      await signOut({ redirect: false });
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Deletion Failed",
        description: "There was an error deleting your account.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onDeleteClose();
    }
  };

  return (
    <Container maxW="container.XL">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <VStack spacing={4} align="stretch">
          {/* Profile Header */}
          <HStack justify="space-between" align="center">
            <Heading size="lg" fontWeight="semibold" color={textColor}>
              Profile Settings
            </Heading>
          </HStack>

          <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={8}>
            {/* Profile Picture Card */}
            <MotionCard
              whileHover={{ y: -2 }}
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              overflow="hidden"
            >
              <CardHeader>
                <Heading size="md" color={textColor}>
                  Profile Picture
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  <Box position="relative">
                    <Avatar
                      size="2xl"
                      name={name || ""}
                      src={imageFile ? URL.createObjectURL(imageFile) : image}
                      border="3px solid"
                      borderColor={primaryColor}
                    />
                    {/* Add progress indicator */}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <CircularProgress
                        value={uploadProgress}
                        color="green.400"
                        size="6"
                        thickness="12px"
                        position="absolute"
                        bottom={2}
                        right={2}
                      />
                    )}

                    <FormLabel
                      htmlFor="file-upload"
                      position="absolute"
                      bottom={2}
                      right={2}
                      bg={primaryColor}
                      borderRadius="full"
                      p={2}
                      cursor="pointer"
                      transition="0.3s"
                      _hover={{ transform: "scale(1.1)" }}
                    >
                      <FiCamera color="white" />
                    </FormLabel>
                    <Input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageUpload}
                    />
                  </Box>
                  <Text fontSize="sm" color={secondaryText}>
                    Recommended: Square image, at least 200x200 pixels
                  </Text>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Profile Information Card */}
            <MotionCard
              whileHover={{ y: -2 }}
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="sm"
              overflow="hidden"
            >
              <CardHeader>
                <Heading size="md" color={textColor}>
                  Personal Information
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={6}>
                  <FormControl>
                    <FormLabel
                      color={textColor}
                      display="flex"
                      alignItems="center"
                    >
                      <FiUser style={{ marginRight: "8px" }} />
                      Full Name
                    </FormLabel>
                    <Input
                      type="text"
                      value={name || ""}
                      onChange={(e) => setName(e.target.value)}
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{ borderColor: primaryColor }}
                      _focus={{
                        borderColor: primaryColor,
                        boxShadow: `0 0 0 1px ${primaryColor}`,
                      }}
                    />
                  </FormControl>
                  <FormControl isDisabled>
                    <FormLabel
                      color={textColor}
                      display="flex"
                      alignItems="center"
                    >
                      <FiMail style={{ marginRight: "8px" }} />
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      bg={inputBg}
                      borderColor={borderColor}
                      _disabled={{
                        opacity: 1,
                        cursor: "not-allowed",
                        bg: inputColor,
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel color={textColor}>Gender</FormLabel>
                    <Select
                      value={gender || ""}
                      onChange={(e) => setGender(e.target.value)}
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{ borderColor: primaryColor }}
                      _focus={{
                        borderColor: primaryColor,
                        boxShadow: `0 0 0 1px ${primaryColor}`,
                      }}
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                  <Button
                    leftIcon={<FiSave />}
                    colorScheme={colorSchemeColor}
                    w="full"
                    onClick={handleSaveChanges}
                    isLoading={loading}
                    loadingText="Saving..."
                    mt={4}
                  >
                    Save Changes
                  </Button>
                </VStack>
              </CardBody>
            </MotionCard>
          </Grid>

          {/* Security Settings Card */}
          <MotionCard
            whileHover={{ y: -2 }}
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="sm"
            overflow="hidden"
          >
            <CardHeader>
              <Heading size="md" color={textColor}>
                Security Settings
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* 2FA Toggle */}
                <Box textAlign="left" w="full">
                  <HStack justify="space-between">
                    <Text fontSize="md" fontWeight="sm" color={textColor}>
                      Two-Factor Authentication (2FA)
                    </Text>

                    {loading ? (
                      <Spinner size="sm" />
                    ) : (
                      <Switch
                        size="lg"
                        colorScheme="teal"
                        isChecked={is2FAEnabled}
                        onChange={toggle2FA}
                        isDisabled={toggling}
                      />
                    )}
                  </HStack>
                </Box>

                <Divider borderColor={borderColor} />

                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="medium" color={textColor}>
                      Password
                    </Text>
                  </Box>
                  <Button
                    leftIcon={<FiLock />}
                    variant="outline"
                    colorScheme={colorSchemeColor}
                    onClick={onPasswordOpen}
                  >
                    Change Password
                  </Button>
                </HStack>
              </VStack>
            </CardBody>
          </MotionCard>

          {/* Danger Zone Card */}
          <MotionCard
            whileHover={{ y: -2 }}
            bg={cardBg}
            borderRadius="2xl"
            boxShadow="sm"
            overflow="hidden"
            border="1px solid"
            borderColor={dangerColor}
          >
            <CardHeader bg={redColorScheme}>
              <Heading size="md" color={dangerColor}>
                Danger Zone
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Alert status="warning" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Delete Account</AlertTitle>
                    <AlertDescription>
                      This action is permanent and cannot be undone. All your
                      data will be erased.
                    </AlertDescription>
                  </Box>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    ml="auto"
                    leftIcon={<FiTrash2 />}
                    onClick={onDeleteOpen}
                  >
                    Delete Account
                  </Button>
                </Alert>
              </VStack>
            </CardBody>
          </MotionCard>
        </VStack>
      </MotionBox>

      {/* Change Password Modal */}
      <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader>Change Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Current Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  bg={inputBg}
                />
              </FormControl>
              <FormControl>
                <FormLabel>New Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  bg={inputBg}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm New Password</FormLabel>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  bg={inputBg}
                />
              </FormControl>
              <HStack w="full" justify="space-between">
                <Button
                  variant="ghost"
                  leftIcon={showPassword ? <FiEyeOff /> : <FiEye />}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"} Passwords
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onPasswordClose}>
              Cancel
            </Button>
            <Button
              colorScheme={colorSchemeColor}
              onClick={handlePasswordChange}
              isLoading={loading}
            >
              Change Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Account Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent borderRadius="2xl">
          <ModalHeader color={dangerColor}>Delete Account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="error" variant="subtle" borderRadius="lg" mb={4}>
              <AlertIcon />
              <Box>
                <AlertTitle>This action cannot be undone!</AlertTitle>
                <AlertDescription>
                  All your data will be permanently removed from our servers.
                </AlertDescription>
              </Box>
            </Alert>
            <Text mb={4}>
              To confirm account deletion, please type your email address below:
            </Text>
            <Input
              placeholder={email}
              bg={inputBg}
              onChange={(e) => {
                if (e.target.value === email) {
                  setIsDeleteButtonEnabled(true);
                } else {
                  setIsDeleteButtonEnabled(false);
                }
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteAccount}
              isLoading={loading}
              isDisabled={!isDeleteButtonEnabled}
            >
              Delete Account Permanently
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
