import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import AuthPage from "./pages/AuthPage";
import "./App.css";
import RootLayout from "./pages/RootLayout";
import LetterDetailPage from "./pages/LetterDetailPage";
import { store } from "./redux/store";

function App() {
  return (
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
  );
}

export default App;
