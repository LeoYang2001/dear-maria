import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import type { TimeCapsule } from "../types/common/TimeCapsule";
import TimeCapsuleDetailModal from "./TimeCapsuleDetailModal";
import "../styles/timeCapsuleCard.css";

interface TimeCapsuleCardProps {
  capsule: TimeCapsule;
}

const TimeCapsuleCard: React.FC<TimeCapsuleCardProps> = ({ capsule }) => {
  //get currentUser from local storage
  const currentUser = localStorage.getItem("currentUser");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const now = new Date();
  const unlockDate = new Date(capsule.unlockDate);
  const daysRemaining = Math.ceil(
    (unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const createdDate = new Date(capsule.createdDate);

  // Determine if this is a received or sent capsule
  const currentUserLowercase = currentUser?.toLowerCase() ?? null;
  const createdByLowercase = capsule.createdBy.toLowerCase();
  const isReceived = createdByLowercase !== currentUserLowercase;
  const isUnlocked = now >= unlockDate;
  const canRead = !isReceived || isUnlocked;

  return (
    <>
      <div
        className={` bg-white border p-6  relative rounded-2xl border-gray-200 shadow-sm hover:border-[#e68d98]  transition-all duration-300 flex flex-col justify-between`}
      >
        {/* this is a blurry mask to cover the content when locked */}
        {isReceived && !isUnlocked && (
          <div
            style={{
              backdropFilter: "blur(3px)",
            }}
            className="absolute w-full h-full z-30 left-0 top-0  bg-white/30 rounded-2xl flex flex-col items-center justify-center"
          >
            <Lock size={40} className="text-gray-400 mb-2" />
            <p className="text-lg font-bold text-gray-600">
              {daysRemaining} days
            </p>
            <p className="text-xs text-gray-500">remaining</p>
          </div>
        )}
        {/* Header with icon and type badge */}
        <div className="card-header">
          <div
            style={{
              backgroundColor: "#fdf1f3",
            }}
            className=" p-2 rounded-xl"
          >
            {isReceived ? (
              <Mail size={24} className="text-pink-500" />
            ) : (
              <Mail size={24} className="text-pink-500" />
            )}
          </div>
        </div>

        <>
          {/* Content area - readable for sent and unlocked received */}
          <div className="card-content">
            <h3 className="card-title">{capsule.title}</h3>

            <div className="card-dates">
              <div className="date-row">
                <span className="date-label">Sent BY:</span>
                <span className="date-value">
                  {capsule.createdBy} on{" "}
                  {createdDate.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="date-row">
                <span className="date-label">Unlocks:</span>
                <span className="date-value">
                  {unlockDate.toLocaleDateString("en-US", {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <p className="card-message">{capsule.message}</p>
          </div>

          {/* Footer - with read button */}
          <div className="card-footer">
            <button
              onClick={() => setIsModalOpen(true)}
              className="read-button"
            >
              Read
            </button>
          </div>
        </>
      </div>

      {/* Detail Modal */}
      {canRead && (
        <TimeCapsuleDetailModal
          isOpen={isModalOpen}
          capsule={capsule}
          onClose={() => setIsModalOpen(false)}
          isReceived={isReceived}
          isUnlocked={isUnlocked}
        />
      )}
    </>
  );
};

export default TimeCapsuleCard;
