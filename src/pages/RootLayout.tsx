import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import LettersPage from "./LettersPage";
import ChecklistPage from "./ChecklistPage";
import TimeCapsulesPage from "./TimeCapsulesPage";
import TravelMapPage from "./TravelMapPage";
import Header from "../components/Header";

type TabType = "letters" | "checklist" | "timecapsules" | "travelmap";

const RootLayout: React.FC = () => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const [activeTab, setActiveTab] = useState<TabType>(
    currentUser === "leo" ? "checklist" : "letters"
  );

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
    <div className=" w-screen h-screen  flex  flex-col ">
      <Header setActiveTab={setActiveTab} activeTab={activeTab} />

      <main className="flex-1  w-full ">{renderContent()}</main>
    </div>
  );
};

export default RootLayout;
