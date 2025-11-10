import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import bowingRabbitGirl from "../assets/bowing-rabbit-girl.gif";
import bowingRabbitGirlPng from "../assets/bowing-rabbit-girl.png";
import bowingRabbitBoy from "../assets/bowing-rabbit-boy.gif";
import bowingRabbitBoyPng from "../assets/bowing-rabbit-boy.png";
import HeartBeat from "../components/HeartBeat";
import { setCurrentUser } from "../redux/authSlice";

const AuthPage: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<
    "maria" | "leo" | null
  >(null);
  const [password, setPassword] = useState("");
  const [hoveredCharacter, setHoveredCharacter] = useState<
    "maria" | "leo" | null
  >(null);
  const mariaImageRef = useRef<HTMLImageElement>(null);
  const leoImageRef = useRef<HTMLImageElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const mariaImg = mariaImageRef.current;
    const leoImg = leoImageRef.current;

    if (mariaImg) {
      mariaImg.style.opacity = hoveredCharacter === "maria" ? "1" : "1";
    }
    if (leoImg) {
      leoImg.style.opacity = hoveredCharacter === "leo" ? "1" : "1";
    }
  }, [hoveredCharacter]);

  // Check if user is already logged in via localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser") as
      | "maria"
      | "leo"
      | null;
    if (savedUser) {
      dispatch(setCurrentUser(savedUser));
      navigate("/main");
    }
  }, [dispatch, navigate]);

  const handleMouseEnter = (characterId: "maria" | "leo") => {
    setHoveredCharacter(characterId);
  };

  const handleMouseLeave = () => {
    setHoveredCharacter(null);
  };

  const characters = [
    {
      id: "maria" as const,
      name: "Maria",
      imagePng: bowingRabbitGirlPng,
      imageGif: bowingRabbitGirl,
      color: "from-pink-100 to-pink-50",
    },
    {
      id: "leo" as const,
      name: "Leo",
      imagePng: bowingRabbitBoyPng,
      imageGif: bowingRabbitBoy,
      color: "from-blue-100 to-blue-50",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharacter) return;

    // TODO: Add authentication logic here
    console.log("Auth attempt:", { character: selectedCharacter, password });

    // Set current user in Redux and localStorage
    dispatch(setCurrentUser(selectedCharacter));
    localStorage.setItem("currentUser", selectedCharacter);
    navigate("/main");
  };

  return (
    <div
      style={{
        backgroundColor: "#fff8f7",
      }}
      className="flex h-screen w-screen items-center justify-center px-4"
    >
      <div className="w-[40%] bg-white border border-gray-50 rounded-3xl p-12 shadow-lg">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <HeartBeat />
          <h1 className="font-elegant mb-3 text-3xl font-bold tracking-tight text-gray-900">
            Every little moment we share lives here.
          </h1>
          <p className="text-lg leading-relaxed text-gray-400">
            Choose your character and enter your password
          </p>
        </div>

        {/* Character Selection */}
        <div className="mb-8 grid grid-cols-2 gap-6">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => setSelectedCharacter(character.id)}
              onMouseEnter={() => handleMouseEnter(character.id)}
              onMouseLeave={() => handleMouseLeave()}
              className={`character-button group cursor-pointer rounded-2xl p-8 transition-all duration-300 border-2 ${
                selectedCharacter === character.id
                  ? "selected border-pink-bright bg-pink-light/10 shadow-lg"
                  : "border-gray-200 hover:border-pink-light"
              }`}
            >
              <div className="character-gif mb-12 flex justify-center">
                <img
                  ref={character.id === "maria" ? mariaImageRef : leoImageRef}
                  src={
                    hoveredCharacter === character.id
                      ? character.imageGif
                      : character.imagePng
                  }
                  alt={character.name}
                  className="h-32 w-32 object-contain"
                  style={{
                    animationIterationCount:
                      character.id === "maria" ? "1" : "infinite",
                  }}
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {character.name}
              </h2>
            </button>
          ))}
        </div>

        {/* Password Input */}
        <div
          style={{
            opacity: selectedCharacter ? "1" : "0.2",
          }}
          className="mb-8 space-y-3 animate-in fade-in duration-300"
        >
          <input
            disabled={!selectedCharacter}
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-base text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-pink-bright focus:outline-none focus:ring-2 focus:ring-pink-bright/20"
          />
        </div>

        {/* Submit Button */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={!selectedCharacter || !password}
            style={{
              background:
                !selectedCharacter || !password ? "#f9d5d7" : " #ff7e85",
            }}
            className={`w-full rounded-full py-4 text-base cursor-pointer font-semibold transition-all duration-300
            }`}
          >
            Enter Our World
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
