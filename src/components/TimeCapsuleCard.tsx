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
  const currentUserCapitalized = currentUser
    ? currentUser.charAt(0).toUpperCase() + currentUser.slice(1)
    : null;
  const isReceived = capsule.createdBy !== currentUserCapitalized;
  const isUnlocked = now >= unlockDate;
  const canRead = !isReceived || isUnlocked;

  return (
    <>
      <div className={`capsule-card ${isReceived ? "received" : "sent"}`}>
        {/* Header with icon and type badge */}
        <div className="card-header">
          <div className="card-icon">
            {isReceived ? (
              <Mail size={24} className="text-pink-500" />
            ) : (
              <Mail size={24} className="text-blue-500" />
            )}
          </div>
          <div className="card-type-badge">
            {isReceived ? "📬 Received" : "📤 Sent"}
          </div>
        </div>

        {/* For locked received capsules: show only lock overlay */}
        {isReceived && !isUnlocked ? (
          <>
            {/* Blurred content area */}
            <div className="card-content blurred">
              <h3 className="card-title">{capsule.title}</h3>
              <div className="card-dates">
                <div className="date-row">
                  <span className="date-label">Sent:</span>
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

            {/* Locked overlay */}
            <div className="card-locked-overlay">
              <Lock size={40} className="text-gray-500" />
              <p className="locked-text">{daysRemaining} days remaining</p>
            </div>

            {/* Footer - no action button for locked */}
            <div className="card-footer">
              <div className="text-center text-sm text-gray-500 py-2 flex-1">
                Unlocks{" "}
                {unlockDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Content area - readable for sent and unlocked received */}
            <div className="card-content">
              <h3 className="card-title">{capsule.title}</h3>

              <div className="card-dates">
                <div className="date-row">
                  <span className="date-label">Sent:</span>
                  <span className="date-value">
                    {isReceived ? capsule.createdBy : "You"} on{" "}
                    {createdDate.toLocaleDateString("en-US", {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {isReceived && isUnlocked && (
                  <div className="date-row">
                    <span className="date-label">Created:</span>
                    <span className="date-value">
                      {createdDate.toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <p className="card-message">{capsule.message}</p>
            </div>

            {/* Footer - with read button */}
            <div className="card-footer">
              <button
                onClick={() => setIsModalOpen(true)}
                className="read-button"
              >
                📖 Read Letter
              </button>
            </div>
          </>
        )}
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
