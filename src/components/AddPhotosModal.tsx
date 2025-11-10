import React, { useState } from "react";
import { X, Upload, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { uploadTodoImages } from "../storage";

interface AddPhotosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (imageUrls: string[]) => Promise<void>;
  createdBy: "maria" | "leo";
  existingImages?: string[];
}

const AddPhotosModal: React.FC<AddPhotosModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  createdBy,
  existingImages = [],
}) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetForm = () => {
    setSelectedImages([]);
    setPreviewUrls([]);
    setError("");
    setSuccess(false);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages =
      files.length + selectedImages.length + existingImages.length;

    if (totalImages > 5) {
      const remaining = 5 - existingImages.length - selectedImages.length;
      setError(
        `You can add ${remaining} more image${
          remaining !== 1 ? "s" : ""
        } (max 5 total)`
      );
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
    if (selectedImages.length === 0) {
      setError("Please select at least one image");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Upload images to Firebase Storage
      const imageUrls = await uploadTodoImages(selectedImages, createdBy);

      // Call the onAdd callback to update the todo
      await onAdd(imageUrls);
      setSuccess(true);

      // Reset form and close modal
      setTimeout(() => {
        resetForm();
        onClose();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add photos. Try again."
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
            className="fixed inset-0 bg-black z-40"
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
              className="bg-white rounded-3xl shadow-2xl w-[30vw] flex flex-col"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-3xl">
                <h2 className="text-2xl font-elegant text-gray-900">
                  Add Photos
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <form className="p-6 space-y-4 flex-1 overflow-y-auto">
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

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Photos ({existingImages.length + previewUrls.length}/5)
                  </label>

                  {/* Show existing images section if any */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Already added ({existingImages.length})
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {existingImages.map((url, idx) => (
                        <motion.div
                          key={`existing-${idx}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative h-24"
                        >
                          <img
                            src={url}
                            alt={`Existing ${idx}`}
                            className="w-full h-full object-cover rounded-2xl shadow-lg"
                          />
                          <div className="absolute inset-0 rounded-2xl bg-linear-to-t from-black/10 to-transparent opacity-30" />
                        </motion.div>
                      ))}
                      {previewUrls.map((url, idx) => (
                        <motion.div
                          key={`new-${idx}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: (existingImages.length + idx) * 0.05,
                          }}
                          className="relative h-24 group"
                        >
                          <img
                            src={url}
                            alt={`Preview ${idx}`}
                            className="w-full h-full object-cover rounded-2xl shadow-lg"
                          />
                          <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full px-1.5 py-0.5 text-xs font-medium">
                            New
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute bottom-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                      {/* Upload Button - disabled when total is 5 */}
                      <label
                        className="relative h-24 border-2 border-dashed border-gray-300 hover:border-pink-light rounded-2xl p-3 cursor-pointer transition-colors flex flex-col items-center justify-center bg-gray-50 hover:bg-pink-50"
                        style={{
                          pointerEvents:
                            existingImages.length + previewUrls.length >= 5
                              ? "none"
                              : "auto",
                          opacity:
                            existingImages.length + previewUrls.length >= 5
                              ? 0.5
                              : 1,
                        }}
                      >
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          disabled={
                            isLoading ||
                            existingImages.length + previewUrls.length >= 5
                          }
                        />
                        <Upload size={20} className="text-gray-400 mb-1" />
                        <p className="text-xs text-gray-600 text-center">
                          {existingImages.length + previewUrls.length > 0
                            ? `${existingImages.length + previewUrls.length}/5`
                            : "Upload"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </form>

              {/* Action Buttons */}
              {!success && !error && (
                <div className="flex gap-3 pt-4 px-6 pb-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      resetForm();
                    }}
                    disabled={isLoading}
                    className="flex-1 px-4 py-3 cursor-pointer rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    disabled={isLoading || selectedImages.length === 0}
                    className="flex-1 px-4 py-3 cursor-pointer rounded-2xl bg-pink-400 hover:bg-pink-500 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        <span>Adding...</span>
                      </>
                    ) : (
                      <span>Add Photos</span>
                    )}
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

export default AddPhotosModal;
