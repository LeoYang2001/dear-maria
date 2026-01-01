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
import { mockResolutionData } from "../data/mockResolutionData";

const YEARRESOLUTION_COLLECTION = "year_resolutions";

/** * Add multiple resolutions to the database
 */
export const addMockResolutionsToDatabase = async (): Promise<void> => {
  for (const resolution of mockResolutionData) {
    try {
      await addResolution(resolution);
      console.log(`Added resolution: ${resolution.text}`);
    } catch (error) {
      console.error(`Error adding resolution: ${resolution.text}`, error);
    }
  }
};

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
