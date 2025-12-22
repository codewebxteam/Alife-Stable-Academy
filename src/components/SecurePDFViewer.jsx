import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  AlertTriangle,
} from "lucide-react";

const SecurePDFViewer = ({ book, onClose }) => {
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1);
  const [isFocused, setIsFocused] = useState(true);
  const [securityWarning, setSecurityWarning] = useState(false);

  // Security Logic (Blur on focus loss, prevent screenshots)
  useEffect(() => {
    const handleBlur = () => setIsFocused(false);
    const handleFocus = () => setIsFocused(true);
    const handleKeyDown = (e) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && e.key === "p") ||
        (e.metaKey && e.shiftKey && e.key === "4")
      ) {
        e.preventDefault();
        setSecurityWarning(true);
        setTimeout(() => setSecurityWarning(false), 2000);
      }
    };
    const handleContextMenu = (e) => e.preventDefault();

    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 bg-slate-900 flex flex-col select-none"
    >
      {/* Toolbar */}
      <div className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3 text-white">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg"
          >
            <X className="size-5" />
          </button>
          <div>
            <span className="font-bold text-sm block">{book.title}</span>
            <span className="text-[10px] text-slate-400">Secure Reader</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale((s) => Math.max(s - 0.2, 0.6))}
            className="text-slate-300 p-1"
          >
            <ZoomOut className="size-4" />
          </button>
          <span className="text-xs text-slate-300 w-8 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScale((s) => Math.min(s + 0.2, 2.0))}
            className="text-slate-300 p-1"
          >
            <ZoomIn className="size-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative bg-[#333] overflow-auto flex justify-center p-8">
        {!isFocused && (
          <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white">
            <EyeOff className="size-16 mb-4 text-slate-500" />
            <h2 className="text-xl font-bold">Content Hidden</h2>
            <p className="text-slate-400 text-sm">Return to window to read</p>
          </div>
        )}

        {/* Mock PDF Page */}
        <motion.div
          animate={{ scale }}
          className="bg-white shadow-2xl relative"
          style={{
            width: "100%",
            maxWidth: "800px",
            aspectRatio: "1/1.414",
            height: "fit-content",
          }}
        >
          <div className="absolute inset-0 p-12 text-slate-800 pointer-events-none">
            <div className="border-b pb-4 mb-8 flex justify-between opacity-50 text-xs font-bold uppercase">
              <span>{book.title}</span>
              <span>Page {pageNum}</span>
            </div>
            <div className="space-y-4 opacity-80">
              <div className="w-3/4 h-8 bg-slate-800 rounded mb-8" />
              {[...Array(12)].map((_, i) => (
                <div key={i} className="w-full h-3 bg-slate-200 rounded" />
              ))}
            </div>
          </div>
          {/* Watermark */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex flex-wrap content-center justify-center overflow-hidden gap-16 rotate-[-30deg]">
            {[...Array(20)].map((_, i) => (
              <span key={i} className="text-xl font-black text-black">
                DO NOT COPY
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer / Pagination */}
      <div className="h-14 bg-slate-800 border-t border-slate-700 flex items-center justify-center gap-6 shrink-0">
        <button
          onClick={() => setPageNum((p) => Math.max(p - 1, 1))}
          className="p-2 rounded-full bg-slate-700 text-white hover:bg-[#5edff4] hover:text-slate-900"
        >
          <ChevronLeft className="size-5" />
        </button>
        <span className="text-white font-mono text-sm">
          Page {pageNum} / {book.totalPages}
        </span>
        <button
          onClick={() => setPageNum((p) => Math.min(p + 1, book.totalPages))}
          className="p-2 rounded-full bg-slate-700 text-white hover:bg-[#5edff4] hover:text-slate-900"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </motion.div>
  );
};

export default SecurePDFViewer;
