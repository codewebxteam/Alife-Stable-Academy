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
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Settings,
  Check,
  ChevronRight,
  Signal,
  AlertCircle,
} from "lucide-react";
import { useCourse } from "../context/CourseContext";

const CourseVideoPlayer = ({
  course,
  playlist = [],
  initialIndex = 0,
  onClose,
}) => {
  // --- 1. DATA PREPARATION ---
  const getVideoList = () => {
    if (playlist && playlist.length > 0) return playlist;
    if (
      course.lectures &&
      Array.isArray(course.lectures) &&
      course.lectures.length > 0
    )
      return course.lectures;

    const vidId = course.youtubeId || course.videoId;
    if (vidId)
      return [
        { id: "main", videoId: vidId, title: course.title, url: course.url },
      ];
    if (course.url)
      return [
        { id: "url-only", url: course.url, title: course.title, videoId: "" },
      ];
    return [];
  };

  const lectures = getVideoList();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentVideo = lectures[currentIndex];

  // --- 2. REFS & STATE ---
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loadedFraction, setLoadedFraction] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isHovering, setIsHovering] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDoubleTapOverlay, setShowDoubleTapOverlay] = useState(null);

  // Settings State
  const [showSettings, setShowSettings] = useState(false);
  const [activeMenu, setActiveMenu] = useState("main");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [qualityLevel, setQualityLevel] = useState("auto");

  // Standard Qualities
  const STANDARD_QUALITIES = [
    { label: "Auto", value: "auto" },
    { label: "1080p HD", value: "hd1080" },
    { label: "720p HD", value: "hd720" },
    { label: "480p", value: "large" },
    { label: "360p", value: "medium" },
    { label: "240p", value: "small" },
  ];

  const { updateCourseProgress } = useCourse();
  const hoverTimeoutRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // --- 3. NAVIGATION ---
  const playNext = () => {
    if (currentIndex < lectures.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsLoading(true);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsLoading(true);
    }
  };

  // --- 4. CONTROLS VISIBILITY ---
  const handleUserActivity = () => {
    setIsHovering(true);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (isPlaying && !showSettings) {
      hoverTimeoutRef.current = setTimeout(() => setIsHovering(false), 3000);
    }
  };

  // --- 5. YOUTUBE INIT ---
  useEffect(() => {
    if (!currentVideo) return;

    let finalVideoId = currentVideo.videoId;
    if (!finalVideoId && currentVideo.url) {
      try {
        const u = new URL(currentVideo.url);
        if (u.hostname.includes("youtube.com"))
          finalVideoId = u.searchParams.get("v");
        else if (u.hostname.includes("youtu.be"))
          finalVideoId = u.pathname.slice(1);
      } catch {}
    }

    if (!finalVideoId) return;

    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    const initPlayer = () => {
      // Re-use instance if possible
      if (
        playerRef.current &&
        typeof playerRef.current.loadVideoById === "function"
      ) {
        playerRef.current.loadVideoById(finalVideoId);
        return;
      }

      playerRef.current = new window.YT.Player("youtube-player", {
        videoId: finalVideoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          iv_load_policy: 3,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            setDuration(e.target.getDuration());
            setIsLoading(false);
            e.target.playVideo();
            // Safe Call for Speed
            if (typeof e.target.setPlaybackRate === "function") {
              e.target.setPlaybackRate(playbackSpeed);
            }
          },
          onStateChange: (e) => {
            if (e.data === 1) {
              setIsPlaying(true);
              setIsLoading(false);
            }
            if (e.data === 2) setIsPlaying(false);
            if (e.data === 3) setIsLoading(true);
            if (e.data === 0 && currentIndex < lectures.length - 1) playNext();
          },
          onPlaybackQualityChange: (e) => {
            setQualityLevel(e.data);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) initPlayer();
    else window.onYouTubeIframeAPIReady = initPlayer;

    return () => {
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [currentVideo, currentIndex]);

  // --- 6. SYNC LOOP ---
  useEffect(() => {
    progressIntervalRef.current = setInterval(() => {
      if (
        playerRef.current &&
        typeof playerRef.current.getCurrentTime === "function"
      ) {
        const t = playerRef.current.getCurrentTime();
        const d = playerRef.current.getDuration();
        // Safe check for buffer
        const loaded =
          typeof playerRef.current.getVideoLoadedFraction === "function"
            ? playerRef.current.getVideoLoadedFraction()
            : 0;

        setCurrentTime(t);
        if (d) setDuration(d);
        if (loaded) setLoadedFraction(loaded);

        if (d > 0 && Math.floor(t) % 5 === 0 && course.courseId) {
          const partPct = 100 / lectures.length;
          const overall = currentIndex * partPct + (t / d) * partPct;
          updateCourseProgress(course.courseId, Math.min(overall, 100), t);
        }
      }
    }, 500);
    return () => clearInterval(progressIntervalRef.current);
  }, [currentIndex, lectures.length]);

  // --- 7. ACTIONS (With Safety Checks) ---

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    if (showSettings) {
      setShowSettings(false);
      setActiveMenu("main");
      return;
    }

    if (
      playerRef.current &&
      typeof playerRef.current.getPlayerState === "function"
    ) {
      const state = playerRef.current.getPlayerState();
      if (state === 1) playerRef.current.pauseVideo();
      else playerRef.current.playVideo();
    }
  };

  const handleSeekChange = (e) => setCurrentTime(parseFloat(e.target.value));

  const handleSeekCommit = (e) => {
    const newTime = parseFloat(e.target.value);
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const handleSpeedChange = (speed) => {
    // [FIX] Strict Check: Is function available?
    if (
      playerRef.current &&
      typeof playerRef.current.setPlaybackRate === "function"
    ) {
      try {
        playerRef.current.setPlaybackRate(speed);
        setPlaybackSpeed(speed);
      } catch (err) {
        console.warn("Speed change failed", err);
      }
    }
    setTimeout(() => {
      setShowSettings(false);
      setActiveMenu("main");
    }, 200);
  };

  const handleQualityChange = (quality) => {
    // [FIX] Strict Check for Quality
    if (
      playerRef.current &&
      typeof playerRef.current.setPlaybackQuality === "function"
    ) {
      try {
        playerRef.current.setPlaybackQuality(quality);
        setQualityLevel(quality);
      } catch (err) {
        console.warn("Quality change failed", err);
      }
    }
    setTimeout(() => {
      setShowSettings(false);
      setActiveMenu("main");
    }, 200);
  };

  const getCurrentQualityLabel = () => {
    const found = STANDARD_QUALITIES.find((q) => q.value === qualityLevel);
    return found ? found.label : "Auto";
  };

  const handleDoubleTap = (side) => {
    if (!playerRef.current || typeof playerRef.current.seekTo !== "function")
      return;

    if (side === "left") {
      const t = Math.max(currentTime - 10, 0);
      playerRef.current.seekTo(t, true);
      setShowDoubleTapOverlay("left");
    } else {
      const t = Math.min(currentTime + 10, duration);
      playerRef.current.seekTo(t, true);
      setShowDoubleTapOverlay("right");
    }
    setTimeout(() => setShowDoubleTapOverlay(null), 800);
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        if (window.screen.orientation?.lock)
          window.screen.orientation.lock("landscape").catch(() => {});
      } catch (e) {}
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
      if (window.screen.orientation?.unlock) window.screen.orientation.unlock();
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h > 0)
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Safe Thumbnail Fallback
  const getThumb = (id) =>
    id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black flex flex-col font-sans select-none overflow-hidden touch-none"
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
      onClick={handleUserActivity}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* --- TOP BAR --- */}
      <div
        className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/90 via-black/50 to-transparent z-20 flex items-center justify-between px-4 md:px-6 transition-opacity duration-300 ${
          isHovering || showSettings ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4 text-white">
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full active:scale-95 transition-all"
          >
            <X className="size-5 md:size-6" />
          </button>
          <div className="min-w-0">
            <h2 className="font-bold text-sm md:text-lg text-white drop-shadow-md line-clamp-1">
              {currentVideo?.title}
            </h2>
            <p className="text-[10px] md:text-xs text-slate-300 drop-shadow-md line-clamp-1">
              {course.title}
            </p>
          </div>
        </div>

        {/* Settings Toggle */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
              setActiveMenu("main");
            }}
            className={`p-2 rounded-full transition-all ${
              showSettings
                ? "bg-white text-black"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <Settings
              className={`size-5 md:size-6 ${
                showSettings ? "animate-spin-slow" : ""
              }`}
            />
          </button>

          {/* --- SETTINGS MENU --- */}
          {showSettings && (
            <div
              className="absolute top-14 right-0 w-64 bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] text-white animate-in slide-in-from-top-2 fade-in duration-200"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {activeMenu === "main" && (
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => setActiveMenu("speed")}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-white/10 rounded-xl transition-colors active:bg-white/20"
                  >
                    <span className="text-sm font-medium">Playback Speed</span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      {playbackSpeed === 1 ? "Normal" : playbackSpeed + "x"}{" "}
                      <ChevronRight size={16} />
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveMenu("quality")}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-white/10 rounded-xl transition-colors active:bg-white/20"
                  >
                    <span className="text-sm font-medium">Quality</span>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      {getCurrentQualityLabel()} <ChevronRight size={16} />
                    </div>
                  </button>
                </div>
              )}

              {activeMenu === "speed" && (
                <div className="p-2 overflow-y-auto max-h-60 custom-scrollbar">
                  <button
                    onClick={() => setActiveMenu("main")}
                    className="w-full text-left p-3 text-xs text-slate-400 uppercase font-bold border-b border-white/10 mb-1 flex items-center gap-2 active:bg-white/5"
                  >
                    <ChevronRight size={14} className="rotate-180" /> Back
                  </button>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => handleSpeedChange(speed)}
                      className="w-full flex items-center gap-3 p-3.5 hover:bg-white/10 rounded-xl text-sm active:bg-white/20"
                    >
                      {playbackSpeed === speed ? (
                        <Check size={16} className="text-[#5edff4]" />
                      ) : (
                        <span className="w-4" />
                      )}
                      <span>{speed === 1 ? "Normal" : speed + "x"}</span>
                    </button>
                  ))}
                </div>
              )}

              {activeMenu === "quality" && (
                <div className="p-2 overflow-y-auto max-h-60 custom-scrollbar">
                  <button
                    onClick={() => setActiveMenu("main")}
                    className="w-full text-left p-3 text-xs text-slate-400 uppercase font-bold border-b border-white/10 mb-1 flex items-center gap-2 active:bg-white/5"
                  >
                    <ChevronRight size={14} className="rotate-180" /> Back
                  </button>
                  {STANDARD_QUALITIES.map((q) => (
                    <button
                      key={q.value}
                      onClick={() => handleQualityChange(q.value)}
                      className="w-full flex items-center gap-3 p-3.5 hover:bg-white/10 rounded-xl text-sm active:bg-white/20"
                    >
                      {qualityLevel === q.value ? (
                        <Check size={16} className="text-[#5edff4]" />
                      ) : (
                        <span className="w-4" />
                      )}
                      <span>{q.label}</span>
                      {q.value === "auto" && (
                        <Signal size={12} className="ml-auto text-slate-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- VIDEO AREA --- */}
      <div className="flex-1 relative flex items-center justify-center bg-black">
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none bg-black/40 backdrop-blur-sm">
            <Loader2 className="size-14 text-[#5edff4] animate-spin drop-shadow-2xl" />
          </div>
        )}

        {showDoubleTapOverlay && (
          <div
            className={`absolute top-0 bottom-0 w-1/3 bg-white/5 z-40 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300 ${
              showDoubleTapOverlay === "left"
                ? "left-0 rounded-r-[50px]"
                : "right-0 rounded-l-[50px]"
            }`}
          >
            <div className="flex flex-col items-center text-white animate-bounce">
              {showDoubleTapOverlay === "left" ? (
                <RotateCcw size={40} />
              ) : (
                <RotateCw size={40} />
              )}
              <span className="text-sm font-black mt-2">10s</span>
            </div>
          </div>
        )}

        <div className="w-full h-full pointer-events-none">
          <div id="youtube-player" className="w-full h-full" />
        </div>

        <div className="absolute inset-0 z-10 flex">
          <div
            className="w-1/3 h-full"
            onDoubleClick={() => handleDoubleTap("left")}
            onClick={togglePlay}
          />
          <div className="flex-1 h-full" onClick={togglePlay} />
          <div
            className="w-1/3 h-full"
            onDoubleClick={() => handleDoubleTap("right")}
            onClick={togglePlay}
          />
        </div>

        {!isPlaying && !isLoading && !showSettings && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="p-6 bg-black/40 backdrop-blur-md rounded-full border border-white/20 shadow-2xl">
              <Play size={48} className="fill-white text-white translate-x-1" />
            </div>
          </div>
        )}
      </div>

      {/* --- BOTTOM CONTROLS --- */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent px-4 md:px-8 pb-8 pt-20 z-20 transition-opacity duration-300 ${
          isHovering || showSettings ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* SEEK BAR */}
        <div className="relative h-6 group mb-4 flex items-center w-full">
          <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm group-hover:h-2.5 transition-all duration-300">
            <div
              className="h-full bg-white/30 transition-all duration-300"
              style={{ width: `${loadedFraction * 100}%` }}
            />
            <div
              className="absolute top-0 left-0 h-full bg-[#5edff4] transition-all duration-100 shadow-[0_0_15px_rgba(94,223,244,0.6)]"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <input
            ref={progressBarRef}
            type="range"
            min={0}
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeekChange}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
          />
          <div
            className="absolute w-4 h-4 bg-[#5edff4] border-2 border-white rounded-full shadow-lg pointer-events-none transition-all duration-100 group-hover:scale-125"
            style={{
              left: `${(currentTime / duration) * 100}%`,
              transform: `translateX(-50%)`,
            }}
          />
        </div>

        {/* CONTROLS ROW */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <button
              onClick={playPrev}
              disabled={currentIndex === 0}
              className={`text-white hover:text-[#5edff4] active:scale-90 transition-all ${
                currentIndex === 0 ? "opacity-30" : ""
              }`}
            >
              <SkipBack className="size-8 fill-current" />
            </button>
            <button
              onClick={togglePlay}
              className="text-white hover:text-[#5edff4] active:scale-90 transition-all"
            >
              {isPlaying ? (
                <Pause className="size-10 fill-current" />
              ) : (
                <Play className="size-10 fill-current" />
              )}
            </button>
            <button
              onClick={playNext}
              disabled={currentIndex === lectures.length - 1}
              className={`text-white hover:text-[#5edff4] active:scale-90 transition-all ${
                currentIndex === lectures.length - 1 ? "opacity-30" : ""
              }`}
            >
              <SkipForward className="size-8 fill-current" />
            </button>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <span className="text-xs font-mono text-[#5edff4] font-bold">
                {formatTime(currentTime)}
              </span>
              <span className="text-xs font-mono text-slate-400">/</span>
              <span className="text-xs font-mono text-slate-300">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="md:hidden text-xs font-mono text-slate-200">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:text-[#5edff4] transition-colors"
            >
              {isMuted ? (
                <VolumeX className="size-6" />
              ) : (
                <Volume2 className="size-6" />
              )}
            </button>
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
    </div>
  );
};

export default CourseVideoPlayer;
