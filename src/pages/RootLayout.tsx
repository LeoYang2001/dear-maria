import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import LettersPage from "./LettersPage";
import ChecklistPage from "./ChecklistPage";
import TimeCapsulesPage from "./TimeCapsulesPage";
import TravelMapPage from "./TravelMapPage";
import NewYearResolutionsPage from "./NewYearResolutionsPage";
import Header from "../components/Header";

type TabType =
  | "letters"
  | "checklist"
  | "timecapsules"
  | "travelmap"
  | "resolutions";

const RootLayout: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const [activeTab, setActiveTab] = useState<TabType>(
    currentUser === "leo" ? "checklist" : "letters"
  );
  const mainRef = useRef<HTMLElement>(null);

  // Always start a newly-opened tab scrolled to the top
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, left: 0 });
  }, [activeTab]);

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
      case "resolutions":
        return <NewYearResolutionsPage />;
      default:
        return <LettersPage />;
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      <Header setActiveTab={setActiveTab} activeTab={activeTab} />

      <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto w-full">
        {renderContent()}
      </main>
    </div>
  );
};

export default RootLayout;
