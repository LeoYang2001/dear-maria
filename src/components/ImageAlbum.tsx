import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Trash2, Loader } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { deleteImageFromTodoAsync } from "../redux/todoSlice";

interface ImageAlbumProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  todoId?: string;
  onImageDeleted?: () => void;
}

const ImageAlbum: React.FC<ImageAlbumProps> = ({
  images,
  isOpen,
  onClose,
  title = "Photo Album",
  todoId,
  onImageDeleted,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleDeleteImage = async (imageUrl: string, index: number) => {
    if (!todoId) {
      console.error("Todo ID is missing");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      await dispatch(
        deleteImageFromTodoAsync({
          todoId,
          imageUrl,
        })
      ).unwrap();

      // Update current index if deleting current image
      if (index === currentImageIndex && images.length > 1) {
        setCurrentImageIndex(Math.max(0, index - 1));
      }

      onImageDeleted?.();
    } catch (err) {
      console.error("Error deleting image:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40 "
          />

          {/* Album Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 "
            onClick={onClose}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-3xl shadow-2xl flex flex-col  overflow-hidden"
              style={{ width: "40vw", height: "80vh" }}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 bg-[#fff8f7] border-b ">
                <h2 className="text-2xl font-semibold text-black">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-300  cursor-pointer rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Main Image Viewer */}
              <div className="flex-1 flex items-center justify-center bg-black relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`Image ${currentImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full object-contain"
                    style={{ width: "100%", height: "100%" }}
                  />
                </AnimatePresence>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full transition-all text-white z-10"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/80 rounded-full transition-all text-white z-10"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full">
                  <p className="text-white text-sm font-medium">
                    {currentImageIndex + 1} / {images.length}
                  </p>
                </div>
              </div>

              {/* Thumbnail Strip */}
              {images.length > 0 && (
                <div className="bg-[#fff8f7]  px-6 py-4 overflow-x-auto">
                  <div className="flex gap-3">
                    {images.map((imageUrl, idx) => (
                      <motion.div key={idx} className="relative shrink-0 group">
                        <button
                          onClick={() => goToImage(idx)}
                          className={`relative rounded-lg overflow-hidden transition-all ${
                            currentImageIndex === idx
                              ? "ring-2 ring-pink-bright"
                              : "ring-1 ring-gray-600"
                          }`}
                        >
                          <img
                            src={imageUrl}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-16 h-16 object-cover"
                          />
                        </button>

                        {/* Delete button appears on hover */}
                        {todoId && currentImageIndex === idx && (
                          <motion.button
                            initial={{ opacity: 1, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteImage(imageUrl, idx);
                            }}
                            disabled={isDeleting}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transition-all disabled:opacity-50 "
                            title="Delete image"
                          >
                            {isDeleting ? (
                              <Loader size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ImageAlbum;
