import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, Maximize, X } from "lucide-react";
import pianoMp4 from "../assets/piano.mp4";

interface MusicPlayerProps {
  isVisible?: boolean;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isVisible = true,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Auto-play when component mounts or autoPlay prop changes
  useEffect(() => {
    if (autoPlay && videoRef.current && audioRef.current && isVisible) {
      videoRef.current.play().catch((error) => {
        console.error("Video auto-play failed:", error);
      });
      audioRef.current.play().catch((error) => {
        console.error("Audio auto-play failed:", error);
      });
      setIsPlaying(true);
    }
  }, [autoPlay, isVisible]);

  if (!isVisible) return null;

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        if (videoRef.current) {
          videoRef.current.pause();
        }
      } else {
        audioRef.current.play().catch((error) => {
          console.error("Play failed:", error);
        });
        if (videoRef.current) {
          videoRef.current.play().catch((error) => {
            console.error("Video play failed:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      // Sync video to audio if it exists
      if (
        videoRef.current &&
        Math.abs(videoRef.current.currentTime - audioRef.current.currentTime) >
          0.1
      ) {
        videoRef.current.currentTime = audioRef.current.currentTime;
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      // Also set video duration if it exists
      if (videoRef.current) {
        videoRef.current.currentTime = audioRef.current.currentTime;
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      {/* Hidden audio element for sound */}
      <audio
        ref={audioRef}
        src={pianoMp4}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        loop
        crossOrigin="anonymous"
      />

      {/* Hidden video element - only shown in fullscreen */}
      {isFullscreen && (
        <video
          ref={videoRef}
          src={pianoMp4}
          onLoadedMetadata={handleLoadedMetadata}
          loop
          crossOrigin="anonymous"
          muted
          style={{ display: "none" }}
        />
      )}

      <div className="fixed bottom-6 right-6 z-40">
        <div className="bg-white rounded-full shadow-lg px-6 py-4 flex items-center gap-4 border border-gray-200 hover:shadow-xl transition-shadow">
          {/* Play/Pause Button */}
          <button
            onClick={handlePlayPause}
            className="shrink-0 w-10 h-10 rounded-full bg-linear-to-r from-pink-400 to-pink-500 text-white flex items-center justify-center hover:shadow-md transition-shadow"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>

          {/* Song Info */}
          <div className="flex flex-col min-w-max">
            <p className="text-sm font-semibold text-gray-900">
              Happy Birthday
            </p>
            <p className="text-xs text-gray-500">Piano performance by Leo</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 min-w-48">
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-1 h-1 bg-gray-300 rounded-full appearance-none cursor-pointer accent-pink-400"
              step="0.1"
            />
            <span className="text-xs text-gray-500 font-medium">
              {formatTime(duration)}
            </span>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="shrink-0 p-2  cursor-pointer hover:bg-gray-100 rounded-lg transition-colors"
            title="Fullscreen"
          >
            <Maximize size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Fullscreen Video Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Blurry background overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

          <div
            onClick={() => setIsFullscreen(false)}
            className="relative w-full h-full  flex items-center justify-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-colors z-10 border border-white/30"
              title="Close"
            >
              <X size={28} className="text-white" />
            </button>

            {/* Video Container with rounded corners and shadow */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-8/12 h-4/6 rounded-3xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm"
            >
              {/* Video Player */}
              <video
                ref={videoRef}
                src={pianoMp4}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleEnded}
                loop
                crossOrigin="anonymous"
                muted
                autoPlay
                className="w-full h-full object-contain bg-black"
              />

              {/* Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/50 to-transparent p-6">
                <div className="flex items-center gap-4">
                  {/* Play/Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-colors text-white border border-white/20"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <Pause size={24} fill="currentColor" />
                    ) : (
                      <Play size={24} fill="currentColor" />
                    )}
                  </button>

                  {/* Progress */}
                  <div className="flex-1 flex items-center gap-3">
                    <span className="text-sm text-white/80 font-medium">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      value={currentTime}
                      onChange={handleProgressChange}
                      className="flex-1 h-1.5 bg-white/30 rounded-full appearance-none cursor-pointer accent-pink-400"
                      step="0.1"
                    />
                    <span className="text-sm text-white/80 font-medium">
                      {formatTime(duration)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MusicPlayer;
