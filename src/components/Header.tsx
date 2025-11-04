import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LettersPage from "../pages/LettersPage";
import ChecklistPage from "../pages/ChecklistPage";
import TimeCapsulesPage from "../pages/TimeCapsulesPage";
import TravelMapPage from "../pages/TravelMapPage";

type TabType = "letters" | "checklist" | "timecapsules" | "travelmap";

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("letters");
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add logout logic here
    console.log("User logged out");
    navigate("/auth");
  };

  const tabs = [
    { id: "letters" as TabType, label: "Letters", icon: "💌" },
    { id: "checklist" as TabType, label: "Checklist", icon: "✅" },
    { id: "timecapsules" as TabType, label: "Time Capsules", icon: "⏰" },
    { id: "travelmap" as TabType, label: "Travel Map", icon: "🗺️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "letters":
        return <LettersPage />;
      case "checklist":
        return <ChecklistPage />;
      case "timecapsules":
        return <TimeCapsulesPage />;
      case "travelmap":
        return <TravelMapPage />;
      default:
        return <LettersPage />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-pastel to-white">
      <nav className="bg-white/95 backdrop-blur-md shadow-md border-b border-pink-light/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="text-2xl">❤️</span>
              <h1 className="text-base font-semibold text-gray-900 tracking-tight">
                For Maria & Leo
              </h1>
            </div>

            {/* Navigation Tabs - Desktop */}
            <div className=" md:flex items-center space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1.5 ${
                    activeTab === tab.id
                      ? "text-pink-bright bg-pink-light/20 border border-pink-bright/30"
                      : "text-gray-600 hover:text-pink-light"
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline text-sm text-gray-500">
                Maria
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-pink-bright font-medium transition-colors duration-200 text-sm"
              >
                <span>Logout</span>
                <span>➡️</span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden pb-4">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center space-x-1 whitespace-nowrap shrink-0 ${
                    activeTab === tab.id
                      ? "text-pink-bright bg-pink-light/20 border border-pink-bright/30"
                      : "text-gray-600 hover:text-pink-light"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Header;
