import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Add logout logic here
    console.log("User logged out");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-pastel to-white">
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-pink-light/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-pink-bright">
                Dear Maria 💕
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="bg-linear-to-r from-pink-bright to-pink-light hover:from-pink-light hover:to-pink-bright text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Logout ✨
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white/60 backdrop-blur-sm border-2 border-dashed border-pink-light/40 rounded-2xl h-96 flex items-center justify-center shadow-lg">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-pink-bright mb-4">
                Welcome Back! 🌸
              </h2>
              <p className="text-pink-light text-lg">
                You have successfully logged in. This is your cute dashboard! ✨
              </p>
              <div className="mt-6">
                <span className="text-4xl">💖</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
