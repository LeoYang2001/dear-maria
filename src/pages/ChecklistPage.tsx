import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import type { RootState, AppDispatch } from "../redux/store";
import SearchAddButton from "../components/SearchAddButton";
import AddTodoModal from "../components/AddTodoModal";
import TodoItem from "../components/TodoItem";
import type { Todo } from "../types/common/Todo";
import {
  fetchAllTodos,
  addNewTodo,
  updateTodoStatusAsync,
  deleteTodoAsync,
} from "../redux/todoSlice";

// Blur search - fuzzy matching algorithm
const blurSearch = (query: string, text: string): number => {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  let score = 0;
  let queryIndex = 0;
  let consecutiveMatches = 0;

  for (let i = 0; i < t.length && queryIndex < q.length; i++) {
    if (t[i] === q[queryIndex]) {
      score += 10 + consecutiveMatches * 5; // Bonus for consecutive matches
      consecutiveMatches++;
      queryIndex++;
    } else {
      consecutiveMatches = 0;
    }
  }

  // Only return score if all query characters were found
  return queryIndex === q.length ? score : -1;
};

const ChecklistPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputValue, setInputValue] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<"maria" | "leo" | null>(null);

  // Get currentUser from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser") as
      | "maria"
      | "leo"
      | null;
    setCurrentUser(savedUser);
  }, []);
  const { todos: items } = useSelector((state: RootState) => state.todos);

  // Fetch todos on component mount
  useEffect(() => {
    dispatch(fetchAllTodos());
  }, [dispatch]);

  // Calculate progress - count items where both maria and leo have completed
  const totalItems = items.length;
  const completedItems = items.filter(
    (item) => item.status.maria && item.status.leo
  ).length;
  const progressPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  // Filter items based on search with blur search
  const filteredItems = inputValue.trim()
    ? items
        .map((item) => ({
          item,
          score: blurSearch(inputValue, item.title),
        }))
        .filter(({ score }) => score > -1)
        .sort((a, b) => b.score - a.score)
        .map(({ item }) => item)
    : items;

  const handleAddItem = async (newItem: Todo) => {
    dispatch(
      addNewTodo({
        title: newItem.title,
        description: newItem.description,
        createdBy: newItem.createdBy as "maria" | "leo",
        images: newItem.images,
      })
    );
  };

  const handleInputKeyPress = () => {
    // Search input only - do nothing on Enter
    return;
  };

  const handleDeleteItem = async (todoId: string) => {
    await dispatch(deleteTodoAsync(todoId)).unwrap();
  };

  const toggleItemCompletion = async (todoId: string) => {
    const item = items.find((t) => t.id === todoId);

    if (item && currentUser) {
      const isCompleted = item.status[currentUser as "maria" | "leo"];
      await dispatch(
        updateTodoStatusAsync({
          todoId,
          user: currentUser as "maria" | "leo",
          completed: !isCompleted,
        })
      ).unwrap();
    }
  };

  const toggleItemExpanded = (todoId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(todoId)) {
      newExpanded.delete(todoId);
    } else {
      newExpanded.add(todoId);
    }
    setExpandedItems(newExpanded);
  };

  const setItemExpanded = (todoId: string) => {
    const newExpanded = new Set(expandedItems);
    if (!newExpanded.has(todoId)) {
      newExpanded.add(todoId);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="h-full select-none w-full  flex flex-col justify-start items-center pt-8 px-8">
      {/* Header */}
      <div className="flex flex-col justify-center items-center mb-8 w-full">
        <h1 className="text-6xl font-elegant text-gray-900 flex-1 leading-tight">
          Our Checklist
        </h1>
        <p className="text-2xl text-center text-gray-400 mt-4">
          Adventures and moments we want to share together
        </p>
      </div>

      {/* Progress Section */}
      <div className="w-full  max-w-2xl mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-md text-[#e56d7a]">
            Progress: {completedItems} of {totalItems} completed
          </span>
          <span className="text-sm font-medium text-md text-[#e56d7a]">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-linear-to-r from-[#e56d7a] to-pink-bright rounded-full"
          />
        </div>
      </div>

      {/* Search and Add Section */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search your adventures..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleInputKeyPress}
            className="flex-1 px-6 py-4 rounded-3xl border-2 border-gray-200 focus:border-pink-bright focus:outline-none text-lg placeholder-gray-400 transition-colors"
          />

          {/* Add Button Component */}
          <SearchAddButton onAddClick={() => setIsModalOpen(true)} />
        </div>
      </div>

      {/* Add Todo Modal */}
      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        createdBy={currentUser || "maria"}
      />

      {/* Checklist Items */}
      <div
        className="w-full  flex-1 pb-6  max-w-3xl px-4 space-y-3 max-h-[60vh] overflow-y-auto "
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`
          div::-webkit-scrollbar {
            width: 6px;
          }
          div::-webkit-scrollbar-track {
            background: transparent;
          }
          div::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
          }
          div::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
        `}</style>
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              No checklist items yet. Add one to get started!
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              isExpanded={expandedItems.has(item.id)}
              onToggleExpand={toggleItemExpanded}
              setItemExpanded={setItemExpanded}
              onToggleCompletion={toggleItemCompletion}
              onDelete={handleDeleteItem}
              currentUser={currentUser}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ChecklistPage;
