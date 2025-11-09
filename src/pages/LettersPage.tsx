import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import type { RootState } from "../redux/store";
import { markLetterAsVisited } from "../redux/lettersSlice";

export const letterMockData = [
  {
    id: 1,
    title: "Here's to Us",
    letter: "H",
    content: "This is the content of letter 1.",
  },
  {
    id: 2,
    title: "Always in my Heart",
    letter: "A",
    content: "This is the content of letter 2.",
  },
  {
    id: 3,
    title: "Precious Moments",
    letter: "P",
    content: "This is the content of letter 3.",
  },
  {
    id: 4,
    title: "Pure Joy Forever",
    letter: "P",
    content: "This is the content of letter 4.",
  },
  {
    id: 5,
    title: "You're My Everything",
    letter: "Y",
    content: "This is the content of letter 5.",
  },
  {
    id: 6,
    title: "Beautiful Days Ahead",
    letter: "B",
    content: "This is the content of letter 6.",
  },
  {
    id: 7,
    title: "In My Dreams",
    letter: "I",
    content: "This is the content of letter 7.",
  },
  {
    id: 8,
    title: "Radiant Soul",
    letter: "R",
    content: "This is the content of letter 8.",
  },
  {
    id: 9,
    title: "Time Stands Still",
    letter: "T",
    content: "This is the content of letter 9.",
  },
  {
    id: 10,
    title: "Helping You Shine",
    letter: "H",
    content: "This is the content of letter 10.",
  },
  {
    id: 11,
    title: "Days of Joy",
    letter: "D",
    content: "This is the content of letter 11.",
  },
  {
    id: 12,
    title: "Adventurous Heart",
    letter: "A",
    content: "This is the content of letter 12.",
  },
  {
    id: 13,
    title: "Young and Free",
    letter: "Y",
    content: "This is the content of letter 13.",
  },
];

const LettersPage: React.FC = () => {
  const [lettersInfo] = useState(letterMockData);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const visitedLetterIds = useSelector(
    (state: RootState) => state.letters.visitedLetterIds
  );

  console.log("location.state?.disableAnimation:", location.state);
  // Check if animation should be disabled (when returning from letter detail)
  const disableAnimation = location.state?.disableAnimation === true;

  const handleLetterClick = (
    letterId: number,
    letter: (typeof letterMockData)[0]
  ) => {
    // Mark as visited in Redux
    dispatch(markLetterAsVisited(letterId));

    // Navigate with letter data
    navigate(`/letter/${letterId}`, { state: { letter } });
  };

  return (
    <div className=" w-full h-full flex flex-col justify-start items-center pt-36  ">
      <div className=" w-[80%] h-[30%]  flex flex-row justify-center items-center ">
        {lettersInfo.slice(0, 5).map((letter, index) => (
          <motion.div
            key={letter.id}
            layoutId={`letter-${letter.id}`}
            className={`px-3 py-3 letterDiv cursor-pointer relative ${
              visitedLetterIds.includes(letter.id) ? "selected" : ""
            }`}
            initial={
              !disableAnimation
                ? { opacity: 0, scale: 0.8 }
                : { opacity: 1, scale: 1 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={
              !disableAnimation
                ? {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: index * 0.1,
                  }
                : { type: "spring", stiffness: 300, damping: 30, delay: 0 }
            }
            style={{
              height: 180,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 15px",
            }}
            onClick={() => handleLetterClick(letter.id, letter)}
            whileHover={{ scale: 1.05 }}
          >
            <h2
              style={{
                fontSize: 160,
              }}
            >
              {letter.letter}
            </h2>
            {/* Visited Indicator Dot */}
            {visitedLetterIds.includes(letter.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-3 h-3 bg-pink-bright rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>
      <div className=" w-[85%] h-[30%] flex flex-row justify-center items-center ">
        {lettersInfo.slice(5, 14).map((letter, index) => (
          <motion.div
            key={letter.id}
            layoutId={`letter-${letter.id}`}
            className={`px-3 py-3 letterDiv cursor-pointer relative ${
              visitedLetterIds.includes(letter.id) ? "selected" : ""
            }`}
            initial={
              !disableAnimation
                ? { opacity: 0, scale: 0.8 }
                : { opacity: 1, scale: 1 }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={
              !disableAnimation
                ? {
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    delay: (index + 5) * 0.1,
                  }
                : { type: "spring", stiffness: 300, damping: 30, delay: 0 }
            }
            style={{
              height: 180,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              margin: "0 15px",
            }}
            onClick={() => handleLetterClick(letter.id, letter)}
            whileHover={{ scale: 1.05 }}
          >
            <h2
              style={{
                fontSize: 160,
              }}
            >
              {letter.letter}
            </h2>
            {/* Visited Indicator Dot */}
            {visitedLetterIds.includes(letter.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-3 h-3 bg-pink-bright rounded-full"
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LettersPage;
