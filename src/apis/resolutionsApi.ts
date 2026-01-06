//Create an api that adds mock resolution data to database using async for loop

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import type { Resolution } from "../types/common/Resolution";
import { db } from "../firebase";
import { sendEmail } from "./sendNotification.ts";

const YEARRESOLUTION_COLLECTION = "year_resolutions";


/**
 * Add a single resolution to the database
 */
export const addResolution = async (
  newResolution: Omit<Resolution, "id">
): Promise<string> => {
  try {
    const resolutionData = {
      text: newResolution.text,
      category: newResolution.category,
      createdBy: newResolution.createdBy,
    };

    const docRef = await addDoc(
      collection(db, YEARRESOLUTION_COLLECTION),
      resolutionData
    );

    console.log("Year Resolution added with ID:", docRef.id);


    // Send notification email in the background (non-blocking)
    const recipient = newResolution.createdBy === "maria" ? "leo" : "maria";
    const accountType = recipient === "leo" ? 'account1' : 'account2';
    const senderName = newResolution.createdBy === "maria" ? "maria" : "leo";
    
    // Fire-and-forget: send email without awaiting
    sendEmail(accountType, {
      to_name: recipient,
      from_name: senderName,
      task_title: `New ${newResolution.category} Resolution`,
      task_description: newResolution.text,
      name: 'New Year Resolutions',
      message: `${senderName} just added a new ${newResolution.category} resolution: "${newResolution.text}"`,
    }).catch(error => {
      console.error("Error sending email notification:", error);
      // Don't throw - we don't want email failures to break the resolution creation
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding Year Resolution:", error);
    throw error;
  }
};

// api to fetch all resolutions can be added here if needed
export const getAllResolutions = async (): Promise<
  (Resolution & { id: string })[]
> => {
  try {
    const querySnapshot = await getDocs(
      collection(db, YEARRESOLUTION_COLLECTION)
    );
    const resolutions: (Resolution & { id: string })[] = [];
    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      resolutions.push({
        id: docSnapshot.id,
        text: data.text,
        category: data.category,
        createdBy: data.createdBy,
      });
    });
    return resolutions;
  } catch (error) {
    console.error("Error fetching all resolutions:", error);
    throw error;
  }
};

// api to delete a resolution by id
export const deleteResolutionById = async (
  resolutionId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, YEARRESOLUTION_COLLECTION, resolutionId));
    console.log(`Resolution with ID ${resolutionId} deleted successfully.`);
  } catch (error) {
    console.error(`Error deleting resolution with ID ${resolutionId}:`, error);
    throw error;
  }
};
