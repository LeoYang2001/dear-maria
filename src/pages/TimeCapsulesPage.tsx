import React, { useState, useEffect } from "react";
import { Plus, Lock } from "lucide-react";
import type { TimeCapsule } from "../types/common/TimeCapsule";
import TimeCapsuleCard from "../components/TimeCapsuleCard";
import CreateTimeCapsuleModal from "../components/CreateTimeCapsuleModal";
import { mockTimeCapsules } from "../data/mockTimeCapsules";
import { getAllTimeCapsules } from "../apis/timeCapsuleApis";
import "../styles/tabs.css";

const TimeCapsulesPage: React.FC = () => {
  const currentUser = localStorage.getItem("currentUser");
  const currentUserLowercase = currentUser?.toLowerCase() ?? null;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [capsules, setCapsules] = useState<TimeCapsule[]>(mockTimeCapsules);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"received" | "sent">("sent");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch time capsules from backend on mount
  useEffect(() => {
    const fetchTimeCapsules = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getAllTimeCapsules();
        setCapsules(data);
      } catch (err) {
        console.error("Failed to fetch time capsules:", err);
        setError("Failed to load time capsules. Using mock data instead.");
        // Keep mock data as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeCapsules();
  }, []);

  const itemsPerPage = 8; // 4 cols * 2 rows

  // Filter capsules based on tab
  const filteredCapsules = capsules.filter((capsule) => {
    const isReceived = capsule.createdBy.toLowerCase() !== currentUserLowercase;
    return activeTab === "received" ? isReceived : !isReceived;
  });

  const totalPages = Math.ceil(filteredCapsules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCapsules = filteredCapsules.slice(startIndex, endIndex);

  const receivedCount = capsules.filter(
    (c) => c.createdBy.toLowerCase() !== currentUserLowercase
  ).length;
  const sentCount = capsules.filter(
    (c) => c.createdBy.toLowerCase() === currentUserLowercase
  ).length;

  const handleCreateCapsule = (newCapsule: TimeCapsule) => {
    setCapsules([...capsules, newCapsule]);
    setCurrentPage(1);
    setActiveTab("sent");
  };

  return (
    <div className="h-full select-none w-full flex flex-col justify-start items-center pt-8 px-8">
      {/* Header */}
      <div className="flex flex-col justify-center items-center mb-12 w-full">
        <h1 className="text-6xl font-elegant text-gray-900 leading-tight">
          Time Capsules
        </h1>
        <p className="text-2xl text-center text-gray-400 mt-4">
          Letters from the past, sealed with trust, waiting for their moment
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full max-w-2xl mb-6 px-6 py-4 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center pt-40 flex-1">
          <div className="animate-spin">
            <Lock size={48} className="text-gray-400" />
          </div>
          <p className="text-xl text-gray-400 mt-4">
            Loading your time capsules...
          </p>
        </div>
      )}

      {/* Create New Time Capsule Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full max-w-2xl mb-12 px-6 py-4 bg-pink-400 cursor-pointer hover:bg-pink-500 active:scale-95 text-white rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg"
      >
        <Plus size={24} />
        <span>Create New Time Capsule</span>
      </button>

      {/* Tabs - CSS Slider Style */}
      {!isLoading && capsules.length > 0 && (
        <div className="tabs-container">
          <div className="tabs-wrapper">
            {/* Slider Background */}
            <div
              className="tabs-slider"
              style={{
                transform:
                  activeTab === "received"
                    ? "translateX(0)"
                    : "translateX(100%)",
              }}
            />

            {/* Received Tab */}
            <button
              onClick={() => {
                setActiveTab("received");
                setCurrentPage(1);
              }}
              className="tabs-button"
            >
              <span className={activeTab === "received" ? "active" : ""}>
                Received ({receivedCount})
              </span>
            </button>

            {/* Sent Tab */}
            <button
              onClick={() => {
                setActiveTab("sent");
                setCurrentPage(1);
              }}
              className="tabs-button"
            >
              <span className={activeTab === "sent" ? "active" : ""}>
                Sent ({sentCount})
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && currentCapsules.length === 0 && (
        <div className="flex flex-col  items-center  pt-40 flex-1 w-full opacity-0 animate-fade-in">
          <Lock size={64} className="text-gray-300 mb-6" />
          <p className="text-2xl text-gray-500 font-medium">
            {activeTab === "received"
              ? "No received capsules yet"
              : "No sent capsules yet. Create your first one!"}
          </p>
        </div>
      )}

      {/* Time Capsules Grid */}
      {!isLoading && currentCapsules.length > 0 && (
        <div className="w-full h-[60vh] flex flex-col relative  items-center">
          {/* Grid */}
          <div className="w-full grid grid-cols-4 gap-12   px-20 mb-8">
            {currentCapsules.map((capsule) => (
              <TimeCapsuleCard key={capsule.id} capsule={capsule} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center absolute justify-center gap-2  bottom-12">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                        currentPage === page
                          ? "bg-pink-400 text-white"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Time Capsule Modal */}
      <CreateTimeCapsuleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCapsule}
      />
    </div>
  );
};

export default TimeCapsulesPage;
