import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import { LoadScript } from "@react-google-maps/api";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import RootLayout from "./pages/RootLayout";
import LetterDetailPage from "./pages/LetterDetailPage";
import { store } from "./redux/store";
import { APIProvider } from "@vis.gl/react-google-maps";

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
      <APIProvider apiKey={apiKey}>
        <Provider store={store}>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/main" element={<RootLayout />} />
                <Route path="/letter/:id" element={<LetterDetailPage />} />
                <Route path="/" element={<Navigate to="/auth" replace />} />
              </Routes>
            </AnimatePresence>
          </Router>
        </Provider>
      </APIProvider>
    </LoadScript>
  );
}

export default App;
