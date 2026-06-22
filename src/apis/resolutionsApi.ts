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

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || "";

import OpenAI from "openai";

const client = new OpenAI(
  {
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  }
);


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

    predictResolutionCategory(newResolution.text)


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


const RESOLUTION_MODULES = ["BOOK_LIBRARY", "HABIT_TRACKER","SKILL_LEARNING"];

// this is a function we use ai to predict what category a new resolution belongs to
export const predictResolutionCategory = async (text: string): Promise<string> => {

  console.log('text received ', text)
        const prompt = `
      You are an intent-classification system for a goal-tracking app.

      Task:
      Analyze the user's resolution and return:
      1) The MOST appropriate category
      2) A short, friendly question to ask the user to activate the feature

      Allowed categories:
      ${RESOLUTION_MODULES.join(", ")}

      Rules:
      - Choose ONLY ONE category.
      - Respond ONLY with valid JSON.
      - Do NOT include explanations or extra text.
      - If the resolution does not clearly match any category, use "UNKNOWN".
      - The userPrompt must be a natural, friendly question suitable for UI display.

      Examples:

      Resolution: "Read 12 books this year"
      Response:
      {
        "category": "BOOK_LIBRARY",
        "userPrompt": "Do you want to create a book shelf to track your reading?"
      }

      Resolution: "Go to the gym three times a week"
      Response:
      {
        "category": "HABIT_TRACKER",
        "userPrompt": "Do you want to start a habit tracker for your workouts?"
      }

      Resolution: "Be happier"
      Response:
      {
        "category": "UNKNOWN",
        "userPrompt": "Do you want help turning this goal into something more concrete?"
      }

      Now analyze this resolution:
      "${text}"
      `.trim();

        const response = await client.responses.create({
          model: "gpt-5-nano",
          input: prompt,
        });
        console.log(response.output_text.trim())
        return response.output_text.trim();
};
