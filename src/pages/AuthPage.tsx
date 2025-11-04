import { Heart } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bowingRabbitGirl from "../assets/bowing-rabbit-girl.gif";
import bowingRabbitGirlPng from "../assets/bowing-rabbit-girl.png";
import bowingRabbitBoy from "../assets/bowing-rabbit-boy.gif";
import bowingRabbitBoyPng from "../assets/bowing-rabbit-boy.png";

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

    // For now, just navigate to main page after any form submission
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
          <div className="heart-beat">
            <Heart size={58} opacity={1} color="#e87c87" fill="#e87c87" />
          </div>
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
              className={`group rounded-2xl p-8 transition-all duration-300 border-2 ${
                selectedCharacter === character.id
                  ? "border-pink-bright bg-pink-light/10 shadow-lg"
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
        <div className="mb-8 space-y-3 animate-in fade-in duration-300">
          <label className="block text-sm font-medium text-gray-700">
            Enter your password
          </label>
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
            className={`w-full rounded-full py-4 text-base font-semibold transition-all duration-300 ${
              selectedCharacter && password
                ? "bg-pink-light text-white hover:bg-pink-bright shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
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
