import React from "react";

const TravelMapPage: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <h1 className="font-elegant mb-6 text-3xl font-semibold tracking-tight text-pink-bright">
          Travel Map 🗺️
        </h1>
        <div className="text-center py-12">
          <div className="mb-4 text-6xl">🌍</div>
          <p className="text-lg leading-relaxed text-pink-light">
            Explore and plan adventures together
          </p>
        </div>
      </div>
    </div>
  );
};

export default TravelMapPage;
