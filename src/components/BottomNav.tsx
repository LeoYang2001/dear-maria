import {
  Footprints,
  ListChecks,
  Mail,
  PillBottle,
  Sparkles,
} from "lucide-react";
import React from "react";

type TabType =
  | "letters"
  | "checklist"
  | "timecapsules"
  | "travelmap"
  | "resolutions";

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  currentUser: "maria" | "leo" | null;
}

const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
}) => {
  const allTabs: {
    id: TabType;
    label: string;
    icon: (color: string) => React.ReactNode;
  }[] = [
    {
      id: "letters",
      label: "Letters",
      icon: (c) => <Mail color={c} size={22} />,
    },
    {
      id: "checklist",
      label: "Checklist",
      icon: (c) => <ListChecks color={c} size={22} />,
    },
    {
      id: "timecapsules",
      label: "Capsules",
      icon: (c) => <PillBottle color={c} size={22} />,
    },
    {
      id: "travelmap",
      label: "Map",
      icon: (c) => <Footprints color={c} size={22} />,
    },
    {
      id: "resolutions",
      label: "Goals",
      icon: (c) => <Sparkles color={c} size={22} />,
    },
  ];

  const tabs =
    currentUser === "leo"
      ? allTabs.filter((tab) => tab.id !== "letters")
      : allTabs;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-black/5 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] pb-safe"
      style={{ backgroundColor: "rgba(255, 248, 247, 0.95)" }}
    >
      <div className="flex items-stretch justify-around px-1 pt-1.5 pb-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-2xl transition-colors active:scale-95"
            >
              <span
                className={`flex items-center justify-center h-9 w-12 rounded-2xl transition-all duration-200 ${
                  active ? "bg-[#feeaeb]" : "bg-transparent"
                }`}
              >
                {tab.icon(active ? "#e67582" : "#a3a09f")}
              </span>
              <span
                className="text-[11px] font-medium leading-none"
                style={{ color: active ? "#e67582" : "#9ca3af" }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
