import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, SkipForward } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
import letterPic1 from "../assets/letter_pics/letter_1.png";
import letterPic2 from "../assets/letter_pics/letter_2.png";

interface LetterData {
  id: number;
  title: string;
  letter: string;
  content: string;
  pic_url?: string;
}

const letterPicMap: { [key: string]: string } = {
  "letter_1.png": letterPic1,
  "letter_2.png": letterPic2,
  // Add other letter pictures here as needed
};

const LetterDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const letter = location.state?.letter as LetterData | undefined;
  const [skipAnimation, setSkipAnimation] = useState(false);

  if (!letter) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Letter not found</p>
      </div>
    );
  }

  return (
    <motion.div
      key={`letter-detail-${letter.id}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-screen    bg-linear-to-br from-pink-50 to-white p-8 flex flex-col "
    >
      {/* Back Button */}
      <button
        onClick={() => navigate("/main", { state: { disableAnimation: true } })}
        className="flex items-center space-x-2 text-pink-bright hover:text-pink-600 transition-colors mb-8 w-fit"
      >
        <ArrowLeft size={30} />
        <span className=" text-xl cursor-pointer">Back</span>
      </button>

      {/* Letter Container */}
      <div className="flex-1  flex flex-col items-center justify-start max-w-4xl mx-auto w-full">
        {/* Letter Initial and Title - Same Row */}
        <div className="w-full flex items-baseline justify-center gap-4 mb-12">
          {/* Letter Initial - Shared Element */}
          <motion.div
            layoutId={`letter-${letter.id}`}
            transition={{ type: "spring", stiffness: 200, damping: 30 }}
          >
            <div className="text-9xl font-bold text-pink-bright leading-tight">
              {letter.letter}
            </div>
          </motion.div>

          {/* Letter Title */}
          <motion.h1
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl font-elegant font-bold text-gray-900 flex-1 leading-tight"
          >
            {letter.title.slice(1, letter.title.length)}
          </motion.h1>
        </div>

        {/* Letter Content - Two Column Card */}
        <motion.div
          style={{
            width: "70vw",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-3xl  shadow-2xl overflow-hidden  mt-6"
        >
          <div className="flex w-full h-[60vh] ">
            {/* Left Side - Letter Picture */}
            <div className="w-1/2 bg-linear-to-br from-pink-50 to-pink-100 flex items-center justify-center p-8">
              {letter.pic_url ? (
                <motion.img
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  src={letterPicMap[letter.pic_url]}
                  alt={letter.title}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="text-9xl font-bold text-pink-bright opacity-20">
                      {letter.letter}
                    </div>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Right Side - Letter Content */}
            <div className="w-2/3 p-4  flex flex-col relative overflow-y-auto ">
              <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap flex-1">
                {skipAnimation ? (
                  <p>{letter.content}</p>
                ) : (
                  <TypeAnimation
                    sequence={[letter.content]}
                    wrapper="span"
                    speed={30}
                    style={{ display: "block" }}
                    cursor={true}
                    repeat={0}
                  />
                )}
              </div>

              {/* Skip Button - only show during animation */}
              {!skipAnimation && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  onClick={() => setSkipAnimation(true)}
                  className=" absolute top-2 right-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all text-sm font-medium cursor-pointer"
                  title="Skip typing animation"
                >
                  <span>Skip</span>
                  <SkipForward size={16} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Letter Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 text-center text-gray-400 text-sm"
        >
          <p>Letter #{letter.id}</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LetterDetailPage;
