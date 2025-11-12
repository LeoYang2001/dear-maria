import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Provider, useSelector } from "react-redux";
import { LoadScript } from "@react-google-maps/api";
import React, { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import RootLayout from "./pages/RootLayout";
import LetterDetailPage from "./pages/LetterDetailPage";
import MusicPlayer from "./components/MusicPlayer";
import { store, type RootState } from "./redux/store";
import { APIProvider } from "@vis.gl/react-google-maps";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

function AppContent() {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  // Trigger auto-play on first user login and check if user exists
  useEffect(() => {
    console.log("currentUser in AppContent useEffect:", currentUser);
    if (currentUser && !shouldAutoPlay) {
      setShouldAutoPlay(true);
    } else if (!currentUser) {
      setShouldAutoPlay(false);
    }
  }, [currentUser, shouldAutoPlay]);

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/main" element={<RootLayout />} />
          <Route path="/letter/:id" element={<LetterDetailPage />} />
          <Route path="/" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AnimatePresence>
      {/* Global Music Player - shows when user is logged in */}
      <MusicPlayer isVisible={!!currentUser} autoPlay={shouldAutoPlay} />
    </>
  );
}

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <APIProvider apiKey={apiKey}>
        <Provider store={store}>
          <Router>
            <AppContent />
          </Router>
        </Provider>
      </APIProvider>
    </LoadScript>
  );
}

export default App;
