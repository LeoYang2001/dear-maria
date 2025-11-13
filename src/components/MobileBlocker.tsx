import React, { useState, useEffect } from "react";
import { Smartphone } from "lucide-react";

const MobileBlocker: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const isUserAgentMobile =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          userAgent.toLowerCase()
        );

      // Also check screen size
      const isScreenMobile = window.innerWidth < 1024;

      setIsMobile(isUserAgentMobile || isScreenMobile);
      setIsLoaded(true);
    };

    checkDevice();

    // Re-check on resize
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed inset-0  z-9999 bg-white flex items-center justify-center p-4">
      <div className=" w-full  h-2/3 flex flex-col justify-start items-center text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-linear-to-br from-pink-100 to-pink-50 flex items-center justify-center">
            <Smartphone size={108} className="text-pink-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-7xl font-bold text-gray-900 mb-4">Desktop Only</h1>

        {/* Description */}
        <p className="text-4xl mt-20 text-gray-600 mb-6">
          Dear Maria is designed to be experienced on desktop. Please visit this
          website from a desktop or laptop device for the best experience.
        </p>

        {/* Features */}
        <div className="space-y-3 mb-8 text-left text-2xl bg-gray-50 rounded-xl p-6">
          <div className="flex items-start gap-3 ">
            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-gray-700">Beautiful map interface</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-gray-700">Full interactive features</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-pink-500 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <p className="text-gray-700">Premium experience</p>
          </div>
        </div>

        {/* Contact Info */}
        <p className="text-2xl text-gray-500">
          Open this link on your desktop or laptop for the best experience 💻
        </p>
      </div>
    </div>
  );
};

export default MobileBlocker;
