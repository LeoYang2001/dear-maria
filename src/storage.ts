// src/firebase/storage.ts
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase";

const storage = getStorage(app);

export const uploadTodoImages = async (
  files: File[],
  user: "leo" | "maria"
) => {
  const urls: string[] = [];

  for (const file of files) {
    const filePath = `todos/${user}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, filePath);

    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    urls.push(downloadURL);
  }

  return urls;
};
