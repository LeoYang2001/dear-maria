import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, Mail, Heart } from "lucide-react";
import type { TimeCapsule } from "../types/common/TimeCapsule";

interface TimeCapsuleDetailModalProps {
  isOpen: boolean;
  capsule: TimeCapsule;
  onClose: () => void;
  isReceived: boolean;
  isUnlocked: boolean;
}

const TimeCapsuleDetailModal: React.FC<TimeCapsuleDetailModalProps> = ({
  isOpen,
  capsule,
  onClose,
  isReceived,
  isUnlocked,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const createdDate = new Date(capsule.createdDate);
  const unlockDate = new Date(capsule.unlockDate);
  const now = new Date();
  const daysRemaining = Math.ceil(
    (unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header - Journal Style */}
              <div className="sticky top-0 bg-linear-to-r from-pink-50 to-purple-50 border-b border-gray-200 px-8 py-6 flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="inline-block px-3 py-1 bg-white border border-pink-300 rounded-full">
                      <span className="text-xs font-semibold text-pink-600">
                        {isReceived ? "📬 Received" : "📤 Sent"}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-4xl font-elegant font-bold text-gray-900 mb-4">
                    {capsule.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span className="font-medium">{capsule.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>
                        {createdDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Content - Journal Page Style */}
              <div className="overflow-y-auto flex-1 px-8 py-8">
                {/* Status Banner for Locked Capsules */}
                {isReceived && !isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border-l-4 border-blue-400 rounded-lg p-4 mb-6"
                  >
                    <p className="text-blue-900 font-medium">
                      ⏰ This capsule unlocks in{" "}
                      <span className="font-bold text-blue-700">
                        {daysRemaining} days
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold">
                        {unlockDate.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </motion.div>
                )}

                {/* Unlock Status for Unlocked Received Capsules */}
                {isReceived && isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-l-4 border-green-400 rounded-lg p-4 mb-6"
                  >
                    <p className="text-green-900 font-medium">
                      ✨ This capsule is now unlocked! Sent by{" "}
                      {capsule.createdBy} on{" "}
                      {createdDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </motion.div>
                )}

                {/* Message Content - Journal Style */}
                <div className="bg-linear-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-8 mb-6 min-h-[300px] shadow-sm">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap font-serif text-lg">
                    {capsule.message}
                  </p>
                </div>

                {/* Metadata Footer */}
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 border-t border-gray-200 pt-6">
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase mb-1">
                      Sent On
                    </p>
                    <p className="font-medium">
                      {createdDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-semibold uppercase mb-1">
                      Unlocks On
                    </p>
                    <p className="font-medium">
                      {unlockDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Email Notification Info */}
                {capsule.emailNotification && (
                  <div className="mt-6 flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-3 rounded-lg">
                    <Mail size={16} />
                    <span>Email notification enabled for unlock date</span>
                  </div>
                )}
              </div>

              {/* Modal Footer - Actions */}
              <div className="border-t border-gray-200 bg-gray-50 px-8 py-4 flex items-center justify-between">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isLiked
                      ? "bg-pink-100 text-pink-600"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Heart
                    size={20}
                    fill={isLiked ? "currentColor" : "none"}
                    stroke={isLiked ? "currentColor" : "currentColor"}
                  />
                  <span>{isLiked ? "Liked" : "Like"}</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TimeCapsuleDetailModal;
