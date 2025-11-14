import React, { useState } from "react";
import { TypeAnimation } from "react-type-animation";
import { SkipForward } from "lucide-react";
import HeartBeat from "./HeartBeat";

interface GreetingModalProps {
  onClose: () => void;
  onBegin: () => void;
}

const GreetingModal: React.FC<GreetingModalProps> = ({ onClose, onBegin }) => {
  const [skipAnimation, setSkipAnimation] = useState(false);

  const greetingText =
    "I know you have been guessing what is your gift for your 22nd birthday. Well the time has come and I am so excited to share it with you! This is the most special project I have ever created, a space where only belongs to us, I hope we will keep adding more memories here together as we hold our hands experiencing various adventures in our beautiful life.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurry dark background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Greeting Modal */}
      <div className="relative max-w-2xl w-full mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center space-y-8 animate-fade-in">
          {/* Decorative heart emoji */}
          <div className=" flex  justify-center items-center">
            <HeartBeat size={48} />
          </div>

          {/* Main greeting */}
          <div className="space-y-4 relative">
            <h1 className="text-3xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Dear Maria,
            </h1>
            <p className="text-xl text-gray-600 text-left min-h-48">
              {skipAnimation ? (
                <span>{greetingText}</span>
              ) : (
                <TypeAnimation
                  sequence={[greetingText]}
                  wrapper="span"
                  speed={40}
                  style={{ display: "inline" }}
                  cursor={true}
                  repeat={0}
                />
              )}
            </p>
            {/* Skip Button - only show during animation */}
            {!skipAnimation && (
              <button
                onClick={() => setSkipAnimation(true)}
                className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all text-sm font-medium cursor-pointer"
                title="Skip typing animation"
              >
                <span>Skip</span>
                <SkipForward size={16} />
              </button>
            )}
          </div>

          {/* Closing message */}
          <p className="text-lg text-gray-600 italic">
            Made for you, by Leo ❤️
          </p>

          {/* Close button */}
          <button
            onClick={onBegin}
            className="mt-8 px-8 py-3  bg-pink-300   text-white rounded-full font-semibold hover:shadow-lg hover:bg-pink-500 cursor-pointer transition-all duration-200 hover:scale-105"
          >
            Let's Begin ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default GreetingModal;
