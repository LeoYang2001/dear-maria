import React from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface SearchAddButtonProps {
  onAddClick: () => void;
}

const SearchAddButton: React.FC<SearchAddButtonProps> = ({ onAddClick }) => {
  return (
    <motion.div
      animate={{
        width: "56px",
      }}
      transition={{ type: "spring", stiffness: 280, damping: 25 }}
      className="relative h-14"
    >
      {/* Background Glow Effect */}
      <motion.div className="absolute inset-0 bg-pink-bright rounded-full blur-lg" />

      {/* Main Button */}
      <motion.button
        onClick={onAddClick}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-linear-to-br from-pink-bright to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white flex items-center justify-center transition-all shadow-lg hover:shadow-xl cursor-pointer border border-pink-400 border-opacity-50"
      >
        <Plus size={26} strokeWidth={3} />
      </motion.button>
    </motion.div>
  );
};

export default SearchAddButton;
