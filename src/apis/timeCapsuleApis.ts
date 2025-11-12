import { addDoc, collection, getDocs } from "firebase/firestore";
import type { TimeCapsule } from "../types/common/TimeCapsule";
import { db } from "../firebase";

const TIMECAPSULES_COLLECTION = "time_capsules";

/**
 * Add a new todo item to Firestore
 * @param title - The title of the todo
 * @param description - The description of the todo
 * @param createdBy - The user who created the todo (maria or leo)
 * @param images - Optional array of image URLs
 * @returns Promise with the created todo document ID
 */
export const addTimeCapsule = async (
  newTimeCapsule: TimeCapsule
): Promise<string> => {
  try {
    // Create a copy and remove undefined fields (Firebase doesn't accept undefined values)
    const timeCapsuleData: any = {
      title: newTimeCapsule.title,
      message: newTimeCapsule.message,
      unlockDate: newTimeCapsule.unlockDate,
      createdDate: newTimeCapsule.createdDate,
      createdBy: newTimeCapsule.createdBy,
      emailAddress: newTimeCapsule.emailAddress,
    };

    // Only add picture if it exists
    if (newTimeCapsule.picture) {
      timeCapsuleData.picture = newTimeCapsule.picture;
    }

    const docRef = await addDoc(
      collection(db, TIMECAPSULES_COLLECTION),
      timeCapsuleData
    );
    // we need to schedule email notification here

    console.log("Time Capsule added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding Time Capsule:", error);
    throw error;
  }
};

/**
 * Get all todos
 * @returns Promise with array of all todos sorted by creation date (latest first)
 */
export const getAllTimeCapsules = async (): Promise<
  (TimeCapsule & { id: string })[]
> => {
  try {
    const querySnapshot = await getDocs(
      collection(db, TIMECAPSULES_COLLECTION)
    );
    const timeCapsules: (TimeCapsule & { id: string })[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      timeCapsules.push({
        id: docSnapshot.id,
        title: data.title,
        message: data.message,
        unlockDate: data.unlockDate,
        createdDate: data.createdDate,
        createdBy: data.createdBy,
        picture: data.picture,
      });
    });

    // Sort by createdAt date, latest first
    timeCapsules.sort((a, b) => {
      return (
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
    });

    console.log("timeCapsules sorted by createdDate", timeCapsules);

    return timeCapsules;
  } catch (error) {
    console.error("Error fetching all time capsules:", error);
    throw error;
  }
};
