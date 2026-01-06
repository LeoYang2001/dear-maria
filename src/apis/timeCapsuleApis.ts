import { addDoc, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import type { TimeCapsule } from "../types/common/TimeCapsule";
import { db } from "../firebase";
import { sendEmail } from "./sendNotification.ts";

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
      isRead: newTimeCapsule.isRead ?? false,
    };

    // Only add picture if it exists
    if (newTimeCapsule.picture) {
      timeCapsuleData.picture = newTimeCapsule.picture;
    }

    const docRef = await addDoc(
      collection(db, TIMECAPSULES_COLLECTION),
      timeCapsuleData
    );
    
    console.log("Time Capsule added with ID:", docRef.id);

    console.log('creted by', newTimeCapsule.createdBy)
    
    // Send notification email in the background (non-blocking)
    const recipient = newTimeCapsule.createdBy === "maria" ? "leo" : "maria";
    const accountType = recipient === "leo" ? 'account1' : 'account2';
    const senderName = newTimeCapsule.createdBy === "maria" ? "maria" : "leo";

    
    // Fire-and-forget: send email without awaiting
    sendEmail(accountType, {
      to_name: recipient,
      from_name: senderName,
      task_title: newTimeCapsule.title,
      task_description: `Unlock Date: ${new Date(newTimeCapsule.unlockDate).toLocaleDateString()}`,
      name: 'Time Capsule',
      message: `${senderName} just created a new time capsule "${newTimeCapsule.title}" for you! It will unlock on ${new Date(newTimeCapsule.unlockDate).toLocaleDateString()}.`,
    }).catch(error => {
      console.error("Error sending email notification:", error);
      // Don't throw - we don't want email failures to break the time capsule creation
    });
    
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
        isRead: data.isRead ?? false,
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

// Function to send read receipt
export const sendReadReceipt = async (timeCapsuleId: string): Promise<boolean> => {
  try {
    const timeCapsuleRef = doc(db, TIMECAPSULES_COLLECTION, timeCapsuleId);
    await updateDoc(timeCapsuleRef, {
      isRead: true
    });
    console.log("Read receipt sent for time capsule:", timeCapsuleId);
    return true;
  } catch (error) {
    console.error("Error sending read receipt:", error);
    throw error;
  }
}