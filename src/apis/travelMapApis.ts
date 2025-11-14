import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Pin } from "../types/common/Pin";

const TIMECAPSULES_COLLECTION = "world_travel_footprints";

/**
 * Add a new todo item to Firestore
 * @param title - The title of the todo
 * @param description - The description of the todo
 * @param createdBy - The user who created the todo (maria or leo)
 * @param images - Optional array of image URLs
 * @returns Promise with the created todo document ID
 */
export const addPin = async (newPin: Pin): Promise<string> => {
  try {
    // Create a copy and remove undefined fields (Firebase doesn't accept undefined values)
    const newPinData: any = {
      lat: newPin.lat,
      lng: newPin.lng,
      name: newPin.name,
      description: newPin.description,
      type: newPin.type,
    };

    const docRef = await addDoc(
      collection(db, TIMECAPSULES_COLLECTION),
      newPinData
    );

    console.log("Pin added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding Pin:", error);
    throw error;
  }
};

/**
 * Get all todos
 * @returns Promise with array of all todos sorted by creation date (latest first)
 */
export const getAllPins = async (): Promise<(Pin & { id: string })[]> => {
  try {
    const querySnapshot = await getDocs(
      collection(db, TIMECAPSULES_COLLECTION)
    );
    const pins: (Pin & { id: string })[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      pins.push({
        id: docSnapshot.id,
        lat: data.lat,
        lng: data.lng,
        name: data.name,
        description: data.description,
        type: data.type,
        pictureURL: data.pictureURL ? data.pictureURL : null,
      });
    });

    // Sort alphabetically by name
    pins.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });

    console.log("pins sorted alphabetically by name", pins);

    return pins;
  } catch (error) {
    console.error("Error fetching all time capsules:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates of all pins
 * @param callback - Function called whenever pins are updated
 * @returns Unsubscribe function to stop listening
 */
export const subscribeToAllPins = (
  callback: (pins: (Pin & { id: string })[]) => void
): (() => void) => {
  try {
    const unsubscribe = onSnapshot(
      collection(db, TIMECAPSULES_COLLECTION),
      (querySnapshot) => {
        const pins: (Pin & { id: string })[] = [];

        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          pins.push({
            id: docSnapshot.id,
            lat: data.lat,
            lng: data.lng,
            name: data.name,
            description: data.description,
            type: data.type,
            pictureURL: data.pictureURL ? data.pictureURL : null,
          });
        });

        // Sort alphabetically by name
        pins.sort((a, b) => {
          return a.name.localeCompare(b.name);
        });

        console.log("pins updated in real-time:", pins);
        callback(pins);
      },
      (error) => {
        console.error("Error subscribing to pins:", error);
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error("Error setting up real-time listener:", error);
    throw error;
  }
};

/**
 * Delete a todo item
 * @param pinId - The ID of the pin to delete
 */
export const deletePin = async (pinId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, TIMECAPSULES_COLLECTION, pinId));
    console.log("Pin deleted:", pinId);
  } catch (error) {
    console.error("Error deleting pin:", error);
    throw error;
  }
};

export const updatePinImage = async (
  pinId: string,
  pictureURL: string
): Promise<void> => {
  try {
    const pinRef = doc(db, TIMECAPSULES_COLLECTION, pinId);
    const docSnapshot = await getDocs(
      query(
        collection(db, TIMECAPSULES_COLLECTION),
        where("__name__", "==", pinId)
      )
    );

    if (!docSnapshot.empty) {
      await updateDoc(pinRef, {
        pictureURL: pictureURL,
      });
      console.log("Images added to pin:", pinId);
    }
  } catch (error) {
    console.error("Error adding images to pin:", error);
    throw error;
  }
};

export const togglePinStatus = async (
  pinId: string,
  newType: string
): Promise<void> => {
  try {
    const pinRef = doc(db, TIMECAPSULES_COLLECTION, pinId);
    await updateDoc(pinRef, {
      type: newType,
    });
    console.log("Pin status updated:", pinId);
  } catch (error) {
    console.error("Error updating pin status:", error);
    throw error;
  }
};
