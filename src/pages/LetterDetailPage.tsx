import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface LetterData {
  id: number;
  title: string;
  letter: string;
  content: string;
}

const LetterDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const letter = location.state?.letter as LetterData | undefined;

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
      className="w-full h-screen   bg-linear-to-br from-pink-50 to-white p-8 flex flex-col"
    >
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-pink-bright hover:text-pink-600 transition-colors mb-8 w-fit"
      >
        <ArrowLeft size={30} />
        <span className=" text-xl cursor-pointer">Back</span>
      </button>

      {/* Letter Container */}
      <div className="flex-1 flex flex-col items-center justify-start max-w-4xl mx-auto w-full">
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

        {/* Letter Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-lg w-full mt-12"
        >
          <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
            {letter.content}
          </p>
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
