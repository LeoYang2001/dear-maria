import React, { useState } from "react";
import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { MapPin, X, Upload, Trash2, Eye, Loader } from "lucide-react";
import { uploadPinImage } from "../storage";
import { updatePinImage } from "../apis/travelMapApis";

export type PinType = "wishlist" | "visited";

export interface PlaceMarkerProps {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  type: PinType;
  isSelected: boolean;
  onSelect: () => void;
  onClose: () => void;
  onRemove: () => void;
  pictureURL?: string; // Optional picture URL
  onViewImage?: (imageURL: string, name: string, description: string) => void; // Callback to view image
}

const PlaceMarker: React.FC<PlaceMarkerProps> = ({
  id,
  lat,
  lng,
  name,
  description,
  type,
  isSelected,
  onSelect,
  onClose,
  pictureURL,
  onViewImage,
}) => {
  const [localImageURL, setLocalImageURL] = useState<string | undefined>(
    pictureURL
  );
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoadingImage(true);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setLocalImageURL(result);
      };
      reader.readAsDataURL(file);

      // Upload to storage and update Firestore
      const imgUrl = await uploadPinImage(file);
      await updatePinImage(id, imgUrl);
    } catch (error) {
      console.error("Error uploading pin image:", error);
      // Revert preview on error
      setLocalImageURL(pictureURL);
    } finally {
      setIsLoadingImage(false);
    }
  };

  const handleDeleteImage = async () => {
    setIsLoadingImage(true);
    try {
      await updatePinImage(id, "");
    } catch (error) {
      console.error("Error deleting pin image:", error);
    } finally {
      setIsLoadingImage(false);
      setLocalImageURL(undefined);
    }
  };

  // Color scheme for different pin types
  const markerColors = {
    wishlist: "#FF6B6B", // Red for wishlist
    visited: "#4ECDC4", // Teal for visited
  };

  const markerColor = markerColors[type];

  // Custom marker icon with colored MapPin

  const MarkerIcon = () => (
    <div className="flex items-center justify-center cursor-pointer hover:scale-110 transition-transform drop-shadow-lg">
      <MapPin size={40} fill={markerColor} color="white" strokeWidth={1.5} />
    </div>
  );

  const typeLabel = type === "wishlist" ? "Want to Visit" : "Been There";
  const typeBgColor =
    type === "wishlist"
      ? "bg-red-100 text-red-900"
      : "bg-teal-100 text-teal-900";

  return (
    <AdvancedMarker key={id} position={{ lat, lng }} onClick={onSelect}>
      <MarkerIcon />

      {isSelected && (
        <InfoWindow onCloseClick={onClose} position={{ lat, lng }}>
          <div className="p-3 min-w-max">
            {/* Image Preview Section */}
            {localImageURL ? (
              <div className="relative  mb-3">
                <img
                  src={localImageURL}
                  alt={name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {/* Loading Overlay */}
                {isLoadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <Loader size={24} className="text-white animate-spin" />
                  </div>
                )}
                {/* Image Action Buttons */}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors rounded-lg flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    onClick={() =>
                      onViewImage?.(localImageURL!, name, description)
                    }
                    disabled={isLoadingImage}
                    className="p-2 cursor-pointer bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="View image"
                  >
                    <Eye size={16} />
                  </button>
                  <label className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <Upload size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isLoadingImage}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => handleDeleteImage()}
                    disabled={isLoadingImage}
                    className="p-2 cursor-pointer bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Section when no image */
              <div className="mb-3 border-2 h-48  border-dashed border-gray-300 rounded-lg  text-center relative">
                {isLoadingImage && (
                  <div className="absolute inset-0 bg-black/10 rounded-lg flex items-center justify-center">
                    <Loader size={24} className="text-gray-600 animate-spin" />
                  </div>
                )}
                <label className="cursor-pointer hover:bg-gray-200 transition-all duration-200  h-full justify-center flex flex-col items-center gap-2 disabled:opacity-50">
                  {isLoadingImage ? (
                    <Loader size={24} className="text-gray-400 animate-spin" />
                  ) : (
                    <Upload size={24} className="text-gray-400" />
                  )}
                  <span className="text-xs font-medium text-gray-600">
                    {isLoadingImage ? "Uploading..." : "Upload Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isLoadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            )}
            <h3 className="font-bold text-gray-900 text-sm">{name}</h3>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
            <div
              className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-2 ${typeBgColor}`}
            >
              {typeLabel}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="mt-2 opacity-0 ml-2 inline-flex items-center gap-1 px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
            >
              <X size={14} />
              Remove
            </button>
          </div>
        </InfoWindow>
      )}
    </AdvancedMarker>
  );
};

export default PlaceMarker;
