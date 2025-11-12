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

export const uploadTimeCapsuleImage = async (
  file: File,
  user: "Maria" | "Leo" | null
) => {
  const filePath = `timeCapsule/${user}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

export const uploadPinImage = async (file: File) => {
  const filePath = `footprint/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};
