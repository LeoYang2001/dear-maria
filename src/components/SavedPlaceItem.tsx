import React, { useState } from "react";
import { type PinType } from "./PlaceMarker";
import { togglePinStatus } from "../apis/travelMapApis";

interface SavedPlaceItemProps {
  id: string;
  name: string;
  description: string;
  type: PinType;
  isSelected: boolean;
  onSelect: (lat: number, lng: number, id: string) => void;
  onRemove: (id: string) => void;
  lat: number;
  lng: number;
}

const SavedPlaceItem: React.FC<SavedPlaceItemProps> = ({
  id,
  name,
  description,
  type,
  isSelected,
  onSelect,
  onRemove,
  lat,
  lng,
}) => {
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsTogglingStatus(true);
      const newType = type === "wishlist" ? "visited" : "wishlist";
      await togglePinStatus(id, newType);
    } catch (error) {
      console.error("Error toggling pin status:", error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  const isPinWishlist = type === "wishlist";
  const pinBgColor = isPinWishlist
    ? "bg-red-50 hover:bg-red-100 border-l-red-500"
    : "bg-teal-50 hover:bg-teal-100 border-l-teal-500";
  const selectedBg = isSelected
    ? `${pinBgColor}`
    : "bg-gray-50 hover:bg-gray-100";

  return (
    <div
      style={{
        minWidth: "240px",
      }}
      className={`p-2 rounded cursor-pointer transition-colors border-l-4 ${
        isSelected ? pinBgColor : selectedBg
      }`}
      onClick={() => onSelect(lat, lng, id)}
    >
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm text-gray-900 flex-1">{name}</p>
        <button
          onClick={handleToggleStatus}
          disabled={isTogglingStatus}
          className={`text-xs px-2 py-1 rounded-full font-semibold transition-all ${
            isPinWishlist
              ? "bg-red-200 text-red-800 hover:bg-red-300"
              : "bg-teal-200 text-teal-800 hover:bg-teal-300"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
          title={`Click to mark as ${isPinWishlist ? "visited" : "wishlist"}`}
        >
          {isPinWishlist ? "Wish" : "Been"}
        </button>
      </div>
      <p className="text-xs text-gray-500 truncate mt-1">{description}</p>
      <div className="flex gap-1 mt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(id);
          }}
          className="flex-1 text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default SavedPlaceItem;
