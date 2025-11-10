import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Todo } from "../types/common/Todo";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (todo: Todo) => Promise<void>;
  createdBy: "maria" | "leo";
}

const AddTodoModal: React.FC<AddTodoModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  createdBy,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedImages([]);
    setPreviewUrls([]);
    setError("");
    setSuccess(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedImages.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setSelectedImages([...selectedImages, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    setError("");
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const newTodo: Todo = {
        title: title.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString().split("T")[0],
        createdBy,
        status: { maria: false, leo: false },
        images: previewUrls,
      };

      // Call the onAdd callback which will dispatch Redux action
      await onAdd(newTodo);
      setSuccess(true);

      // Reset form and close modal
      setTimeout(() => {
        resetForm();
        onClose();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add todo. Try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black  z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white  rounded-3xl shadow-2xl  w-[30vw]  h-[60vh] flex flex-col  "
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-elegant text-gray-900 ">
                  Add New Adventure
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <form className="p-6 space-y-4">
                {/* Success Message */}
                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center"
                    >
                      <p className="text-green-700 font-medium">
                        ✓ Adventure added!
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center"
                    >
                      <p className="text-red-700 font-medium text-sm">
                        {error}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Title Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Visit Paris, Learn Photography"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-bright focus:outline-none placeholder-gray-400 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details about this adventure..."
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:border-pink-bright focus:outline-none placeholder-gray-400 transition-colors resize-none h-24"
                    disabled={isLoading}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Photos (Optional - Max 5)
                  </label>

                  {/* 3x2 Grid Layout */}
                  <div className="grid grid-cols-3 gap-3">
                    {/* Image Previews */}
                    {previewUrls.map((url, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative h-24 group"
                      >
                        <img
                          src={url}
                          alt={`Preview ${idx}`}
                          className="w-full h-full object-cover rounded-2xl shadow-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                          <X size={14} />
                        </button>
                      </motion.div>
                    ))}
                    {/* Upload Button - First position, disabled when full */}
                    <label
                      className="relative h-24 border-2 border-dashed border-gray-300 hover:border-pink-light rounded-2xl p-3 cursor-pointer transition-colors flex flex-col items-center justify-center bg-gray-50 hover:bg-pink-50 disabled:opacity-50"
                      style={{
                        pointerEvents:
                          previewUrls.length >= 5 ? "none" : "auto",
                        opacity: previewUrls.length >= 5 ? 0.5 : 1,
                      }}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        disabled={isLoading || previewUrls.length >= 5}
                      />
                      <Upload size={20} className="text-gray-400 mb-1" />
                      <p className="text-xs text-gray-600 text-center">
                        {previewUrls.length > 0
                          ? `${previewUrls.length}/5`
                          : "Upload"}
                      </p>
                    </label>

                    {/* Empty Grid Slots for visual balance */}
                    {Array.from({
                      length: Math.max(0, 5 - previewUrls.length),
                    }).map((_, idx) => (
                      <div
                        key={`empty-${idx}`}
                        className="h-24 border-2 border-dashed border-gray-200 rounded-2xl opacity-30"
                      />
                    ))}
                  </div>
                </div>
              </form>
              {/* Action Buttons */}
              {!success && !error && (
                <div className="flex gap-3 pt-4  px-6">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 cursor-pointer rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 cursor-pointer rounded-2xl bg-linear-to-r  text-white font-medium  bg-pink-400 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Adding..." : "Add Adventure"}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTodoModal;
