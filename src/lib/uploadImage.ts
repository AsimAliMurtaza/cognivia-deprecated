// src/libs/uploadImage.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    if (!file.name) {
      throw new Error("File must have a valid name");
    }

    const storageRef = ref(storage, `user-images/${file.name}`);

    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
    onProgress?.(0);
  } catch (error) {
    console.error("Error uploading image:", error);

    throw new Error("Failed to upload image to Firebase Storage");
  }
};
