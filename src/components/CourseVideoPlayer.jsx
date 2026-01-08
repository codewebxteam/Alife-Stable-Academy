import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
} from "lucide-react";
import { useCourse } from "../context/CourseContext";

const CourseVideoPlayer = ({ course, onClose }) => {
  const playerRef = useRef(null); // For YouTube Player
  const containerRef = useRef(null); // For Fullscreen
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(true); // For hiding controls
  const [localProgress, setLocalProgress] = useState(course.progress || 0);
  const [isLoading, setIsLoading] = useState(true);

  const { updateCourseProgress } = useCourse();
  const progressIntervalRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const courseIdRef = useRef(course.courseId);
  const hoverTimeoutRef = useRef(null);

  // --- MOUSE HOVER LOGIC (Hide controls when inactive) ---
  const handleMouseMove = () => {
    setIsHovering(true);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setIsHovering(false);
    }, 3000);
  };

  // --- PROGRESS TRACKING ---
  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    stopProgressTracking();
    progressIntervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        setCurrentTime(current);
        if (total > 0) {
          const progress = (current / total) * 100;
          setLocalProgress(progress);

          const now = Date.now();
          if (now - lastUpdateRef.current > 5000) {
            updateCourseProgress(courseIdRef.current, progress, current);
            lastUpdateRef.current = now;
          }
        }
      }
    }, 1000);
  }, [stopProgressTracking, updateCourseProgress]);

  // --- YOUTUBE INITIALIZATION ---
  useEffect(() => {
    if (course.youtubeId) {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      const initPlayer = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
          videoId: course.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0, // 🔒 Hides YouTube Native Controls (Share btn gone)
            disablekb: 1, // 🔒 Disables Keyboard shortcuts
            fs: 0, // 🔒 Hides YouTube Fullscreen button
            modestbranding: 1, // Minimal Branding
            rel: 0, // No related videos
            showinfo: 0, // No title info
            iv_load_policy: 3, // Hide annotations
          },
          events: {
            onReady: (event) => {
              setDuration(event.target.getDuration());
              startProgressTracking();
              setIsLoading(false);
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressTracking();
                setIsLoading(false);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                stopProgressTracking();
              } else if (event.data === window.YT.PlayerState.BUFFERING) {
                setIsLoading(true);
              }
            },
          },
        });
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    }

    return () => {
      stopProgressTracking();
      if (playerRef.current && playerRef.current.destroy) {
        // Save progress one last time
        if (playerRef.current.getCurrentTime) {
          const current = playerRef.current.getCurrentTime();
          const total = playerRef.current.getDuration();
          if (total > 0) {
            const progress = (current / total) * 100;
            updateCourseProgress(courseIdRef.current, progress, current);
          }
        }
        playerRef.current.destroy();
      }
    };
  }, [
    course.youtubeId,
    startProgressTracking,
    stopProgressTracking,
    updateCourseProgress,
  ]);

  // --- CUSTOM CONTROLS HANDLERS ---
  const togglePlay = () => {
    if (course.youtubeId && playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (course.youtubeId && playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    setCurrentTime(newTime);
    if (course.youtubeId && playerRef.current) {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col font-sans select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setIsHovering(false)}
      // 🔒 Disable Right Click
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* --- TOP BAR (Title & Close) --- */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/90 to-transparent z-20 flex items-center justify-between px-6 transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4 text-white">
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full transition-all"
          >
            <X className="size-5" />
          </button>
          <div>
            <h2 className="font-bold text-sm md:text-lg text-white drop-shadow-md line-clamp-1">
              {course.title}
            </h2>
            <p className="text-[10px] md:text-xs text-slate-300 drop-shadow-md">
              {course.instructor}
            </p>
          </div>
        </div>
      </div>

      {/* --- VIDEO AREA --- */}
      <div className="flex-1 relative flex items-center justify-center bg-black overflow-hidden">
        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <Loader2 className="size-12 text-[#5edff4] animate-spin" />
          </div>
        )}

        {course.youtubeId ? (
          <div className="relative w-full h-full">
            {/* 1. pointer-events-none on iframe prevents interaction with YouTube internals 
               2. scale-125 zooms in slightly to hide any remaining YouTube edges if needed (Optional)
            */}
            <div className="w-full h-full pointer-events-none">
              <div id="youtube-player" className="w-full h-full" />
            </div>

            {/* 🔒 INVISIBLE OVERLAY TO BLOCK CLICKS/RIGHT CLICKS ON VIDEO */}
            <div
              className="absolute inset-0 z-[5]"
              onClick={togglePlay}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        ) : course.videoUrl ? (
          <VideoPlayer
            videoUrl={course.videoUrl}
            courseId={course.courseId}
            updateProgress={updateCourseProgress}
            isHovering={isHovering}
            onToggleHover={setIsHovering}
          />
        ) : (
          <div className="text-white text-center p-8">
            <p>No video source found.</p>
          </div>
        )}
      </div>

      {/* --- BOTTOM CONTROLS (CUSTOM) --- */}
      {course.youtubeId && (
        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-12 z-20 transition-opacity duration-300 ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Progress Bar */}
          <div className="group relative h-1.5 bg-slate-600 rounded-full mb-4 cursor-pointer">
            <div
              className="absolute h-full bg-[#5edff4] rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-[#5edff4] transition-colors"
              >
                {isPlaying ? (
                  <Pause className="size-8 fill-current" />
                ) : (
                  <Play className="size-8 fill-current" />
                )}
              </button>

              <div className="flex items-center gap-2 group">
                <button
                  onClick={toggleMute}
                  className="text-white hover:text-[#5edff4] transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="size-6" />
                  ) : (
                    <Volume2 className="size-6" />
                  )}
                </button>
              </div>

              <span className="text-xs md:text-sm text-slate-300 font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-[#5edff4] transition-colors"
              >
                {isFullscreen ? (
                  <Minimize className="size-6" />
                ) : (
                  <Maximize className="size-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- CUSTOM HTML5 PLAYER (UPDATED FOR SECURITY) ---
const VideoPlayer = ({
  videoUrl,
  courseId,
  updateProgress,
  isHovering,
  onToggleHover,
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Update Firebase
      const now = Date.now();
      if (now - lastUpdateRef.current > 5000) {
        updateProgress(
          courseId,
          (video.currentTime / video.duration) * 100,
          video.currentTime
        );
        lastUpdateRef.current = now;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", () => setDuration(video.duration));
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [courseId, updateProgress]);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const time = (e.target.value / 100) * duration;
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  return (
    <div className="relative w-full h-full" onClick={() => onToggleHover(true)}>
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        // 🔒 SECURITY FEATURES
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        onClick={togglePlay}
        disablePictureInPicture
      />

      {/* Custom Controls for HTML5 Video */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-12 z-20 transition-opacity duration-300 ${
          isHovering ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Similar controls as YouTube player above... */}
        <div className="group relative h-1.5 bg-slate-600 rounded-full mb-4 cursor-pointer">
          <div
            className="absolute h-full bg-[#5edff4] rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center text-white">
          <button onClick={togglePlay}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <span className="text-xs">
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, "0")}{" "}
            / {Math.floor(duration / 60)}:
            {Math.floor(duration % 60)
              .toString()
              .padStart(2, "0")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
