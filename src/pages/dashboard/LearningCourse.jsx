import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { COURSES_DATA } from "../../data/coursesData";
import { useAuth } from "../../context/AuthContext";
import {
  updateEnrollmentProgress,
  updateDashboardFromLearning,
} from "../../services/enrollment.service";

// ✅ LOCAL VIDEO IMPORT
import video from "../../assets/videos/web-dev-intro.mp4";

const SAVE_INTERVAL = 5; // Firebase save every 5 seconds

const LearningCourse = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();

  const course = COURSES_DATA.find((c) => String(c.id) === id);

  const videoRef = useRef(null);
  const lastSavedRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [resumeTime, setResumeTime] = useState(0); // 🔥 resume support

  if (!course) {
    return <p className="p-10 font-bold">Course not found</p>;
  }

  /* 🔁 RESUME VIDEO FROM FIREBASE (ON LOAD) */
  useEffect(() => {
    if (!videoRef.current || resumeTime <= 0) return;
    videoRef.current.currentTime = resumeTime;
  }, [resumeTime]);

  /* 🔄 HANDLE VIDEO PROGRESS */
  const handleTimeUpdate = async (e) => {
    const vid = e.target;
    if (!vid.duration) return;

    /* 🟢 UI UPDATE — EVERY SECOND */
    const percent = Math.min(
      Math.floor((vid.currentTime / vid.duration) * 100),
      100
    );

    setCurrentTime(vid.currentTime);
    setProgress(percent);

    /* 🔒 FIREBASE UPDATE — EVERY 5 SECONDS */
    if (!currentUser) return;

    const now = Math.floor(vid.currentTime);
    if (now - lastSavedRef.current < SAVE_INTERVAL) return;

    lastSavedRef.current = now;

    try {
      await updateEnrollmentProgress(
        currentUser.uid,
        course.id,
        percent,
        vid.currentTime
      );

      await updateDashboardFromLearning(
        currentUser.uid,
        course.id,
        percent,
        SAVE_INTERVAL
      );
    } catch (err) {
      console.error("❌ Learning sync failed:", err);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">
        {course.title}
      </h1>

      {/* 🎥 VIDEO PLAYER */}
      <div className="rounded-2xl overflow-hidden shadow-lg bg-black">
        <video
          ref={videoRef}
          controls
          playsInline
          preload="metadata"
          className="w-full h-[420px]"
          src={video}
          onLoadedMetadata={(e) => {
            // resume point after metadata loads
            if (resumeTime > 0) {
              e.target.currentTime = resumeTime;
            }
          }}
          onTimeUpdate={handleTimeUpdate}
          onError={() => alert("❌ Video file not found")}
        />
      </div>

      {/* 📊 PROGRESS UI */}
      <div className="bg-white p-6 rounded-2xl border space-y-3">
        <div className="flex justify-between text-sm font-bold text-slate-600">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#5edff4] to-[#0891b2] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-slate-500">
          Watched: {Math.floor(currentTime)} seconds
        </p>
      </div>
    </div>
  );
};

export default LearningCourse;
