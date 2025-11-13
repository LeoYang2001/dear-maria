import React from "react";
import HeartBeat from "./HeartBeat";

interface GreetingModalProps {
  onClose: () => void;
  onBegin: () => void;
}

const GreetingModal: React.FC<GreetingModalProps> = ({ onClose, onBegin }) => {
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
          <div className="space-y-4">
            <h1 className="text-3xl font-bold bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Happy Birthday, my girl! 🎂
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              This website was created especially for you. A special place to
              celebrate our beautiful memories together.
            </p>
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
