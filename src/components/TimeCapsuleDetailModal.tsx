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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
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
            className="fixed inset-0 bg-black z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-[45vw] max-h-[80vh] overflow-hidden flex flex-col"
            >
              {/* Modal Header - Minimal Style */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex justify-between items-center">
                <div className="flex-1">
                  <h2 className="text-3xl font-elegant font-bold text-gray-900">
                    {capsule.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{capsule.createdBy}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
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
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                >
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 px-8 py-6 space-y-6">
                {/* Status Banner for Locked Capsules */}
                {isReceived && !isUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-2xl p-4"
                  >
                    <p className="text-blue-900 font-medium text-sm">
                      ⏰ Unlocks in{" "}
                      <span className="font-bold text-blue-700">
                        {daysRemaining} days
                      </span>{" "}
                      on{" "}
                      <span className="font-semibold">
                        {unlockDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
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
                    className="bg-green-50 border border-green-200 rounded-2xl p-4"
                  >
                    <p className="text-green-900 font-medium text-sm">
                      ✨ Unlocked! Sent on{" "}
                      {createdDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </motion.div>
                )}

                {/* Image Display - if available */}
                {capsule.picture && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setIsImageModalOpen(true)}
                    className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <img
                      src={capsule.picture}
                      alt={capsule.title}
                      className="w-full h-auto max-h-64 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                )}

                {/* Message Content - Journal Style */}
                <div className="bg-linear-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 min-h-[200px] shadow-sm">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base break-all">
                    {capsule.message}
                  </p>
                </div>

                {/* Metadata Section */}
                <div className="border-t border-gray-100 pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase mb-2">
                        Unlocks
                      </p>
                      <p className="text-gray-600 font-medium text-sm">
                        {unlockDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Email Notification Info */}
                  {capsule.emailAddress && (
                    <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 px-4 py-3 rounded-xl border border-purple-100">
                      <Mail size={16} className="shrink-0" />
                      <span>Email notification set</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Action */}
              {isReceived && isUnlocked && (
                <div className="border-t border-gray-100 px-8 py-4 bg-gray-50">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors"
                  >
                    <Heart
                      size={18}
                      className={isLiked ? "fill-pink-500 text-pink-500" : ""}
                    />
                    <span>{isLiked ? "Liked" : "Like this message"}</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Full Screen Image Modal */}
          <AnimatePresence>
            {isImageModalOpen && capsule.picture && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsImageModalOpen(false)}
                  className="fixed inset-0 bg-black z-50"
                />

                {/* Image Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  onClick={() => setIsImageModalOpen(false)}
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex flex-col items-center max-w-4xl max-h-[90vh]"
                  >
                    {/* Close Button */}
                    <button
                      onClick={() => setIsImageModalOpen(false)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors z-10 shadow-lg"
                    >
                      <X size={24} className="text-gray-600" />
                    </button>

                    {/* Full Image */}
                    <img
                      src={capsule.picture}
                      alt={capsule.title}
                      className="w-full h-auto max-h-[85vh] object-contain rounded-lg shadow-2xl"
                    />

                    {/* Image Info */}
                    <div className="mt-4 text-center text-white">
                      <p className="text-sm font-medium">{capsule.title}</p>
                      <p className="text-xs text-gray-300 mt-1">
                        Click anywhere to close
                      </p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};

export default TimeCapsuleDetailModal;
