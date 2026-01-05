import React, { useState, useEffect } from "react";
import { Plus, Sparkles, Target, Heart, X, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import type { Resolution } from "../types/common/Resolution";
import {
  getAllResolutions,
  addResolution,
  deleteResolutionById,
} from "../apis/resolutionsApi";

const categoryIcons = {
  personal: "✨",
  relationship: "💕",
  career: "🎯",
  health: "💪",
  adventure: "🌍",
};

const categoryColors = {
  personal: "bg-purple-100 text-purple-600 border-purple-200",
  relationship: "bg-pink-100 text-pink-600 border-pink-200",
  career: "bg-blue-100 text-blue-600 border-blue-200",
  health: "bg-green-100 text-green-600 border-green-200",
  adventure: "bg-orange-100 text-orange-600 border-orange-200",
};

const NewYearResolutionsPage: React.FC = () => {
  const currentUser = useSelector(
    (state: RootState) => state.auth.currentUser
  ) as "maria" | "leo" | null;
  const partnerName = currentUser === "leo" ? "Maria" : "Leo";
  const currentUserDisplay = currentUser === "leo" ? "Leo" : "Maria";

  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newResolution, setNewResolution] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<Resolution["category"]>("personal");

  // Fetch resolutions from Firestore on mount
  useEffect(() => {
    const fetchResolutions = async () => {
      try {
        setIsLoading(true);
        const data = await getAllResolutions();
        setResolutions(data);
      } catch (error) {
        console.error("Error fetching resolutions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchResolutions();
  }, []);

  // Filter resolutions by user
  const myResolutions = resolutions.filter((r) => r.createdBy === currentUser);
  const partnerResolutions = resolutions.filter(
    (r) => r.createdBy !== currentUser
  );

  const handleAddResolution = async () => {
    if (!newResolution.trim() || !currentUser || isAdding) return;

    try {
      setIsAdding(true);
      const newResolutionData = {
        text: newResolution.trim(),
        category: selectedCategory,
        createdBy: currentUser,
      };

      const docId = await addResolution(newResolutionData);

      // Add to local state with the returned ID
      const resolution: Resolution = {
        id: docId,
        ...newResolutionData,
      };

      setResolutions([...resolutions, resolution]);
      setNewResolution("");
    } catch (error) {
      console.error("Error adding resolution:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveResolution = async (id: string) => {
    try {
      // Optimistically remove from UI
      setResolutions(resolutions.filter((r) => r.id !== id));
      // Delete from Firestore
      await deleteResolutionById(id);
    } catch (error) {
      console.error("Error deleting resolution:", error);
      // Refetch on error to restore state
      const data = await getAllResolutions();
      setResolutions(data);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddResolution();
    }
  };

  return (
    <div className="min-h-full w-full flex flex-col items-center pt-8 px-8 pb-12 bg-linear-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <div className="flex flex-col justify-center items-center mb-12 w-full max-w-4xl">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={32} className="text-pink-500" />
          <h1 className="text-4xl font-elegant text-gray-900 leading-tight">
            2026 Resolutions
          </h1>
          <Sparkles size={32} className="text-pink-500" />
        </div>
        <p className="text-lg text-center text-gray-500 mt-2">
          A new year, new dreams, new adventures together 💕
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Add Resolution Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <Target size={24} className="text-pink-500" />
            Add a New Resolution
          </h2>

          {/* Category Selection */}
          <div className="flex flex-wrap gap-3 mb-6">
            {(Object.keys(categoryIcons) as Resolution["category"][]).map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                    selectedCategory === category
                      ? categoryColors[category] +
                        " ring-2 ring-offset-2 ring-pink-300"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {categoryIcons[category]}{" "}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Input Field */}
          <div className="flex gap-4">
            <input
              type="text"
              value={newResolution}
              onChange={(e) => setNewResolution(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What do you want to achieve in 2026?"
              className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-100 placeholder-gray-400 transition-all text-lg"
            />
            <button
              onClick={handleAddResolution}
              disabled={!newResolution.trim() || isAdding}
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-lg"
            >
              {isAdding ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Plus size={24} />
              )}
              {isAdding ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        {/* Two-Column Resolutions Display */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="animate-spin text-pink-500 mb-4" />
            <p className="text-gray-500">Loading resolutions...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* My Resolutions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-pink-600 flex items-center justify-center">
                  <User size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {currentUserDisplay}'s Goals
                  </h2>
                  <p className="text-xs text-gray-500">
                    {myResolutions.length}{" "}
                    {myResolutions.length === 1 ? "resolution" : "resolutions"}
                  </p>
                </div>
              </div>

              {/* Empty State */}
              {myResolutions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  <Sparkles size={36} className="mb-3 opacity-50" />
                  <p className="text-sm font-medium">No resolutions yet</p>
                  <p className="text-xs mt-1">Add your first goal above!</p>
                </div>
              )}

              {/* My Resolutions List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {myResolutions.map((resolution, index) => (
                    <motion.div
                      key={resolution.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border ${
                        categoryColors[resolution.category]
                      } flex items-start gap-3 group relative`}
                    >
                      <span className="text-xl">
                        {categoryIcons[resolution.category]}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {resolution.text}
                        </p>
                        <span className="text-xs text-gray-500 mt-1 capitalize">
                          {resolution.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveResolution(resolution.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/50 rounded-full"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Partner's Resolutions */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Heart size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {partnerName}'s Goals
                  </h2>
                  <p className="text-xs text-gray-500">
                    {partnerResolutions.length}{" "}
                    {partnerResolutions.length === 1
                      ? "resolution"
                      : "resolutions"}
                  </p>
                </div>
              </div>

              {/* Empty State */}
              {partnerResolutions.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  <Heart size={36} className="mb-3 opacity-50" />
                  <p className="text-sm font-medium">
                    No resolutions from {partnerName}
                  </p>
                  <p className="text-xs mt-1">They haven't added goals yet</p>
                </div>
              )}

              {/* Partner's Resolutions List */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {partnerResolutions.map((resolution, index) => (
                    <motion.div
                      key={resolution.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border ${
                        categoryColors[resolution.category]
                      } flex items-start gap-3`}
                    >
                      <span className="text-xl">
                        {categoryIcons[resolution.category]}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">
                          {resolution.text}
                        </p>
                        <span className="text-xs text-gray-500 mt-1 capitalize">
                          {resolution.category}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

      
      </div>
    </div>
  );
};

export default NewYearResolutionsPage;
