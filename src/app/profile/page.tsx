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
  Input,
  FormControl,
  FormLabel,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCamera, FiSave } from "react-icons/fi";

export default function EditProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const toast = useToast();

  // State for form fields
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [image, setImage] = useState(session?.user?.image || "");
  const [loading, setLoading] = useState(false);

  // Soft pastel colors
  const cardBg = useColorModeValue("white", "gray.700");
  const primaryColor = "#6EC3C4"; // Soft teal
  const textColor = useColorModeValue("gray.700", "gray.200");
  const inputBg = useColorModeValue("white", "gray.600");
  const inputBorderColor = useColorModeValue("gray.300", "gray.500");

  // Redirect to login if not authenticated
  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  // Handle profile picture upload (mock function for now)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission (dummy function, replace with API call)
  const handleSaveChanges = async () => {
    setLoading(true);
    // Simulate saving to a database
    setTimeout(() => {
      update({ name, email, image });
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <Container centerContent maxW="container.md" py={10}>
      <Box
        p={6}
        borderRadius="2xl"
        boxShadow="2xl"
        bg={cardBg}
        textAlign="center"
        w="100%"
        maxW="500px"
      >
        {/* Profile Picture Upload */}
        <VStack spacing={6}>
          <Box position="relative">
            <Avatar
              size="xl"
              name={name}
              src={image}
              border="2px solid"
              borderColor={primaryColor}
            />
            <FormLabel
              htmlFor="file-upload"
              position="absolute"
              bottom={0}
              right={0}
              bg={primaryColor}
              borderRadius="full"
              p={2}
              cursor="pointer"
              transition="0.3s"
              _hover={{ bg: "#5AA8A9", transform: "scale(1.1)" }}
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

          {/* Form Fields */}
          <FormControl isRequired>
            <FormLabel color={textColor}>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              bg={inputBg}
              borderColor={inputBorderColor}
              _hover={{ borderColor: primaryColor }}
              _focus={{
                borderColor: primaryColor,
                boxShadow: `0 0 0 1px ${primaryColor}`,
              }}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel color={textColor}>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg={inputBg}
              borderColor={inputBorderColor}
              _hover={{ borderColor: primaryColor }}
              _focus={{
                borderColor: primaryColor,
                boxShadow: `0 0 0 1px ${primaryColor}`,
              }}
            />
          </FormControl>

          {/* Save Button */}
          <Button
            leftIcon={<FiSave />}
            bg={primaryColor}
            color="white"
            w="full"
            onClick={handleSaveChanges}
            isLoading={loading}
            loadingText="Saving..."
            _hover={{ bg: "#5AA8A9", transform: "scale(1.05)" }}
            transition="all 0.2s"
          >
            Save Changes
          </Button>
        </VStack>
      </Box>
    </Container>
  );
}