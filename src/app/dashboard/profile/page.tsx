"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  CircularProgressLabel,
  Heading,
} from "@chakra-ui/react";
import {
  FiCamera,
  FiSave,
  FiLock,
  FiTrash2,
  FiMail,
  FiPhone,
  FiUser,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import { motion } from "framer-motion";

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

  // State for form fields
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(65);

  // Color scheme
  const cardBg = useColorModeValue("white", "gray.800");
  const primaryColor = useColorModeValue("teal.500", "blue.400");
  const dangerColor = useColorModeValue("red.500", "red.400");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryText = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const colorSchemeColor = useColorModeValue("teal", "blue");
  const redColorScheme = useColorModeValue("red.50", "red.900");

  // Redirect to login if not authenticated
  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
        <CircularProgress isIndeterminate color={primaryColor} />
      </Box>
    );
  }
  if (!session) {
    router.push("/login");
    return null;
  }

  // Handle profile picture upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 2MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setProfileCompletion(Math.min(profileCompletion + 5, 100));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await update({ name, email, image });
      setProfileCompletion(Math.min(profileCompletion + 10, 100));
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile.",
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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    <Container maxW="container.lg" py={8}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <VStack spacing={8} align="stretch">
          {/* Profile Header */}
          <HStack justify="space-between" align="center">
            <Heading size="xl" fontWeight="semibold" color={textColor}>
              Profile Settings
            </Heading>
            <CircularProgress
              value={profileCompletion}
              color={primaryColor}
              size="60px"
              thickness="8px"
            >
              <CircularProgressLabel>
                {profileCompletion}%
              </CircularProgressLabel>
            </CircularProgress>
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
                      name={name}
                      src={image}
                      border="3px solid"
                      borderColor={primaryColor}
                    />
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
                    <FormLabel color={textColor} display="flex" alignItems="center">
                      <FiUser style={{ marginRight: "8px" }} />
                      Full Name
                    </FormLabel>
                    <Input
                      type="text"
                      value={name}
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

                  <FormControl>
                    <FormLabel color={textColor} display="flex" alignItems="center">
                      <FiMail style={{ marginRight: "8px" }} />
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{ borderColor: primaryColor }}
                      _focus={{
                        borderColor: primaryColor,
                        boxShadow: `0 0 0 1px ${primaryColor}`,
                      }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color={textColor} display="flex" alignItems="center">
                      <FiPhone style={{ marginRight: "8px" }} />
                      Phone Number
                    </FormLabel>
                    {/* <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      bg={inputBg}
                      borderColor={borderColor}
                      _hover={{ borderColor: primaryColor }}
                      _focus={{
                        borderColor: primaryColor,
                        boxShadow: `0 0 0 1px ${primaryColor}`,
                      }}
                    /> */}
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
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="medium" color={textColor}>
                      Two-Factor Authentication
                    </Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Add an extra layer of security to your account
                    </Text>
                  </Box>
                  <Switch
                    colorScheme={colorSchemeColor}
                    isChecked={twoFactorEnabled}
                    onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                  />
                </HStack>

                <Divider borderColor={borderColor} />

                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="medium" color={textColor}>
                      Password
                    </Text>
                    <Text fontSize="sm" color={secondaryText}>
                      Last changed 3 months ago
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

                <Divider borderColor={borderColor} />

                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="medium" color={textColor}>
                      Active Sessions
                    </Text>
                    <Text fontSize="sm" color={secondaryText}>
                      2 devices currently logged in
                    </Text>
                  </Box>
                  <Button
                    variant="outline"
                    colorScheme={colorSchemeColor}
                  >
                    View Sessions
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
                      This action is permanent and cannot be undone. All your data will be erased.
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
                  // Enable delete button
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
              isDisabled={true} // Would enable when email matches
            >
              Delete Account Permanently
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}