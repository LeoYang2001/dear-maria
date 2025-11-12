import React, { useState } from "react";
import { LocateFixed, ChevronUp, ChevronDown } from "lucide-react";
import { type PinType } from "./PlaceMarker";
import SavedPlaceItem from "./SavedPlaceItem";

interface SavedPlace {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  type: PinType;
}

interface SavedPlacesSidebarProps {
  pins: SavedPlace[];
  selectedPin: string | null;
  onPinSelect: (lat: number, lng: number, id: string) => void;
  onPinRemove: (id: string) => void;
  onFitAllPins: () => void;
}

const SavedPlacesSidebar: React.FC<SavedPlacesSidebarProps> = ({
  pins,
  selectedPin,
  onPinSelect,
  onPinRemove,
  onFitAllPins,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (pins.length === 0) return null;

  return (
    <div
      className={`absolute top-8 right-8 bg-white rounded-lg shadow-lg transition-all duration-300 ${
        isExpanded ? "max-h-[80%] p-4 max-w-xs" : "p-3 max-w-fit"
      } flex flex-col`}
    >
      <div className="flex items-center justify-between mb-3">
        {isExpanded && (
          <h3 className="font-semibold text-gray-900">
            Saved Places ({pins.length})
          </h3>
        )}
        <div className="flex items-center gap-2 ml-auto">
          {/* ✨ Fit All Pins Button */}
          {isExpanded && (
            <button
              onClick={onFitAllPins}
              title="Fit all pins in view"
              className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer duration-300 rounded-lg transition-colors"
            >
              <LocateFixed color="#3B82F6" size={18} />
            </button>
          )}
          {/* ✨ Toggle Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 cursor-pointer duration-300 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp color="#4B5563" size={18} />
            ) : (
              <ChevronDown color="#4B5563" size={18} />
            )}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="space-y-2 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-500">
          {pins.map((pin) => (
            <SavedPlaceItem
              key={pin.id}
              id={pin.id}
              name={pin.name}
              description={pin.description}
              type={pin.type}
              lat={pin.lat}
              lng={pin.lng}
              isSelected={selectedPin === pin.id}
              onSelect={onPinSelect}
              onRemove={onPinRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPlacesSidebar;
