import React, { useState, useEffect } from "react";
import { Video, Plus, Trash2, Save, X } from "lucide-react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const VideoManager = () => {
  const [videos, setVideos] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: "", url: "", price: "299", originalPrice: "999" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "courseVideos"));
      const videoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleAddVideo = async () => {
    if (!newVideo.title || !newVideo.url || !newVideo.price) {
      alert("Please fill all fields");
      return;
    }

    const videoId = extractVideoId(newVideo.url);
    if (!videoId) {
      alert("Invalid YouTube URL");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "courseVideos"), {
        title: newVideo.title,
        url: newVideo.url,
        videoId: videoId,
        price: newVideo.price,
        originalPrice: newVideo.originalPrice,
        createdAt: new Date().toISOString(),
      });
      setNewVideo({ title: "", url: "", price: "299", originalPrice: "999" });
      setShowAddForm(false);
      fetchVideos();
    } catch (error) {
      console.error("Error adding video:", error);
      alert("Failed to add video");
    }
    setLoading(false);
  };

  const handleDeleteVideo = async (id) => {
    if (!confirm("Delete this video?")) return;
    try {
      await deleteDoc(doc(db, "courseVideos", id));
      fetchVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            YouTube Videos
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage videos displayed on courses page
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 transition-all"
        >
          {showAddForm ? <X size={18} /> : <Plus size={18} />}
          {showAddForm ? "Cancel" : "Add Video"}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Add New Video
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, title: e.target.value })
                }
                placeholder="Enter video title"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                YouTube URL
              </label>
              <input
                type="text"
                value={newVideo.url}
                onChange={(e) =>
                  setNewVideo({ ...newVideo, url: e.target.value })
                }
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={newVideo.price}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, price: e.target.value })
                  }
                  placeholder="299"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  value={newVideo.originalPrice}
                  onChange={(e) =>
                    setNewVideo({ ...newVideo, originalPrice: e.target.value })
                  }
                  placeholder="999"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddVideo}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Video"}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div
            key={video.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition-all"
          >
            <div className="aspect-video bg-slate-100">
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-slate-900 mb-2 line-clamp-2">
                {video.title}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg font-bold text-slate-900">
                  ₹{video.price}
                </span>
                {video.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    ₹{video.originalPrice}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDeleteVideo(video.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all text-sm w-full justify-center"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && !showAddForm && (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          <Video size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            No Videos Yet
          </h3>
          <p className="text-slate-500">Add your first YouTube video</p>
        </div>
      )}
    </div>
  );
};

export default VideoManager;
