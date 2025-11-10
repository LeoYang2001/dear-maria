import React, { useState } from "react";
import { Trash2, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Todo } from "../types/common/Todo";

interface TodoItemProps {
  item: Todo & { id: string };
  isExpanded: boolean;
  onToggleExpand: (todoId: string) => void;
  onToggleCompletion: (todoId: string) => Promise<void>;
  onDelete: (todoId: string) => Promise<void>;
  currentUser: string | null;
}

const TodoItem: React.FC<TodoItemProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  onToggleCompletion,
  onDelete,
  currentUser,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // Determine the completion state
  const currentUserCompleted = item.status[currentUser as "maria" | "leo"];
  const otherUserCompleted =
    currentUser === "maria" ? item.status.leo : item.status.maria;
  const bothCompleted = item.status.maria && item.status.leo;

  const userCompleteStatus = {
    leo: item.status.leo,
    maria: item.status.maria,
  };

  // Handle toggle completion with loading state
  const handleToggleCompletion = async () => {
    setIsLoading(true);
    try {
      await onToggleCompletion(item.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete with loading state
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(item.id);
    } finally {
      setIsLoading(false);
    }
  };

  // Determine UI state
  let checkboxState: "none" | "current-only" | "other-only" | "both-completed" =
    "none";

  if (bothCompleted) {
    checkboxState = "both-completed";
  } else if (currentUserCompleted && !otherUserCompleted) {
    checkboxState = "current-only";
  } else if (!currentUserCompleted && otherUserCompleted) {
    checkboxState = "other-only";
  }

  // Get checkbox styling based on state
  const getCheckboxStyle = () => {
    switch (checkboxState) {
      case "both-completed":
        return "bg-green-500 border-green-500 shadow-lg";
      case "current-only":
        return "bg-gray-300 border-gray-400";
      case "other-only":
        return "border-gray-300 bg-gray-100";
      default:
        return "border-gray-300 hover:border-pink-light";
    }
  };

  // Get title styling based on state
  const getTitleStyle = () => {
    if (bothCompleted) {
      return "text-gray-400 line-through";
    } else if (checkboxState === "current-only") {
      return "text-gray-500";
    } else {
      return "text-gray-900";
    }
  };

  // Get checkbox checkmark visibility
  const shouldShowCheckmark = () => {
    return (
      checkboxState === "both-completed" || checkboxState === "current-only"
    );
  };

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={() => {
        onToggleExpand(item.id);
      }}
      className="bg-white rounded-2xl border overflow-hidden relative border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer"
    >
      {/* Loading Overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6"
            >
              <Loader size={24} className="text-pink-bright" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        animate={{
          height: isExpanded ? "auto" : "60px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-center gap-4">
            {/* Checkbox - Different states based on completion */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleToggleCompletion();
              }}
              className="mt-0.5 shrink-0 cursor-pointer relative group"
              title={
                checkboxState === "both-completed"
                  ? "✓ Both completed"
                  : checkboxState === "current-only"
                  ? `✓ You completed • ${
                      currentUser === "maria" ? "Leo" : "Maria"
                    } pending`
                  : checkboxState === "other-only"
                  ? `${
                      currentUser === "maria" ? "Leo" : "Maria"
                    } completed • You pending`
                  : "Not completed"
              }
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${getCheckboxStyle()} ${
                  isLoading ? "opacity-50" : ""
                }`}
              >
                {shouldShowCheckmark() && (
                  <span className="text-white text-xs font-bold">✓</span>
                )}
                {checkboxState === "other-only" && (
                  <span className="text-gray-400 text-xs">-</span>
                )}
              </div>
              {/* Tooltip on hover */}
            </div>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h3
                className={`text-lg font-semibold truncate ${getTitleStyle()}`}
              >
                {item.title}
              </h3>
            </div>

            {/* Delete Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isLoading}
              className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mt-4 pt-4 border-t border-gray-100 space-y-3"
              >
                {/* Description */}
                <p className="text-sm text-gray-600">{item.description}</p>

                {/* Created Info */}
                <div className="text-xs text-gray-400">
                  <p>
                    Created by {item.createdBy} on {item.createdAt}
                  </p>
                </div>

                {/* Add Photos Button */}
                <button className="px-4 py-2 rounded-2xl border border-gray-300 hover:border-pink-light flex items-center gap-2 text-gray-600 hover:text-pink-bright transition-colors cursor-pointer text-sm">
                  <span>📷</span>
                  <span>Add Photos</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* A progress bar shows the user's completion status. */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute flex flex-row bottom-0 w-full h-2"
          >
            {/* Create a mask expand from 0 to 100%  */}

            {Object.keys(userCompleteStatus).map((user) => {
              if (userCompleteStatus[user as "leo" | "maria"]) {
                return (
                  <motion.div
                    key={user}
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{
                      duration: 0.4,
                      delay: user === "maria" ? 0 : 0.15,
                    }}
                    style={{
                      height: "100%",
                      backgroundColor: user === "maria" ? "#fbb6ce" : "#2aad4d",
                    }}
                  />
                );
              }
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TodoItem;
