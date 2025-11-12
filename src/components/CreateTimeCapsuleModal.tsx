import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock } from "lucide-react";
import type { TimeCapsule } from "../types/common/TimeCapsule";
import type { RootState } from "../redux/store";
import { useSelector } from "react-redux";

interface CreateTimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (capsule: TimeCapsule) => void;
}

const CreateTimeCapsuleModal: React.FC<CreateTimeCapsuleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const currentUser = useSelector(
    (state: RootState) => state.auth.currentUser
  ) as "Maria" | "Leo" | null;

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    unlockDate: "",
    emailNotification: false,
  });
  const [formError, setFormError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!formData.title.trim()) {
      setFormError("Please enter a title");
      return;
    }
    if (!formData.message.trim()) {
      setFormError("Please enter your message");
      return;
    }
    if (!formData.unlockDate) {
      setFormError("Please select an unlock date");
      return;
    }

    // Check if unlock date is in the future
    const unlockDateObj = new Date(formData.unlockDate);
    if (unlockDateObj <= new Date()) {
      setFormError("Unlock date must be in the future");
      return;
    }

    // Create new capsule
    const newCapsule: TimeCapsule = {
      id: Date.now().toString(),
      title: formData.title,
      message: formData.message,
      unlockDate: formData.unlockDate,
      createdDate: new Date().toISOString(),
      emailNotification: formData.emailNotification,
      createdBy: currentUser || "Maria",
    };

    onSubmit(newCapsule);

    // Reset form
    setFormData({
      title: "",
      message: "",
      unlockDate: "",
      emailNotification: false,
    });
    setFormError("");
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      title: "",
      message: "",
      unlockDate: "",
      emailNotification: false,
    });
    setFormError("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center rounded-t-3xl">
                <div>
                  <h2 className="text-2xl font-elegant font-semibold text-gray-900">
                    Create a Time Capsule
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Write a letter to your future selves. Once scheduled, it
                    cannot be canceled—a symbol of trust.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Error Message */}
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-3"
                  >
                    <p className="text-red-700 font-medium text-sm">
                      {formError}
                    </p>
                  </motion.div>
                )}

                {/* Title Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Our 2nd Anniversary"
                    className="w-full px-4 py-3 rounded-2xl border border-pink-light focus:border-pink-bright focus:outline-none focus:ring-1 focus:ring-pink-bright transition-colors"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your letter here..."
                    rows={5}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-pink-bright focus:outline-none focus:ring-1 focus:ring-pink-bright transition-colors resize-none"
                  />
                </div>

                {/* Unlock Date Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Unlock Date
                  </label>
                  <input
                    type="date"
                    name="unlockDate"
                    value={formData.unlockDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:border-pink-bright focus:outline-none focus:ring-1 focus:ring-pink-bright transition-colors"
                  />
                </div>

                {/* Warning Message */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-3 flex gap-2">
                  <span className="text-yellow-600 text-lg">⚠️</span>
                  <p className="text-yellow-700 text-sm">
                    Once created, this capsule cannot be edited or deleted until
                    the unlock date
                  </p>
                </div>

                {/* Email Notification Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="emailNotification"
                    name="emailNotification"
                    checked={formData.emailNotification}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                  <label
                    htmlFor="emailNotification"
                    className="text-sm text-gray-600 cursor-pointer"
                  >
                    Send email notification on unlock day
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-2xl bg-pink-bright hover:bg-pink-500 text-white font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock size={18} />
                    <span>Seal & Schedule</span>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateTimeCapsuleModal;
