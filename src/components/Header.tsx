import {
  Footprints,
  ListChecks,
  LogOut,
  Mail,
  PillBottle,
  Sparkles,
  Menu,
  X,
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
  const [menuOpen, setMenuOpen] = useState(false);

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

  const handleSelectTab = (id: TabType) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <nav
      style={{ backgroundColor: "#fff8f7" }}
      className="relative z-50 shadow-sm shrink-0"
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

          {/* Mobile menu icon */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile expandable navigation menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="lg:hidden fixed inset-0 top-14 sm:top-16 z-40 bg-black/20"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Menu panel */}
          <div className="lg:hidden absolute top-full left-0 right-0 z-50 bg-[#fff8f7] border-t border-black/5 shadow-xl rounded-b-3xl px-3 py-3 flex flex-col gap-1 animate-fade-in">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectTab(tab.id)}
                  className={`flex flex-row cursor-pointer transition-all duration-200 items-center gap-3 px-4 py-3 rounded-2xl w-full text-left active:scale-[0.98]
                    ${active ? "bg-[#feeaeb]" : "hover:bg-black/5"}`}
                >
                  <span className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/70">
                    {tab.icon(active ? "#e67582" : "#a3a09f")}
                  </span>
                  <span
                    className="text-base font-medium"
                    style={{ color: active ? "#e67582" : "#4b5563" }}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}

            {/* User + logout */}
            <div className="flex items-center justify-between mt-2 pt-3 px-2 border-t border-black/5">
              <span className="text-sm text-gray-500 capitalize">
                Signed in as {currentUser || "Guest"}
              </span>
              <button
                onClick={handleLogout}
                className="flex cursor-pointer hover:opacity-65 transition-all duration-300 items-center gap-2 text-gray-700 px-2 py-1"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}

export default Header;
