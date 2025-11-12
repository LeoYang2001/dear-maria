import { Footprints, ListChecks, LogOut, Mail, PillBottle } from "lucide-react";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import HeartBeat from "./HeartBeat";

type TabType = "letters" | "checklist" | "timecapsules" | "travelmap";

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
      icon: (color: string) => <Mail color={color} />,
    },
    {
      id: "checklist" as TabType,
      label: "Checklist",
      icon: (color: string) => <ListChecks color={color} />,
    },
    {
      id: "timecapsules" as TabType,
      label: "Time Capsules",
      icon: (color: string) => <PillBottle color={color} />,
    },
    {
      id: "travelmap" as TabType,
      label: "Travel Map",
      icon: (color: string) => <Footprints color={color} />,
    },
  ];

  // Filter out letters tab if user is leo
  const tabs =
    currentUser === "leo"
      ? allTabs.filter((tab) => tab.id !== "letters")
      : allTabs;
  return (
    <nav
      style={{
        backgroundColor: "#fff8f7",
      }}
      className=" shadow-sm"
    >
      <div className="  mx-auto px-6  lg:px-8">
        <div className="flex justify-start items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 shrink-0">
            <HeartBeat size={28} />
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              Dear Maria
            </h1>
          </div>

          {/* Navigation Tabs - Desktop */}
          <div className="   ml-auto mr-20 flex flex-row gap-2  items-center space-x-">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`  flex flex-row cursor-pointer transition-all duration-200 items-center gap-3 px-4 py-3 rounded-2xl
                    ${
                      activeTab === tab.id
                        ? "bg-[#feeaeb] hover:bg-[#feeaeb]"
                        : "hover:bg-[#ddd]"
                    }`}
              >
                <span className="text-base">
                  {tab.icon(`${activeTab === tab.id ? "#e67582" : "#a3a09f"}`)}
                </span>
                <span
                  style={{
                    fontSize: 18,
                    color: activeTab === tab.id ? "#e67582" : "#6b7280",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            <span className="border-l-2 pl-3 border-gray-300 sm:inline text-lg text-gray-500 capitalize">
              {currentUser || "Guest"}
            </span>
            <button
              onClick={handleLogout}
              className="flex  cursor-pointer hover:opacity-65 transition-all duration-300 items-center  px-3 gap-2"
            >
              <LogOut />
              <span className=" text-lg">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}>
                <span>{tab.icon("#e67582")}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
