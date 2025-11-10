import {
  collection,
  addDoc,
  Query,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import type { Todo } from "../types/common/Todo";
import { db } from "../firebase.ts";

const TODOS_COLLECTION = "todos";

/**
 * Add a new todo item to Firestore
 * @param title - The title of the todo
 * @param description - The description of the todo
 * @param createdBy - The user who created the todo (maria or leo)
 * @param images - Optional array of image URLs
 * @returns Promise with the created todo document ID
 */
export const addTodoItem = async (
  title: string,
  description: string,
  createdBy: "maria" | "leo",
  images?: string[]
): Promise<string> => {
  try {
    const todoData: Todo = {
      title,
      description,
      createdAt: new Date().toISOString(),
      createdBy,
      status: {
        maria: false,
        leo: false,
      },
      images: images || [],
    };

    const docRef = await addDoc(collection(db, TODOS_COLLECTION), todoData);
    console.log("Todo added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding todo:", error);
    throw error;
  }
};

/**
 * Update a todo item's completion status
 * @param todoId - The ID of the todo
 * @param user - The user (maria or leo)
 * @param completed - Whether the user has completed the todo
 */
export const updateTodoStatus = async (
  todoId: string,
  user: "maria" | "leo",
  completed: boolean
): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      [`status.${user}`]: completed,
    });
    console.log("Todo status updated:", todoId);
  } catch (error) {
    console.error("Error updating todo status:", error);
    throw error;
  }
};

/**
 * Get all todos created by a specific user
 * @param createdBy - The user who created the todos (maria or leo)
 * @returns Promise with array of todos
 */
export const getTodosByCreator = async (
  createdBy: "maria" | "leo"
): Promise<(Todo & { id: string })[]> => {
  try {
    const q: Query = query(
      collection(db, TODOS_COLLECTION),
      where("createdBy", "==", createdBy)
    );
    const querySnapshot = await getDocs(q);
    const todos: (Todo & { id: string })[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      todos.push({
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        createdBy: data.createdBy,
        status: data.status,
        images: data.images || [],
      });
    });

    return todos;
  } catch (error) {
    console.error("Error fetching todos by creator:", error);
    throw error;
  }
};

/**
 * Get all todos
 * @returns Promise with array of all todos sorted by creation date (latest first)
 */
export const getAllTodos = async (): Promise<(Todo & { id: string })[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, TODOS_COLLECTION));
    const todos: (Todo & { id: string })[] = [];

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      todos.push({
        id: docSnapshot.id,
        title: data.title,
        description: data.description,
        createdAt: data.createdAt,
        createdBy: data.createdBy,
        status: data.status,
        images: data.images || [],
      });
    });

    // Sort by createdAt date, latest first
    todos.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    console.log("todos sorted by createdAt date", todos);

    return todos;
  } catch (error) {
    console.error("Error fetching all todos:", error);
    throw error;
  }
};

/**
 * Delete a todo item
 * @param todoId - The ID of the todo to delete
 */
export const deleteTodoItem = async (todoId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, TODOS_COLLECTION, todoId));
    console.log("Todo deleted:", todoId);
  } catch (error) {
    console.error("Error deleting todo:", error);
    throw error;
  }
};

/**
 * Update todo title and description
 * @param todoId - The ID of the todo
 * @param title - The new title
 * @param description - The new description
 */
export const updateTodoDetails = async (
  todoId: string,
  title: string,
  description: string
): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    await updateDoc(todoRef, {
      title,
      description,
    });
    console.log("Todo details updated:", todoId);
  } catch (error) {
    console.error("Error updating todo details:", error);
    throw error;
  }
};

/**
 * Add images to a todo
 * @param todoId - The ID of the todo
 * @param imageUrls - Array of image URLs to add
 */
export const addImagesToTodo = async (
  todoId: string,
  imageUrls: string[]
): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    const docSnapshot = await getDocs(
      query(collection(db, TODOS_COLLECTION), where("__name__", "==", todoId))
    );

    if (!docSnapshot.empty) {
      const existingImages = docSnapshot.docs[0].data().images || [];
      await updateDoc(todoRef, {
        images: [...existingImages, ...imageUrls],
      });
      console.log("Images added to todo:", todoId);
    }
  } catch (error) {
    console.error("Error adding images to todo:", error);
    throw error;
  }
};

/**
 * Delete an image from a todo
 * @param todoId - The ID of the todo
 * @param imageUrl - The URL of the image to delete
 */
export const deleteImageFromTodo = async (
  todoId: string,
  imageUrl: string
): Promise<void> => {
  try {
    const todoRef = doc(db, TODOS_COLLECTION, todoId);
    const docSnapshot = await getDocs(
      query(collection(db, TODOS_COLLECTION), where("__name__", "==", todoId))
    );

    if (!docSnapshot.empty) {
      const existingImages = docSnapshot.docs[0].data().images || [];
      const updatedImages = existingImages.filter(
        (url: string) => url !== imageUrl
      );
      await updateDoc(todoRef, {
        images: updatedImages,
      });
      console.log("Image deleted from todo:", todoId, imageUrl);
    }
  } catch (error) {
    console.error("Error deleting image from todo:", error);
    throw error;
  }
};
