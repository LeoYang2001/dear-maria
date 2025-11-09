/**
 * Test file for adding a sample todo
 * This file demonstrates how to use the addTodoItem function
 */

import {
  addTodoItem,
  getAllTodos,
  updateTodoStatus,
} from "../apis/checklistApis";
import { todos } from "./testTodoList";

/**
 * Test function to add a sample todo item
 */
export const testAddSampleTodo = async (): Promise<void> => {
  try {
    console.log("🧪 Starting todo test...");

    // Add a sample todo
    const sampleTitle = "Visit the Paris Eiffel Tower";
    const sampleDescription =
      "Take a romantic trip to Paris and visit the Eiffel Tower together";
    const createdBy = "maria";
    const sampleImages = [
      "https://example.com/paris1.jpg",
      "https://example.com/paris2.jpg",
    ];

    console.log(`📝 Adding todo: "${sampleTitle}"`);
    const todoId = await addTodoItem(
      sampleTitle,
      sampleDescription,
      createdBy,
      sampleImages
    );

    console.log(`✅ Todo added successfully with ID: ${todoId}`);

    // Update the todo status for maria
    console.log("🔄 Updating todo status for maria...");
    await updateTodoStatus(todoId, "maria", true);
    console.log("✅ Maria's status updated to completed");

    // Fetch all todos to verify
    console.log("📋 Fetching all todos...");
    const allTodos = await getAllTodos();
    console.log(`✅ Total todos: ${allTodos.length}`);
    console.log("📄 All todos:", allTodos);

    // Log the newly added todo
    const newTodo = allTodos.find((t) => t.id === todoId);
    if (newTodo) {
      console.log("\n🎯 Newly added todo:");
      console.log(`  Title: ${newTodo.title}`);
      console.log(`  Description: ${newTodo.description}`);
      console.log(`  Created by: ${newTodo.createdBy}`);
      console.log(
        `  Status: Maria=${newTodo.status.maria}, Leo=${newTodo.status.leo}`
      );
      console.log(`  Images: ${newTodo.images?.length || 0} images`);
    }

    console.log("\n✨ Test completed successfully!");
  } catch (error) {
    console.error("❌ Error during todo test:", error);
    throw error;
  }
};

/**
 * Add all todos from the mock data sequentially
 * This function will add each todo one by one with a delay
 */
export const addAllTodosSequentially = async (): Promise<void> => {
  try {
    console.log("🧪 Starting sequential todo upload...");
    console.log(`📦 Total todos to add: ${todos.length}`);

    const addedTodoIds: string[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Add each todo sequentially
    for (let idx = 0; idx < todos.length; idx++) {
      const todo = todos[idx];

      try {
        console.log(
          `\n[${idx + 1}/${todos.length}] 📝 Adding: "${todo.title}"`
        );

        const todoId = await addTodoItem(
          todo.title,
          todo.description,
          todo.createdBy as "maria" | "leo",
          todo.images
        );

        addedTodoIds.push(todoId);
        successCount++;

        console.log(`✅ Added successfully with ID: ${todoId}`);

        // Small delay between requests to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (itemError) {
        errorCount++;
        console.error(
          `❌ Failed to add "${todo.title}":`,
          itemError instanceof Error ? itemError.message : itemError
        );
      }
    }

    // Fetch all todos to verify
    console.log("\n📋 Fetching all todos to verify...");
    const allTodos = await getAllTodos();

    console.log("\n" + "=".repeat(60));
    console.log("✨ Batch upload completed!");
    console.log("=".repeat(60));
    console.log(`✅ Successfully added: ${successCount} todos`);
    console.log(`❌ Failed to add: ${errorCount} todos`);
    console.log(`📊 Total todos in database: ${allTodos.length}`);
    console.log("=".repeat(60));

    // Show summary of added todos
    if (addedTodoIds.length > 0) {
      console.log("\n📄 Added todos summary:");
      addedTodoIds.forEach((id, idx) => {
        const addedTodo = allTodos.find((t) => t.id === id);
        if (addedTodo) {
          console.log(
            `  ${idx + 1}. ${addedTodo.title} (by ${addedTodo.createdBy})`
          );
        }
      });
    }
  } catch (error) {
    console.error("❌ Error during batch todo upload:", error);
    throw error;
  }
};

export default testAddSampleTodo;
