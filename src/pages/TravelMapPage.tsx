import { Map } from "@vis.gl/react-google-maps";
import React, { useState, useEffect } from "react";
import { Search, X, Loader } from "lucide-react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import PlaceMarker, { type PinType } from "../components/PlaceMarker";
import SavedPlacesSidebar from "../components/SavedPlacesSidebar";
import { addPin, subscribeToAllPins, deletePin } from "../apis/travelMapApis";

interface PlacePin {
  id: string;
  lat: number;
  lng: number;
  name: string;
  description: string;
  type: PinType;
  pictureURL?: string;
}

const TravelMapPage: React.FC = () => {
  const [mapCenter, setMapCenter] = useState({ lat: 22.54992, lng: 0 });
  const [mapZoom, setMapZoom] = useState(3);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pins, setPins] = useState<PlacePin[]>([]);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [hoveredSuggestion, setHoveredSuggestion] = useState<string | null>(
    null
  );
  // ✨ NEW STATE: Used to force the map to re-render with new defaults
  const [mapUpdateKey, setMapUpdateKey] = useState(0);
  // ✨ Image Modal State
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageURL: string;
    name: string;
    description: string;
  }>({ isOpen: false, imageURL: "", name: "", description: "" });
  // ✨ Loading State for pin addition
  const [isLoading, setIsLoading] = useState(false);

  // ✨ Real-time listener for pins from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToAllPins((fetchedPins) => {
      setPins(fetchedPins as PlacePin[]);
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Disable browser zoom on this page
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable Ctrl/Cmd +/- and Ctrl/Cmd 0
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "0" || e.key === "=")
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      // Restrict to cities
      types: ["geocode"],
    },
    debounce: 300,
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleSelect = async (address: string, type: PinType) => {
    setValue(address, false);
    setShowSuggestions(false);
    clearSuggestions();
    setValue("");
    setHoveredSuggestion(null);
    setIsLoading(true);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setMapCenter({ lat, lng });
      setMapZoom(12);

      // ✨ Force map to re-render with the new center/zoom
      setMapUpdateKey((prevKey) => prevKey + 1);

      // Add pin directly without modal
      const newPin: PlacePin = {
        id: `${lat}-${lng}-${Date.now()}`,
        lat,
        lng,
        name: address.split(",")[0],
        description: address,
        type,
      };
      await addPin(newPin);
      console.log("newPin:", newPin);
      // setPins([...pins, newPin]);
      // setSelectedPin(newPin.id);
    } catch (error) {
      console.error("Error fetching location details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePin = async (pinId: string) => {
    //pop up confirmation window
    const confirmed = window.confirm(
      "Are you sure you want to delete this pin?"
    );
    if (!confirmed) return;

    try {
      await deletePin(pinId);
      setPins(pins.filter((pin) => pin.id !== pinId));
      if (selectedPin === pinId) {
        setSelectedPin(null);
      }
    } catch (error) {
      console.error("Error removing pin:", error);
    }
  };

  // ✨ NEW: Smooth animation function using state updates
  const animateMapTo = (
    newCenter: { lat: number; lng: number },
    newZoom: number
  ) => {
    setMapCenter(newCenter);
    setMapZoom(newZoom);
    setMapUpdateKey((prevKey) => prevKey + 1);
  };

  // ✨ NEW: Adjust map to selected pin with smooth animation
  const handlePinSelect = (lat: number, lng: number, id: string) => {
    animateMapTo({ lat, lng }, 13);
    setSelectedPin(id);
  };

  // ✨ NEW: Calculate bounding box and fit all pins in view
  const handleFitAllPins = () => {
    if (pins.length === 0) return;

    if (pins.length === 1) {
      // If only one pin, center on it with zoom level 13
      animateMapTo({ lat: pins[0].lat, lng: pins[0].lng }, 13);
    } else {
      // Calculate bounds for multiple pins
      let minLat = pins[0].lat;
      let maxLat = pins[0].lat;
      let minLng = pins[0].lng;
      let maxLng = pins[0].lng;

      pins.forEach((pin) => {
        minLat = Math.min(minLat, pin.lat);
        maxLat = Math.max(maxLat, pin.lat);
        minLng = Math.min(minLng, pin.lng);
        maxLng = Math.max(maxLng, pin.lng);
      });

      // Add padding (10% margin) around the bounding box to ensure all pins are visible
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const latPadding = latDiff * 0.1;
      const lngPadding = lngDiff * 0.1;

      const paddedMinLat = minLat - latPadding;
      const paddedMaxLat = maxLat + latPadding;
      const paddedMinLng = minLng - lngPadding;
      const paddedMaxLng = maxLng + lngPadding;

      // Calculate center and zoom level based on padded bounds
      const centerLat = (paddedMinLat + paddedMaxLat) / 2;
      const centerLng = (paddedMinLng + paddedMaxLng) / 2;

      // Calculate zoom level based on the span of padded coordinates
      const paddedLatDiff = paddedMaxLat - paddedMinLat;
      const paddedLngDiff = paddedMaxLng - paddedMinLng;
      const maxPaddedDiff = Math.max(paddedLatDiff, paddedLngDiff);

      // Use a more granular zoom calculation for optimal zoom level
      let zoomLevel = 13;
      if (maxPaddedDiff > 20) zoomLevel = 3;
      else if (maxPaddedDiff > 10) zoomLevel = 4;
      else if (maxPaddedDiff > 5) zoomLevel = 5;
      else if (maxPaddedDiff > 2.5) zoomLevel = 6;
      else if (maxPaddedDiff > 1.5) zoomLevel = 7;
      else if (maxPaddedDiff > 0.75) zoomLevel = 8;
      else if (maxPaddedDiff > 0.4) zoomLevel = 9;
      else if (maxPaddedDiff > 0.2) zoomLevel = 10;
      else if (maxPaddedDiff > 0.1) zoomLevel = 11;
      else if (maxPaddedDiff > 0.05) zoomLevel = 12;
      else zoomLevel = 13;

      animateMapTo({ lat: centerLat, lng: centerLng }, zoomLevel);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: To use form submission for adding pins, select a type via the suggestions dropdown
    // For now, we just prevent submission without a type
    if (value.trim()) {
      // Don't submit without user selecting a type from suggestions
      console.log(
        "Please select a location and choose a type from the suggestions"
      );
    }
  };

  return (
    <div className="h-full select-none  w-full  pb-12 flex flex-col justify-start items-center pt-8 px-8">
      {/* Header */}
      <div className="flex flex-col justify-center items-center mb-8 w-full">
        <h1 className="text-3xl font-elegant text-gray-900 flex-1 leading-tight">
          Our Travel Map
        </h1>
        <p className="text-lg text-center text-gray-400 mt-4">
          Every place we've explored together
        </p>
      </div>

      {/* Search Box */}
      <form className="w-full max-w-2xl mb-4 relative" onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={handleInput}
            onFocus={() => value.trim() && setShowSuggestions(true)}
            disabled={!ready || isLoading}
            placeholder="Search for a city..."
            className="w-full px-4 py-2 pl-12 text-md border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {isLoading ? (
            <Loader className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
          ) : (
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && status === "OK" && data.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
            {data.map(({ place_id, description, structured_formatting }) => (
              <div
                key={place_id}
                className="relative w-full border-b border-gray-200 last:border-b-0"
                onMouseEnter={() => setHoveredSuggestion(place_id)}
                onMouseLeave={() => setHoveredSuggestion(null)}
              >
                <button
                  type="button"
                  disabled={hoveredSuggestion === place_id}
                  className="w-full text-left px-6 py-3 hover:bg-gray-100 transition-colors disabled:bg-gray-100"
                >
                  <div className="font-medium text-gray-900">
                    {structured_formatting?.main_text ||
                      description.split(",")[0]}
                  </div>
                  <div className="text-sm text-gray-500">{description}</div>
                </button>

                {/* Hover Overlay Buttons */}
                {hoveredSuggestion === place_id && (
                  <div className="absolute inset-0 bg-linear-to-r from-transparent to-white/95 flex items-center justify-end gap-2 pr-6 rounded-lg">
                    <button
                      type="button"
                      onClick={() => handleSelect(description, "wishlist")}
                      className="px-3 py-1 cursor-pointer bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors shadow-md"
                    >
                      ❤️ Wishlist
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect(description, "visited")}
                      className="px-3 py-1 cursor-pointer bg-teal-500 text-white text-sm font-medium rounded-lg hover:bg-teal-600 transition-colors shadow-md"
                    >
                      ✓ Visited
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </form>
      <div className=" mt-8 w-[60vw] h-[60vh] relative rounded-2xl overflow-hidden">
        <Map
          // ✨ ADD THE KEY HERE to force re-render
          key={mapUpdateKey}
          onClick={() => setSelectedPin(null)}
          mapId="dear-maria-map"
          // mapId="e8cff7df41009c7b5f4057da"
          style={{ width: "100%", height: "100%" }}
          // ✨ USE DEFAULT PROPS
          defaultCenter={mapCenter}
          defaultZoom={mapZoom}
          gestureHandling="greedy"
          disableDefaultUI
        >
          {/* Render pins on the map */}
          {pins.map((pin) => (
            <PlaceMarker
              key={pin.id}
              id={pin.id}
              lat={pin.lat}
              lng={pin.lng}
              name={pin.name}
              description={pin.description}
              type={pin.type}
              pictureURL={pin.pictureURL}
              isSelected={selectedPin === pin.id}
              onSelect={() => setSelectedPin(pin.id)}
              onClose={() => setSelectedPin(null)}
              onRemove={() => handleRemovePin(pin.id)}
              onViewImage={(imageURL, name, description) =>
                setImageModal({ isOpen: true, imageURL, name, description })
              }
            />
          ))}
        </Map>
        {/* ✨ Saved Places Sidebar Component */}
        <SavedPlacesSidebar
          pins={pins}
          selectedPin={selectedPin}
          onPinSelect={handlePinSelect}
          onPinRemove={handleRemovePin}
          onFitAllPins={handleFitAllPins}
        />
      </div>

      {/* Image Modal */}
      {imageModal.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setImageModal({ ...imageModal, isOpen: false })}
        >
          <div
            className="relative max-w-8xl max-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={imageModal.imageURL}
              alt={imageModal.name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            {/* Close Button */}
            <button
              onClick={() => setImageModal({ ...imageModal, isOpen: false })}
              className="absolute top-4 right-4 p-2 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              <X size={24} />
            </button>
            {/* Image Info */}
            <div className="mt-4 text-white text-center">
              <h3 className="text-lg font-semibold">{imageModal.name}</h3>
              <p className="text-sm text-gray-300">{imageModal.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelMapPage;
