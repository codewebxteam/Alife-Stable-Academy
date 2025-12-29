import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { useCourse } from "../context/CourseContext";

const CourseVideoPlayer = ({ course, onClose }) => {
  const playerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [localProgress, setLocalProgress] = useState(course.progress || 0);
  const { updateCourseProgress } = useCourse();
  const progressIntervalRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const courseIdRef = useRef(course.courseId);

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

  useEffect(() => {
    if (course.youtubeId && course.youtubeId !== "" && course.youtubeId !== "undefined") {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      const initPlayer = () => {
        playerRef.current = new window.YT.Player('youtube-player', {
          videoId: course.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: (event) => {
              setDuration(event.target.getDuration());
              startProgressTracking();
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                startProgressTracking();
              } else {
                setIsPlaying(false);
                stopProgressTracking();
              }
            }
          }
        });
      };

      if (window.YT && window.YT.Player) {
        initPlayer();
      } else {
        window.onYouTubeIframeAPIReady = initPlayer;
      }
    }

    return () => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const current = playerRef.current.getCurrentTime();
        const total = playerRef.current.getDuration();
        if (total > 0) {
          const progress = (current / total) * 100;
          updateCourseProgress(courseIdRef.current, progress, current);
        }
      }
      stopProgressTracking();
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [course.youtubeId, startProgressTracking, stopProgressTracking, updateCourseProgress]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
          <div>
            <span className="font-bold text-sm block">{course.title}</span>
            <span className="text-[10px] text-slate-400">
              {course.instructor}
            </span>
          </div>
        </div>
        <div className="text-white text-sm flex items-center gap-4">
          <span>Progress: {Math.round(localProgress)}%</span>
          {duration > 0 && (
            <span className="text-slate-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          )}
        </div>
      </div>

      {/* Video Player */}
      <div className="flex-1 flex items-center justify-center bg-black">
        {course.youtubeId && course.youtubeId !== "" && course.youtubeId !== "undefined" ? (
          <div id="youtube-player" className="w-full h-full" />
        ) : course.videoUrl && course.videoUrl !== "" && course.videoUrl !== "undefined" ? (
          <VideoPlayer 
            videoUrl={course.videoUrl}
            courseId={course.courseId}
            updateProgress={updateCourseProgress}
          />
        ) : (
          <div className="text-white text-center p-8">
            <div className="size-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="size-10 text-slate-400" />
            </div>
            <p className="text-xl mb-2">No video available for this course</p>
            <p className="text-sm text-slate-400 mb-6">Please add video information in admin panel.</p>
            <div className="bg-slate-800 rounded-xl p-4 text-left max-w-md mx-auto">
              <p className="text-xs text-slate-500 mb-2">Debug Info:</p>
              <p className="text-xs text-slate-400">Course ID: <span className="text-white">{course.courseId}</span></p>
              <p className="text-xs text-slate-400">Video URL: <span className="text-white">{course.videoUrl || "Not set"}</span></p>
              <p className="text-xs text-slate-400">YouTube ID: <span className="text-white">{course.youtubeId || "Not set"}</span></p>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <p className="text-xs text-yellow-400">💡 To fix: Go to Admin Panel → Course Manager → Edit this course → Add YouTube Video ID</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Separate Video Player Component for custom videos
const VideoPlayer = ({ videoUrl, courseId, updateProgress }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      
      // Update Firebase every 5 seconds
      const now = Date.now();
      if (now - lastUpdateRef.current > 5000) {
        updateProgress(courseId, progress, video.currentTime);
        lastUpdateRef.current = now;
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [courseId, updateProgress]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        onClick={togglePlay}
      />
      
      {/* Custom Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="text-white hover:text-[#5edff4] transition-colors"
          >
            {isPlaying ? <Pause className="size-6" /> : <Play className="size-6" />}
          </button>
          
          <div className="flex-1">
            <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5edff4]"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
          </div>
          
          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          
          <button
            onClick={toggleMute}
            className="text-white hover:text-[#5edff4] transition-colors"
          >
            {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-[#5edff4] transition-colors"
          >
            <Maximize className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseVideoPlayer;
