import { Heart } from "lucide-react";
import React from "react";

function HeartBeat({ size = 58 }: { size?: number }) {
  return (
    <div className="heart-beat">
      <Heart size={size} opacity={1} color="#e87c87" fill="#e87c87" />
    </div>
  );
}

export default HeartBeat;
