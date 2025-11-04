import React from "react";

const TimeCapsulesPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <h1 className="font-elegant mb-6 text-3xl font-semibold tracking-tight text-pink-bright">
          Time Capsules ⏰
        </h1>
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">🕰️</div>
          <p className="text-lg leading-relaxed text-pink-light">
            Preserve memories for the future
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeCapsulesPage;
