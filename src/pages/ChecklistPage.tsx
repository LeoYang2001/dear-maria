import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Trash2, Plus, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { RootState } from "../redux/store";
import {
  checklistMockData,
  type ChecklistItem,
} from "../data/checklistMockData";

const ChecklistPage: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(checklistMockData);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  // Calculate progress
  const totalItems = items.length;
  const completedItems = items.filter(
    (item) => item.completedBy.length === 2
  ).length;
  const progressPercentage =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: Math.max(...items.map((i) => i.id), 0) + 1,
      title: newItemTitle,
      completedBy: [],
      photos: [],
    };

    setItems([newItem, ...items]);
    setNewItemTitle("");
  };

  const handleDeleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleItemCompletion = (id: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const isCompleted = item.completedBy.includes(
            currentUser as "maria" | "leo"
          );
          return {
            ...item,
            completedBy: isCompleted
              ? item.completedBy.filter((user) => user !== currentUser)
              : [...item.completedBy, currentUser as "maria" | "leo"],
          };
        }
        return item;
      })
    );
  };

  const toggleItemExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="h-full w-full  flex flex-col justify-start items-center pt-8 px-8">
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

      {/* Add New Item */}
      <div className="w-full max-w-2xl mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add a new adventure or goal..."
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
            className="flex-1 px-6 py-4 rounded-3xl border-2 border-gray-200 focus:border-pink-bright focus:outline-none text-lg placeholder-gray-400 transition-colors"
          />
          <button
            onClick={handleAddItem}
            className="w-14 h-14 rounded-full bg-[#e56d7a] hover:bg-pink-600 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

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
          items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => toggleItemExpanded(item.id)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer"
            >
              <motion.div
                animate={{
                  height: expandedItems.has(item.id) ? "auto" : "60px",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleItemCompletion(item.id);
                      }}
                      className="mt-0.5 shrink-0 cursor-pointer"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.completedBy.includes(
                            currentUser as "maria" | "leo"
                          )
                            ? "bg-pink-bright border-pink-bright"
                            : "border-gray-300 hover:border-pink-light"
                        }`}
                      >
                        {item.completedBy.includes(
                          currentUser as "maria" | "leo"
                        ) && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        )}
                      </div>
                    </button>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-lg font-semibold truncate ${
                          item.completedBy.length === 2
                            ? "text-gray-400 line-through"
                            : "text-gray-900"
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(item.id);
                      }}
                      className="shrink-0 p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedItems.has(item.id) && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 pt-4 border-t border-gray-100 space-y-3"
                      >
                        {/* User Completion Status */}
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Maria</span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                item.completedBy.includes("maria")
                                  ? "bg-pink-bright"
                                  : "bg-gray-200"
                              }`}
                            >
                              {item.completedBy.includes("maria") && (
                                <span className="text-white text-xs font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Leo</span>
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                                item.completedBy.includes("leo")
                                  ? "bg-blue-500"
                                  : "bg-gray-200"
                              }`}
                            >
                              {item.completedBy.includes("leo") && (
                                <span className="text-white text-xs font-bold">
                                  ✓
                                </span>
                              )}
                            </div>
                          </div>
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
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChecklistPage;
