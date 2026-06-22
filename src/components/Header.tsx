import {
  Footprints,
  ListChecks,
  LogOut,
  Mail,
  PillBottle,
  Sparkles,
} from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import HeartBeat from "./HeartBeat";

type TabType =
  | "letters"
  | "checklist"
  | "timecapsules"
  | "travelmap"
  | "resolutions";

function Header({
  setActiveTab,
  activeTab,
}: {
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  activeTab: TabType;
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState<"maria" | "leo" | null>(null);

  // Get currentUser from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser") as
      | "maria"
      | "leo"
      | null;
    setCurrentUser(savedUser);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const allTabs = [
    {
      id: "letters" as TabType,
      label: "Letters",
      icon: (color: string) => <Mail color={color} size={20} />,
    },
    {
      id: "checklist" as TabType,
      label: "Checklist",
      icon: (color: string) => <ListChecks color={color} size={20} />,
    },
    {
      id: "timecapsules" as TabType,
      label: "Time Capsules",
      icon: (color: string) => <PillBottle color={color} size={20} />,
    },
    {
      id: "travelmap" as TabType,
      label: "Travel Map",
      icon: (color: string) => <Footprints color={color} size={20} />,
    },
    {
      id: "resolutions" as TabType,
      label: "2026 Goals",
      icon: (color: string) => <Sparkles color={color} size={20} />,
    },
  ];

  // Filter out letters tab if user is leo
  const tabs =
    currentUser === "leo"
      ? allTabs.filter((tab) => tab.id !== "letters")
      : allTabs;

  return (
    <nav
      style={{ backgroundColor: "#fff8f7" }}
      className="relative z-40 shadow-sm shrink-0"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <HeartBeat size={24} />
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight whitespace-nowrap">
              Dear Maria
            </h1>
          </div>

          {/* Navigation Tabs - Desktop / Large screens */}
          <div className="hidden lg:flex flex-row gap-1 items-center mx-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-row cursor-pointer transition-all duration-200 items-center gap-2 px-3 xl:px-4 py-2.5 rounded-2xl
                    ${
                      activeTab === tab.id
                        ? "bg-[#feeaeb] hover:bg-[#feeaeb]"
                        : "hover:bg-black/5"
                    }`}
              >
                <span>
                  {tab.icon(`${activeTab === tab.id ? "#e67582" : "#a3a09f"}`)}
                </span>
                <span
                  className="text-sm xl:text-base whitespace-nowrap"
                  style={{
                    color: activeTab === tab.id ? "#e67582" : "#6b7280",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right Section - Desktop */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <span className="border-l-2 pl-3 border-gray-300 text-base text-gray-500 capitalize">
              {currentUser || "Guest"}
            </span>
            <button
              onClick={handleLogout}
              className="flex cursor-pointer hover:opacity-65 transition-all duration-300 items-center px-2 gap-2 text-gray-700"
            >
              <LogOut size={20} />
              <span className="text-base">Logout</span>
            </button>
          </div>

          {/* Right Section - Mobile (slim top bar) */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <span className="text-sm text-gray-500 capitalize">
              {currentUser || "Guest"}
            </span>
            <button
              onClick={handleLogout}
              aria-label="Logout"
              className="p-2 rounded-xl text-gray-600 hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
