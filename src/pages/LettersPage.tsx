import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import type { RootState } from "../redux/store";
import { markLetterAsVisited } from "../redux/lettersSlice";
import { letterMockData } from "../data/letterData";

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
